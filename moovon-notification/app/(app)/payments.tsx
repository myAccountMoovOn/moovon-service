import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import {
  Text,
  useTheme,
  Surface,
  IconButton,
  Portal,
  Modal,
  Button,
  SegmentedButtons,
  Divider,
  Chip,
  Searchbar,
} from 'react-native-paper';
import { useAuthStore } from '../../store/authStore';
import { usePaymentsStore, PaymentItem } from '../../store/paymentsStore';
import { useRouter } from 'expo-router';

export default function PaymentsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const user = useAuthStore(s => s.user);
  
  const { payments, isLoading, fetchPayments, markAsPaid, fetchInvoice, deletePayment } = usePaymentsStore();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<string>('all');

  const load = useCallback(() => {
    fetchPayments({
      search: search || undefined,
      status: statusFilter === 'all' ? undefined : statusFilter,
    });
  }, [search, statusFilter]);

  useEffect(() => {
    if (user) load();
  }, [user, load]);

  const handleDelete = (id: string) => {
    Alert.alert('Delete Payment', 'Are you sure you want to delete this payment record?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deletePayment(id) },
    ]);
  };

  const handleMarkPaid = (subscriptionId: string) => {
    Alert.alert('Mark as Paid', 'Manually mark this payment as successful?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Confirm', onPress: () => markAsPaid(subscriptionId).catch(err => Alert.alert('Error', err.message)) },
    ]);
  };

  const renderPayment = ({ item }: { item: PaymentItem }) => {
    const isSuccess = item.status === 'success';
    const isPending = item.status === 'pending';
    const customer = item.subscription?.customer;
    const service = item.subscription?.service;

    return (
      <Surface style={styles.card} elevation={1}>
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
              {customer?.name || 'Unknown Customer'}
            </Text>
            <Text variant="bodySmall" style={{ color: '#0057e7', fontWeight: '500', marginTop: 2 }}>
              {service?.name || 'Custom Package'}
            </Text>
          </View>
          <Chip
            compact
            style={{ 
              backgroundColor: isSuccess ? 'rgba(76,175,80,0.12)' : isPending ? 'rgba(255,152,0,0.12)' : 'rgba(244,67,54,0.12)' 
            }}
            textStyle={{ 
              color: isSuccess ? '#388E3C' : isPending ? '#F57C00' : '#D32F2F', 
              fontSize: 10 
            }}
          >
            {item.status.toUpperCase()}
          </Chip>
        </View>

        <Divider style={{ marginVertical: 10 }} />
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
          <Text variant="bodySmall" style={{ color: '#666' }}>Amount:</Text>
          <Text variant="bodySmall" style={{ fontWeight: 'bold' }}>₹{item.amount}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
          <Text variant="bodySmall" style={{ color: '#666' }}>Gateway:</Text>
          <Text variant="bodySmall" style={{ textTransform: 'capitalize' }}>{item.paymentGateway}</Text>
        </View>
        {item.transactionId && (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
            <Text variant="bodySmall" style={{ color: '#666' }}>Transaction ID:</Text>
            <Text variant="bodySmall" style={{ fontFamily: 'monospace' }}>{item.transactionId}</Text>
          </View>
        )}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text variant="bodySmall" style={{ color: '#666' }}>Date:</Text>
          <Text variant="bodySmall">
            {item.paidAt ? new Date(item.paidAt).toLocaleDateString() : new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>

        <Divider style={{ marginVertical: 10 }} />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          {isPending ? (
            <Button mode="outlined" icon="check-circle" compact onPress={() => handleMarkPaid(item.subscriptionId)}>
              Mark Paid
            </Button>
          ) : isSuccess ? (
            <Button mode="text" icon="file-document-outline" compact onPress={() => fetchInvoice(item.id).catch(err => Alert.alert('Error', err.message))}>
              Invoice
            </Button>
          ) : <View />}

          <IconButton icon="delete" size={18} iconColor={theme.colors.error} onPress={() => handleDelete(item.id)} />
        </View>
      </Surface>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: '#f5f5f5' }]}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <IconButton icon="arrow-left" onPress={() => router.back()} style={{ marginLeft: -8 }} />
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text variant="headlineMedium" style={styles.headerText}>Payments</Text>
              <Text variant="bodySmall" style={{ color: '#666' }}>Transaction history</Text>
            </View>
            <IconButton
              icon="filter-variant"
              onPress={() => {
                setPendingStatus(statusFilter);
                setFilterModalVisible(true);
              }}
              iconColor={statusFilter !== 'all' ? '#0057e7' : '#666'}
            />
          </View>
        </View>
        
        <Searchbar
          placeholder="Search by ID or customer..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchbar}
          inputStyle={{ fontSize: 14 }}
        />
        
        {statusFilter !== 'all' && (
          <View style={{ flexDirection: 'row', marginHorizontal: 16, marginTop: 8 }}>
            <Chip compact onClose={() => setStatusFilter('all')} style={{ backgroundColor: 'rgba(0,87,231,0.1)' }} textStyle={{ color: '#0057e7', fontSize: 11 }}>
              Status: {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
            </Chip>
          </View>
        )}
      </View>

      <FlatList
        data={payments}
        keyExtractor={i => i.id}
        renderItem={renderPayment}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={load} />}
        ListEmptyComponent={
          !isLoading ? (
            <Text style={{ textAlign: 'center', marginTop: 60, color: '#999' }}>
              No payments found.
            </Text>
          ) : null
        }
      />

      {/* Filter Modal */}
      <Portal>
        <Modal visible={filterModalVisible} onDismiss={() => setFilterModalVisible(false)} contentContainerStyle={styles.filterModal}>
          <Text variant="titleLarge" style={{ fontWeight: 'bold', marginBottom: 20 }}>Filters</Text>
          
          <Text variant="labelLarge" style={{ color: '#666', marginBottom: 8 }}>Payment Status</Text>
          <SegmentedButtons
            value={pendingStatus}
            onValueChange={v => setPendingStatus(v)}
            buttons={[
              { value: 'all', label: 'All' },
              { value: 'success', label: 'Success' },
              { value: 'pending', label: 'Pending' },
            ]}
            style={{ marginBottom: 28 }}
          />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Button mode="outlined" onPress={() => setPendingStatus('all')} style={{ flex: 1, marginRight: 8 }}>Reset</Button>
            <Button mode="contained" onPress={() => { setStatusFilter(pendingStatus); setFilterModalVisible(false); }} style={{ flex: 1 }}>Apply</Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 50,
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
  listContent: { padding: 16, paddingBottom: 40 },
  card: { borderRadius: 12, backgroundColor: '#fff', marginBottom: 14, padding: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  filterModal: {
    backgroundColor: '#fff',
    padding: 24,
    marginHorizontal: 0,
    marginBottom: 0,
    marginTop: 'auto',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  }
});
