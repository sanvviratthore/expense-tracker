import { Tabs } from 'expo-router';
import { Text } from 'react-native';

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#161616',
          borderTopColor: '#2a2a2a',
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: '#e8d44d',
        tabBarInactiveTintColor: '#7a7672',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>◈</Text>,
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categories',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>◉</Text>,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          href: null, // hide from tab bar, accessed via button
        }}
      />
    </Tabs>
  );
}
