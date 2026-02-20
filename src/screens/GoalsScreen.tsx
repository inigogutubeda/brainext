import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GoalListScreen } from "./goals/GoalListScreen";
import { GoalFormScreen } from "./goals/GoalFormScreen";

const Stack = createNativeStackNavigator();

export function GoalsScreen() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="GoalList" component={GoalListScreen} />
      <Stack.Screen name="GoalForm" component={GoalFormScreen} />
    </Stack.Navigator>
  );
}
