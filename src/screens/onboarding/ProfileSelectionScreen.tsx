import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from "react-native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { ProfileType } from "../../types";
import { PROFILE_CONFIG } from "../../config/profiles";

type Props = {
  navigation: NativeStackNavigationProp<any>;
  route: { params?: { selectedProfile?: ProfileType } };
};

const PROFILES: ProfileType[] = ["entrepreneur", "creative", "freelancer", "business_owner"];

export function ProfileSelectionScreen({ navigation }: Props) {
  const [selected, setSelected] = useState<ProfileType | null>(null);

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <ScrollView className="flex-1 px-6 pt-10">
        <Text className="text-3xl font-bold text-stone-900 mb-2">¿Quién eres?</Text>
        <Text className="text-base text-stone-500 mb-8">
          Personalizamos tu experiencia según tu realidad.
        </Text>

        <View className="gap-3">
          {PROFILES.map((type) => {
            const config = PROFILE_CONFIG[type];
            const isSelected = selected === type;
            return (
              <TouchableOpacity
                key={type}
                onPress={() => setSelected(type)}
                className={`rounded-2xl p-5 border-2 ${
                  isSelected
                    ? "bg-amber-50 border-amber-500"
                    : "bg-white border-stone-200"
                }`}
              >
                <Text className={`text-base font-semibold mb-1 ${isSelected ? "text-amber-700" : "text-stone-900"}`}>
                  {config.label}
                </Text>
                <Text className={`text-sm ${isSelected ? "text-amber-600" : "text-stone-500"}`}>
                  {config.description}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          className={`mt-8 rounded-2xl py-4 items-center mb-10 ${selected ? "bg-amber-600" : "bg-stone-200"}`}
          disabled={!selected}
          onPress={() => selected && navigation.navigate("GoalSetup", { profileType: selected })}
        >
          <Text className={`font-semibold text-base ${selected ? "text-white" : "text-stone-400"}`}>
            Continuar →
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
