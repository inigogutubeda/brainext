import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, SafeAreaView } from "react-native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useJournalStore } from "../../stores/journalStore";
import { useFocusStore } from "../../stores/focusStore";
import { useAuthStore } from "../../stores/authStore";
import { PROFILE_CONFIG } from "../../config/profiles";
import type { GuidedAnswers, ProfileType } from "../../types";

function getTodayDate() { return new Date().toISOString().split("T")[0]; }

type Props = { navigation: NativeStackNavigationProp<any> };

export function EveningJournalScreen({ navigation }: Props) {
  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");
  const [q3, setQ3] = useState("");
  const [freeText, setFreeText] = useState("");
  const [alignmentScore, setAlignmentScore] = useState<1 | 2 | 3 | 4 | 5>(3);

  const { saveEntry, todayEntry, fetchTodayEntry } = useJournalStore();
  const { todayFocus } = useFocusStore();
  const { user, profile } = useAuthStore();
  const today = getTodayDate();

  const profileType = (profile?.profile_type ?? "entrepreneur") as ProfileType;
  const config = PROFILE_CONFIG[profileType].evening;

  const SCORE_LABELS = ["", "Muy desalineado", "Poco alineado", "Neutral", "Bastante alineado", "Totalmente alineado"];

  useEffect(() => {
    if (user) fetchTodayEntry(user.id, today);
  }, [user]);

  useEffect(() => {
    if (todayEntry) {
      setQ1(todayEntry.guided_answers.q1 ?? "");
      setQ2(todayEntry.guided_answers.q2 ?? "");
      setQ3(todayEntry.guided_answers.q3 ?? "");
      setFreeText(todayEntry.free_text);
      setAlignmentScore(todayEntry.guided_answers.alignment_score);
    }
  }, [todayEntry]);

  const handleSave = async () => {
    if (!user) return;
    const guided_answers: GuidedAnswers = { q1, q2, q3, alignment_score: alignmentScore };
    const error = await saveEntry(user.id, today, {
      free_text: freeText,
      guided_answers,
      related_project_ids: [],
    });
    if (error) Alert.alert("Error", error);
    else {
      Alert.alert("¡Guardado!", "Tu reflexión del día está guardada.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <ScrollView className="flex-1 px-5 pt-6">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mb-6">
          <Text className="text-stone-400 text-sm">← Volver</Text>
        </TouchableOpacity>

        <Text className="text-2xl font-bold text-stone-900 mb-1">Cierre del día</Text>
        <Text className="text-stone-500 mb-6">Convierte la acción en aprendizaje.</Text>

        {todayFocus && (
          <View className="bg-amber-50 rounded-2xl p-4 mb-5 border border-amber-100">
            <Text className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">
              Tu intención de hoy fue:
            </Text>
            <Text className="text-sm font-medium text-amber-900">{todayFocus.main_focus}</Text>
          </View>
        )}

        {[
          { label: config.q1, value: q1, onChange: setQ1 },
          { label: config.q2, value: q2, onChange: setQ2 },
          { label: config.q3, value: q3, onChange: setQ3 },
        ].map((field, i) => (
          <View key={i} className="mb-5">
            <Text className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
              {field.label}
            </Text>
            <TextInput
              className="bg-white rounded-xl px-4 py-4 text-stone-900 border border-stone-200"
              placeholder="Escribe aquí..."
              placeholderTextColor="#A8A29E"
              multiline
              value={field.value}
              onChangeText={field.onChange}
            />
          </View>
        ))}

        {/* Alignment score */}
        <Text className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">
          {config.alignmentLabel}
        </Text>
        <View className="flex-row justify-between mb-2">
          {([1, 2, 3, 4, 5] as const).map((score) => (
            <TouchableOpacity
              key={score}
              className={`w-12 h-12 rounded-full items-center justify-center border-2 ${
                alignmentScore === score ? "bg-amber-600 border-amber-600" : "bg-white border-stone-200"
              }`}
              onPress={() => setAlignmentScore(score)}
            >
              <Text className={`font-bold ${alignmentScore === score ? "text-white" : "text-stone-600"}`}>
                {score}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text className="text-xs text-stone-400 text-center mb-5">{SCORE_LABELS[alignmentScore]}</Text>

        {/* Free text */}
        <Text className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
          Notas libres (opcional)
        </Text>
        <TextInput
          className="bg-white rounded-xl px-4 py-4 text-stone-900 h-24 mb-8 border border-stone-200"
          placeholder="Cualquier cosa que quieras recordar de hoy."
          placeholderTextColor="#A8A29E"
          multiline
          value={freeText}
          onChangeText={setFreeText}
        />

        <TouchableOpacity
          className="bg-amber-600 rounded-2xl py-4 items-center mb-10"
          onPress={handleSave}
        >
          <Text className="text-white font-semibold text-base">Guardar reflexión</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
