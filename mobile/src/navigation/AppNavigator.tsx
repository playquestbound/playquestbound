import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { Colors } from '@/lib/theme';
import type { RootStackParamList, MainTabParamList } from './types';

// Screens
import { AuthScreen } from '@/screens/AuthScreen';
import { LandingScreen } from '@/screens/LandingScreen';
import { HomeScreen } from '@/screens/HomeScreen';
import { QuestsScreen } from '@/screens/QuestsScreen';
import { JournalScreen } from '@/screens/JournalScreen';
import { LeaderboardScreen } from '@/screens/LeaderboardScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';
import { PlayerProfileScreen } from '@/screens/PlayerProfileScreen';
import { RunTrackerScreen } from '@/screens/RunTrackerScreen';
import { StoreScreen } from '@/screens/StoreScreen';
import { DiscoverScreen } from '@/screens/DiscoverScreen';
import { SearchPlayersScreen } from '@/screens/SearchPlayersScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';
import { CharacterCreationScreen } from '@/screens/CharacterCreationScreen';
import { AdminQuestsScreen } from '@/screens/admin/AdminQuestsScreen';
import { AdminSubmissionsScreen } from '@/screens/admin/AdminSubmissionsScreen';
import { AdminModelsScreen } from '@/screens/admin/AdminModelsScreen';
import { LoadingScreen } from '@/components/LoadingScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const navTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.secondary,
    background: Colors.background,
    card: Colors.backgroundCard,
    text: Colors.textPrimary,
    border: Colors.border,
    notification: Colors.secondary,
  },
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.navBackground,
          borderTopColor: Colors.navBorder,
          borderTopWidth: 1,
          height: 85,
          paddingBottom: 25,
          paddingTop: 8,
          position: 'absolute',
          elevation: 20,
          shadowColor: Colors.secondary,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
        },
        tabBarActiveTintColor: Colors.secondary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Discover"
        component={DiscoverScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="compass" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Quests"
        component={QuestsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="shield" size={size + 8} color={Colors.secondary} />
          ),
          tabBarLabel: 'Quests',
        }}
      />
      <Tab.Screen
        name="Store"
        component={StoreScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bag" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
          tabBarLabel: 'You',
        }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const { user, loading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();

  if (loading || (user && profileLoading)) {
    return <LoadingScreen />;
  }

  const needsCharacter = user && profile && !profile.has_created_character;

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
          animation: 'slide_from_right',
        }}
      >
        {!user ? (
          <>
            <Stack.Screen name="Landing" component={LandingScreen} />
            <Stack.Screen name="Auth" component={AuthScreen} />
          </>
        ) : needsCharacter ? (
          <Stack.Screen name="CharacterCreation" component={CharacterCreationScreen} />
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="RunTracker" component={RunTrackerScreen} />
            <Stack.Screen name="Journal" component={JournalScreen} />
            <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
            <Stack.Screen name="SearchPlayers" component={SearchPlayersScreen} />
            <Stack.Screen name="PlayerProfile" component={PlayerProfileScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen
              name="CharacterCreation"
              component={CharacterCreationScreen}
              options={{ presentation: 'modal' }}
            />
            <Stack.Screen name="AdminQuests" component={AdminQuestsScreen} />
            <Stack.Screen name="AdminSubmissions" component={AdminSubmissionsScreen} />
            <Stack.Screen name="AdminModels" component={AdminModelsScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
