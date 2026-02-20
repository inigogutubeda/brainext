import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, SafeAreaView, KeyboardAvoidingView, Platform } from "react-native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../../navigation/index";
import { useAuthStore } from "../../stores/authStore";

type Props = { navigation: NativeStackNavigationProp<AuthStackParamList, "Login"> };

export function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, loading } = useAuthStore();

  const handleSignIn = async () => {
    if (!email.trim() || !password) return;
    const error = await signIn(email.trim().toLowerCase(), password);
    if (error) Alert.alert("Error al iniciar sesión", error);
  };

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <KeyboardAvoidingView
        className="flex-1 px-6 justify-center"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text className="text-3xl font-bold text-stone-900 mb-2">Bienvenido</Text>
        <Text className="text-base text-stone-500 mb-10">
          Inicia sesión para continuar.
        </Text>

        <Text className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Email</Text>
        <TextInput
          className="bg-white rounded-xl px-4 py-4 text-stone-900 mb-4 border border-stone-200"
          placeholder="tu@email.com"
          placeholderTextColor="#A8A29E"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Contraseña</Text>
        <TextInput
          className="bg-white rounded-xl px-4 py-4 text-stone-900 mb-8 border border-stone-200"
          placeholder="••••••••"
          placeholderTextColor="#A8A29E"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          className={`rounded-2xl py-4 items-center mb-4 ${loading ? "bg-stone-300" : "bg-amber-600"}`}
          onPress={handleSignIn}
          disabled={loading}
        >
          <Text className="text-white font-semibold text-base">
            {loading ? "Entrando..." : "Iniciar sesión"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Register")} className="items-center">
          <Text className="text-stone-500 text-sm">
            ¿Sin cuenta? <Text className="text-amber-600 font-semibold">Crear cuenta →</Text>
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
