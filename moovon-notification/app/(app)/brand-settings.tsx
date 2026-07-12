import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { Text, TextInput, Button, IconButton, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useCompanyStore } from '../../store/companyStore';

export default function BrandSettingsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { company, fetchMyCompany, updateMyCompany, isLoading } = useCompanyStore();

  const [name, setName] = useState('');
  const [logo, setLogo] = useState('');
  const [customDomain, setCustomDomain] = useState('');

  useEffect(() => {
    fetchMyCompany();
  }, []);

  useEffect(() => {
    if (company) {
      setName(company.name || '');
      setLogo(company.logo || '');
      setCustomDomain(company.customDomain || '');
    }
  }, [company]);

  const handleSave = async () => {
    if (!name.trim()) return Alert.alert('Error', 'Company name is required');
    try {
      await updateMyCompany({ name, logo, customDomain });
      Alert.alert('Success', 'Brand settings updated successfully!');
      router.back();
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.message || 'Failed to update brand settings');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" onPress={() => router.back()} style={{ marginLeft: -8 }} />
        <Text variant="titleLarge" style={{ fontWeight: 'bold' }}>Brand Settings</Text>
      </View>

      <View style={styles.form}>
        <Text variant="bodyLarge" style={styles.description}>
          Customize how your customers experience your platform. You can set a custom domain and logo for white-labeling.
        </Text>

        <TextInput
          label="Company Name"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Logo URL"
          value={logo}
          onChangeText={setLogo}
          mode="outlined"
          placeholder="https://example.com/logo.png"
          autoCapitalize="none"
          style={styles.input}
        />

        {logo ? (
          <View style={styles.previewContainer}>
            <Text variant="bodySmall" style={{ marginBottom: 8, color: '#666' }}>Logo Preview:</Text>
            <Image 
              source={{ uri: logo }} 
              style={{ width: 100, height: 100, resizeMode: 'contain', borderRadius: 8, backgroundColor: '#f9f9f9' }} 
              onError={() => Alert.alert('Error', 'Failed to load image from URL')}
            />
          </View>
        ) : null}

        <TextInput
          label="Custom Domain"
          value={customDomain}
          onChangeText={setCustomDomain}
          mode="outlined"
          placeholder="portal.yourdomain.com"
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
          left={<TextInput.Affix text="https://" />}
        />
        <Text variant="bodySmall" style={styles.helpText}>
          If you configure a custom domain, point its CNAME record to our servers to enable white-label access.
        </Text>

        <Button 
          mode="contained" 
          onPress={handleSave} 
          loading={isLoading}
          style={styles.saveBtn}
          contentStyle={{ paddingVertical: 8 }}
        >
          Save Settings
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  form: { padding: 16 },
  description: { marginBottom: 24, color: '#555' },
  input: { marginBottom: 16 },
  helpText: { marginTop: -8, marginBottom: 24, color: '#777' },
  previewContainer: {
    marginBottom: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    alignItems: 'center',
  },
  saveBtn: {
    marginTop: 8,
    backgroundColor: '#0057e7',
    borderRadius: 8,
  }
});
