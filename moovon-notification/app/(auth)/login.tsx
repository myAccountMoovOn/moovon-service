import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { Text, TextInput, Button, useTheme, Surface } from 'react-native-paper';
import { Link, router } from 'expo-router';

import { useAuthStore } from '../../store/authStore';

export default function LoginScreen() {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const login = useAuthStore((state) => state.login);
  const verifyOtp = useAuthStore((state) => state.verifyOtp);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

  const handleLogin = async () => {
    if (!email || !password) return;
    clearError();
    try {
      await login({ email, password });
      setOtpSent(true);
    } catch (err) {
      // Error is handled by store
    }
  };

  const handleVerifyOtp = async () => {
    if (!email || !otp) return;
    clearError();
    try {
      await verifyOtp(email, otp);
      // On success, redirect to home
      router.replace('/');
    } catch (err) {
      // Error handled by store
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <View style={styles.fakeShadow} />
        <Image source={require('../../assets/images/favicon.png')} style={styles.logoImage} resizeMode="contain" />
        <Text variant="displaySmall" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
          Moovon
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          {otpSent ? 'Two-Factor Authentication' : 'Sign in to your account'}
        </Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets={true}
        >
        <Surface style={styles.card} elevation={2}>
          {!otpSent ? (
            <>
              <TextInput
                label="Email"
                mode="outlined"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
              <TextInput
                label="Password"
                mode="outlined"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                right={<TextInput.Icon icon={showPassword ? "eye-off" : "eye"} onPress={() => setShowPassword(!showPassword)} />}
                style={styles.input}
              />

              {error ? (
                <Text style={{ color: theme.colors.error, marginBottom: 16 }}>{error}</Text>
              ) : null}

              <Button
                mode="contained"
                onPress={handleLogin}
                loading={isLoading}
                style={styles.button}
                contentStyle={styles.buttonContent}
              >
                Sign In
              </Button>
            </>
          ) : (
            <>
              <Text style={{ marginBottom: 16 }}>We sent a 6-digit pin to {email}</Text>
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
                Verify & Login
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
          <Text variant="bodyMedium">New to Moovon?</Text>
          <Link href="/(auth)/signup" asChild>
            <Button mode="text">Sign up for an Account</Button>
          </Link>
        </View>

        <View style={{ flex: 1 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 120,
  },
  fakeShadow: {
    position: 'absolute',
    top: 35,
    width: 50,
    height: 40,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 24,
  },
  logoImage: {
    width: 80,
    height: 80,
    marginBottom: 16,
    borderRadius: 40,
    backgroundColor: '#ffffff',
  },
  subtitle: {
    marginTop: 8,
    opacity: 0.7,
  },
  card: {
    padding: 24,
    borderRadius: 12,
    marginBottom: 32,
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
  },
  divider: {
    height: 1,
    width: '50%',
    backgroundColor: '#e0e0e0',
    marginVertical: 16,
  },
});
