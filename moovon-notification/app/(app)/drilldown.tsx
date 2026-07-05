import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, useTheme, Surface, ActivityIndicator, IconButton, Searchbar, SegmentedButtons, Menu } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useDashboardStore } from '../../store/dashboardStore';

const formatDate = (dateString: string | Date | undefined) => {
  if (!dateString) return 'N/A';
  const d = new Date(dateString);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

export default function DrillDownScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { metric } = useLocalSearchParams<{ metric: string }>();

  const { 
    activeMetric, setActiveMetric,
    searchQuery, setSearchQuery, 
    drillDownData, isDrillDownLoading, fetchDrillDownData,
    period, setPeriod
  } = useDashboardStore();

  const [filterMenuVisible, setFilterMenuVisible] = useState(false);

  useEffect(() => {
    if (metric && activeMetric !== metric) {
      setActiveMetric(metric);
    }
  }, [metric]);

  const getTitle = () => {
    switch (activeMetric) {
      case 'customers': return 'Total Customers';
      case 'active': return 'Active Subscriptions';
      case 'expired': return 'Expired Subscriptions';
      case 'revenue': return 'Total Revenue';
      case 'new_customers': return 'New Customers';
      case 'new_revenue': return 'New Revenue';
      case 'upcoming': return 'Upcoming Renewals';
      case 'expected': return 'Expected Revenue';
      default: return 'Data View';
    }
  };

  const isCustomerMetric = ['customers', 'new_customers'].includes(activeMetric || '');
  const isSubscriptionMetric = ['active', 'expired', 'upcoming', 'expected'].includes(activeMetric || '');
  const isRevenueMetric = ['revenue', 'new_revenue'].includes(activeMetric || '');

  const changeMetric = (newMetric: string) => {
    setActiveMetric(newMetric);
    setFilterMenuVisible(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: '#f5f5f5' }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <IconButton 
            icon="arrow-left" 
            size={24} 
            onPress={() => router.back()} 
            style={{ marginLeft: -8 }}
          />
          <Text variant="headlineSmall" style={styles.headerText}>{getTitle()}</Text>
        </View>

        <Menu
          visible={filterMenuVisible}
          onDismiss={() => setFilterMenuVisible(false)}
          anchor={
            <IconButton 
              icon="filter-variant" 
              iconColor={theme.colors.primary}
              onPress={() => setFilterMenuVisible(true)} 
            />
          }
        >
          {isCustomerMetric && (
            <>
              <Menu.Item onPress={() => changeMetric('customers')} title="All Customers" />
              <Menu.Item onPress={() => changeMetric('new_customers')} title="New Customers" />
            </>
          )}
          {isSubscriptionMetric && (
            <>
              <Menu.Item onPress={() => changeMetric('active')} title="Active Subscriptions" />
              <Menu.Item onPress={() => changeMetric('expired')} title="Expired Subscriptions" />
              <Menu.Item onPress={() => changeMetric('upcoming')} title="Upcoming Renewals" />
              <Menu.Item onPress={() => changeMetric('expected')} title="Pending / Expected" />
            </>
          )}
          {isRevenueMetric && (
            <>
              <Menu.Item onPress={() => changeMetric('revenue')} title="Total Revenue" />
              <Menu.Item onPress={() => changeMetric('new_revenue')} title="New Revenue" />
            </>
          )}
        </Menu>
      </View>

      {/* Advanced Filters */}
      <View style={styles.filterSection}>
        <Searchbar
          placeholder="Search name, email, or phone..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={{ backgroundColor: '#ffffff', borderRadius: 8, marginBottom: 12 }}
          elevation={1}
        />
        
        <SegmentedButtons
          value={period}
          onValueChange={(value) => setPeriod(value as any)}
          buttons={[
            { value: 'today', label: 'Today' },
            { value: 'week', label: 'Week' },
            { value: 'month', label: 'Month' },
            { value: 'all', label: 'All' },
          ]}
          theme={{ colors: { secondaryContainer: 'rgba(0, 87, 231, 0.1)' } }}
        />
      </View>

      {/* Data List */}
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isDrillDownLoading && drillDownData.length > 0} onRefresh={fetchDrillDownData} />
        }
      >
        {isDrillDownLoading && drillDownData.length === 0 ? (
          <ActivityIndicator animating={true} style={{ marginTop: 40 }} />
        ) : drillDownData.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 40, color: '#666' }}>No records found for this period.</Text>
        ) : (
          drillDownData.map((item, index) => (
            <Surface key={item.id || index} style={styles.listItem} elevation={1}>
              {['customers', 'new_customers'].includes(activeMetric || '') && (
                <View style={styles.listRow}>
                  <View>
                    <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
                    <Text style={{ color: '#666', fontSize: 12 }}>{item.phone || item.email || 'No contact info'}</Text>
                  </View>
                  <Text style={{ color: '#666', fontSize: 12 }}>
                    Joined: {formatDate(item.createdAt)}
                  </Text>
                </View>
              )}

              {['active', 'expired', 'upcoming', 'expected'].includes(activeMetric || '') && (
                <View style={styles.listRow}>
                  <View>
                    <Text style={{ fontWeight: 'bold' }}>{item.customer?.name || 'Unknown'}</Text>
                    <Text style={{ color: '#666', fontSize: 12 }}>{item.service?.name || 'Unknown Service'}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ color: activeMetric === 'expired' ? theme.colors.error : theme.colors.primary, fontWeight: 'bold' }}>
                      {activeMetric === 'expired' ? 'EXPIRED' : formatDate(item.endDate)}
                    </Text>
                    <Text style={{ color: '#999', fontSize: 10 }}>{item.service?.durationType?.toUpperCase()}</Text>
                  </View>
                </View>
              )}

              {['revenue', 'new_revenue'].includes(activeMetric || '') && (
                <View style={styles.listRow}>
                  <View>
                    <Text style={{ fontWeight: 'bold' }}>{item.subscription?.customer?.name || 'Unknown'}</Text>
                    <Text style={{ color: '#666', fontSize: 12 }}>{item.subscription?.service?.name || 'Unknown Service'}</Text>
                  </View>
                  <Text style={{ fontWeight: 'bold', color: theme.colors.primary, fontSize: 16 }}>
                    ₹{item.amount?.toLocaleString() || 0}
                  </Text>
                </View>
              )}
            </Surface>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50, 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  headerText: {
    fontWeight: 'bold',
    color: '#333333',
    marginLeft: 8,
  },
  filterSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100, 
  },
  listItem: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  listRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
