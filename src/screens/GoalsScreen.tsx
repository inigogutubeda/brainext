import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GoalListScreen } from "./goals/GoalListScreen";
import { GoalFormScreen } from "./goals/GoalFormScreen";

const Stack = createNativeStackNavigator();

export function GoalsScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="GoalList" component={GoalListScreen} options={{ title: "Objetivos" }} />
      <Stack.Screen name="GoalForm" component={GoalFormScreen} options={{ title: "Nuevo Objetivo" }} />
    </Stack.Navigator>
  );
}
