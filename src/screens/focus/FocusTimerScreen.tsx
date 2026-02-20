import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Alert, Modal, SafeAreaView, AppState, AppStateStatus } from "react-native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useFocusStore } from "../../stores/focusStore";

type Props = { navigation: NativeStackNavigationProp<any> };

const DURATIONS = [
  { label: "25 min", value: 25 },
  { label: "60 min", value: 60 },
  { label: "90 min", value: 90 },
];

type BreakReason = "distracted" | "necessary" | "lost";

export function FocusTimerScreen({ navigation }: Props) {
  const { todayFocus } = useFocusStore();
  const [selectedDuration, setSelectedDuration] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [breaks, setBreaks] = useState<{ leftAt: Date; returnedAt?: Date; reason?: BreakReason }[]>([]);
  const [showAccountability, setShowAccountability] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const appStateRef = useRef<AppStateStatus>("active");
  const backgroundTimeRef = useRef<Date | null>(null);
  const isRunningRef = useRef(false);

  // Keep ref in sync with isRunning state
  useEffect(() => { isRunningRef.current = isRunning; }, [isRunning]);

  // Detect app going background / returning — registered once
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState: AppStateStatus) => {
      if (appStateRef.current === "active" && nextState === "background" && isRunningRef.current) {
        backgroundTimeRef.current = new Date();
        setBreaks((prev) => [...prev, { leftAt: new Date() }]);
      }
      if (appStateRef.current === "background" && nextState === "active" && isRunningRef.current) {
        if (backgroundTimeRef.current) {
          const elapsed = Math.floor((Date.now() - backgroundTimeRef.current.getTime()) / 1000);
          backgroundTimeRef.current = null;
          if (elapsed > 10) {
            setShowAccountability(true);
          }
        }
      }
      appStateRef.current = nextState;
    });
    return () => subscription.remove();
  }, []);

  // Timer countdown
  useEffect(() => {
    if (isRunning && !showAccountability) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            setIsComplete(true);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, showAccountability]);

  const handleStart = () => {
    setSecondsLeft(selectedDuration * 60);
    setIsRunning(true);
    setIsComplete(false);
    setBreaks([]);
  };

  const handleStop = () => {
    Alert.alert("¿Salir del modo foco?", "Perderás el progreso de esta sesión.", [
      { text: "Cancelar" },
      { text: "Salir", style: "destructive", onPress: () => { setIsRunning(false); navigation.goBack(); } },
    ]);
  };

  const handleBreakReason = (reason: BreakReason) => {
    setBreaks((prev) => {
      const updated = [...prev];
      if (updated.length > 0) {
        updated[updated.length - 1] = { ...updated[updated.length - 1], returnedAt: new Date(), reason };
      }
      return updated;
    });
    setShowAccountability(false);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const progress = 1 - secondsLeft / (selectedDuration * 60);

  if (isComplete) {
    return (
      <SafeAreaView className="flex-1 bg-cream items-center justify-center px-6">
        <Text className="text-5xl mb-4">✅</Text>
        <Text className="text-2xl font-bold text-stone-900 mb-2">¡Sesión completada!</Text>
        <Text className="text-stone-500 text-center mb-2">
          {selectedDuration} minutos de foco.
        </Text>
        {breaks.length > 0 && (
          <Text className="text-stone-400 text-sm text-center mb-8">
            {breaks.length} {breaks.length === 1 ? "interrupción" : "interrupciones"} registradas.
          </Text>
        )}
        <TouchableOpacity className="bg-amber-600 rounded-2xl py-4 px-8" onPress={() => navigation.goBack()}>
          <Text className="text-white font-semibold text-base">Volver al inicio</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="flex-1 px-6 pt-6">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mb-6">
          <Text className="text-stone-400 text-sm">← Volver</Text>
        </TouchableOpacity>

        <Text className="text-2xl font-bold text-stone-900 mb-1">Modo Foco</Text>
        {todayFocus && (
          <Text className="text-stone-500 mb-6 text-sm">{todayFocus.main_focus}</Text>
        )}

        {!isRunning && (
          <>
            <Text className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">
              Duración
            </Text>
            <View className="flex-row gap-3 mb-8">
              {DURATIONS.map((d) => (
                <TouchableOpacity
                  key={d.value}
                  onPress={() => { setSelectedDuration(d.value); setSecondsLeft(d.value * 60); }}
                  className={`flex-1 py-3 rounded-xl items-center border-2 ${selectedDuration === d.value ? "bg-amber-50 border-amber-500" : "bg-white border-stone-200"}`}
                >
                  <Text className={`font-semibold ${selectedDuration === d.value ? "text-amber-700" : "text-stone-600"}`}>
                    {d.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* Timer display */}
        <View className="flex-1 items-center justify-center">
          <View className="bg-white rounded-full w-52 h-52 items-center justify-center border-4 border-amber-100 mb-8">
            <Text className="text-5xl font-bold text-stone-900">{formatTime(secondsLeft)}</Text>
            {isRunning && (
              <Text className="text-xs text-stone-400 mt-1">
                {Math.round(progress * 100)}% completado
              </Text>
            )}
          </View>

          {breaks.filter((b) => b.reason).length > 0 && (
            <Text className="text-xs text-stone-400 mb-4">
              {breaks.filter((b) => b.reason).length} {breaks.filter((b) => b.reason).length === 1 ? "interrupción" : "interrupciones"}
            </Text>
          )}

          {!isRunning ? (
            <TouchableOpacity className="bg-amber-600 rounded-2xl py-4 px-12" onPress={handleStart}>
              <Text className="text-white font-semibold text-base">Iniciar foco</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity className="border-2 border-red-300 rounded-2xl py-4 px-12" onPress={handleStop}>
              <Text className="text-red-400 font-semibold text-base">Detener</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Accountability Modal */}
      <Modal visible={showAccountability} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl px-6 pt-6 pb-10">
            <Text className="text-xl font-bold text-stone-900 mb-2">Estuviste fuera del foco</Text>
            <Text className="text-stone-500 mb-6">¿Qué pasó?</Text>
            {[
              { reason: "distracted" as BreakReason, label: "Me distraje", emoji: "😅" },
              { reason: "necessary" as BreakReason, label: "Era necesario", emoji: "✅" },
              { reason: "lost" as BreakReason, label: "Me perdí", emoji: "🌀" },
            ].map((opt) => (
              <TouchableOpacity
                key={opt.reason}
                className="flex-row items-center bg-stone-50 rounded-xl p-4 mb-3"
                onPress={() => handleBreakReason(opt.reason)}
              >
                <Text className="text-2xl mr-3">{opt.emoji}</Text>
                <Text className="text-stone-800 font-medium">{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
