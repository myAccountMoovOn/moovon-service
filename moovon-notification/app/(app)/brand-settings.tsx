import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { Text, TextInput, Button, IconButton, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useCompanyStore } from '../../store/companyStore';

import GeneralDetailsForm from '../../components/brand-settings/GeneralDetailsForm';
import BrandingColorsForm from '../../components/brand-settings/BrandingColorsForm';
import CustomDomainForm from '../../components/brand-settings/CustomDomainForm';
import SmtpConfigForm from '../../components/brand-settings/SmtpConfigForm';
import SupportLegalForm from '../../components/brand-settings/SupportLegalForm';

export default function BrandSettingsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { company, fetchMyCompany, updateMyCompany, isLoading } = useCompanyStore();

  const [formData, setFormData] = useState<any>({
    name: '', appName: '', tagline: '', logo: '', primaryColor: '',
    accentColor: '', favicon: '', appIconUrl: '', customDomain: '',
    smtpHost: '', smtpPort: '', smtpUser: '', smtpPass: '',
    smtpFromName: '', smtpFromEmail: '', emailHeaderLogo: '',
    supportEmail: '', supportPhone: '', privacyPolicyUrl: '',
    termsUrl: '', footerText: ''
  });

  useEffect(() => {
    fetchMyCompany();
  }, []);

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || '',
        appName: company.appName || '',
        tagline: company.tagline || '',
        logo: company.logo || '',
        primaryColor: company.primaryColor || '',
        accentColor: company.accentColor || '',
        favicon: company.favicon || '',
        appIconUrl: company.appIconUrl || '',
        customDomain: company.customDomain || '',
        smtpHost: company.smtpHost || '',
        smtpPort: company.smtpPort || '',
        smtpUser: company.smtpUser || '',
        smtpPass: company.smtpPass || '',
        smtpFromName: company.smtpFromName || '',
        smtpFromEmail: company.smtpFromEmail || '',
        emailHeaderLogo: company.emailHeaderLogo || '',
        supportEmail: company.supportEmail || '',
        supportPhone: company.supportPhone || '',
        privacyPolicyUrl: company.privacyPolicyUrl || '',
        termsUrl: company.termsUrl || '',
        footerText: company.footerText || ''
      });
    }
  }, [company]);

  const handleChange = (key: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!formData.name?.trim()) return Alert.alert('Error', 'Company name is required');
    try {
      await updateMyCompany(formData);
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

        <GeneralDetailsForm formData={formData} handleChange={handleChange} />
        <BrandingColorsForm formData={formData} handleChange={handleChange} />
        <CustomDomainForm formData={formData} handleChange={handleChange} />
        <SmtpConfigForm formData={formData} handleChange={handleChange} />
        <SupportLegalForm formData={formData} handleChange={handleChange} />

        <Button mode="contained" onPress={handleSave} loading={isLoading} style={styles.saveBtn} contentStyle={{ paddingVertical: 8 }}>
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
  sectionTitle: { marginTop: 16, marginBottom: 12, fontWeight: 'bold', color: '#333' },
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
