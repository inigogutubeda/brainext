import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ProjectListScreen } from "./projects/ProjectListScreen";
import { ProjectFormScreen } from "./projects/ProjectFormScreen";

const Stack = createNativeStackNavigator();

export function ProjectsScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProjectList" component={ProjectListScreen} options={{ title: "Proyectos" }} />
      <Stack.Screen name="ProjectForm" component={ProjectFormScreen} options={{ title: "Nuevo Proyecto" }} />
    </Stack.Navigator>
  );
}
