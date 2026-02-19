import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useProjectsStore } from "../../stores/projectsStore";
import { useGoalsStore } from "../../stores/goalsStore";
import { useAuthStore } from "../../stores/authStore";
import type { Project } from "../../types";

type Props = { navigation: any };

export function ProjectFormScreen({ navigation }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [goalId, setGoalId] = useState("");
  const [incomeType, setIncomeType] = useState<Project["income_type"]>("income");
  const { createProject } = useProjectsStore();
  const { goals, fetchGoals, activeGoals } = useGoalsStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user && goals.length === 0) fetchGoals(user.id);
  }, [user]);

  const availableGoals = activeGoals();

  const handleSave = async () => {
    if (!name.trim()) return Alert.alert("Error", "El nombre es obligatorio.");
    if (!goalId) return Alert.alert("Error", "Selecciona un objetivo.");
    if (!user) return;
    const error = await createProject(user.id, { name, description, goal_id: goalId, income_type: incomeType });
    if (error) Alert.alert("Error", error);
    else navigation.goBack();
  };

  return (
    <ScrollView className="flex-1 bg-white px-6 pt-6">
      <Text className="text-lg font-semibold text-gray-700 mb-1">Nombre del proyecto</Text>
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-900"
        placeholder="¿En qué estás trabajando?"
        value={name}
        onChangeText={setName}
      />
      <Text className="text-lg font-semibold text-gray-700 mb-1">Descripción</Text>
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-900 h-24"
        placeholder="¿Qué es y por qué importa?"
        multiline
        value={description}
        onChangeText={setDescription}
      />
      <Text className="text-lg font-semibold text-gray-700 mb-1">Objetivo asociado</Text>
      <View className="border border-gray-300 rounded-lg mb-4 overflow-hidden">
        <Picker selectedValue={goalId} onValueChange={(v) => setGoalId(v)}>
          <Picker.Item label="Selecciona un objetivo" value="" />
          {availableGoals.map((g) => (
            <Picker.Item key={g.id} label={g.title} value={g.id} />
          ))}
        </Picker>
      </View>
      <Text className="text-lg font-semibold text-gray-700 mb-2">¿Genera ingresos?</Text>
      <View className="flex-row mb-8 gap-2">
        {(["income", "non_income"] as const).map((type) => (
          <TouchableOpacity
            key={type}
            className={`flex-1 py-2 rounded-lg items-center border ${incomeType === type ? "bg-indigo-600 border-indigo-600" : "border-gray-300"}`}
            onPress={() => setIncomeType(type)}
          >
            <Text className={incomeType === type ? "text-white font-semibold" : "text-gray-700"}>
              {type === "income" ? "Sí, genera ingresos" : "No genera ingresos"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        className="bg-indigo-600 rounded-lg py-4 items-center mb-8"
        onPress={handleSave}
      >
        <Text className="text-white font-semibold text-base">Guardar proyecto</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
