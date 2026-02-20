import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView } from "react-native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useProjectsStore } from "../../stores/projectsStore";
import { useGoalsStore } from "../../stores/goalsStore";
import { useAuthStore } from "../../stores/authStore";
import type { IncomeType } from "../../types";

type Props = { navigation: NativeStackNavigationProp<any> };

export function ProjectFormScreen({ navigation }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [goalId, setGoalId] = useState("");
  const [incomeType, setIncomeType] = useState<IncomeType>("income");
  const [saving, setSaving] = useState(false);

  const createProject = useProjectsStore((s) => s.createProject);
  const { goals, fetchGoals } = useGoalsStore();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (user && goals.length === 0) fetchGoals(user.id);
  }, [user]);

  const handleSave = async () => {
    if (!name.trim() || !goalId || !user) return;
    setSaving(true);
    try {
      await createProject(user.id, { name: name.trim(), description, goal_id: goalId, income_type: incomeType });
      navigation.goBack();
    } finally {
      setSaving(false);
    }
  };

  const activeGoals = goals.filter((g) => g.status === "active");

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <ScrollView className="flex-1 px-5 pt-6">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mb-6">
          <Text className="text-stone-400 text-sm">← Volver</Text>
        </TouchableOpacity>

        <Text className="text-2xl font-bold text-stone-900 mb-6">Nuevo proyecto</Text>

        <Text className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Nombre</Text>
        <TextInput
          className="bg-white rounded-xl px-4 py-4 text-stone-900 mb-5 border border-stone-200"
          placeholder="¿En qué consiste este proyecto?"
          placeholderTextColor="#A8A29E"
          value={name}
          onChangeText={setName}
        />

        <Text className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Descripción (opcional)</Text>
        <TextInput
          className="bg-white rounded-xl px-4 py-4 text-stone-900 mb-5 border border-stone-200"
          placeholder="Contexto adicional..."
          placeholderTextColor="#A8A29E"
          multiline
          value={description}
          onChangeText={setDescription}
        />

        <Text className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Tipo de proyecto</Text>
        <View className="flex-row gap-3 mb-5">
          {[
            { value: "income" as IncomeType, label: "💰 Genera ingresos" },
            { value: "non_income" as IncomeType, label: "🧠 Sin ingresos directos" },
          ].map((opt) => (
            <TouchableOpacity
              key={opt.value}
              onPress={() => setIncomeType(opt.value)}
              className={`flex-1 py-3 rounded-xl items-center border-2 ${incomeType === opt.value ? "bg-amber-50 border-amber-500" : "bg-white border-stone-200"}`}
            >
              <Text className={`text-xs font-semibold ${incomeType === opt.value ? "text-amber-700" : "text-stone-600"}`}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Objetivo asociado</Text>
        {activeGoals.map((g) => (
          <TouchableOpacity
            key={g.id}
            onPress={() => setGoalId(g.id)}
            className={`rounded-xl px-4 py-3 mb-2 border-2 ${goalId === g.id ? "bg-amber-50 border-amber-500" : "bg-white border-stone-200"}`}
          >
            <Text className={`text-sm font-medium ${goalId === g.id ? "text-amber-700" : "text-stone-700"}`}>
              {g.title}
            </Text>
          </TouchableOpacity>
        ))}
        {activeGoals.length === 0 && (
          <Text className="text-stone-400 text-sm mb-5">No hay objetivos activos. Crea uno primero.</Text>
        )}

        <TouchableOpacity
          className={`rounded-2xl py-4 items-center mt-4 mb-10 ${name.trim() && goalId && !saving ? "bg-amber-600" : "bg-stone-200"}`}
          disabled={!name.trim() || !goalId || saving}
          onPress={handleSave}
        >
          <Text className={`font-semibold text-base ${name.trim() && goalId && !saving ? "text-white" : "text-stone-400"}`}>
            {saving ? "Guardando..." : "Crear proyecto"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
