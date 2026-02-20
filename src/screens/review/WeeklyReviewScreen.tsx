import React, { useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, SafeAreaView } from "react-native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useProjectsStore } from "../../stores/projectsStore";
import { useGoalsStore } from "../../stores/goalsStore";
import { useAuthStore } from "../../stores/authStore";
import { PROFILE_CONFIG } from "../../config/profiles";
import type { Project, ProfileType } from "../../types";

type Props = { navigation: NativeStackNavigationProp<any> };

const STATUS_OPTIONS: { label: string; value: Project["status"] }[] = [
  { label: "Continuar", value: "active" },
  { label: "Pausar", value: "paused" },
  { label: "Cerrar", value: "closed" },
];

function ProjectCard({ project, onDecision }: { project: Project; onDecision: (id: string, s: Project["status"]) => void }) {
  return (
    <View className="bg-white rounded-2xl p-4 mb-3 border border-stone-100">
      <Text className="text-sm font-semibold text-stone-900 mb-1">{project.name}</Text>
      <Text className="text-xs text-stone-400 mb-3">
        {project.income_type === "income" ? "💰 Genera ingresos" : "🧠 Sin ingresos directos"}
      </Text>
      <View className="flex-row gap-2">
        {STATUS_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.value}
            className={`flex-1 py-2 rounded-xl items-center border ${
              project.status === opt.value ? "bg-amber-600 border-amber-600" : "bg-cream border-stone-200"
            }`}
            onPress={() => onDecision(project.id, opt.value)}
          >
            <Text className={`text-xs font-semibold ${project.status === opt.value ? "text-white" : "text-stone-600"}`}>
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
  const { user, profile } = useAuthStore();

  const profileType = (profile?.profile_type ?? "entrepreneur") as ProfileType;
  const config = PROFILE_CONFIG[profileType].weekly;

  useEffect(() => {
    if (user) { fetchProjects(user.id); fetchGoals(user.id); }
  }, [user]);

  const activeProjects = projects.filter((p) => p.status !== "closed");
  const activeGoals = goals.filter((g) => g.status === "active");

  const handleDecision = async (id: string, status: Project["status"]) => {
    const error = await updateProject(id, { status });
    if (error) Alert.alert("Error", error);
  };

  const handleFinish = () => {
    Alert.alert("Revisión completada", "Que tengas una semana alineada.", [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <ScrollView className="flex-1 px-5 pt-6">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mb-6">
          <Text className="text-stone-400 text-sm">← Volver</Text>
        </TouchableOpacity>

        <Text className="text-2xl font-bold text-stone-900 mb-1">Revisión semanal</Text>
        <Text className="text-stone-500 mb-2">Evalúa la coherencia de tu semana.</Text>

        {/* Profile opening question */}
        <View className="bg-amber-50 rounded-2xl px-4 py-3 mb-6 border border-amber-100">
          <Text className="text-sm text-amber-800 italic">{config.opening}</Text>
        </View>

        {activeGoals.length > 0 && (
          <View className="mb-5">
            <Text className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
              Objetivos activos
            </Text>
            {activeGoals.map((g) => (
              <View key={g.id} className="bg-white rounded-xl p-3 mb-2 border border-stone-100">
                <Text className="text-sm font-medium text-stone-800">{g.title}</Text>
                <Text className="text-xs text-stone-400">{g.horizon} · {g.dimension}</Text>
              </View>
            ))}
          </View>
        )}

        <Text className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">
          Proyectos — decide qué hacer
        </Text>
        {activeProjects.length === 0 && (
          <Text className="text-stone-400 text-center py-8">Sin proyectos activos para revisar.</Text>
        )}
        {activeProjects.map((p) => (
          <ProjectCard key={p.id} project={p} onDecision={handleDecision} />
        ))}

        {/* Strategic question */}
        <View className="bg-stone-100 rounded-2xl px-4 py-4 mb-6 mt-2">
          <Text className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
            Pregunta estratégica
          </Text>
          <Text className="text-sm text-stone-700">{config.strategicQuestion}</Text>
        </View>

        <TouchableOpacity
          className="bg-amber-600 rounded-2xl py-4 items-center mb-10"
          onPress={handleFinish}
        >
          <Text className="text-white font-semibold text-base">Terminar revisión</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
