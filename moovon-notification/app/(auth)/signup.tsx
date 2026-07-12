import React, { useState, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Modal, FlatList, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, useTheme, Surface, SegmentedButtons, Searchbar } from 'react-native-paper';
import { router } from 'expo-router';
import { api } from '../../api/axios';
import { useAuthStore } from '../../store/authStore';

const CompanySelectModal = ({ visible, onClose, onSelect, companies, fetching, title }: any) => {
  const theme = useTheme();
  const [search, setSearch] = useState('');

  const filtered = companies.filter((c: any) => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
        <View style={styles.modalHeader}>
          <Text variant="titleLarge">{title}</Text>
          <Button onPress={onClose}>Close</Button>
        </View>
        <Searchbar
          placeholder="Search..."
          onChangeText={setSearch}
          value={search}
          style={styles.searchbar}
        />
        {fetching ? (
          <Text style={{ textAlign: 'center', marginTop: 24 }}>Loading...</Text>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.listItem, { borderBottomColor: theme.colors.surfaceVariant }]}
                onPress={() => {
                  onSelect(item.code, item.name);
                  onClose();
                }}
              >
                <Text variant="bodyLarge">{item.name}</Text>
                <Text variant="bodySmall" style={{ opacity: 0.6 }}>{item.code}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 24 }}>No results found.</Text>}
          />
        )}
      </View>
    </Modal>
  );
};

export default function SignupScreen() {
  const theme = useTheme();
  const [accountType, setAccountType] = useState('customer');
  
  const [formData, setFormData] = useState({
    companyName: '',
    name: '',
    phone: '',
    email: '',
    password: '',
    businessCode: '',
    resellerCode: '',
  });

  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  
  const [companies, setCompanies] = useState([]);
  const [fetchingCompanies, setFetchingCompanies] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCompanyName, setSelectedCompanyName] = useState('');

  const registerCustomerStep1 = useAuthStore((state) => state.registerCustomerStep1);
  const registerProviderStep1 = useAuthStore((state) => state.registerProviderStep1);
  const registerResellerStep1 = useAuthStore((state) => state.registerResellerStep1);
  const verifySignup = useAuthStore((state) => state.verifySignup);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

  useEffect(() => {
    if (accountType === 'customer' || accountType === 'business') {
      const fetchCompanies = async () => {
        setFetchingCompanies(true);
        try {
          const type = accountType === 'customer' ? 'business' : 'reseller';
          const res = await api.get(`/companies/public/list?type=${type}`);
          const raw = res.data;
          const list = Array.isArray(raw) ? raw : Array.isArray(raw?.data) ? raw.data : [];
          setCompanies(list);
        } catch (e) {
          console.error('Failed to fetch companies', e);
        } finally {
          setFetchingCompanies(false);
        }
      };
      fetchCompanies();
    } else {
      setCompanies([]);
    }
  }, [accountType]);

  const handleSignup = async () => {
    if (!formData.email || !formData.password) return;
    clearError();
    try {
      if (accountType === 'customer') {
        if (!formData.businessCode) return;
        await registerCustomerStep1({ ...formData, companyCode: formData.businessCode });
      } else if (accountType === 'business') {
        if (!formData.companyName) return;
        await registerProviderStep1(formData);
      } else {
        if (!formData.companyName) return;
        await registerResellerStep1(formData);
      }
      setOtpSent(true);
    } catch (err) {
      // Error handled by store
    }
  };

  const handleVerifyOtp = async () => {
    if (!formData.email || !otp) return;
    clearError();
    try {
      await verifySignup(formData.email, otp);
      router.replace('/');
    } catch (err) {
      // Error handled by store
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const openCompanySelect = () => setModalVisible(true);
  
  const handleCompanySelect = (code: string, name: string) => {
    setSelectedCompanyName(name);
    if (accountType === 'customer') {
      updateField('businessCode', code);
    } else {
      updateField('resellerCode', code);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? undefined : 'padding'}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets={true}
      >
        <View style={{ flex: 1 }} />
        
        <View style={styles.header}>
          <Text variant="headlineMedium" style={{ fontWeight: 'bold' }}>
            Create an Account
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Join Moovon today
          </Text>
        </View>

        <Surface style={styles.card} elevation={2}>
          {!otpSent ? (
            <>
              <SegmentedButtons
                value={accountType}
                onValueChange={(val) => {
                  setAccountType(val);
                  setFormData(prev => ({ ...prev, businessCode: '', resellerCode: '', companyName: '' }));
                  setSelectedCompanyName('');
                  clearError();
                }}
                buttons={[
                  { value: 'customer', label: 'Customer' },
                  { value: 'business', label: 'Business' },
                  { value: 'reseller', label: 'Reseller' },
                ]}
                style={{ marginBottom: 24 }}
              />

              <TextInput
                label="Full Name"
                mode="outlined"
                value={formData.name}
                onChangeText={(v) => updateField('name', v)}
                style={styles.input}
              />
              <TextInput
                label="Phone Number"
                mode="outlined"
                value={formData.phone}
                onChangeText={(v) => updateField('phone', v)}
                keyboardType="phone-pad"
                style={styles.input}
              />
              <TextInput
                label="Email"
                mode="outlined"
                value={formData.email}
                onChangeText={(v) => updateField('email', v)}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
              <TextInput
                label="Password"
                mode="outlined"
                value={formData.password}
                onChangeText={(v) => updateField('password', v)}
                secureTextEntry
                style={styles.input}
              />

              {accountType === 'customer' && (
                <TouchableOpacity onPress={openCompanySelect}>
                  <View pointerEvents="none">
                    <TextInput
                      label="Select a Business *"
                      mode="outlined"
                      value={selectedCompanyName}
                      placeholder="Tap to select..."
                      style={styles.input}
                      right={<TextInput.Icon icon="chevron-down" />}
                    />
                  </View>
                </TouchableOpacity>
              )}

              {(accountType === 'business' || accountType === 'reseller') && (
                <TextInput
                  label="Company Name *"
                  mode="outlined"
                  value={formData.companyName}
                  onChangeText={(v) => updateField('companyName', v)}
                  style={styles.input}
                />
              )}

              {accountType === 'business' && (
                <TouchableOpacity onPress={openCompanySelect}>
                  <View pointerEvents="none">
                    <TextInput
                      label="Select a Reseller (Optional)"
                      mode="outlined"
                      value={selectedCompanyName}
                      placeholder="Tap to select..."
                      style={styles.input}
                      right={<TextInput.Icon icon="chevron-down" />}
                    />
                  </View>
                </TouchableOpacity>
              )}

              {error ? (
                <Text style={{ color: theme.colors.error, marginBottom: 16 }}>{error}</Text>
              ) : null}

              <Button
                mode="contained"
                onPress={handleSignup}
                loading={isLoading}
                style={styles.button}
                contentStyle={styles.buttonContent}
              >
                Create Account
              </Button>
            </>
          ) : (
            <>
              <Text style={{ marginBottom: 16 }}>We sent a 6-digit pin to {formData.email}</Text>
              <TextInput
                label="6-Digit OTP"
                mode="outlined"
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                maxLength={6}
                style={styles.input}
              />
              {error ? (
                <Text style={{ color: theme.colors.error, marginBottom: 16 }}>{error}</Text>
              ) : null}
              <Button
                mode="contained"
                onPress={handleVerifyOtp}
                loading={isLoading}
                style={styles.button}
                contentStyle={styles.buttonContent}
              >
                Verify & Register
              </Button>
              <Button
                mode="text"
                onPress={() => setOtpSent(false)}
                style={{ marginTop: 8 }}
                disabled={isLoading}
              >
                Go Back
              </Button>
            </>
          )}
        </Surface>

        <View style={styles.footer}>
          <Button mode="text" onPress={() => router.back()}>
            Back to Login
          </Button>
        </View>

        <View style={{ flex: 1 }} />
      </ScrollView>

      <CompanySelectModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelect={handleCompanySelect}
        companies={companies}
        fetching={fetchingCompanies}
        title={accountType === 'customer' ? 'Select Business' : 'Select Reseller'}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  subtitle: {
    marginTop: 8,
    opacity: 0.7,
  },
  card: {
    padding: 24,
    borderRadius: 12,
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 6,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  modalContainer: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 40 : 0,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  searchbar: {
    margin: 16,
  },
  listItem: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
