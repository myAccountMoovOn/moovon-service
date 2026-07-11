import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Button, useTheme, Divider } from 'react-native-paper';
import { useAuthStore } from '../../../store/authStore';
import { useCompanyStore } from '../../../store/companyStore';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const theme = useTheme();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { company, fetchMyCompany } = useCompanyStore();
  const router = useRouter();

  React.useEffect(() => {
    if (user?.role !== 'customer') {
      fetchMyCompany();
    }
  }, [user]);

  return (
    <View style={[styles.container, { backgroundColor: '#f5f5f5' }]}>
      <View style={styles.header}>
        {company?.logo ? (
          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            <Image 
              source={{ uri: company.logo }} 
              style={{ width: 80, height: 80, resizeMode: 'contain', borderRadius: 8 }} 
            />
          </View>
        ) : null}
        <Text variant="headlineMedium" style={styles.headerText}>{company?.name || 'Profile'}</Text>
      </View>
      
      <View style={styles.card}>
        <Text variant="titleMedium" style={{ color: theme.colors.primary, marginBottom: 16, fontWeight: 'bold' }}>
          Account Settings
        </Text>
        
        <Text variant="bodyLarge" style={{ marginBottom: 8, color: '#333' }}>
          Email: {user?.email}
        </Text>
        <Text variant="bodyLarge" style={{ marginBottom: 24, color: '#333' }}>
          Role: <Text style={{ textTransform: 'capitalize' }}>{user?.role}</Text>
        </Text>

        {user?.role !== 'customer' && (
          <View style={{ marginBottom: 24 }}>
            <Divider style={{ marginBottom: 16 }} />
            <Text variant="titleMedium" style={{ color: theme.colors.primary, marginBottom: 16, fontWeight: 'bold' }}>
              Management Tools
            </Text>
            
            <Button 
              mode="contained" 
              icon="cash-multiple" 
              onPress={() => router.push('/(app)/payments' as any)}
              style={{ borderRadius: 8, marginBottom: 12 }}
            >
              Payments History
            </Button>
            
            <Button 
              mode="outlined" 
              icon="bell-outline" 
              onPress={() => router.push('/(app)/notifications' as any)}
              style={{ borderRadius: 8, marginBottom: 12 }}
            >
              Notification Logs
            </Button>
            
            <Button 
              mode="outlined" 
              icon="message-draw" 
              onPress={() => router.push('/(app)/templates' as any)}
              style={{ borderRadius: 8, marginBottom: 12 }}
            >
              Notification Templates
            </Button>
            
            <Button 
              mode="outlined" 
              icon="tag-multiple" 
              onPress={() => router.push('/(app)/categories' as any)}
              style={{ borderRadius: 8, marginBottom: 12 }}
            >
              Manage Categories
            </Button>

            <Button 
              mode="outlined" 
              icon="ticket-percent" 
              onPress={() => router.push('/(app)/coupons' as any)}
              style={{ borderRadius: 8, marginBottom: 12 }}
            >
              Manage Coupons
            </Button>
            
            <Button 
              mode="outlined" 
              icon="chart-bar" 
              onPress={() => router.push('/(app)/reports' as any)}
              style={{ borderRadius: 8, marginBottom: 12 }}
            >
              Business Reports
            </Button>

            <Button 
              mode="outlined" 
              icon="palette-swatch" 
              onPress={() => router.push('/(app)/brand-settings' as any)}
              style={{ borderRadius: 8 }}
            >
              Brand Settings (White Labeling)
            </Button>
          </View>
        )}

        <Button mode="contained" onPress={logout} style={styles.button}>
          Logout
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60, // For status bar
    paddingHorizontal: 20,
    paddingBottom: 100, 
  },
  header: {
    marginBottom: 24,
  },
  headerText: {
    fontWeight: 'bold',
    color: '#333333',
  },
  card: {
    padding: 24,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    shadowColor: 'rgba(60, 64, 67, 0.3)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 2,
  },
  button: {
    width: '100%',
    borderRadius: 8,
    marginTop: 16,
  }
});
