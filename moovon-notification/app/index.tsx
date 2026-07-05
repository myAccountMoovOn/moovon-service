import { Redirect } from 'expo-router';

export default function Index() {
  // TODO: Add auth state check later to redirect to (app)/dashboard if logged in
  return <Redirect href="/(auth)/login" />;
}
