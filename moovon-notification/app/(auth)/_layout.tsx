import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" options={{ title: 'Login' }} />
      <Stack.Screen name="signup-customer" options={{ title: 'Sign Up', headerShown: true }} />
      <Stack.Screen name="signup-provider" options={{ title: 'Register Company', headerShown: true }} />
    </Stack>
  );
}
