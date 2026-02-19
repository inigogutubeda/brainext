import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useGoalsStore } from "../../stores/goalsStore";
import { useAuthStore } from "../../stores/authStore";
import type { Goal } from "../../types";

import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
type Props = { navigation: NativeStackNavigationProp<any> };

const horizonOptions: Goal["horizon"][] = ["short", "mid", "long"];
const dimensionOptions: Goal["dimension"][] = ["personal", "professional", "financial"];
const horizonLabel: Record<Goal["horizon"], string> = { short: "Corto plazo", mid: "Medio plazo", long: "Largo plazo" };
const dimensionLabel: Record<Goal["dimension"], string> = { personal: "Personal", professional: "Profesional", financial: "Financiero" };

export function GoalFormScreen({ navigation }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<1 | 2 | 3>(2);
  const [horizon, setHorizon] = useState<Goal["horizon"]>("short");
  const [dimension, setDimension] = useState<Goal["dimension"]>("professional");
  const { createGoal } = useGoalsStore();
  const { user } = useAuthStore();

  const handleSave = async () => {
    if (!title.trim()) return Alert.alert("Error", "El título es obligatorio.");
    if (!user) return;
    const error = await createGoal(user.id, { title, description, priority, horizon, dimension });
    if (error) Alert.alert("Error", error);
    else navigation.goBack();
  };

  return (
    <ScrollView className="flex-1 bg-white px-6 pt-6">
      <Text className="text-lg font-semibold text-gray-700 mb-1">Título</Text>
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-900"
        placeholder="¿Qué quieres conseguir?"
        value={title}
        onChangeText={setTitle}
      />
      <Text className="text-lg font-semibold text-gray-700 mb-1">Descripción</Text>
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-900 h-24"
        placeholder="¿Por qué importa esto?"
        multiline
        value={description}
        onChangeText={setDescription}
      />
      <Text className="text-lg font-semibold text-gray-700 mb-2">Horizonte</Text>
      <View className="flex-row mb-4 gap-2">
        {horizonOptions.map((h) => (
          <TouchableOpacity
            key={h}
            className={`flex-1 py-2 rounded-lg items-center border ${horizon === h ? "bg-indigo-600 border-indigo-600" : "border-gray-300"}`}
            onPress={() => setHorizon(h)}
          >
            <Text className={horizon === h ? "text-white font-semibold" : "text-gray-700"}>
              {horizonLabel[h]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text className="text-lg font-semibold text-gray-700 mb-2">Dimensión</Text>
      <View className="flex-row mb-4 gap-2">
        {dimensionOptions.map((d) => (
          <TouchableOpacity
            key={d}
            className={`flex-1 py-2 rounded-lg items-center border ${dimension === d ? "bg-indigo-600 border-indigo-600" : "border-gray-300"}`}
            onPress={() => setDimension(d)}
          >
            <Text className={dimension === d ? "text-white font-semibold" : "text-gray-700"}>
              {dimensionLabel[d]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text className="text-lg font-semibold text-gray-700 mb-2">Prioridad</Text>
      <View className="flex-row mb-8 gap-2">
        {([1, 2, 3] as const).map((p) => (
          <TouchableOpacity
            key={p}
            className={`flex-1 py-2 rounded-lg items-center border ${priority === p ? "bg-indigo-600 border-indigo-600" : "border-gray-300"}`}
            onPress={() => setPriority(p)}
          >
            <Text className={priority === p ? "text-white font-semibold" : "text-gray-700"}>
              {p === 1 ? "Alta" : p === 2 ? "Media" : "Baja"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        className="bg-indigo-600 rounded-lg py-4 items-center mb-8"
        onPress={handleSave}
      >
        <Text className="text-white font-semibold text-base">Guardar objetivo</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
