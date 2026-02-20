import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ProjectListScreen } from "./projects/ProjectListScreen";
import { ProjectFormScreen } from "./projects/ProjectFormScreen";

const Stack = createNativeStackNavigator();

export function ProjectsScreen() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProjectList" component={ProjectListScreen} />
      <Stack.Screen name="ProjectForm" component={ProjectFormScreen} />
    </Stack.Navigator>
  );
}
