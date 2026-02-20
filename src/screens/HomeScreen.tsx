import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from "react-native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useFocusStore } from "../stores/focusStore";
import { useAuthStore } from "../stores/authStore";
import { useGoalsStore } from "../stores/goalsStore";
import { useProjectsStore } from "../stores/projectsStore";

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

function getTodayLabel() {
  return new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });
}

function isEvening() {
  return new Date().getHours() >= 18;
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
  const evening = isEvening();

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <ScrollView className="flex-1 px-5 pt-6">
        <Text className="text-2xl font-bold text-stone-900 mb-1 capitalize">{getTodayLabel()}</Text>

        {/* State 1: No focus set */}
        {!todayFocus && (
          <View className="bg-white rounded-3xl p-5 mb-4 border border-stone-100">
            <Text className="text-base font-semibold text-stone-800 mb-1">
              ¿En qué vas a invertir tu energía hoy?
            </Text>
            <Text className="text-sm text-stone-400 mb-4">
              Tómate 2 minutos antes de empezar.
            </Text>
            <TouchableOpacity
              className="bg-amber-600 rounded-xl py-3 items-center"
              onPress={() => navigation.navigate("MorningFocus")}
            >
              <Text className="text-white font-semibold">Decidir mi día →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* State 2/3: Focus set */}
        {todayFocus && (
          <View className="bg-white rounded-3xl p-5 mb-4 border border-stone-100">
            <Text className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
              Foco principal
            </Text>
            <Text className="text-base font-bold text-stone-900 mb-3">
              {todayFocus.main_focus}
            </Text>
            {todayFocus.secondary_focus ? (
              <>
                <Text className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
                  Foco secundario
                </Text>
                <Text className="text-sm text-stone-600 mb-3">{todayFocus.secondary_focus}</Text>
              </>
            ) : null}
            <TouchableOpacity onPress={() => navigation.navigate("MorningFocus")}>
              <Text className="text-amber-600 text-sm font-medium">Editar foco del día</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Evening journal CTA — elevated if evening and focus set */}
        <TouchableOpacity
          className={`rounded-2xl p-4 mb-3 flex-row items-center border ${
            evening && todayFocus ? "bg-stone-800 border-stone-700" : "bg-white border-stone-100"
          }`}
          onPress={() => navigation.navigate("EveningJournal")}
        >
          <Text className="text-2xl mr-3">🌙</Text>
          <View className="flex-1">
            <Text className={`text-sm font-semibold ${evening && todayFocus ? "text-white" : "text-stone-800"}`}>
              Cerrar el día
            </Text>
            <Text className={`text-xs ${evening && todayFocus ? "text-stone-400" : "text-stone-400"}`}>
              Reflexiona sobre lo que pasó
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-white rounded-2xl p-4 mb-5 flex-row items-center border border-stone-100"
          onPress={() => navigation.navigate("WeeklyReview")}
        >
          <Text className="text-2xl mr-3">📊</Text>
          <View className="flex-1">
            <Text className="text-sm font-semibold text-stone-800">Revisión semanal</Text>
            <Text className="text-xs text-stone-400">Ajusta tus proyectos y prioridades</Text>
          </View>
        </TouchableOpacity>

        {/* Focus mode CTA — only when focus is set */}
        {todayFocus && (
          <TouchableOpacity
            className="bg-amber-50 rounded-2xl p-4 mb-5 flex-row items-center border border-amber-200"
            onPress={() => navigation.navigate("FocusTimer")}
          >
            <Text className="text-2xl mr-3">⏱️</Text>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-amber-800">Modo Foco</Text>
              <Text className="text-xs text-amber-600">Bloquea distracciones y trabaja sin interrupciones</Text>
            </View>
          </TouchableOpacity>
        )}

        {goals.length > 0 && (
          <View className="mb-4">
            <Text className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
              Objetivos activos
            </Text>
            {goals.map((g) => (
              <View key={g.id} className="bg-white rounded-xl p-3 mb-2 border border-stone-100">
                <Text className="text-sm font-medium text-stone-800">{g.title}</Text>
              </View>
            ))}
          </View>
        )}

        {projects.length > 0 && (
          <View className="mb-10">
            <Text className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
              Proyectos activos
            </Text>
            {projects.map((p) => (
              <View key={p.id} className="bg-white rounded-xl p-3 mb-2 border border-stone-100">
                <Text className="text-sm font-medium text-stone-800">
                  {p.income_type === "income" ? "💰 " : "🧠 "}{p.name}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
