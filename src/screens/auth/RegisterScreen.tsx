import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useAuthStore } from "../../stores/authStore";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../../navigation";

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList>;
};

export function RegisterScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signUp, loading } = useAuthStore();

  const handleRegister = async () => {
    const error = await signUp(email, password);
    if (error) {
      Alert.alert("Error", error);
    } else {
      Alert.alert("¡Listo!", "Revisa tu email para confirmar tu cuenta.");
      navigation.navigate("Login");
    }
  };

  return (
    <View className="flex-1 justify-center px-6 bg-white">
      <Text className="text-3xl font-bold mb-8 text-gray-900">Crear cuenta</Text>
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-900"
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-6 text-gray-900"
        placeholder="Contraseña (mín. 6 caracteres)"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        className="bg-indigo-600 rounded-lg py-4 items-center"
        onPress={handleRegister}
        disabled={loading}
      >
        <Text className="text-white font-semibold text-base">
          {loading ? "Creando..." : "Crear cuenta"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="mt-4 items-center"
        onPress={() => navigation.goBack()}
      >
        <Text className="text-indigo-600">Ya tengo cuenta</Text>
      </TouchableOpacity>
    </View>
  );
}
