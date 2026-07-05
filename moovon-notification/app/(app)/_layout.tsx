import { Tabs } from 'expo-router';
import CustomTabBar from '../../components/ui/CustomTabBar';

export default function AppLayout() {
  return (
    <Tabs 
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" options={{ title: 'Dashboard' }} />
      <Tabs.Screen name="services" options={{ title: 'Services' }} />
      <Tabs.Screen name="customers" options={{ title: 'Customers' }} />
      <Tabs.Screen name="subscriptions" options={{ title: 'Subscriptions' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      <Tabs.Screen name="drilldown" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="packages" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="payments" options={{ href: null, tabBarStyle: { display: 'none' } }} />
    </Tabs>
  );
}
