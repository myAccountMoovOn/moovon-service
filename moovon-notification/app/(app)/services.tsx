import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { 
  Text, useTheme, Surface, ActivityIndicator, IconButton, 
  FAB, Portal, Modal, TextInput, Button, SegmentedButtons, 
  Switch, Divider, Chip
} from 'react-native-paper';
import { useAuthStore } from '../../store/authStore';
import { useServicesStore, ServiceItem } from '../../store/servicesStore';
import { useRouter } from 'expo-router';

export default function ServicesScreen() {
  const theme = useTheme();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { services, isLoading, error, fetchServices, createService, updateService, deleteService } = useServicesStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<ServiceItem>>({
    name: '',
    pricingType: 'fixed',
    durationType: 'monthly',
    basePrice: 0,
    isActive: true,
  });

  useEffect(() => {
    if (user) {
      fetchServices();
    }
  }, [user]);

  const openModal = (service?: ServiceItem) => {
    if (service) {
      setEditingId(service.id);
      setFormData({
        name: service.name,
        pricingType: service.pricingType,
        durationType: service.durationType,
        basePrice: service.basePrice,
        isActive: service.isActive,
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        pricingType: 'fixed',
        durationType: 'monthly',
        basePrice: 0,
        isActive: true,
      });
    }
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!formData.name || formData.name.length < 2) {
      alert('Name must be at least 2 characters');
      return;
    }
    
    try {
      if (editingId) {
        await updateService(editingId, formData);
      } else {
        await createService(formData);
      }
      setModalVisible(false);
    } catch (err: any) {
      alert(err.message || 'An error occurred');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteService(id);
    } catch (err: any) {
      alert(err.message || 'An error occurred');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: '#f5f5f5' }]}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text variant="headlineMedium" style={styles.headerText}>Services</Text>
            <Text variant="bodyMedium" style={{ color: '#666' }}>Manage your offerings</Text>
          </View>
          <Button
            mode="outlined"
            icon="package-variant"
            onPress={() => router.push('/(app)/packages' as any)}
            compact
          >
            Packages
          </Button>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading && services.length > 0} onRefresh={fetchServices} />
        }
      >
        {error ? (
          <Text style={{ color: theme.colors.error, marginBottom: 16 }}>{error}</Text>
        ) : null}

        {isLoading && services.length === 0 ? (
          <ActivityIndicator animating={true} style={{ marginTop: 40 }} />
        ) : services.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 40, color: '#666' }}>No services found. Add one to get started!</Text>
        ) : (
          services.map((service) => (
            <Surface key={service.id} style={styles.card} elevation={1}>
              <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                  <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>{service.name}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                    <Chip 
                      compact 
                      style={{ 
                        backgroundColor: service.isActive ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                        marginRight: 8
                      }}
                      textStyle={{ color: service.isActive ? '#4CAF50' : '#F44336', fontSize: 10 }}
                    >
                      {service.isActive ? 'Active' : 'Inactive'}
                    </Chip>
                    <Text style={{ color: '#666', fontSize: 12 }}>
                      {service.durationType.toUpperCase()} • {service.pricingType.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Text variant="titleLarge" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                    ₹{service.basePrice}
                  </Text>
                </View>
              </View>
              
              <Divider style={{ marginVertical: 12 }} />
              
              <View style={styles.cardActions}>
                <Button mode="text" icon="pencil" onPress={() => openModal(service)}>Edit</Button>
                <Button mode="text" icon="delete" textColor={theme.colors.error} onPress={() => handleDelete(service.id)}>
                  Delete
                </Button>
              </View>
            </Surface>
          ))
        )}
      </ScrollView>

      <Portal>
        <Modal 
          visible={modalVisible} 
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modalContent}
        >
          <Text variant="headlineSmall" style={{ fontWeight: 'bold', marginBottom: 20 }}>
            {editingId ? 'Edit Service' : 'Add New Service'}
          </Text>

          <TextInput
            mode="outlined"
            label="Service Name"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            style={{ marginBottom: 16 }}
          />

          <TextInput
            mode="outlined"
            label="Base Price (₹)"
            keyboardType="numeric"
            value={formData.basePrice?.toString() || ''}
            onChangeText={(text) => setFormData({ ...formData, basePrice: Number(text) })}
            style={{ marginBottom: 24 }}
          />

          <Text variant="labelLarge" style={{ marginBottom: 8, color: '#666' }}>Pricing Type</Text>
          <SegmentedButtons
            value={formData.pricingType as string}
            onValueChange={(value) => setFormData({ ...formData, pricingType: value as any })}
            buttons={[
              { value: 'fixed', label: 'Fixed' },
              { value: 'custom', label: 'Custom' },
            ]}
            style={{ marginBottom: 24 }}
            theme={{ colors: { secondaryContainer: 'rgba(0, 87, 231, 0.1)' } }}
          />

          <Text variant="labelLarge" style={{ marginBottom: 8, color: '#666' }}>Duration</Text>
          <SegmentedButtons
            value={formData.durationType as string}
            onValueChange={(value) => setFormData({ ...formData, durationType: value as any })}
            buttons={[
              { value: 'monthly', label: 'Month' },
              { value: 'quarterly', label: 'Quarter' },
              { value: 'yearly', label: 'Year' },
            ]}
            style={{ marginBottom: 24 }}
            theme={{ colors: { secondaryContainer: 'rgba(0, 87, 231, 0.1)' } }}
          />

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
            <Text variant="labelLarge">Active Status</Text>
            <Switch 
              value={formData.isActive} 
              onValueChange={(val) => setFormData({ ...formData, isActive: val })} 
              color={theme.colors.primary}
            />
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <Button mode="text" onPress={() => setModalVisible(false)} style={{ marginRight: 8 }}>Cancel</Button>
            <Button mode="contained" onPress={handleSave} loading={isLoading}>
              {editingId ? 'Save Changes' : 'Create Service'}
            </Button>
          </View>
        </Modal>
      </Portal>

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color="#fff"
        onPress={() => openModal()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerText: {
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100, 
  },
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 110, // Above tab bar and iOS safe area
    borderRadius: 28,
  },
  modalContent: {
    backgroundColor: 'white', 
    padding: 24, 
    margin: 20, 
    borderRadius: 12 
  },
});
