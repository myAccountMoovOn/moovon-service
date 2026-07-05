import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { useAuthStore } from '../../store/authStore';

export default function ProfileScreen() {
  const theme = useTheme();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <View style={[styles.container, { backgroundColor: '#f5f5f5' }]}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.headerText}>Profile</Text>
      </View>
      
      <View style={styles.card}>
        <Text variant="titleMedium" style={{ color: theme.colors.primary, marginBottom: 16, fontWeight: 'bold' }}>
          Account Settings
        </Text>
        
        <Text variant="bodyLarge" style={{ marginBottom: 8, color: '#333' }}>
          Email: {user?.email}
        </Text>
        <Text variant="bodyLarge" style={{ marginBottom: 24, color: '#333' }}>
          Role: {user?.role}
        </Text>

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
