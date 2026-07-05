import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
  TouchableOpacity,
  Platform,
  ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
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
  SegmentedButtons,
  Switch,
  Divider,
  Chip,
  Searchbar,
} from 'react-native-paper';
import { useAuthStore } from '../../store/authStore';
import { useCustomersStore, CustomerItem, CustomerCreateResult } from '../../store/customersStore';
import { useRouter } from 'expo-router';

// ── Date helpers ──────────────────────────────────────────────────────────────
function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

// ── Types ─────────────────────────────────────────────────────────────────────
type FilterPeriod = 'all' | 'today' | 'week' | 'month' | 'custom';
type FilterStatus = 'all' | 'active' | 'inactive';

function getPeriodDates(period: FilterPeriod, customFrom?: string, customTo?: string): { from?: string; to?: string } {
  const now = new Date();
  if (period === 'today') {
    const from = new Date(now); from.setHours(0, 0, 0, 0);
    const to = new Date(now); to.setHours(23, 59, 59, 999);
    return { from: from.toISOString(), to: to.toISOString() };
  } else if (period === 'week') {
    const from = new Date(now); from.setDate(now.getDate() - now.getDay()); from.setHours(0, 0, 0, 0);
    const to = new Date(now); to.setHours(23, 59, 59, 999);
    return { from: from.toISOString(), to: to.toISOString() };
  } else if (period === 'month') {
    const from = new Date(now.getFullYear(), now.getMonth(), 1);
    const to = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    return { from: from.toISOString(), to: to.toISOString() };
  } else if (period === 'custom' && customFrom && customTo) {
    return { from: customFrom, to: customTo };
  }
  return {};
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function CustomersScreen() {
  const theme = useTheme();
  const user = useAuthStore((s) => s.user);
  const { customers, total, isLoading, fetchCustomers, createCustomer, updateCustomer, deleteCustomer } = useCustomersStore();

  // Filter state
  const [search, setSearch] = useState('');
  const [period, setPeriod] = useState<FilterPeriod>('all');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [customFrom, setCustomFrom] = useState<string | null>(null);
  const [customTo, setCustomTo] = useState<string | null>(null);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  // Pending (unsaved) filter state — only applied when user hits Apply
  const [pendingPeriod, setPendingPeriod] = useState<FilterPeriod>('all');
  const [pendingStatus, setPendingStatus] = useState<FilterStatus>('all');
  const [pendingFrom, setPendingFrom] = useState<Date>(new Date());
  const [pendingTo, setPendingTo] = useState<Date>(new Date());
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerItem | null>(null);
  const [createdCredentials, setCreatedCredentials] = useState<{ email: string; password: string } | null>(null);
  const [credModalVisible, setCredModalVisible] = useState(false);

  // Form state
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    address: '',
    gstNumber: '',
    notes: '',
    isActive: true,
    notificationEmail: true,
    notificationSms: true,
    notificationWhatsapp: true,
  });

  // ── Fetch with current filters ─────────────────────────────────────────────
  const load = useCallback(() => {
    const dates = getPeriodDates(period, customFrom || undefined, customTo || undefined);
    fetchCustomers({
      search: search || undefined,
      isActive: statusFilter === 'all' ? undefined : statusFilter === 'active',
      from: dates.from,
      to: dates.to,
    });
  }, [search, period, statusFilter, customFrom, customTo]);

  useEffect(() => { if (user) load(); }, [user, search, period, statusFilter, customFrom, customTo]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const openCreateModal = () => {
    setEditingCustomer(null);
    setForm({ name: '', email: '', phone: '', companyName: '', address: '', gstNumber: '', notes: '', isActive: true, notificationEmail: true, notificationSms: true, notificationWhatsapp: true });
    setModalVisible(true);
  };

  const openEditModal = (customer: CustomerItem) => {
    setEditingCustomer(customer);
    setForm({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      companyName: customer.companyName || '',
      address: customer.address || '',
      gstNumber: customer.gstNumber || '',
      notes: customer.notes || '',
      isActive: customer.isActive,
      notificationEmail: customer.notificationEmail,
      notificationSms: customer.notificationSms,
      notificationWhatsapp: customer.notificationWhatsapp,
    });
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!form.name || form.name.length < 2) { Alert.alert('Validation', 'Name must be at least 2 characters'); return; }
    if (!form.email.includes('@')) { Alert.alert('Validation', 'Please enter a valid email'); return; }
    if (!form.phone || form.phone.length < 7) { Alert.alert('Validation', 'Please enter a valid phone number'); return; }

    try {
      if (editingCustomer) {
        await updateCustomer(editingCustomer.id, form);
        setModalVisible(false);
      } else {
        const result: CustomerCreateResult = await createCustomer(form);
        setModalVisible(false);
        if (result?.password) {
          setCreatedCredentials({ email: result.email || form.email, password: result.password });
          setCredModalVisible(true);
        }
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Something went wrong');
    }
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert('Delete Customer', `Are you sure you want to delete ${name}? This will also delete all their subscriptions and payments.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteCustomer(id) },
    ]);
  };

  // ── Customer Card ──────────────────────────────────────────────────────────
  const renderCustomer = ({ item }: { item: CustomerItem }) => (
    <Surface style={styles.card} elevation={1}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>{item.name}</Text>
          <Text variant="bodySmall" style={{ color: '#666' }}>{item.email}</Text>
          {item.phone ? <Text variant="bodySmall" style={{ color: '#666' }}>{item.phone}</Text> : null}
        </View>
        <Chip
          compact
          style={{ backgroundColor: item.isActive ? 'rgba(76,175,80,0.12)' : 'rgba(244,67,54,0.12)' }}
          textStyle={{ color: item.isActive ? '#388E3C' : '#D32F2F', fontSize: 10 }}
        >
          {item.isActive ? 'Active' : 'Inactive'}
        </Chip>
      </View>

      {(item.companyName || item.gstNumber) ? (
        <>
          <Divider style={{ marginVertical: 10 }} />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {item.companyName ? <Text variant="bodySmall" style={{ color: '#555' }}>🏢 {item.companyName}</Text> : null}
            {item.gstNumber ? <Text variant="bodySmall" style={{ color: '#555' }}>GST: {item.gstNumber}</Text> : null}
          </View>
        </>
      ) : null}

      <Divider style={{ marginVertical: 10 }} />

      <View style={styles.cardFooter}>
        <Text variant="bodySmall" style={{ color: '#999' }}>Joined: {formatDate(item.createdAt)}</Text>
        <View style={{ flexDirection: 'row' }}>
          <IconButton icon="pencil" size={18} onPress={() => openEditModal(item)} />
          <IconButton icon="delete" size={18} iconColor={theme.colors.error} onPress={() => handleDelete(item.id, item.name)} />
        </View>
      </View>
    </Surface>
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <View style={[styles.container, { backgroundColor: '#f5f5f5' }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text variant="headlineMedium" style={styles.headerText}>Customers</Text>
            <Text variant="bodySmall" style={{ color: '#666' }}>{total} total</Text>
          </View>
          <IconButton
            icon="filter-variant"
            onPress={() => {
              setPendingPeriod(period);
              setPendingStatus(statusFilter);
              setPendingFrom(customFrom ? new Date(customFrom) : new Date());
              setPendingTo(customTo ? new Date(customTo) : new Date());
              setFilterModalVisible(true);
            }}
            iconColor={(period !== 'all' || statusFilter !== 'all') ? '#0057e7' : '#666'}
          />
        </View>

        <Searchbar
          placeholder="Search by name, email, phone..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchbar}
          inputStyle={{ fontSize: 14 }}
        />

        {/* Active filter chips */}
        {(period !== 'all' || statusFilter !== 'all') && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
            {statusFilter !== 'all' && (
              <Chip
                compact
                onClose={() => setStatusFilter('all')}
                style={{ backgroundColor: 'rgba(0,87,231,0.1)' }}
                textStyle={{ color: '#0057e7', fontSize: 11 }}
              >
                {statusFilter === 'active' ? 'Active' : 'Inactive'}
              </Chip>
            )}
            {period !== 'all' && (
              <Chip
                compact
                onClose={() => setPeriod('all')}
                style={{ backgroundColor: 'rgba(0,87,231,0.1)' }}
                textStyle={{ color: '#0057e7', fontSize: 11 }}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Chip>
            )}
          </View>
        )}
      </View>

      {/* List */}
      {isLoading && customers.length === 0 ? (
        <ActivityIndicator animating style={{ marginTop: 60 }} />
      ) : (
        <FlatList
          data={customers}
          keyExtractor={(item) => item.id}
          renderItem={renderCustomer}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={isLoading && customers.length > 0} onRefresh={load} />}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', marginTop: 60, color: '#999' }}>
              No customers found.
            </Text>
          }
        />
      )}

      {/* FAB */}
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color="#fff"
        onPress={openCreateModal}
      />

      {/* Create / Edit Modal */}
      <Portal>
        {/* ── Filter Popup ─────────────────────────────────────── */}
        <Modal
          visible={filterModalVisible}
          onDismiss={() => setFilterModalVisible(false)}
          contentContainerStyle={styles.filterModal}
        >
          <Text variant="titleLarge" style={{ fontWeight: 'bold', marginBottom: 20 }}>Filter Customers</Text>

          <Text variant="labelLarge" style={{ color: '#666', marginBottom: 8 }}>Status</Text>
          <SegmentedButtons
            value={pendingStatus}
            onValueChange={(v) => setPendingStatus(v as FilterStatus)}
            buttons={[
              { value: 'all', label: 'All' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
            ]}
            style={{ marginBottom: 20 }}
            theme={{ colors: { secondaryContainer: 'rgba(0,87,231,0.1)' } }}
          />

          <Text variant="labelLarge" style={{ color: '#666', marginBottom: 8 }}>Joined Period</Text>
          <SegmentedButtons
            value={pendingPeriod}
            onValueChange={(v) => setPendingPeriod(v as FilterPeriod)}
            buttons={[
              { value: 'all', label: 'All' },
              { value: 'today', label: 'Today' },
              { value: 'week', label: 'Week' },
              { value: 'month', label: 'Month' },
              { value: 'custom', label: 'Custom' },
            ]}
            style={{ marginBottom: pendingPeriod === 'custom' ? 16 : 28 }}
            theme={{ colors: { secondaryContainer: 'rgba(0,87,231,0.1)' } }}
          />

          {pendingPeriod === 'custom' && (
            <View style={{ marginBottom: 20 }}>
              {Platform.OS === 'android' ? (
                <>
                  <Button mode="outlined" onPress={() => setShowFromPicker(true)} style={{ marginBottom: 8 }}>
                    From: {pendingFrom.toLocaleDateString('en-GB')}
                  </Button>
                  <Button mode="outlined" onPress={() => setShowToPicker(true)} style={{ marginBottom: 8 }}>
                    To: {pendingTo.toLocaleDateString('en-GB')}
                  </Button>
                  {showFromPicker && (
                    <DateTimePicker value={pendingFrom} mode="date" display="default"
                      onChange={(_, d) => { setShowFromPicker(false); if (d) setPendingFrom(d); }} />
                  )}
                  {showToPicker && (
                    <DateTimePicker value={pendingTo} mode="date" display="default"
                      onChange={(_, d) => { setShowToPicker(false); if (d) setPendingTo(d); }} />
                  )}
                </>
              ) : (
                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                  <View style={{ alignItems: 'center' }}>
                    <Text variant="labelMedium" style={{ color: '#666', marginBottom: 4 }}>Start Date</Text>
                    <DateTimePicker value={pendingFrom} mode="date" display="default"
                      onChange={(_, d) => { if (d) setPendingFrom(d); }} />
                  </View>
                  <View style={{ alignItems: 'center' }}>
                    <Text variant="labelMedium" style={{ color: '#666', marginBottom: 4 }}>End Date</Text>
                    <DateTimePicker value={pendingTo} mode="date" display="default"
                      onChange={(_, d) => { if (d) setPendingTo(d); }} />
                  </View>
                </View>
              )}
            </View>
          )}

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Button
              mode="outlined"
              onPress={() => {
                setPendingPeriod('all');
                setPendingStatus('all');
              }}
              style={{ flex: 1, marginRight: 8 }}
            >
              Reset
            </Button>
            <Button
              mode="contained"
              onPress={() => {
                setPeriod(pendingPeriod);
                setStatusFilter(pendingStatus);
                if (pendingPeriod === 'custom') {
                  setCustomFrom(pendingFrom.toISOString());
                  setCustomTo(pendingTo.toISOString());
                } else {
                  setCustomFrom(null);
                  setCustomTo(null);
                }
                setFilterModalVisible(false);
              }}
              style={{ flex: 1 }}
            >
              Apply
            </Button>
          </View>
        </Modal>

        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modalContent}
        >
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <Text variant="headlineSmall" style={{ fontWeight: 'bold', marginBottom: 16 }}>
              {editingCustomer ? 'Edit Customer' : 'Add Customer'}
            </Text>

            <TextInput mode="outlined" label="Full Name *" value={form.name} onChangeText={(t) => setForm({ ...form, name: t })} style={styles.input} />
            <TextInput mode="outlined" label="Email *" keyboardType="email-address" autoCapitalize="none" value={form.email} onChangeText={(t) => setForm({ ...form, email: t })} style={styles.input} editable={!editingCustomer} />
            <TextInput mode="outlined" label="Phone *" keyboardType="phone-pad" value={form.phone} onChangeText={(t) => setForm({ ...form, phone: t })} style={styles.input} />
            <TextInput mode="outlined" label="Company Name" value={form.companyName} onChangeText={(t) => setForm({ ...form, companyName: t })} style={styles.input} />
            <TextInput mode="outlined" label="GST Number" value={form.gstNumber} onChangeText={(t) => setForm({ ...form, gstNumber: t })} style={styles.input} />
            <TextInput mode="outlined" label="Address" value={form.address} onChangeText={(t) => setForm({ ...form, address: t })} style={styles.input} multiline numberOfLines={2} />
            <TextInput mode="outlined" label="Notes" value={form.notes} onChangeText={(t) => setForm({ ...form, notes: t })} style={styles.input} multiline numberOfLines={2} />

            <Divider style={{ marginVertical: 12 }} />
            <Text variant="labelLarge" style={{ marginBottom: 8 }}>Notifications</Text>
            {[
              { label: 'Email', field: 'notificationEmail' as const },
              { label: 'SMS', field: 'notificationSms' as const },
              { label: 'WhatsApp', field: 'notificationWhatsapp' as const },
            ].map(({ label, field }) => (
              <View key={field} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <Text>{label}</Text>
                <Switch value={form[field]} onValueChange={(v) => setForm({ ...form, [field]: v })} color={theme.colors.primary} />
              </View>
            ))}

            <Divider style={{ marginVertical: 12 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text variant="labelLarge">Active Status</Text>
              <Switch value={form.isActive} onValueChange={(v) => setForm({ ...form, isActive: v })} color={theme.colors.primary} />
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <Button mode="text" onPress={() => setModalVisible(false)} style={{ marginRight: 8 }}>Cancel</Button>
              <Button mode="contained" onPress={handleSave} loading={isLoading}>
                {editingCustomer ? 'Save Changes' : 'Create Customer'}
              </Button>
            </View>
          </ScrollView>
        </Modal>

        {/* Credentials modal (shown after creation) */}
        <Modal
          visible={credModalVisible}
          onDismiss={() => setCredModalVisible(false)}
          contentContainerStyle={styles.modalContent}
        >
          <Text variant="headlineSmall" style={{ fontWeight: 'bold', marginBottom: 8 }}>✅ Customer Created!</Text>
          <Text variant="bodyMedium" style={{ color: '#555', marginBottom: 16 }}>
            Please save these login credentials for your customer:
          </Text>
          <Surface style={{ padding: 16, borderRadius: 8, backgroundColor: '#f9f9f9', marginBottom: 16 }} elevation={0}>
            <Text variant="labelMedium" style={{ color: '#666' }}>Email</Text>
            <Text variant="bodyLarge" style={{ fontWeight: 'bold', marginBottom: 8 }}>{createdCredentials?.email}</Text>
            <Text variant="labelMedium" style={{ color: '#666' }}>Password</Text>
            <Text variant="bodyLarge" style={{ fontWeight: 'bold', fontFamily: 'monospace' }}>{createdCredentials?.password}</Text>
          </Surface>
          <Button mode="contained" onPress={() => setCredModalVisible(false)}>Got it!</Button>
        </Modal>
      </Portal>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerText: { fontWeight: 'bold', color: '#1a1a1a' },
  searchbar: { marginTop: 10, backgroundColor: '#f5f5f5', elevation: 0, borderRadius: 10 },
  listContent: { padding: 16, paddingBottom: 120 },
  card: {
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 14,
    padding: 16,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(0,87,231,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontWeight: 'bold', fontSize: 18, color: '#0057e7' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  fab: { position: 'absolute', right: 16, bottom: 110, borderRadius: 28 },
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
  filterModal: {
    backgroundColor: '#fff',
    padding: 24,
    marginHorizontal: 0,
    marginBottom: 0,
    marginTop: 'auto',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  input: { marginBottom: 12 },

});
