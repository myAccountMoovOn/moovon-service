import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Text, IconButton, FAB, Divider, Chip } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useCouponsStore, Coupon } from '../../store/couponsStore';

export default function CouponsScreen() {
  const router = useRouter();
  const { coupons, fetchCoupons, deleteCoupon, isLoading } = useCouponsStore();

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleDelete = (id: string) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this coupon?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteCoupon(id);
          } catch (e) {
            Alert.alert('Error', 'Failed to delete coupon');
          }
        }
      }
    ]);
  };

  const renderItem = ({ item }: { item: Coupon }) => {
    const isExpired = item.expiryDate && new Date(item.expiryDate) < new Date();
    
    return (
      <View style={styles.listItem}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>{item.code}</Text>
            {!item.isActive ? (
              <Chip compact textStyle={{ fontSize: 10 }}>Inactive</Chip>
            ) : isExpired ? (
              <Chip compact textStyle={{ fontSize: 10, color: '#d32f2f' }} style={{ backgroundColor: '#ffebee' }}>Expired</Chip>
            ) : (
              <Chip compact textStyle={{ fontSize: 10, color: '#2e7d32' }} style={{ backgroundColor: '#e8f5e9' }}>Active</Chip>
            )}
          </View>
          
          <Text variant="bodyMedium" style={{ color: '#666', marginTop: 4 }}>
            {item.type === 'percentage' ? `${item.value}% OFF` : `Rs. ${item.value} OFF`} 
            {item.minPurchaseAmount > 0 ? ` (Min. Rs. ${item.minPurchaseAmount})` : ''}
          </Text>
          
          {item.expiryDate && (
            <Text variant="bodySmall" style={{ color: isExpired ? '#d32f2f' : '#666', marginTop: 4 }}>
              Expires: {new Date(item.expiryDate).toLocaleDateString()}
            </Text>
          )}
        </View>
        
        <View style={{ flexDirection: 'row' }}>
          <IconButton icon="pencil" onPress={() => router.push({ pathname: '/(app)/coupon-edit' as any, params: { id: item.id } })} />
          <IconButton icon="delete" iconColor="#d32f2f" onPress={() => handleDelete(item.id)} />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" onPress={() => router.back()} style={{ marginLeft: -8 }} />
        <View>
          <Text variant="headlineMedium" style={styles.headerText}>Coupons</Text>
          <Text variant="bodySmall" style={{ color: '#666' }}>Manage promotional discounts</Text>
        </View>
      </View>

      <FlatList
        data={coupons}
        keyExtractor={i => i.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        ItemSeparatorComponent={() => <Divider />}
        refreshing={isLoading}
        onRefresh={fetchCoupons}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 40, color: '#999' }}>No coupons found. Create one to boost sales!</Text>}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('/(app)/coupon-edit' as any)}
        color="#fff"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  headerText: { fontWeight: 'bold', color: '#1a1a1a' },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 4,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#0057e7',
  }
});
