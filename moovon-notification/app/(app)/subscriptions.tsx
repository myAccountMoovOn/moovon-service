import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
  TouchableOpacity,
  ScrollView,
  Platform,
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
  SegmentedButtons,
  Switch,
  Divider,
  Chip,
  Searchbar,
  List,
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuthStore } from '../../store/authStore';
import { useSubscriptionsStore, SubscriptionItem } from '../../store/subscriptionsStore';
import { useCustomersStore } from '../../store/customersStore';
import { useServicesStore } from '../../store/servicesStore';
import { usePackagesStore } from '../../store/packagesStore';

type FilterStatus = 'all' | 'active' | 'expired' | 'upcoming';
type PaymentStatus = 'all' | 'paid' | 'pending' | 'partial';

export default function SubscriptionsScreen() {
  const theme = useTheme();
  const user = useAuthStore(s => s.user);
  
  // Stores
  const { subscriptions, isLoading, fetchSubscriptions, createSubscription, updateSubscription, deleteSubscription, notifySubscription } = useSubscriptionsStore();
  const { customers, fetchCustomers } = useCustomersStore();
  const { services, fetchServices } = useServicesStore();
  const { packages, fetchPackages } = usePackagesStore();

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatus>('all');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  
  const [pendingStatus, setPendingStatus] = useState<FilterStatus>('all');
  const [pendingPayment, setPendingPayment] = useState<PaymentStatus>('all');

  // Creation/Edit Form State
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSub, setEditingSub] = useState<SubscriptionItem | null>(null);
  const [form, setForm] = useState({
    customerId: '',
    serviceId: '',
    packageId: '',
    startDate: new Date(),
    endDate: new Date(),
    amount: '',
    autoRenewal: false,
    paymentStatus: 'pending' as 'paid' | 'pending' | 'partial',
    notes: '',
  });

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // Selector Modals
  const [selectorVisible, setSelectorVisible] = useState(false);
  const [selectorType, setSelectorType] = useState<'customer' | 'service' | 'package'>('customer');

  const load = useCallback(() => {
    fetchSubscriptions({
      search: search || undefined,
      status: statusFilter === 'all' ? undefined : statusFilter,
      paymentStatus: paymentFilter === 'all' ? undefined : paymentFilter,
    });
  }, [search, statusFilter, paymentFilter]);

  useEffect(() => {
    if (user) {
      load();
      fetchCustomers();
      fetchServices();
      fetchPackages();
    }
  }, [user, load]);

  const openCreate = () => {
    setEditingSub(null);
    setForm({
      customerId: '',
      serviceId: '',
      packageId: '',
      startDate: new Date(),
      endDate: new Date(),
      amount: '',
      autoRenewal: false,
      paymentStatus: 'pending',
      notes: '',
    });
    setModalVisible(true);
  };

  const openEdit = (sub: SubscriptionItem) => {
    setEditingSub(sub);
    setForm({
      customerId: sub.customerId,
      serviceId: sub.serviceId || '',
      packageId: sub.packageId || '',
      startDate: new Date(sub.startDate),
      endDate: sub.endDate ? new Date(sub.endDate) : new Date(),
      amount: String(sub.amount),
      autoRenewal: sub.autoRenewal,
      paymentStatus: sub.paymentStatus,
      notes: sub.notes || '',
    });
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!form.customerId) { Alert.alert('Error', 'Please select a customer'); return; }
    if (!form.serviceId && !form.packageId) { Alert.alert('Error', 'Please select either a service or package'); return; }
    if (!form.amount || isNaN(Number(form.amount))) { Alert.alert('Error', 'Please enter a valid amount'); return; }

    const payload = {
      customerId: form.customerId,
      serviceId: form.serviceId || undefined,
      packageId: form.packageId || undefined,
      startDate: form.startDate.toISOString().split('T')[0],
      endDate: form.endDate.toISOString().split('T')[0],
      amount: Number(form.amount),
      autoRenewal: form.autoRenewal,
      paymentStatus: form.paymentStatus,
      notes: form.notes || undefined,
    };

    try {
      if (editingSub) {
        await updateSubscription(editingSub.id, payload);
      } else {
        await createSubscription(payload);
      }
      setModalVisible(false);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to save');
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete', 'Are you sure you want to delete this subscription?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteSubscription(id) },
    ]);
  };

  const handleNotify = (id: string) => {
    Alert.alert('Send Reminder', 'Send renewal reminder via Email?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Send', onPress: () => {
        notifySubscription(id, ['email']).then(() => {
          Alert.alert('Success', 'Reminder sent!');
        }).catch(err => {
          Alert.alert('Error', err.message || 'Failed to send');
        });
      }},
    ]);
  };

  const getCustomerName = (id: string) => customers.find(c => c.id === id)?.name || 'Unknown';
  const getServiceName = (id: string) => services.find(s => s.id === id)?.name;
  const getPackageName = (id: string) => packages.find(p => p.id === id)?.name;

  const renderSub = ({ item }: { item: SubscriptionItem }) => {
    const isExpired = item.endDate ? new Date(item.endDate) < new Date() : false;
    
    return (
      <Surface style={styles.card} elevation={1}>
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
              {item.customer?.name || 'Customer'}
            </Text>
            <Text variant="bodySmall" style={{ color: '#0057e7', fontWeight: '500', marginTop: 2 }}>
              {item.service?.name || 'Custom Package'}
            </Text>
          </View>
          <Chip
            compact
            style={{ backgroundColor: isExpired ? 'rgba(244,67,54,0.12)' : 'rgba(76,175,80,0.12)' }}
            textStyle={{ color: isExpired ? '#D32F2F' : '#388E3C', fontSize: 10 }}
          >
            {isExpired ? 'Expired' : 'Active'}
          </Chip>
        </View>

        <Divider style={{ marginVertical: 10 }} />
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
          <Text variant="bodySmall" style={{ color: '#666' }}>Amount:</Text>
          <Text variant="bodySmall" style={{ fontWeight: 'bold' }}>₹{item.amount}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
          <Text variant="bodySmall" style={{ color: '#666' }}>Payment:</Text>
          <Text variant="bodySmall" style={{ 
            color: item.paymentStatus === 'paid' ? '#4CAF50' : item.paymentStatus === 'pending' ? '#F44336' : '#FF9800',
            fontWeight: 'bold' 
          }}>
            {item.paymentStatus.toUpperCase()}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
          <Text variant="bodySmall" style={{ color: '#666' }}>Start Date:</Text>
          <Text variant="bodySmall">{new Date(item.startDate).toLocaleDateString()}</Text>
        </View>
        {item.endDate && (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text variant="bodySmall" style={{ color: '#666' }}>End Date:</Text>
            <Text variant="bodySmall">{new Date(item.endDate).toLocaleDateString()}</Text>
          </View>
        )}

        <Divider style={{ marginVertical: 10 }} />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Button mode="text" icon="bell-outline" compact onPress={() => handleNotify(item.id)}>
            Remind
          </Button>
          <View style={{ flexDirection: 'row' }}>
            <IconButton icon="pencil" size={18} onPress={() => openEdit(item)} />
            <IconButton icon="delete" size={18} iconColor={theme.colors.error} onPress={() => handleDelete(item.id)} />
          </View>
        </View>
      </Surface>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: '#f5f5f5' }]}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text variant="headlineMedium" style={styles.headerText}>Subscriptions</Text>
            <Text variant="bodySmall" style={{ color: '#666' }}>Manage recurring plans</Text>
          </View>
          <IconButton
            icon="filter-variant"
            onPress={() => {
              setPendingStatus(statusFilter);
              setPendingPayment(paymentFilter);
              setFilterModalVisible(true);
            }}
            iconColor={(statusFilter !== 'all' || paymentFilter !== 'all') ? '#0057e7' : '#666'}
          />
        </View>
        <Searchbar
          placeholder="Search customers or services..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchbar}
          inputStyle={{ fontSize: 14 }}
        />
        
        {/* Active Filter Chips */}
        {(statusFilter !== 'all' || paymentFilter !== 'all') && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginHorizontal: 16, marginTop: 8 }}>
            {statusFilter !== 'all' && (
              <Chip compact onClose={() => setStatusFilter('all')} style={{ backgroundColor: 'rgba(0,87,231,0.1)' }} textStyle={{ color: '#0057e7', fontSize: 11 }}>
                {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
              </Chip>
            )}
            {paymentFilter !== 'all' && (
              <Chip compact onClose={() => setPaymentFilter('all')} style={{ backgroundColor: 'rgba(0,87,231,0.1)' }} textStyle={{ color: '#0057e7', fontSize: 11 }}>
                {paymentFilter.charAt(0).toUpperCase() + paymentFilter.slice(1)}
              </Chip>
            )}
          </View>
        )}
      </View>

      <FlatList
        data={subscriptions}
        keyExtractor={i => i.id}
        renderItem={renderSub}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={load} />}
        ListEmptyComponent={
          !isLoading ? (
            <Text style={{ textAlign: 'center', marginTop: 60, color: '#999' }}>
              No subscriptions found. Tap + to add one.
            </Text>
          ) : null
        }
      />

      <FAB icon="plus" style={[styles.fab, { backgroundColor: theme.colors.primary }]} color="#fff" onPress={openCreate} />

      {/* Filter Modal */}
      <Portal>
        <Modal visible={filterModalVisible} onDismiss={() => setFilterModalVisible(false)} contentContainerStyle={styles.filterModal}>
          <Text variant="titleLarge" style={{ fontWeight: 'bold', marginBottom: 20 }}>Filters</Text>
          
          <Text variant="labelLarge" style={{ color: '#666', marginBottom: 8 }}>Subscription Status</Text>
          <SegmentedButtons
            value={pendingStatus}
            onValueChange={v => setPendingStatus(v as FilterStatus)}
            buttons={[
              { value: 'all', label: 'All' },
              { value: 'active', label: 'Active' },
              { value: 'expired', label: 'Expired' },
              { value: 'upcoming', label: 'Upcoming' },
            ]}
            style={{ marginBottom: 20 }}
          />

          <Text variant="labelLarge" style={{ color: '#666', marginBottom: 8 }}>Payment Status</Text>
          <SegmentedButtons
            value={pendingPayment}
            onValueChange={v => setPendingPayment(v as PaymentStatus)}
            buttons={[
              { value: 'all', label: 'All' },
              { value: 'paid', label: 'Paid' },
              { value: 'pending', label: 'Pending' },
            ]}
            style={{ marginBottom: 28 }}
          />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Button mode="outlined" onPress={() => { setPendingStatus('all'); setPendingPayment('all'); }} style={{ flex: 1, marginRight: 8 }}>Reset</Button>
            <Button mode="contained" onPress={() => { setStatusFilter(pendingStatus); setPaymentFilter(pendingPayment); setFilterModalVisible(false); }} style={{ flex: 1 }}>Apply</Button>
          </View>
        </Modal>

        {/* Create/Edit Modal */}
        <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modalContent}>
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <Text variant="headlineSmall" style={{ fontWeight: 'bold', marginBottom: 16 }}>
              {editingSub ? 'Edit Subscription' : 'New Subscription'}
            </Text>

            {/* Customer Selector */}
            <TouchableOpacity style={styles.selector} onPress={() => { setSelectorType('customer'); setSelectorVisible(true); }}>
              <Text style={{ color: form.customerId ? '#000' : '#666' }}>
                {form.customerId ? getCustomerName(form.customerId) : 'Select Customer *'}
              </Text>
            </TouchableOpacity>

            {/* Service Selector */}
            <TouchableOpacity style={styles.selector} onPress={() => { setSelectorType('service'); setSelectorVisible(true); }}>
              <Text style={{ color: form.serviceId ? '#000' : '#666' }}>
                {form.serviceId ? getServiceName(form.serviceId) : 'Select Service (Optional)'}
              </Text>
            </TouchableOpacity>

            {/* Package Selector */}
            {!form.serviceId && (
              <TouchableOpacity style={styles.selector} onPress={() => { setSelectorType('package'); setSelectorVisible(true); }}>
                <Text style={{ color: form.packageId ? '#000' : '#666' }}>
                  {form.packageId ? getPackageName(form.packageId) : 'Select Package (Optional)'}
                </Text>
              </TouchableOpacity>
            )}

            <TextInput mode="outlined" label="Amount (₹) *" keyboardType="numeric" value={form.amount} onChangeText={t => setForm({ ...form, amount: t })} style={styles.input} />

            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
              <Button mode="outlined" onPress={() => setShowStartPicker(true)} style={{ flex: 1 }}>
                Start: {form.startDate.toLocaleDateString('en-GB')}
              </Button>
              <Button mode="outlined" onPress={() => setShowEndPicker(true)} style={{ flex: 1 }}>
                End: {form.endDate.toLocaleDateString('en-GB')}
              </Button>
            </View>

            {showStartPicker && (
              <DateTimePicker value={form.startDate} mode="date" display="default"
                onChange={(_, d) => { setShowStartPicker(false); if (d) setForm({ ...form, startDate: d }); }} />
            )}
            {showEndPicker && (
              <DateTimePicker value={form.endDate} mode="date" display="default"
                onChange={(_, d) => { setShowEndPicker(false); if (d) setForm({ ...form, endDate: d }); }} />
            )}

            <Text variant="labelMedium" style={{ marginBottom: 6 }}>Payment Status</Text>
            <SegmentedButtons
              value={form.paymentStatus}
              onValueChange={v => setForm({ ...form, paymentStatus: v as any })}
              buttons={[{ value: 'paid', label: 'Paid' }, { value: 'pending', label: 'Pending' }]}
              style={{ marginBottom: 16 }}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text variant="labelLarge">Auto Renewal</Text>
              <Switch value={form.autoRenewal} onValueChange={v => setForm({ ...form, autoRenewal: v })} color={theme.colors.primary} />
            </View>

            <TextInput mode="outlined" label="Notes" value={form.notes} onChangeText={t => setForm({ ...form, notes: t })} multiline numberOfLines={2} style={styles.input} />

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 }}>
              <Button mode="text" onPress={() => setModalVisible(false)} style={{ marginRight: 8 }}>Cancel</Button>
              <Button mode="contained" onPress={handleSave} loading={isLoading}>
                {editingSub ? 'Save Changes' : 'Create'}
              </Button>
            </View>
          </ScrollView>
        </Modal>

        {/* Item Selector Modal (Customers, Services, Packages) */}
        <Modal visible={selectorVisible} onDismiss={() => setSelectorVisible(false)} contentContainerStyle={styles.selectorModal}>
          <Text variant="titleLarge" style={{ fontWeight: 'bold', marginBottom: 12 }}>
            Select {selectorType.charAt(0).toUpperCase() + selectorType.slice(1)}
          </Text>
          <ScrollView>
            {selectorType === 'customer' && customers.map(c => (
              <List.Item key={c.id} title={c.name} description={c.email} onPress={() => { setForm({ ...form, customerId: c.id }); setSelectorVisible(false); }} />
            ))}
            {selectorType === 'service' && (
              <>
                <List.Item title="None" onPress={() => { setForm({ ...form, serviceId: '' }); setSelectorVisible(false); }} />
                {services.map(s => (
                  <List.Item key={s.id} title={s.name} description={`₹${s.basePrice}`} onPress={() => { setForm({ ...form, serviceId: s.id, packageId: '' }); setSelectorVisible(false); }} />
                ))}
              </>
            )}
            {selectorType === 'package' && (
              <>
                <List.Item title="None" onPress={() => { setForm({ ...form, packageId: '' }); setSelectorVisible(false); }} />
                {packages.map(p => (
                  <List.Item key={p.id} title={p.name} description={`₹${p.offerPrice}`} onPress={() => { setForm({ ...form, packageId: p.id, serviceId: '' }); setSelectorVisible(false); }} />
                ))}
              </>
            )}
          </ScrollView>
          <Button mode="text" onPress={() => setSelectorVisible(false)} style={{ marginTop: 8 }}>Close</Button>
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
    paddingHorizontal: 16,
  },
  headerText: { fontWeight: 'bold', color: '#1a1a1a' },
  searchbar: { marginTop: 8, backgroundColor: '#f5f5f5', elevation: 0, borderRadius: 10 },
  listContent: { padding: 16, paddingBottom: 120 },
  card: { borderRadius: 12, backgroundColor: '#fff', marginBottom: 14, padding: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
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
  selectorModal: {
    backgroundColor: '#fff',
    padding: 24,
    marginHorizontal: 24,
    borderRadius: 16,
    maxHeight: '70%',
  },
  input: { marginBottom: 12 },
  selector: {
    borderWidth: 1,
    borderColor: '#79747E',
    borderRadius: 4,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
  }
});
