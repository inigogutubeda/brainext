import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useJournalStore } from "../../stores/journalStore";
import { useFocusStore } from "../../stores/focusStore";
import { useAuthStore } from "../../stores/authStore";
import type { GuidedAnswers } from "../../types";

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

type Props = { navigation: NativeStackNavigationProp<any> };

const ALIGNMENT_LABELS = ["", "Muy desalineado", "Poco alineado", "Neutral", "Bastante alineado", "Totalmente alineado"];

export function EveningJournalScreen({ navigation }: Props) {
  const [freeText, setFreeText] = useState("");
  const [whatHappened, setWhatHappened] = useState("");
  const [whatAvoided, setWhatAvoided] = useState("");
  const [why, setWhy] = useState("");
  const [alignmentScore, setAlignmentScore] = useState<1 | 2 | 3 | 4 | 5>(3);

  const { saveEntry, todayEntry, fetchTodayEntry } = useJournalStore();
  const { todayFocus } = useFocusStore();
  const { user } = useAuthStore();
  const today = getTodayDate();

  useEffect(() => {
    if (user) fetchTodayEntry(user.id, today);
  }, [user]);

  useEffect(() => {
    if (todayEntry) {
      setFreeText(todayEntry.free_text);
      setWhatHappened(todayEntry.guided_answers.what_happened);
      setWhatAvoided(todayEntry.guided_answers.what_i_avoided);
      setWhy(todayEntry.guided_answers.why);
      setAlignmentScore(todayEntry.guided_answers.alignment_score);
    }
  }, [todayEntry]);

  const handleSave = async () => {
    if (!user) return;
    const guided_answers: GuidedAnswers = {
      what_happened: whatHappened,
      what_i_avoided: whatAvoided,
      why,
      alignment_score: alignmentScore,
    };
    const error = await saveEntry(user.id, today, {
      free_text: freeText,
      guided_answers,
      related_project_ids: [],
    });
    if (error) Alert.alert("Error", error);
    else {
      Alert.alert("¡Guardado!", "Tu reflexión del día está guardada.");
      navigation.goBack();
    }
  };

  return (
    <ScrollView className="flex-1 bg-white px-6 pt-6">
      <Text className="text-2xl font-bold text-gray-900 mb-1">Cierre del día</Text>
      <Text className="text-gray-500 mb-6">Convierte la acción en aprendizaje.</Text>

      {todayFocus && (
        <View className="bg-indigo-50 rounded-2xl p-4 mb-6">
          <Text className="text-xs font-semibold text-indigo-600 mb-1">Tu intención de hoy fue:</Text>
          <Text className="text-sm font-medium text-indigo-900">{todayFocus.main_focus}</Text>
        </View>
      )}

      <Text className="text-base font-semibold text-gray-700 mb-1">¿Qué pasó hoy?</Text>
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-900 h-24"
        placeholder="Sin juicio. ¿Qué hiciste realmente?"
        multiline
        value={whatHappened}
        onChangeText={setWhatHappened}
      />

      <Text className="text-base font-semibold text-gray-700 mb-1">¿Qué evitaste o pospusiste?</Text>
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-900"
        placeholder="Sé honesto contigo mismo."
        value={whatAvoided}
        onChangeText={setWhatAvoided}
      />

      <Text className="text-base font-semibold text-gray-700 mb-1">¿Por qué?</Text>
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-900"
        placeholder="¿Miedo? ¿Incertidumbre? ¿Energía?"
        value={why}
        onChangeText={setWhy}
      />

      <Text className="text-base font-semibold text-gray-700 mb-2">
        ¿Cómo de alineado te sientes con tus objetivos hoy?
      </Text>
      <View className="flex-row justify-between mb-4">
        {([1, 2, 3, 4, 5] as const).map((score) => (
          <TouchableOpacity
            key={score}
            className={`w-12 h-12 rounded-full items-center justify-center border-2 ${
              alignmentScore === score
                ? "bg-indigo-600 border-indigo-600"
                : "border-gray-300"
            }`}
            onPress={() => setAlignmentScore(score)}
          >
            <Text className={alignmentScore === score ? "text-white font-bold" : "text-gray-600"}>
              {score}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text className="text-xs text-gray-400 mb-4 text-center">{ALIGNMENT_LABELS[alignmentScore]}</Text>

      <Text className="text-base font-semibold text-gray-700 mb-1">Notas libres (opcional)</Text>
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-8 text-gray-900 h-24"
        placeholder="Cualquier cosa que quieras recordar de hoy."
        multiline
        value={freeText}
        onChangeText={setFreeText}
      />

      <TouchableOpacity
        className="bg-indigo-600 rounded-lg py-4 items-center mb-8"
        onPress={handleSave}
      >
        <Text className="text-white font-semibold text-base">Guardar reflexión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
