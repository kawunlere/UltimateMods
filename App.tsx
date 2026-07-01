import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import HomeScreen from './src/screens/HomeScreen';
import ModDetailScreen from './src/screens/ModDetailScreen';
import VipScreen from './src/screens/VipScreen';
import AdminScreen from './src/screens/AdminScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#FFF' }, headerTintColor: '#DAA520' }}>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ModDetail" component={ModDetailScreen} options={{ title: 'Mod Details' }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#DAA520',
          tabBarInactiveTintColor: '#AAA',
          tabBarStyle: { backgroundColor: '#FFF', borderTopColor: '#F0F0F0', height: 60, paddingBottom: 8, paddingTop: 5 },
          tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
          headerShown: false
        }}
      >
        <Tab.Screen 
          name="HomeTab" 
          component={HomeStack} 
          options={{ 
            title: 'Home',
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏠</Text>
          }} 
        />
        <Tab.Screen 
          name="VIP" 
          component={VipScreen}
          options={{ 
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>👑</Text>
          }}
        />
        <Tab.Screen 
          name="Admin" 
          component={AdminScreen}
          options={{ 
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🔒</Text>
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
