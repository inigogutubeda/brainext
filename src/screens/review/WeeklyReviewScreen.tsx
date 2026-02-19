import React, { useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useProjectsStore } from "../../stores/projectsStore";
import { useGoalsStore } from "../../stores/goalsStore";
import { useAuthStore } from "../../stores/authStore";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { Project } from "../../types";

type Props = { navigation: NativeStackNavigationProp<any> };

const projectStatusOptions: { label: string; value: Project["status"]; description: string }[] = [
  { label: "Continuar", value: "active", description: "Sigue siendo prioritario" },
  { label: "Pausar", value: "paused", description: "No es el momento" },
  { label: "Cerrar", value: "closed", description: "Ya no tiene sentido" },
];

function ProjectReviewCard({ project, onDecision }: {
  project: Project;
  onDecision: (id: string, status: Project["status"]) => void;
}) {
  return (
    <View className="bg-white rounded-2xl p-4 mb-4 border border-gray-100">
      <Text className="text-base font-semibold text-gray-900 mb-1">{project.name}</Text>
      <Text className="text-xs text-gray-400 mb-3">
        {project.income_type === "income" ? "💰 Genera ingresos" : "🧠 Sin ingresos directos"}
      </Text>
      <View className="flex-row gap-2">
        {projectStatusOptions.map((opt) => (
          <TouchableOpacity
            key={opt.value}
            className={`flex-1 py-2 rounded-lg items-center border ${
              project.status === opt.value
                ? "bg-indigo-600 border-indigo-600"
                : "border-gray-200"
            }`}
            onPress={() => onDecision(project.id, opt.value)}
          >
            <Text
              className={`text-xs font-semibold ${project.status === opt.value ? "text-white" : "text-gray-600"}`}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

export function WeeklyReviewScreen({ navigation }: Props) {
  const { projects, fetchProjects, updateProject } = useProjectsStore();
  const { goals, fetchGoals } = useGoalsStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      fetchProjects(user.id);
      fetchGoals(user.id);
    }
  }, [user]);

  const activeProjects = projects.filter((p) => p.status !== "closed");
  const activeGoals = goals.filter((g) => g.status === "active");

  const handleProjectDecision = async (id: string, status: Project["status"]) => {
    const error = await updateProject(id, { status });
    if (error) Alert.alert("Error", error);
  };

  const handleFinish = () => {
    Alert.alert("Revisión completada", "Que tengas una semana alineada.");
    navigation.goBack();
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 px-4 pt-6">
      <Text className="text-2xl font-bold text-gray-900 mb-1">Revisión semanal</Text>
      <Text className="text-gray-500 mb-6">Evalúa la coherencia de tu semana y decide qué continúa.</Text>

      {activeGoals.length > 0 && (
        <View className="mb-6">
          <Text className="text-sm font-semibold text-gray-400 mb-2">OBJETIVOS ACTIVOS</Text>
          {activeGoals.map((g) => (
            <View key={g.id} className="bg-white rounded-xl p-3 mb-2 border border-gray-100">
              <Text className="text-sm font-medium text-gray-800">{g.title}</Text>
              <Text className="text-xs text-gray-400">{g.horizon} · {g.dimension}</Text>
            </View>
          ))}
        </View>
      )}

      <Text className="text-sm font-semibold text-gray-400 mb-2">PROYECTOS — DECIDE QUÉ HACER</Text>
      {activeProjects.length === 0 && (
        <Text className="text-gray-400 text-center py-8">Sin proyectos activos para revisar.</Text>
      )}
      {activeProjects.map((p) => (
        <ProjectReviewCard key={p.id} project={p} onDecision={handleProjectDecision} />
      ))}

      <TouchableOpacity
        className="bg-indigo-600 rounded-lg py-4 items-center mt-4 mb-8"
        onPress={handleFinish}
      >
        <Text className="text-white font-semibold text-base">Terminar revisión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
