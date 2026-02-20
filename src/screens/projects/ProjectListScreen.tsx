import React, { useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, SafeAreaView } from "react-native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useProjectsStore } from "../../stores/projectsStore";
import { useGoalsStore } from "../../stores/goalsStore";
import { useAuthStore } from "../../stores/authStore";
import type { Project } from "../../types";

type Props = { navigation: NativeStackNavigationProp<any> };

const STATUS_BADGE = {
  active: "bg-amber-100 text-amber-700",
  paused: "bg-stone-100 text-stone-500",
  closed: "bg-red-50 text-red-400",
};

function ProjectCard({ project, goalTitle }: { project: Project; goalTitle: string }) {
  return (
    <View className="bg-white rounded-2xl p-4 mb-3 border border-stone-100">
      <View className="flex-row items-start justify-between mb-1">
        <Text className="text-base font-semibold text-stone-900 flex-1 mr-2">{project.name}</Text>
        <View className={`px-2 py-1 rounded-full ${STATUS_BADGE[project.status].split(" ")[0]}`}>
          <Text className={`text-xs font-semibold ${STATUS_BADGE[project.status].split(" ")[1]}`}>
            {project.status === "active" ? "Activo" : project.status === "paused" ? "Pausado" : "Cerrado"}
          </Text>
        </View>
      </View>
      <Text className="text-xs text-stone-400">
        {project.income_type === "income" ? "💰" : "🧠"} {goalTitle}
      </Text>
    </View>
  );
}

export function ProjectListScreen({ navigation }: Props) {
  const { projects, fetchProjects, loading } = useProjectsStore();
  const { goals, fetchGoals } = useGoalsStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) { fetchProjects(user.id); fetchGoals(user.id); }
  }, [user]);

  const getGoalTitle = (goalId: string) => goals.find((g) => g.id === goalId)?.title ?? "Sin objetivo";

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="flex-1 px-5">
        <View className="flex-row items-center justify-between py-5">
          <Text className="text-xl font-bold text-stone-900">Proyectos</Text>
          <TouchableOpacity
            className="bg-amber-600 rounded-xl px-4 py-2"
            onPress={() => navigation.navigate("ProjectForm")}
          >
            <Text className="text-white font-semibold text-sm">+ Nuevo</Text>
          </TouchableOpacity>
        </View>

        {loading && <Text className="text-stone-400 text-center py-8">Cargando...</Text>}

        {!loading && projects.length === 0 && (
          <View className="flex-1 items-center justify-center">
            <Text className="text-stone-400 text-center mb-2">Sin proyectos todavía.</Text>
            <Text className="text-stone-400 text-center text-sm">Crea un proyecto asociado a un objetivo.</Text>
          </View>
        )}

        <FlatList
          data={projects}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ProjectCard project={item} goalTitle={getGoalTitle(item.goal_id)} />}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}
