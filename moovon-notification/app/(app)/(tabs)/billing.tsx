import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, useTheme, ActivityIndicator } from 'react-native-paper';
import { api } from '../../../api/axios';
import { useAuthStore } from '../../../store/authStore';

export default function BillingScreen() {
  const theme = useTheme();
  const user = useAuthStore((state) => state.user);
  
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get('/payments/my-payments');
      const data = res.data?.data ?? res.data;
      setPayments(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load billing history');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'customer') {
      fetchPayments();
    }
  }, [user]);

  if (user?.role !== 'customer') {
    return (
      <View style={styles.container}>
        <Text style={{ padding: 20 }}>This screen is only for customers.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.headerText}>Billing History</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchPayments} />}
      >
        {error ? (
          <Text style={{ color: theme.colors.error, marginBottom: 16 }}>{error}</Text>
        ) : null}

        {isLoading && payments.length === 0 ? (
          <ActivityIndicator animating={true} style={{ marginTop: 40 }} />
        ) : payments.length > 0 ? (
          payments.map((payment) => (
            <View key={payment.id} style={styles.card}>
              <View style={styles.row}>
                <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                  ₹{payment.amount?.toLocaleString()}
                </Text>
                <Text 
                  style={{ 
                    color: payment.status === 'completed' || payment.status === 'success' ? 'green' : 'orange',
                    fontWeight: 'bold',
                    textTransform: 'capitalize'
                  }}
                >
                  {payment.status}
                </Text>
              </View>
              <Text variant="bodyMedium" style={{ color: '#666', marginTop: 4 }}>
                {payment.description || 'Subscription Payment'}
              </Text>
              <Text variant="bodySmall" style={{ color: '#999', marginTop: 8 }}>
                {new Date(payment.created_at).toLocaleString()}
              </Text>
            </View>
          ))
        ) : (
          <View style={styles.card}>
            <Text variant="bodyLarge" style={{ color: '#666' }}>
              You don't have any billing history yet.
            </Text>
          </View>
        )}
      </ScrollView>
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
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    marginBottom: 12,
    shadowColor: 'rgba(60, 64, 67, 0.3)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  }
});
