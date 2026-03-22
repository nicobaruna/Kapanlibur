import React, {useEffect} from 'react';
import {Platform} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import notifee, {EventType} from '@notifee/react-native';

import DashboardScreen from './src/screens/DashboardScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import LongWeekendScreen from './src/screens/LongWeekendScreen';
import FinancialPlannerScreen from './src/screens/FinancialPlannerScreen';
import {NotificationService} from './src/services/NotificationService';

const Tab = createBottomTabNavigator();

const COLORS = {
  red: '#C8102E',
  white: '#FFFFFF',
  text: '#1A1A2E',
  textSub: '#9CA3AF',
  bg: '#FFFFFF',
  border: '#E8E0D8',
};

// Tab icon component (simple text emoji since no icon library required)
function TabIcon({emoji, focused}: {emoji: string; focused: boolean}) {
  return (
    <React.Fragment>
      {/* Using emoji as icon, size adjusted by focused state */}
    </React.Fragment>
  );
}

export default function App() {
  useEffect(() => {
    // Handle foreground notification events
    const unsubscribe = notifee.onForegroundEvent(({type, detail}) => {
      if (type === EventType.PRESS) {
        console.log('Notification pressed:', detail.notification?.id);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
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
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

// Simple emoji tab bar icon
function TabBarEmoji({
  emoji,
  focused,
  color,
}: {
  emoji: string;
  focused: boolean;
  color: string;
}) {
  const {Text, View, StyleSheet} = require('react-native');
  return (
    <View style={{alignItems: 'center', justifyContent: 'center'}}>
      <Text style={{fontSize: focused ? 24 : 20, opacity: focused ? 1 : 0.6}}>
        {emoji}
      </Text>
      {focused && (
        <View
          style={{
            width: 4,
            height: 4,
            borderRadius: 2,
            backgroundColor: COLORS.red,
            marginTop: 2,
          }}
        />
      )}
    </View>
  );
}
