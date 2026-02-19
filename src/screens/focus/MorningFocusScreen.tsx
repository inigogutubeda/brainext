import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useFocusStore } from "../../stores/focusStore";
import { useProjectsStore } from "../../stores/projectsStore";
import { useGoalsStore } from "../../stores/goalsStore";
import { useAuthStore } from "../../stores/authStore";

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

type Props = { navigation: NativeStackNavigationProp<any> };

export function MorningFocusScreen({ navigation }: Props) {
  const [mainFocus, setMainFocus] = useState("");
  const [secondaryFocus, setSecondaryFocus] = useState("");
  const [intentionNotes, setIntentionNotes] = useState("");
  const { saveFocus, todayFocus } = useFocusStore();
  const { activeProjects } = useProjectsStore();
  const { activeGoals } = useGoalsStore();
  const { user } = useAuthStore();

  const goals = activeGoals();
  const projects = activeProjects();
  const today = getTodayDate();

  useEffect(() => {
    if (todayFocus) {
      setMainFocus(todayFocus.main_focus);
      setSecondaryFocus(todayFocus.secondary_focus);
      setIntentionNotes(todayFocus.intention_notes);
    }
  }, [todayFocus]);

  const handleSave = async () => {
    if (!mainFocus.trim()) return Alert.alert("Error", "Define tu foco principal.");
    if (!user) return;
    const error = await saveFocus(user.id, today, {
      main_focus: mainFocus,
      secondary_focus: secondaryFocus,
      intention_notes: intentionNotes,
    });
    if (error) Alert.alert("Error", error);
    else navigation.goBack();
  };

  return (
    <ScrollView className="flex-1 bg-white px-6 pt-6">
      <Text className="text-2xl font-bold text-gray-900 mb-1">Decide tu día</Text>
      <Text className="text-gray-500 mb-6">¿En qué vas a invertir tu tiempo y energía hoy?</Text>

      {goals.length > 0 && (
        <View className="bg-indigo-50 rounded-2xl p-4 mb-6">
          <Text className="text-sm font-semibold text-indigo-700 mb-2">Tus objetivos activos:</Text>
          {goals.map((g) => (
            <Text key={g.id} className="text-sm text-indigo-800 mb-1">• {g.title}</Text>
          ))}
        </View>
      )}

      <Text className="text-base font-semibold text-gray-700 mb-1">
        Foco principal <Text className="text-red-500">*</Text>
      </Text>
      <Text className="text-xs text-gray-400 mb-2">La única cosa que, si la haces, el día habrá valido la pena.</Text>
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-900"
        placeholder="¿En qué se concentra toda tu energía hoy?"
        value={mainFocus}
        onChangeText={setMainFocus}
      />

      <Text className="text-base font-semibold text-gray-700 mb-1">Foco secundario</Text>
      <Text className="text-xs text-gray-400 mb-2">1-2 cosas importantes pero no urgentes.</Text>
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-900"
        placeholder="¿Qué más puedes avanzar si hay tiempo?"
        value={secondaryFocus}
        onChangeText={setSecondaryFocus}
      />

      <Text className="text-base font-semibold text-gray-700 mb-1">Intención del día</Text>
      <Text className="text-xs text-gray-400 mb-2">¿Por qué es importante este foco hoy específicamente?</Text>
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-900 h-24"
        placeholder="¿Qué sacrificas para hacer esto? ¿Qué queda fuera hoy?"
        multiline
        value={intentionNotes}
        onChangeText={setIntentionNotes}
      />

      {projects.length > 0 && (
        <View className="bg-gray-50 rounded-2xl p-4 mb-6">
          <Text className="text-sm font-semibold text-gray-600 mb-2">Proyectos activos como referencia:</Text>
          {projects.map((p) => (
            <Text key={p.id} className="text-sm text-gray-500 mb-1">
              {p.income_type === "income" ? "💰" : "🧠"} {p.name}
            </Text>
          ))}
        </View>
      )}

      <TouchableOpacity
        className="bg-indigo-600 rounded-lg py-4 items-center mb-8"
        onPress={handleSave}
      >
        <Text className="text-white font-semibold text-base">Confirmar mi foco</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
