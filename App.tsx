import React, {useEffect} from 'react';
import {Platform, View, ActivityIndicator} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import notifee, {EventType} from '@notifee/react-native';

import DashboardScreen from './src/screens/DashboardScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import LongWeekendScreen from './src/screens/LongWeekendScreen';
import FinancialPlannerScreen from './src/screens/FinancialPlannerScreen';
import LoginScreen from './src/screens/LoginScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import {NotificationService} from './src/services/NotificationService';
import {UserProvider, useUser} from './src/context/UserContext';

const Tab = createBottomTabNavigator();

const COLORS = {
  red: '#C8102E',
  white: '#FFFFFF',
  text: '#1A1A2E',
  textSub: '#9CA3AF',
  bg: '#FFFFFF',
  border: '#E8E0D8',
};

function TabBarEmoji({
  emoji,
  focused,
  color,
}: {
  emoji: string;
  focused: boolean;
  color: string;
}) {
  const {Text, View: V} = require('react-native');
  return (
    <V style={{alignItems: 'center', justifyContent: 'center'}}>
      <Text style={{fontSize: focused ? 24 : 20, opacity: focused ? 1 : 0.6}}>
        {emoji}
      </Text>
      {focused && (
        <V
          style={{
            width: 4,
            height: 4,
            borderRadius: 2,
            backgroundColor: COLORS.red,
            marginTop: 2,
          }}
        />
      )}
    </V>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.red,
        tabBarInactiveTintColor: COLORS.textSub,
        tabBarStyle: {
          backgroundColor: COLORS.bg,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 84 : 64,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          paddingTop: 8,
          elevation: 12,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: -2},
          shadowOpacity: 0.08,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
      }}>
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Beranda',
          tabBarIcon: ({focused, color}) => (
            <TabBarEmoji emoji="🏠" focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          tabBarLabel: 'Kalender',
          tabBarIcon: ({focused, color}) => (
            <TabBarEmoji emoji="📅" focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="LongWeekend"
        component={LongWeekendScreen}
        options={{
          tabBarLabel: 'Long Weekend',
          tabBarIcon: ({focused, color}) => (
            <TabBarEmoji emoji="🏖️" focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="FinancialPlanner"
        component={FinancialPlannerScreen}
        options={{
          tabBarLabel: 'Finansial',
          tabBarIcon: ({focused, color}) => (
            <TabBarEmoji emoji="💰" focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profil',
          tabBarIcon: ({focused, color}) => (
            <TabBarEmoji emoji="👤" focused={focused} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const {authState} = useUser();

  if (authState === 'loading') {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F7F3EF'}}>
        <ActivityIndicator size="large" color={COLORS.red} />
      </View>
    );
  }

  if (authState === 'unauthenticated') {
    return <LoginScreen />;
  }

  if (authState === 'onboarding') {
    return <OnboardingScreen />;
  }

  return (
    <NavigationContainer>
      <MainTabs />
    </NavigationContainer>
  );
}

export default function App() {
  useEffect(() => {
    const unsubscribe = notifee.onForegroundEvent(({type, detail}) => {
      if (type === EventType.PRESS) {
        console.log('Notification pressed:', detail.notification?.id);
      }
    });
    return unsubscribe;
  }, []);

  return (
    <SafeAreaProvider>
      <UserProvider>
        <AppNavigator />
      </UserProvider>
    </SafeAreaProvider>
  );
}
