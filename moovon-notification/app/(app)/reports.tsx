import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ScrollView, RefreshControl } from 'react-native';
import { Text, useTheme, Surface, IconButton, SegmentedButtons, Button, Divider, Chip } from 'react-native-paper';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useReportsStore } from '../../store/reportsStore';
import { useAuthStore } from '../../store/authStore';

type ReportTab = 'revenue' | 'renewals';

export default function ReportsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const user = useAuthStore(s => s.user);

  const [activeTab, setActiveTab] = useState<ReportTab>('revenue');
  const [fromDate, setFromDate] = useState<Date>(new Date(new Date().setDate(1))); // First of month
  const [toDate, setToDate] = useState<Date>(new Date());
  
  const [showFrom, setShowFrom] = useState(false);
  const [showTo, setShowTo] = useState(false);

  const { fetchRevenue, fetchRenewals, revenueData, renewalsData, isLoading } = useReportsStore();

  const loadData = () => {
    if (!user) return;
    const fromStr = fromDate.toISOString().split('T')[0];
    const toStr = toDate.toISOString().split('T')[0];
    
    if (activeTab === 'revenue') {
      fetchRevenue(fromStr, toStr);
    } else {
      fetchRenewals(fromStr, toStr);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab, fromDate, toDate, user]);

  const renderRevenueItem = ({ item }: { item: any }) => (
    <View style={styles.listItem}>
      <View style={{ flex: 1 }}>
        <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>{item.subscription?.customer?.name || 'Unknown'}</Text>
        <Text variant="bodySmall" style={{ color: '#666' }}>ID: {item.transactionId || 'N/A'}</Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text variant="titleMedium" style={{ color: '#2e7d32', fontWeight: 'bold' }}>Rs. {item.amount}</Text>
        <Text variant="bodySmall">{new Date(item.paidAt).toLocaleDateString()}</Text>
      </View>
    </View>
  );

  const renderRenewalItem = ({ item }: { item: any }) => {
    const isExpired = new Date(item.endDate) < new Date();
    return (
      <View style={styles.listItem}>
        <View style={{ flex: 1 }}>
          <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>{item.customer?.name}</Text>
          <Text variant="bodySmall" style={{ color: '#666' }}>{item.service?.name}</Text>
        </View>
        <View style={{ alignItems: 'flex-end', gap: 4 }}>
          <Chip compact textStyle={{ fontSize: 10, color: isExpired ? '#d32f2f' : '#ef6c00' }} style={{ backgroundColor: isExpired ? '#ffebee' : '#fff3e0' }}>
            {isExpired ? 'EXPIRED' : 'UPCOMING'}
          </Chip>
          <Text variant="bodySmall" style={{ fontWeight: 'bold' }}>
            {new Date(item.endDate).toLocaleDateString()}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: '#f5f5f5' }]}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" onPress={() => router.back()} style={{ marginLeft: -8 }} />
        <View>
          <Text variant="headlineMedium" style={styles.headerText}>Reports</Text>
          <Text variant="bodySmall" style={{ color: '#666' }}>Business & Revenue Analytics</Text>
        </View>
      </View>

      <View style={styles.filtersContainer}>
        <SegmentedButtons
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as ReportTab)}
          buttons={[
            { value: 'revenue', label: 'Revenue', icon: 'cash-multiple' },
            { value: 'renewals', label: 'Renewals', icon: 'calendar-clock' },
          ]}
          style={{ marginBottom: 16 }}
        />

        <View style={styles.dateRow}>
          <Button mode="outlined" onPress={() => setShowFrom(true)} style={{ flex: 1 }}>
            From: {fromDate.toLocaleDateString()}
          </Button>
          <Text style={{ marginHorizontal: 8 }}>-</Text>
          <Button mode="outlined" onPress={() => setShowTo(true)} style={{ flex: 1 }}>
            To: {toDate.toLocaleDateString()}
          </Button>
        </View>
      </View>

      {showFrom && (
        <DateTimePicker
          value={fromDate}
          mode="date"
          onChange={(e, d) => { setShowFrom(false); if(d) setFromDate(d); }}
        />
      )}
      {showTo && (
        <DateTimePicker
          value={toDate}
          mode="date"
          onChange={(e, d) => { setShowTo(false); if(d) setToDate(d); }}
        />
      )}

      {activeTab === 'revenue' && revenueData && (
        <Surface style={styles.summaryCard} elevation={1}>
          <Text variant="titleMedium" style={{ color: '#fff', opacity: 0.9 }}>Total Revenue (Selected Period)</Text>
          <Text variant="displaySmall" style={{ color: '#fff', fontWeight: 'bold', marginTop: 8 }}>
            Rs. {(revenueData.totalRevenue || 0).toLocaleString()}
          </Text>
        </Surface>
      )}

      <FlatList
        data={activeTab === 'revenue' ? revenueData?.payments : renewalsData}
        keyExtractor={(i, index) => i.id || index.toString()}
        renderItem={activeTab === 'revenue' ? renderRevenueItem : renderRenewalItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadData} />}
        ItemSeparatorComponent={() => <Divider />}
        ListEmptyComponent={
          !isLoading ? (
            <Text style={{ textAlign: 'center', marginTop: 40, color: '#999' }}>
              No records found for this period.
            </Text>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerText: { fontWeight: 'bold', color: '#1a1a1a' },
  filtersContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryCard: {
    margin: 16,
    marginBottom: 0,
    padding: 24,
    borderRadius: 16,
    backgroundColor: '#0057e7',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
  }
});
