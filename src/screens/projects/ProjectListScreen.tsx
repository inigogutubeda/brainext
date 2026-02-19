import React, { useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useProjectsStore } from "../../stores/projectsStore";
import { useGoalsStore } from "../../stores/goalsStore";
import { useAuthStore } from "../../stores/authStore";
import type { Project } from "../../types";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

function ProjectCard({ project, goalTitle }: { project: Project; goalTitle: string }) {
  const incomeLabel = project.income_type === "income" ? "💰 Ingresos" : "🧠 Sin ingresos";
  return (
    <View className="bg-white rounded-2xl p-4 mb-3 border border-gray-100">
      <Text className="text-base font-semibold text-gray-900">{project.name}</Text>
      <Text className="text-sm text-gray-500 mt-1">{goalTitle}</Text>
      <Text className="text-xs text-gray-400 mt-1">{incomeLabel}</Text>
    </View>
  );
}

type Props = { navigation: NativeStackNavigationProp<any> };

export function ProjectListScreen({ navigation }: Props) {
  const { projects, fetchProjects } = useProjectsStore();
  const { goals, fetchGoals } = useGoalsStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      fetchProjects(user.id);
      fetchGoals(user.id);
    }
  }, [user]);

  const getGoalTitle = (goalId: string) =>
    goals.find((g) => g.id === goalId)?.title ?? "Sin objetivo";

  return (
    <View className="flex-1 bg-gray-50 px-4 pt-6">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-2xl font-bold text-gray-900">Proyectos</Text>
        <TouchableOpacity
          className="bg-indigo-600 rounded-full px-4 py-2"
          onPress={() => navigation.navigate("ProjectForm")}
        >
          <Text className="text-white font-semibold">+ Nuevo</Text>
        </TouchableOpacity>
      </View>
      {projects.length === 0 && (
        <Text className="text-gray-400 text-center mt-16">
          Sin proyectos todavía.{"\n"}Primero crea un objetivo.
        </Text>
      )}
      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProjectCard project={item} goalTitle={getGoalTitle(item.goal_id)} />
        )}
      />
    </View>
  );
}
