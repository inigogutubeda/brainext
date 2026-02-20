import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, SafeAreaView } from "react-native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useFocusStore } from "../../stores/focusStore";
import { useGoalsStore } from "../../stores/goalsStore";
import { useAuthStore } from "../../stores/authStore";
import { PROFILE_CONFIG } from "../../config/profiles";
import type { ProfileType } from "../../types";

function getTodayDate() { return new Date().toISOString().split("T")[0]; }

type Props = { navigation: NativeStackNavigationProp<any> };

export function MorningFocusScreen({ navigation }: Props) {
  const [mainFocus, setMainFocus] = useState("");
  const [secondaryFocus, setSecondaryFocus] = useState("");
  const [intentionNotes, setIntentionNotes] = useState("");
  const [showGoals, setShowGoals] = useState(false);

  const { saveFocus, todayFocus } = useFocusStore();
  const { activeGoals } = useGoalsStore();
  const { user, profile } = useAuthStore();
  const today = getTodayDate();

  const profileType = (profile?.profile_type ?? "entrepreneur") as ProfileType;
  const config = PROFILE_CONFIG[profileType].morning;
  const goals = activeGoals();

  useEffect(() => {
    if (todayFocus) {
      setMainFocus(todayFocus.main_focus);
      setSecondaryFocus(todayFocus.secondary_focus);
      setIntentionNotes(todayFocus.intention_notes);
    }
  }, [todayFocus]);

  const handleSave = async () => {
    if (!mainFocus.trim()) return Alert.alert("Necesitas un foco", "Define tu foco principal para empezar el día.");
    if (!user) return;
    const error = await saveFocus(user.id, today, {
      main_focus: mainFocus.trim(),
      secondary_focus: secondaryFocus.trim(),
      intention_notes: intentionNotes.trim(),
    });
    if (error) Alert.alert("Error", error);
    else navigation.goBack();
  };

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <ScrollView className="flex-1 px-5 pt-6">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mb-6">
          <Text className="text-stone-400 text-sm">← Volver</Text>
        </TouchableOpacity>

        <Text className="text-2xl font-bold text-stone-900 mb-1">Decide tu día</Text>
        <Text className="text-stone-500 mb-6">¿En qué vas a invertir tu tiempo y energía hoy?</Text>

        {/* Goals context panel */}
        {goals.length > 0 && (
          <TouchableOpacity
            className="bg-amber-50 rounded-2xl p-4 mb-5 border border-amber-200"
            onPress={() => setShowGoals(!showGoals)}
          >
            <Text className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1">
              Tus objetivos activos {showGoals ? "▲" : "▼"}
            </Text>
            {showGoals && goals.map((g) => (
              <Text key={g.id} className="text-sm text-amber-800 mt-1">• {g.title}</Text>
            ))}
          </TouchableOpacity>
        )}

        {/* Opportunity cost nudge */}
        <View className="bg-stone-100 rounded-xl px-4 py-3 mb-5">
          <Text className="text-xs text-stone-500 italic">{config.opportunityCostNudge}</Text>
        </View>

        {/* Main focus */}
        <Text className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
          {config.mainFocusPrompt} <Text className="text-red-400">*</Text>
        </Text>
        <TextInput
          className="bg-white rounded-xl px-4 py-4 text-stone-900 mb-5 border border-stone-200"
          placeholder={config.mainFocusPlaceholder}
          placeholderTextColor="#A8A29E"
          value={mainFocus}
          onChangeText={setMainFocus}
        />

        {/* Secondary focus */}
        <Text className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
          Foco secundario (opcional)
        </Text>
        <TextInput
          className="bg-white rounded-xl px-4 py-4 text-stone-900 mb-5 border border-stone-200"
          placeholder="1-2 cosas importantes pero no urgentes..."
          placeholderTextColor="#A8A29E"
          value={secondaryFocus}
          onChangeText={setSecondaryFocus}
        />

        {/* Intention */}
        <Text className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
          {config.intentionPrompt}
        </Text>
        <TextInput
          className="bg-white rounded-xl px-4 py-4 text-stone-900 h-24 mb-8 border border-stone-200"
          placeholder="¿Qué sacrificas para que esto pase hoy?"
          placeholderTextColor="#A8A29E"
          multiline
          value={intentionNotes}
          onChangeText={setIntentionNotes}
        />

        <TouchableOpacity
          className="bg-amber-600 rounded-2xl py-4 items-center mb-10"
          onPress={handleSave}
        >
          <Text className="text-white font-semibold text-base">Confirmar mi foco</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
