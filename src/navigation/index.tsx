import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useAuthStore } from "../stores/authStore";
import { LoginScreen } from "../screens/auth/LoginScreen";
import { RegisterScreen } from "../screens/auth/RegisterScreen";
import { ProfileSelectionScreen } from "../screens/onboarding/ProfileSelectionScreen";
import { GoalSetupScreen } from "../screens/onboarding/GoalSetupScreen";
import { AppIntroScreen } from "../screens/onboarding/AppIntroScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { GoalsScreen } from "../screens/GoalsScreen";
import { ProjectsScreen } from "../screens/ProjectsScreen";
import { MorningFocusScreen } from "../screens/focus/MorningFocusScreen";
import { EveningJournalScreen } from "../screens/journal/EveningJournalScreen";
import { WeeklyReviewScreen } from "../screens/review/WeeklyReviewScreen";
import { FocusTimerScreen } from "../screens/focus/FocusTimerScreen";

export type AuthStackParamList = { Login: undefined; Register: undefined };

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const OnboardingStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

function OnboardingNavigator() {
  return (
    <OnboardingStack.Navigator screenOptions={{ headerShown: false }}>
      <OnboardingStack.Screen name="ProfileSelection" component={ProfileSelectionScreen} />
      <OnboardingStack.Screen name="GoalSetup" component={GoalSetupScreen as React.ComponentType<any>} />
      <OnboardingStack.Screen name="AppIntro" component={AppIntroScreen} />
    </OnboardingStack.Navigator>
  );
}

function HomeNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="MorningFocus" component={MorningFocusScreen} />
      <HomeStack.Screen name="EveningJournal" component={EveningJournalScreen} />
      <HomeStack.Screen name="WeeklyReview" component={WeeklyReviewScreen} />
      <HomeStack.Screen name="FocusTimer" component={FocusTimerScreen} />
    </HomeStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={() => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#FAF7F2",
          borderTopColor: "#E7E5E0",
        },
        tabBarActiveTintColor: "#D97706",
        tabBarInactiveTintColor: "#A8A29E",
        tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
      })}
    >
      <Tab.Screen name="Hoy" component={HomeNavigator} />
      <Tab.Screen name="Objetivos" component={GoalsScreen} />
      <Tab.Screen name="Proyectos" component={ProjectsScreen} />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const profileLoading = useAuthStore((s) => s.profileLoading);

  if (!user) return <AuthNavigator />;
  if (profileLoading) return null;
  if (!profile || !profile.profile_type) return <OnboardingNavigator />;
  return <MainTabs />;
}

export function AppNavigator() {
  const initialize = useAuthStore((s) => s.initialize);
  const fetchProfile = useAuthStore((s) => s.fetchProfile);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    const unsubscribe = initialize();
    return unsubscribe;
  }, [initialize]);

  useEffect(() => {
    if (user) {
      fetchProfile(user.id);
    }
  }, [user, fetchProfile]);

  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}
