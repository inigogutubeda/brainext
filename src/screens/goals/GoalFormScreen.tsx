import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView } from "react-native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useGoalsStore } from "../../stores/goalsStore";
import { useAuthStore } from "../../stores/authStore";
import type { GoalHorizon, GoalDimension } from "../../types";

type Props = { navigation: NativeStackNavigationProp<any> };

const HORIZONS: { value: GoalHorizon; label: string }[] = [
  { value: "short", label: "3–6 meses" },
  { value: "mid", label: "1–2 años" },
  { value: "long", label: "3+ años" },
];

const DIMENSIONS: { value: GoalDimension; label: string }[] = [
  { value: "professional", label: "Profesional" },
  { value: "financial", label: "Financiero" },
  { value: "personal", label: "Personal" },
];

export function GoalFormScreen({ navigation }: Props) {
  const [title, setTitle] = useState("");
  const [horizon, setHorizon] = useState<GoalHorizon>("mid");
  const [dimension, setDimension] = useState<GoalDimension>("professional");
  const [saving, setSaving] = useState(false);

  const createGoal = useGoalsStore((s) => s.createGoal);
  const user = useAuthStore((s) => s.user);

  const handleSave = async () => {
    if (!title.trim() || !user) return;
    setSaving(true);
    try {
      await createGoal(user.id, { title: title.trim(), description: "", priority: 2, horizon, dimension });
      navigation.goBack();
    } finally {
      setSaving(false);
    }
  };

  const SegmentedPicker = <T extends string>({ options, value, onChange }: {
    options: { value: T; label: string }[];
    value: T;
    onChange: (v: T) => void;
  }) => (
    <View className="flex-row gap-2 mb-5">
      {options.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          onPress={() => onChange(opt.value)}
          className={`flex-1 py-3 rounded-xl items-center border-2 ${value === opt.value ? "bg-amber-50 border-amber-500" : "bg-white border-stone-200"}`}
        >
          <Text className={`text-xs font-semibold ${value === opt.value ? "text-amber-700" : "text-stone-600"}`}>
            {opt.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <ScrollView className="flex-1 px-5 pt-6">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mb-6">
          <Text className="text-stone-400 text-sm">← Volver</Text>
        </TouchableOpacity>

        <Text className="text-2xl font-bold text-stone-900 mb-6">Nuevo objetivo</Text>

        <Text className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Título</Text>
        <TextInput
          className="bg-white rounded-xl px-4 py-4 text-stone-900 mb-5 border border-stone-200"
          placeholder="¿Qué quieres construir o lograr?"
          placeholderTextColor="#A8A29E"
          value={title}
          onChangeText={setTitle}
        />

        <Text className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Horizonte</Text>
        <SegmentedPicker options={HORIZONS} value={horizon} onChange={setHorizon} />

        <Text className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Dimensión</Text>
        <SegmentedPicker options={DIMENSIONS} value={dimension} onChange={setDimension} />

        <TouchableOpacity
          className={`rounded-2xl py-4 items-center mb-10 ${title.trim() && !saving ? "bg-amber-600" : "bg-stone-200"}`}
          disabled={!title.trim() || saving}
          onPress={handleSave}
        >
          <Text className={`font-semibold text-base ${title.trim() && !saving ? "text-white" : "text-stone-400"}`}>
            {saving ? "Guardando..." : "Crear objetivo"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
