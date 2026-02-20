import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Alert } from "react-native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { ProfileType, GoalHorizon } from "../../types";
import { PROFILE_CONFIG } from "../../config/profiles";
import { useAuthStore } from "../../stores/authStore";
import { useGoalsStore } from "../../stores/goalsStore";

type Props = {
  navigation: NativeStackNavigationProp<any>;
  route: { params: { profileType: ProfileType } };
};

const HORIZONS: { value: GoalHorizon; label: string }[] = [
  { value: "short", label: "3–6 meses" },
  { value: "mid", label: "1–2 años" },
  { value: "long", label: "3+ años" },
];

export function GoalSetupScreen({ navigation, route }: Props) {
  const { profileType } = route.params;
  const config = PROFILE_CONFIG[profileType];
  const [goalTitle, setGoalTitle] = useState("");
  const [horizon, setHorizon] = useState<GoalHorizon>("mid");
  const [saving, setSaving] = useState(false);

  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const fetchProfile = useAuthStore((s) => s.fetchProfile);
  const createGoal = useGoalsStore((s) => s.createGoal);

  const handleContinue = async () => {
    if (!goalTitle.trim() || !user) return;
    setSaving(true);
    try {
      const profileError = await updateProfile(user.id, { profile_type: profileType });
      if (profileError) { Alert.alert("Error", profileError); return; }

      await createGoal(user.id, {
        title: goalTitle.trim(),
        description: "",
        priority: 1,
        horizon,
        dimension: "professional",
      });

      await fetchProfile(user.id);
      navigation.navigate("AppIntro");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <ScrollView className="flex-1 px-6 pt-10">
        <Text className="text-3xl font-bold text-stone-900 mb-2">¿Qué quieres construir?</Text>
        <Text className="text-base text-stone-500 mb-8">
          Tu objetivo principal. Lo que guía tus decisiones.
        </Text>

        <Text className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-2">
          Tu objetivo
        </Text>
        <TextInput
          className="bg-white rounded-2xl px-4 py-4 text-stone-900 text-base mb-6 border border-stone-200"
          placeholder={config.onboarding.goalPlaceholder}
          placeholderTextColor="#A8A29E"
          value={goalTitle}
          onChangeText={setGoalTitle}
        />

        <Text className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-3">
          Horizonte temporal
        </Text>
        <View className="flex-row gap-3 mb-8">
          {HORIZONS.map((h) => (
            <TouchableOpacity
              key={h.value}
              onPress={() => setHorizon(h.value)}
              className={`flex-1 py-3 rounded-xl items-center border-2 ${
                horizon === h.value ? "bg-amber-50 border-amber-500" : "bg-white border-stone-200"
              }`}
            >
              <Text className={`text-sm font-semibold ${horizon === h.value ? "text-amber-700" : "text-stone-600"}`}>
                {h.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text className="text-xs text-stone-400 text-center mb-8">
          No te preocupes, puedes cambiarlo cuando quieras.
        </Text>

        <TouchableOpacity
          className={`rounded-2xl py-4 items-center mb-10 ${goalTitle.trim() && !saving ? "bg-amber-600" : "bg-stone-200"}`}
          disabled={!goalTitle.trim() || saving}
          onPress={handleContinue}
        >
          <Text className={`font-semibold text-base ${goalTitle.trim() && !saving ? "text-white" : "text-stone-400"}`}>
            {saving ? "Guardando..." : "Continuar →"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
