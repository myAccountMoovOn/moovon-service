import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Platform } from 'react-native';
import { Text, useTheme, Surface, ActivityIndicator, IconButton, SegmentedButtons, TouchableRipple, Button } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../../store/authStore';
import { useDashboardStore } from '../../../store/dashboardStore';

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  
  const { 
    metrics, period, setPeriod, isLoading, error, fetchDashboardMetrics,
    setActiveMetric, customFrom, customTo, setCustomDates
  } = useDashboardStore();

  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  const handleFromChange = (event: any, selectedDate?: Date) => {
    setShowFromPicker(Platform.OS === 'ios');
    if (selectedDate && event.type !== 'dismissed') {
      setCustomDates(selectedDate.toISOString(), customTo);
      setShowFromPicker(false);
    }
  };

  const handleToChange = (event: any, selectedDate?: Date) => {
    setShowToPicker(Platform.OS === 'ios');
    if (selectedDate && event.type !== 'dismissed') {
      setCustomDates(customFrom, selectedDate.toISOString());
      setShowToPicker(false);
    }
  };

  useEffect(() => {
    // Automatically fetch metrics when the screen mounts
    if (user?.role === 'provider') {
      fetchDashboardMetrics();
    }
  }, [user]);

  // A quick helper to render a stat card
  const renderMetricCard = (id: string, title: string, value: string | number, icon: string) => {
    return (
      <TouchableRipple 
        style={styles.metricCard} 
        onPress={() => {
          setActiveMetric(id);
          router.push(`/(app)/drilldown?metric=${id}` as any);
        }}
        borderless
      >
        <Surface style={{ flex: 1, backgroundColor: 'transparent' }} elevation={0}>
          <View style={styles.metricHeader}>
            <Text variant="titleMedium" style={styles.metricTitle}>{title}</Text>
            <IconButton icon={icon} size={20} iconColor={theme.colors.primary} style={{ margin: 0 }} />
          </View>
          <Text variant="headlineMedium" style={{ fontWeight: 'bold', color: theme.colors.primary, marginTop: 8 }}>
            {value}
          </Text>
        </Surface>
      </TouchableRipple>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: '#f5f5f5' }]}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.headerText}>Dashboard</Text>
        <Text variant="bodyMedium" style={{ color: '#666' }}>Welcome back, {user?.email}</Text>
      </View>

      {user?.role === 'provider' ? (
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isLoading && !!metrics} onRefresh={fetchDashboardMetrics} />
          }
        >
          {error ? (
            <Text style={{ color: theme.colors.error, marginBottom: 16 }}>{error}</Text>
          ) : null}
          
          <SegmentedButtons
            value={period}
            onValueChange={(value) => setPeriod(value as any)}
            buttons={[
              { value: 'today', label: 'Today' },
              { value: 'week', label: 'Week' },
              { value: 'month', label: 'Month' },
              { value: 'all', label: 'All' },
              { value: 'custom', label: 'Custom' },
            ]}
            style={{ marginBottom: period === 'custom' ? 10 : 20 }}
            theme={{ colors: { secondaryContainer: 'rgba(0, 87, 231, 0.1)' } }}
          />

          {period === 'custom' && (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
              {Platform.OS === 'android' ? (
                <>
                  <Button mode="outlined" onPress={() => setShowFromPicker(true)} style={{ flex: 1, marginRight: 8 }}>
                    {customFrom ? new Date(customFrom).toLocaleDateString('en-GB') : 'Start Date'}
                  </Button>
                  <Button mode="outlined" onPress={() => setShowToPicker(true)} style={{ flex: 1, marginLeft: 8 }}>
                    {customTo ? new Date(customTo).toLocaleDateString('en-GB') : 'End Date'}
                  </Button>
                  
                  {showFromPicker && (
                    <DateTimePicker
                      value={customFrom ? new Date(customFrom) : new Date()}
                      mode="date"
                      display="default"
                      onChange={handleFromChange}
                    />
                  )}
                  {showToPicker && (
                    <DateTimePicker
                      value={customTo ? new Date(customTo) : new Date()}
                      mode="date"
                      display="default"
                      onChange={handleToChange}
                    />
                  )}
                </>
              ) : (
                <>
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text variant="labelMedium" style={{ marginBottom: 4, color: '#666' }}>Start Date</Text>
                    <DateTimePicker
                      value={customFrom ? new Date(customFrom) : new Date()}
                      mode="date"
                      display="default"
                      onChange={(event, date) => {
                        if (date) setCustomDates(date.toISOString(), customTo);
                      }}
                    />
                  </View>
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text variant="labelMedium" style={{ marginBottom: 4, color: '#666' }}>End Date</Text>
                    <DateTimePicker
                      value={customTo ? new Date(customTo) : new Date()}
                      mode="date"
                      display="default"
                      onChange={(event, date) => {
                        if (date) setCustomDates(customFrom, date.toISOString());
                      }}
                    />
                  </View>
                </>
              )}
            </View>
          )}

          {isLoading && !metrics ? (
            <ActivityIndicator animating={true} style={{ marginTop: 40 }} />
          ) : metrics ? (
            <View style={styles.grid}>
              {renderMetricCard(
                'customers',
                'Total Customers', 
                metrics.totalCustomers || 0, 
                'account-group'
              )}
              {renderMetricCard(
                'active',
                'Active Subs', 
                metrics.activeSubscriptions || 0, 
                'check-decagram'
              )}
              {renderMetricCard(
                'expired',
                'Expired Subs', 
                metrics.expiredSubscriptions || 0, 
                'alert-circle-outline'
              )}
              {renderMetricCard(
                'revenue',
                'Total Revenue', 
                `₹${metrics.totalRevenue?.toLocaleString() || 0}`, 
                'cash'
              )}
              {renderMetricCard(
                'new_customers',
                'New Customers', 
                metrics.newCustomers || 0, 
                'rocket-launch'
              )}
              {renderMetricCard(
                'new_revenue',
                'New Revenue', 
                `₹${metrics.newRevenue?.toLocaleString() || 0}`, 
                'cash-plus'
              )}
              {renderMetricCard(
                'upcoming',
                'Upcoming Renewals', 
                metrics.upcomingRenewals || 0, 
                'clock-outline'
              )}
              {renderMetricCard(
                'expected',
                'Expected Revenue', 
                `₹${metrics.expectedRevenue?.toLocaleString() || 0}`, 
                'trending-up'
              )}
            </View>
          ) : null}
        </ScrollView>
      ) : (
        <View style={styles.card}>
          <Text variant="titleMedium" style={{ color: theme.colors.primary, marginBottom: 8, fontWeight: 'bold' }}>
            Customer Dashboard
          </Text>
          <Text variant="bodyLarge" style={{ color: '#333' }}>
            Your active subscriptions and bookings will appear here soon.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60, // For status bar
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  headerText: {
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100, // For floating tab bar
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: '48%', // Two columns
    minHeight: 120, // Adjusted for cards without subtitles
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    marginBottom: 16,
    shadowColor: 'rgba(60, 64, 67, 0.3)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 2,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricTitle: {
    color: '#333',
    fontWeight: '600',
    flex: 1,
  },
  card: {
    marginHorizontal: 20,
    padding: 24,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    shadowColor: 'rgba(60, 64, 67, 0.3)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 2, // Android shadow
  },
});
