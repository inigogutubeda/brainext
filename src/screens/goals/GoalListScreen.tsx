import React, { useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, SafeAreaView } from "react-native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useGoalsStore } from "../../stores/goalsStore";
import { useAuthStore } from "../../stores/authStore";
import type { Goal } from "../../types";

type Props = { navigation: NativeStackNavigationProp<any> };

const HORIZON_LABEL = { short: "3–6 meses", mid: "1–2 años", long: "3+ años" };
const STATUS_COLOR = { active: "bg-amber-100 text-amber-700", paused: "bg-stone-100 text-stone-500", completed: "bg-green-100 text-green-700" };

function GoalCard({ goal }: { goal: Goal }) {
  return (
    <View className="bg-white rounded-2xl p-4 mb-3 border border-stone-100">
      <View className="flex-row items-start justify-between mb-2">
        <Text className="text-base font-semibold text-stone-900 flex-1 mr-2">{goal.title}</Text>
        <View className={`px-2 py-1 rounded-full ${STATUS_COLOR[goal.status].split(" ")[0]}`}>
          <Text className={`text-xs font-semibold ${STATUS_COLOR[goal.status].split(" ")[1]}`}>
            {goal.status === "active" ? "Activo" : goal.status === "paused" ? "Pausado" : "Completado"}
          </Text>
        </View>
      </View>
      <Text className="text-xs text-stone-400">
        {HORIZON_LABEL[goal.horizon]} · {goal.dimension} · P{goal.priority}
      </Text>
    </View>
  );
}

export function GoalListScreen({ navigation }: Props) {
  const { goals, fetchGoals, loading } = useGoalsStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) fetchGoals(user.id);
  }, [user]);

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="flex-1 px-5">
        <View className="flex-row items-center justify-between py-5">
          <Text className="text-xl font-bold text-stone-900">Objetivos</Text>
          <TouchableOpacity
            className="bg-amber-600 rounded-xl px-4 py-2"
            onPress={() => navigation.navigate("GoalForm")}
          >
            <Text className="text-white font-semibold text-sm">+ Nuevo</Text>
          </TouchableOpacity>
        </View>

        {loading && <Text className="text-stone-400 text-center py-8">Cargando...</Text>}

        {!loading && goals.length === 0 && (
          <View className="flex-1 items-center justify-center">
            <Text className="text-stone-400 text-center mb-2">Sin objetivos todavía.</Text>
            <Text className="text-stone-400 text-center text-sm">Crea tu primer objetivo para empezar.</Text>
          </View>
        )}

        <FlatList
          data={goals}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <GoalCard goal={item} />}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}
