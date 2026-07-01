import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import HomeScreen from './src/screens/HomeScreen';
import AppDetailScreen from './src/screens/AppDetailScreen';
import VipScreen from './src/screens/VipScreen';
import AdminScreen from './src/screens/AdminScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const DarkTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#0A0A0A',
    card: '#0A0A0A',
    text: '#FFF',
    border: '#1a1a1a',
  },
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#4A90E2',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: { backgroundColor: '#000', borderTopColor: '#1a1a1a', height: 60, paddingBottom: 8, paddingTop: 5 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ color, focused }) => {
          let name = 'home';
          if (route.name === 'Home') name = focused ? 'home' : 'home-outline';
          if (route.name === 'Games') name = focused ? 'game-controller' : 'game-controller-outline';
          if (route.name === 'VIP') name = focused ? 'diamond' : 'diamond-outline';
          if (route.name === 'Apps') name = focused ? 'apps' : 'apps-outline';
          if (route.name === 'Me') name = focused ? 'person' : 'person-outline';
          return <Icon name={name} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Games" component={HomeScreen} />
      <Tab.Screen name="VIP" component={VipScreen} />
      <Tab.Screen name="Apps" component={HomeScreen} />
      <Tab.Screen name="Me" component={VipScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer theme={DarkTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0A0A0A' } }}>
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="AppDetail" component={AppDetailScreen} />
        <Stack.Screen name="Admin" component={AdminScreen} options={{ presentation: 'modal' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
