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
} from 'react-native-paper';
import { useAuthStore } from '../../store/authStore';
import { useNotificationsStore, NotificationLogItem } from '../../store/notificationsStore';
import { useRouter } from 'expo-router';

export default function NotificationsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const user = useAuthStore(s => s.user);
  
  const { logs, isLoading, fetchLogs } = useNotificationsStore();

  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  
  const [pendingChannel, setPendingChannel] = useState<string>('all');
  const [pendingStatus, setPendingStatus] = useState<string>('all');

  const load = useCallback(() => {
    fetchLogs({
      channel: channelFilter === 'all' ? undefined : channelFilter,
      status: statusFilter === 'all' ? undefined : statusFilter,
    });
  }, [channelFilter, statusFilter]);

  useEffect(() => {
    if (user) load();
  }, [user, load]);

  const renderLog = ({ item }: { item: NotificationLogItem }) => {
    const isSuccess = item.status === 'sent';
    const isPending = item.status === 'pending';
    const customer = item.customer;

    return (
      <Surface style={styles.card} elevation={1}>
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
              {customer?.name || 'Unknown Customer'}
            </Text>
            <Text variant="bodySmall" style={{ color: '#666', marginTop: 2 }}>
              {customer?.email}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Chip
              compact
              style={{ 
                backgroundColor: isSuccess ? 'rgba(76,175,80,0.12)' : isPending ? 'rgba(255,152,0,0.12)' : 'rgba(244,67,54,0.12)',
                marginBottom: 4
              }}
              textStyle={{ 
                color: isSuccess ? '#388E3C' : isPending ? '#F57C00' : '#D32F2F', 
                fontSize: 10 
              }}
            >
              {item.status.toUpperCase()}
            </Chip>
            <Chip compact style={{ backgroundColor: '#f0f0f0' }} textStyle={{ fontSize: 10 }}>
              {item.channel.toUpperCase()}
            </Chip>
          </View>
        </View>

        <Divider style={{ marginVertical: 10 }} />
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
          <Text variant="bodySmall" style={{ color: '#666' }}>Template:</Text>
          <Text variant="bodySmall" style={{ fontWeight: 'bold' }}>{item.templateType}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
          <Text variant="bodySmall" style={{ color: '#666' }}>Created At:</Text>
          <Text variant="bodySmall">
            {new Date(item.createdAt).toLocaleString()}
          </Text>
        </View>
        {item.sentAt && (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
            <Text variant="bodySmall" style={{ color: '#666' }}>Sent At:</Text>
            <Text variant="bodySmall">
              {new Date(item.sentAt).toLocaleString()}
            </Text>
          </View>
        )}
        
        {item.errorMessage && (
          <View style={{ marginTop: 8, padding: 8, backgroundColor: 'rgba(244,67,54,0.1)', borderRadius: 6 }}>
            <Text variant="bodySmall" style={{ color: '#D32F2F' }}>Error: {item.errorMessage}</Text>
          </View>
        )}
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
              <Text variant="headlineMedium" style={styles.headerText}>Notifications</Text>
              <Text variant="bodySmall" style={{ color: '#666' }}>Communication logs</Text>
            </View>
            <IconButton
              icon="filter-variant"
              onPress={() => {
                setPendingChannel(channelFilter);
                setPendingStatus(statusFilter);
                setFilterModalVisible(true);
              }}
              iconColor={(statusFilter !== 'all' || channelFilter !== 'all') ? '#0057e7' : '#666'}
            />
          </View>
        </View>
        
        <View style={{ flexDirection: 'row', paddingHorizontal: 16, marginTop: 8, gap: 8 }}>
          {statusFilter !== 'all' && (
            <Chip compact onClose={() => setStatusFilter('all')} style={{ backgroundColor: 'rgba(0,87,231,0.1)' }} textStyle={{ color: '#0057e7', fontSize: 11 }}>
              Status: {statusFilter}
            </Chip>
          )}
          {channelFilter !== 'all' && (
            <Chip compact onClose={() => setChannelFilter('all')} style={{ backgroundColor: 'rgba(0,87,231,0.1)' }} textStyle={{ color: '#0057e7', fontSize: 11 }}>
              Channel: {channelFilter}
            </Chip>
          )}
        </View>
      </View>

      <FlatList
        data={logs}
        keyExtractor={i => i.id}
        renderItem={renderLog}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={load} />}
        ListEmptyComponent={
          !isLoading ? (
            <Text style={{ textAlign: 'center', marginTop: 60, color: '#999' }}>
              No notification logs found.
            </Text>
          ) : null
        }
      />

      {/* Filter Modal */}
      <Portal>
        <Modal visible={filterModalVisible} onDismiss={() => setFilterModalVisible(false)} contentContainerStyle={styles.filterModal}>
          <Text variant="titleLarge" style={{ fontWeight: 'bold', marginBottom: 20 }}>Filters</Text>
          
          <Text variant="labelLarge" style={{ color: '#666', marginBottom: 8 }}>Status</Text>
          <SegmentedButtons
            value={pendingStatus}
            onValueChange={v => setPendingStatus(v)}
            buttons={[
              { value: 'all', label: 'All' },
              { value: 'sent', label: 'Sent' },
              { value: 'pending', label: 'Pending' },
              { value: 'failed', label: 'Failed' },
            ]}
            style={{ marginBottom: 20 }}
          />

          <Text variant="labelLarge" style={{ color: '#666', marginBottom: 8 }}>Channel</Text>
          <SegmentedButtons
            value={pendingChannel}
            onValueChange={v => setPendingChannel(v)}
            buttons={[
              { value: 'all', label: 'All' },
              { value: 'email', label: 'Email' },
              { value: 'sms', label: 'SMS' },
              { value: 'whatsapp', label: 'WhatsApp' },
            ]}
            style={{ marginBottom: 28 }}
          />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Button mode="outlined" onPress={() => { setPendingStatus('all'); setPendingChannel('all'); }} style={{ flex: 1, marginRight: 8 }}>Reset</Button>
            <Button mode="contained" onPress={() => { setStatusFilter(pendingStatus); setChannelFilter(pendingChannel); setFilterModalVisible(false); }} style={{ flex: 1 }}>Apply</Button>
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
    paddingHorizontal: 8,
  },
  headerText: { fontWeight: 'bold', color: '#1a1a1a' },
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
