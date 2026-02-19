import React, { useEffect } from "react";
import { TouchableOpacity, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useAuthStore } from "../stores/authStore";
import { LoginScreen } from "../screens/auth/LoginScreen";
import { RegisterScreen } from "../screens/auth/RegisterScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { GoalsScreen } from "../screens/GoalsScreen";
import { ProjectsScreen } from "../screens/ProjectsScreen";
import { MorningFocusScreen } from "../screens/focus/MorningFocusScreen";
import { EveningJournalScreen } from "../screens/journal/EveningJournalScreen";
import { WeeklyReviewScreen } from "../screens/review/WeeklyReviewScreen";

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
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

function HomeNavigator() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Home" component={HomeScreen} options={{ title: "Hoy" }} />
      <HomeStack.Screen name="MorningFocus" component={MorningFocusScreen} options={{ title: "Decide tu día" }} />
      <HomeStack.Screen name="EveningJournal" component={EveningJournalScreen} options={{ title: "Cierre del día" }} />
      <HomeStack.Screen name="WeeklyReview" component={WeeklyReviewScreen} options={{ title: "Revisión Semanal" }} />
    </HomeStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={() => ({
        headerShown: true,
        tabBarActiveTintColor: "#4f46e5",
        headerRight: () => (
          <TouchableOpacity
            style={{ marginRight: 16 }}
            onPress={() => useAuthStore.getState().signOut()}
          >
            <Text style={{ color: "#4f46e5" }}>Salir</Text>
          </TouchableOpacity>
        ),
      })}
    >
      <Tab.Screen name="Hoy" component={HomeNavigator} />
      <Tab.Screen name="Objetivos" component={GoalsScreen} />
      <Tab.Screen name="Proyectos" component={ProjectsScreen} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const user = useAuthStore((s) => s.user);
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    const unsubscribe = initialize();
    return unsubscribe;
  }, [initialize]);

  return (
    <NavigationContainer>
      {user ? <MainTabs /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
