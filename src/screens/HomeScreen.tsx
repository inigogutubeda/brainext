import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useFocusStore } from "../stores/focusStore";
import { useAuthStore } from "../stores/authStore";
import { useGoalsStore } from "../stores/goalsStore";
import { useProjectsStore } from "../stores/projectsStore";

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

type Props = { navigation: NativeStackNavigationProp<any> };

export function HomeScreen({ navigation }: Props) {
  const { todayFocus, fetchTodayFocus } = useFocusStore();
  const { activeGoals, fetchGoals } = useGoalsStore();
  const { activeProjects, fetchProjects } = useProjectsStore();
  const { user } = useAuthStore();
  const today = getTodayDate();

  useEffect(() => {
    if (user) {
      fetchTodayFocus(user.id, today);
      fetchGoals(user.id);
      fetchProjects(user.id);
    }
  }, [user]);

  const goals = activeGoals();
  const projects = activeProjects();

  return (
    <ScrollView className="flex-1 bg-gray-50 px-4 pt-8">
      <Text className="text-2xl font-bold text-gray-900 mb-1">Hoy</Text>
      <Text className="text-gray-400 mb-6">{today}</Text>

      {!todayFocus ? (
        <View className="bg-indigo-50 rounded-2xl p-5 mb-4">
          <Text className="text-base font-semibold text-indigo-800 mb-2">
            ¿En qué vas a invertir tu energía hoy?
          </Text>
          <Text className="text-sm text-indigo-600 mb-4">
            Tómate 2 minutos para decidir antes de empezar.
          </Text>
          <TouchableOpacity
            className="bg-indigo-600 rounded-lg py-3 items-center"
            onPress={() => navigation.navigate("MorningFocus")}
          >
            <Text className="text-white font-semibold">Decidir mi día →</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="bg-white rounded-2xl p-5 mb-4 border border-gray-100">
          <Text className="text-sm font-semibold text-gray-400 mb-1">FOCO PRINCIPAL</Text>
          <Text className="text-base font-bold text-gray-900 mb-3">{todayFocus.main_focus}</Text>
          {todayFocus.secondary_focus ? (
            <>
              <Text className="text-sm font-semibold text-gray-400 mb-1">FOCO SECUNDARIO</Text>
              <Text className="text-sm text-gray-700">{todayFocus.secondary_focus}</Text>
            </>
          ) : null}
          <TouchableOpacity className="mt-3" onPress={() => navigation.navigate("MorningFocus")}>
            <Text className="text-indigo-600 text-sm">Editar foco del día</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        className="bg-white rounded-2xl p-4 mb-3 border border-gray-100 flex-row items-center"
        onPress={() => navigation.navigate("EveningJournal")}
      >
        <Text className="text-xl mr-3">🌙</Text>
        <View>
          <Text className="text-sm font-semibold text-gray-800">Cerrar el día</Text>
          <Text className="text-xs text-gray-400">Reflexiona sobre lo que pasó</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-white rounded-2xl p-4 mb-4 border border-gray-100 flex-row items-center"
        onPress={() => navigation.navigate("WeeklyReview")}
      >
        <Text className="text-xl mr-3">📊</Text>
        <View>
          <Text className="text-sm font-semibold text-gray-800">Revisión semanal</Text>
          <Text className="text-xs text-gray-400">Ajusta tus proyectos y prioridades</Text>
        </View>
      </TouchableOpacity>

      {goals.length > 0 && (
        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-400 mb-2">OBJETIVOS ACTIVOS</Text>
          {goals.map((g) => (
            <View key={g.id} className="bg-white rounded-xl p-3 mb-2 border border-gray-100">
              <Text className="text-sm font-medium text-gray-800">{g.title}</Text>
            </View>
          ))}
        </View>
      )}

      {projects.length > 0 && (
        <View className="mb-8">
          <Text className="text-sm font-semibold text-gray-400 mb-2">PROYECTOS ACTIVOS</Text>
          {projects.map((p) => (
            <View key={p.id} className="bg-white rounded-xl p-3 mb-2 border border-gray-100">
              <Text className="text-sm font-medium text-gray-800">
                {p.income_type === "income" ? "💰 " : "🧠 "}{p.name}
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
