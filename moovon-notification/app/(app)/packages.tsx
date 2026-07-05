import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
  ScrollView,
} from 'react-native';
import {
  Text,
  useTheme,
  Surface,
  ActivityIndicator,
  IconButton,
  FAB,
  Portal,
  Modal,
  TextInput,
  Button,
  Divider,
  Chip,
  Switch,
  Searchbar,
  Checkbox,
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { usePackagesStore, PackageItem } from '../../store/packagesStore';
import { useServicesStore } from '../../store/servicesStore';

export default function PackagesScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { packages, isLoading, fetchPackages, createPackage, updatePackage, deletePackage } = usePackagesStore();
  const { services, fetchServices } = useServicesStore();

  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPkg, setEditingPkg] = useState<PackageItem | null>(null);

  const [form, setForm] = useState({
    name: '',
    durationMonths: '1',
    actualPrice: '',
    offerPrice: '',
    isActive: true,
    serviceIds: [] as string[],
  });

  useEffect(() => {
    fetchPackages();
    fetchServices();
  }, []);

  const openCreate = () => {
    setEditingPkg(null);
    setForm({ name: '', durationMonths: '1', actualPrice: '', offerPrice: '', isActive: true, serviceIds: [] });
    setModalVisible(true);
  };

  const openEdit = (pkg: PackageItem) => {
    setEditingPkg(pkg);
    setForm({
      name: pkg.name,
      durationMonths: String(pkg.durationMonths),
      actualPrice: String(pkg.actualPrice),
      offerPrice: String(pkg.offerPrice),
      isActive: pkg.isActive,
      serviceIds: pkg.services?.map(s => s.id) || [],
    });
    setModalVisible(true);
  };

  const toggleService = (id: string) => {
    setForm(f => ({
      ...f,
      serviceIds: f.serviceIds.includes(id)
        ? f.serviceIds.filter(s => s !== id)
        : [...f.serviceIds, id],
    }));
  };

  const handleSave = async () => {
    if (!form.name || form.name.length < 2) { Alert.alert('Validation', 'Package name must be at least 2 characters'); return; }
    if (!form.actualPrice || isNaN(Number(form.actualPrice))) { Alert.alert('Validation', 'Enter a valid actual price'); return; }
    if (!form.offerPrice || isNaN(Number(form.offerPrice))) { Alert.alert('Validation', 'Enter a valid offer price'); return; }
    if (form.serviceIds.length === 0) { Alert.alert('Validation', 'Select at least one service'); return; }

    const payload = {
      name: form.name,
      durationMonths: Number(form.durationMonths),
      actualPrice: Number(form.actualPrice),
      offerPrice: Number(form.offerPrice),
      isActive: form.isActive,
      serviceIds: form.serviceIds,
    };

    try {
      if (editingPkg) {
        await updatePackage(editingPkg.id, payload);
      } else {
        await createPackage(payload);
      }
      setModalVisible(false);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Something went wrong');
    }
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert('Delete Package', `Delete "${name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deletePackage(id) },
    ]);
  };

  const filtered = packages.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.services?.some(s => s.name.toLowerCase().includes(search.toLowerCase()))
  );

  const savings = (pkg: PackageItem) =>
    Number(pkg.actualPrice) - Number(pkg.offerPrice);

  const renderPkg = ({ item }: { item: PackageItem }) => (
    <Surface style={styles.card} elevation={1}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>{item.name}</Text>
          <Text variant="bodySmall" style={{ color: '#666', marginTop: 2 }}>
            {item.durationMonths} month{item.durationMonths > 1 ? 's' : ''} • {item.services?.length || 0} service{(item.services?.length || 0) !== 1 ? 's' : ''}
          </Text>
        </View>
        <Chip
          compact
          style={{ backgroundColor: item.isActive ? 'rgba(76,175,80,0.12)' : 'rgba(244,67,54,0.12)' }}
          textStyle={{ color: item.isActive ? '#388E3C' : '#D32F2F', fontSize: 10 }}
        >
          {item.isActive ? 'Active' : 'Inactive'}
        </Chip>
      </View>

      {/* Included services */}
      {(item.services?.length ?? 0) > 0 && (
        <>
          <Divider style={{ marginVertical: 10 }} />
          <Text variant="labelSmall" style={{ color: '#888', marginBottom: 6 }}>INCLUDED SERVICES</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {item.services?.map(s => (
              <Chip key={s.id} compact style={{ backgroundColor: 'rgba(0,87,231,0.08)' }} textStyle={{ fontSize: 11, color: '#0057e7' }}>
                {s.name}
              </Chip>
            ))}
          </View>
        </>
      )}

      <Divider style={{ marginVertical: 10 }} />

      {/* Pricing */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View>
          <Text variant="bodySmall" style={{ color: '#999', textDecorationLine: 'line-through' }}>₹{item.actualPrice}</Text>
          <Text variant="titleLarge" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>₹{item.offerPrice}</Text>
          {savings(item) > 0 && (
            <Text variant="labelSmall" style={{ color: '#4CAF50' }}>Save ₹{savings(item)}</Text>
          )}
        </View>
        <View style={{ flexDirection: 'row' }}>
          <IconButton icon="pencil" size={18} onPress={() => openEdit(item)} />
          <IconButton icon="delete" size={18} iconColor={theme.colors.error} onPress={() => handleDelete(item.id, item.name)} />
        </View>
      </View>
    </Surface>
  );

  return (
    <View style={[styles.container, { backgroundColor: '#f5f5f5' }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <IconButton icon="arrow-left" onPress={() => router.back()} />
          <View>
            <Text variant="headlineMedium" style={styles.headerText}>Packages</Text>
            <Text variant="bodySmall" style={{ color: '#666' }}>{packages.length} total</Text>
          </View>
        </View>
        <Searchbar
          placeholder="Search packages or services..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchbar}
          inputStyle={{ fontSize: 14 }}
        />
      </View>

      {isLoading && packages.length === 0 ? (
        <ActivityIndicator animating style={{ marginTop: 60 }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={i => i.id}
          renderItem={renderPkg}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={isLoading && packages.length > 0} onRefresh={fetchPackages} />}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', marginTop: 60, color: '#999' }}>
              No packages found. Tap + to create your first bundle!
            </Text>
          }
        />
      )}

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color="#fff"
        onPress={openCreate}
      />

      {/* Create / Edit Modal */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modalContent}
        >
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <Text variant="headlineSmall" style={{ fontWeight: 'bold', marginBottom: 16 }}>
              {editingPkg ? 'Edit Package' : 'Create Package'}
            </Text>

            <TextInput mode="outlined" label="Package Name *" value={form.name} onChangeText={t => setForm({ ...form, name: t })} style={styles.input} />
            <TextInput mode="outlined" label="Duration (months) *" keyboardType="numeric" value={form.durationMonths} onChangeText={t => setForm({ ...form, durationMonths: t })} style={styles.input} />
            <TextInput mode="outlined" label="Actual Price (₹) *" keyboardType="numeric" value={form.actualPrice} onChangeText={t => setForm({ ...form, actualPrice: t })} style={styles.input} />
            <TextInput mode="outlined" label="Offer Price (₹) *" keyboardType="numeric" value={form.offerPrice} onChangeText={t => setForm({ ...form, offerPrice: t })} style={styles.input} />

            <Divider style={{ marginVertical: 12 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text variant="labelLarge">Active Status</Text>
              <Switch value={form.isActive} onValueChange={v => setForm({ ...form, isActive: v })} color={theme.colors.primary} />
            </View>

            <Divider style={{ marginVertical: 4 }} />
            <Text variant="labelLarge" style={{ marginBottom: 8, marginTop: 8 }}>
              Select Services ({form.serviceIds.length} selected)
            </Text>
            {services.length === 0 ? (
              <Text style={{ color: '#999', marginBottom: 12 }}>No services found. Create services first.</Text>
            ) : (
              services.map(svc => (
                <View key={svc.id} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 4 }}>
                  <Checkbox
                    status={form.serviceIds.includes(svc.id) ? 'checked' : 'unchecked'}
                    onPress={() => toggleService(svc.id)}
                    color={theme.colors.primary}
                  />
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text variant="bodyMedium" style={{ fontWeight: '500' }}>{svc.name}</Text>
                    <Text variant="bodySmall" style={{ color: '#666' }}>₹{svc.basePrice} • {svc.durationType}</Text>
                  </View>
                </View>
              ))
            )}

            <Divider style={{ marginVertical: 16 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <Button mode="text" onPress={() => setModalVisible(false)} style={{ marginRight: 8 }}>Cancel</Button>
              <Button mode="contained" onPress={handleSave} loading={isLoading}>
                {editingPkg ? 'Save Changes' : 'Create Package'}
              </Button>
            </View>
          </ScrollView>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 60,
    paddingBottom: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerText: { fontWeight: 'bold', color: '#1a1a1a' },
  searchbar: { marginHorizontal: 16, marginTop: 8, backgroundColor: '#f5f5f5', elevation: 0, borderRadius: 10 },
  listContent: { padding: 16, paddingBottom: 120 },
  card: { borderRadius: 12, backgroundColor: '#fff', marginBottom: 14, padding: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  fab: { position: 'absolute', right: 16, bottom: 40, borderRadius: 28 },
  modalContent: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    marginHorizontal: 16,
    marginVertical: 40,
    borderRadius: 16,
    maxHeight: '88%',
  },
  input: { marginBottom: 12 },
});
