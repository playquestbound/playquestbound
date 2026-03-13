import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';

// Root Stack
export type RootStackParamList = {
  Auth: undefined;
  Landing: undefined;
  CharacterCreation: { editMode?: boolean } | undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  RunTracker: undefined;
  Journal: undefined;
  Leaderboard: undefined;
  SearchPlayers: undefined;
  PlayerProfile: { playerId: string };
  Settings: undefined;
  AdminQuests: undefined;
  AdminSubmissions: undefined;
  AdminModels: undefined;
};

// Main Bottom Tabs
export type MainTabParamList = {
  Home: undefined;
  Discover: undefined;
  Quests: undefined;
  Store: undefined;
  Profile: undefined;
};

// Screen props
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, T>,
    NativeStackScreenProps<RootStackParamList>
  >;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
