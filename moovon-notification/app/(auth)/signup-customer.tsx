import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text, TextInput, Button, useTheme, Surface } from 'react-native-paper';
import { router } from 'expo-router';

import { useAuthStore } from '../../store/authStore';

export default function SignupCustomerScreen() {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    companyCode: '',
    name: '',
    phone: '',
    email: '',
    password: '',
  });
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const registerCustomerStep1 = useAuthStore((state) => state.registerCustomerStep1);
  const verifySignup = useAuthStore((state) => state.verifySignup);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

  const handleSignup = async () => {
    if (!formData.email || !formData.password || !formData.companyCode) return;
    clearError();
    try {
      await registerCustomerStep1(formData);
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
            Join your Company
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Enter the company code provided by your business owner to get started.
          </Text>
        </View>

        <Surface style={styles.card} elevation={2}>
          {!otpSent ? (
            <>
              <TextInput
                label="Company Code *"
                mode="outlined"
                value={formData.companyCode}
                onChangeText={(v) => updateField('companyCode', v)}
                autoCapitalize="characters"
                style={styles.input}
              />

              <View style={styles.divider} />

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
                secureTextEntry={!showPassword}
                right={<TextInput.Icon icon={showPassword ? "eye-off" : "eye"} onPress={() => setShowPassword(!showPassword)} />}
                style={styles.input}
              />

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
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 16,
    marginBottom: 24,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 40,
  },
});
