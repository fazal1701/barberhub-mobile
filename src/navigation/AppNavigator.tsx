import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/theme';

// Screens
import { ProfessionalDiscoveryScreen } from '../screens/ProfessionalDiscoveryScreen';
import { BarberProfileScreen } from '../screens/BarberProfileScreen';
import { BookingScreen } from '../screens/BookingScreen';
import { AppointmentsScreen } from '../screens/AppointmentsScreen';
import { CalendarScheduleScreen } from '../screens/CalendarScheduleScreen';
import { WalkInQueueScreen } from '../screens/WalkInQueueScreen';
import { ClientManagementScreen } from '../screens/ClientManagementScreen';
import { FinancialDashboardScreen } from '../screens/FinancialDashboardScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const ClientTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.card,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: 8,
          height: 65,
        },
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.text.tertiary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Discovery"
        component={ProfessionalDiscoveryScreen}
        options={{
          tabBarLabel: 'Discover',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Schedule"
        component={CalendarScheduleScreen}
        options={{
          tabBarLabel: 'Schedule',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Queue"
        component={WalkInQueueScreen}
        options={{
          tabBarLabel: 'Queue',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Clients"
        component={ClientManagementScreen}
        options={{
          tabBarLabel: 'Clients',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Financials"
        component={FinancialDashboardScreen}
        options={{
          tabBarLabel: 'Money',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="wallet" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  return (
    <NavigationContainer
      theme={{
        dark: true,
        colors: {
          primary: Colors.accent,
          background: Colors.background,
          card: Colors.card,
          text: Colors.text.primary,
          border: Colors.border,
          notification: Colors.accent,
        },
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Main" component={ClientTabNavigator} />
        <Stack.Screen 
          name="BarberProfile" 
          component={BarberProfileScreen}
          options={{
            presentation: 'card',
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen 
          name="Booking" 
          component={BookingScreen}
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen 
          name="Appointments" 
          component={AppointmentsScreen}
          options={{
            presentation: 'card',
            animation: 'slide_from_right',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
