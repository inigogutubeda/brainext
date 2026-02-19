import React, { useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useGoalsStore } from "../../stores/goalsStore";
import { useAuthStore } from "../../stores/authStore";
import type { Goal } from "../../types";

const statusBadge: Record<Goal["status"], { label: string; bg: string; text: string }> = {
  active:    { label: "Activo",      bg: "bg-green-100",  text: "text-green-700"  },
  paused:    { label: "Pausado",     bg: "bg-yellow-100", text: "text-yellow-700" },
  completed: { label: "Completado",  bg: "bg-gray-100",   text: "text-gray-600"   },
};
const dimensionLabel: Record<Goal["dimension"], string> = {
  personal: "Personal", professional: "Profesional", financial: "Financiero",
};

function GoalCard({ goal }: { goal: Goal }) {
  const badge = statusBadge[goal.status];
  return (
    <View className="bg-white rounded-2xl p-4 mb-3 border border-gray-100">
      <View className="flex-row justify-between items-start mb-1">
        <Text className="text-base font-semibold text-gray-900 flex-1">{goal.title}</Text>
        <View className={`px-2 py-1 rounded-full ml-2 ${badge.bg}`}>
          <Text className={`text-xs font-medium ${badge.text}`}>{badge.label}</Text>
        </View>
      </View>
      <Text className="text-sm text-gray-500">{dimensionLabel[goal.dimension]} · P{goal.priority}</Text>
    </View>
  );
}

import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
type Props = { navigation: NativeStackNavigationProp<any> };

export function GoalListScreen({ navigation }: Props) {
  const { goals, fetchGoals, loading } = useGoalsStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) fetchGoals(user.id);
  }, [user]);

  return (
    <View className="flex-1 bg-gray-50 px-4 pt-6">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-2xl font-bold text-gray-900">Objetivos</Text>
        <TouchableOpacity
          className="bg-indigo-600 rounded-full px-4 py-2"
          onPress={() => navigation.navigate("GoalForm")}
        >
          <Text className="text-white font-semibold">+ Nuevo</Text>
        </TouchableOpacity>
      </View>
      {goals.length === 0 && !loading && (
        <Text className="text-gray-400 text-center mt-16">
          Sin objetivos todavía.{"\n"}Añade tu primer objetivo.
        </Text>
      )}
      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <GoalCard goal={item} />}
      />
    </View>
  );
}
