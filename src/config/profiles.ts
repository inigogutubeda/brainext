import type { ProfileType } from "../types";

interface ProfileCopy {
  label: string;
  description: string;
  onboarding: {
    goalPlaceholder: string;
  };
  morning: {
    mainFocusPrompt: string;
    mainFocusPlaceholder: string;
    intentionPrompt: string;
    opportunityCostNudge: string;
  };
  evening: {
    q1: string;
    q2: string;
    q3: string;
    alignmentLabel: string;
  };
  weekly: {
    opening: string;
    strategicQuestion: string;
  };
}

export const PROFILE_CONFIG: Record<ProfileType, ProfileCopy> = {
  freelancer: {
    label: "Freelancer",
    description: "Tus ingresos dependen de tu trabajo directo",
    onboarding: {
      goalPlaceholder: "Ej: Facturar 3.000€/mes de forma estable",
    },
    morning: {
      mainFocusPrompt: "¿Qué trabajo de cliente tiene más impacto hoy?",
      mainFocusPlaceholder: "El trabajo de cliente más importante...",
      intentionPrompt: "¿Qué queda fuera del día para que esto pase?",
      opportunityCostNudge: "¿Estás avanzando en lo que factura o en lo urgente?",
    },
    evening: {
      q1: "¿Avanzaste en lo que factura o solo en lo urgente?",
      q2: "¿Qué trabajo evitaste y por qué?",
      q3: "¿Cómo estuvo tu energía para el trabajo real?",
      alignmentLabel: "¿Cuánto avanzaste en lo que importa?",
    },
    weekly: {
      opening: "¿Esta semana trabajaste en lo que factura o solo en lo urgente?",
      strategicQuestion: "¿Tu pipeline de clientes está sano?",
    },
  },

  entrepreneur: {
    label: "Emprendedor",
    description: "Construyes un negocio desde cero",
    onboarding: {
      goalPlaceholder: "Ej: Conseguir mis primeros 10 clientes",
    },
    morning: {
      mainFocusPrompt: "¿Qué mueve la aguja de tu negocio hoy?",
      mainFocusPlaceholder: "La acción que más impacta en tu negocio...",
      intentionPrompt: "¿Estás construyendo o apagando fuegos?",
      opportunityCostNudge: "¿Esto acerca tu visión o la pospone?",
    },
    evening: {
      q1: "¿Construiste algo hoy o solo operaste?",
      q2: "¿Qué te frenó o en qué te distrajiste?",
      q3: "¿Estás más cerca de tu visión que ayer?",
      alignmentLabel: "¿Cuánto te acercaste a tu visión?",
    },
    weekly: {
      opening: "¿Esta semana construiste o solo operaste?",
      strategicQuestion: "¿Algún proyecto debería cerrarse para liberar energía?",
    },
  },

  creative: {
    label: "Creativo",
    description: "Tu trabajo es tu expresión y tu medio de vida",
    onboarding: {
      goalPlaceholder: "Ej: Lanzar mi primer álbum / libro / colección",
    },
    morning: {
      mainFocusPrompt: "¿Qué vas a crear o avanzar hoy?",
      mainFocusPlaceholder: "La obra o avance creativo del día...",
      intentionPrompt: "¿Tienes bloqueado tiempo para crear sin interrupciones?",
      opportunityCostNudge: "¿Hoy haces obra o haces recados?",
    },
    evening: {
      q1: "¿Creaste algo hoy, aunque fuera pequeño?",
      q2: "¿Qué robó tu tiempo creativo?",
      q3: "¿Tu energía creativa aumentó o se agotó?",
      alignmentLabel: "¿Fue un día de creación real?",
    },
    weekly: {
      opening: "¿Esta semana hiciste obra o solo tareas?",
      strategicQuestion: "¿Qué proyecto creativo merece más espacio la próxima semana?",
    },
  },

  business_owner: {
    label: "Empresario",
    description: "Diriges un equipo o negocio en marcha",
    onboarding: {
      goalPlaceholder: "Ej: Delegar operaciones y enfocarme en estrategia",
    },
    morning: {
      mainFocusPrompt: "¿Qué decisión o problema necesita tu atención hoy?",
      mainFocusPlaceholder: "La decisión o problema más importante...",
      intentionPrompt: "¿Qué puedes delegar para proteger este foco?",
      opportunityCostNudge: "¿Esto requiere solo tu cabeza, o podrías liberarlo?",
    },
    evening: {
      q1: "¿Lideraste hoy o solo gestionaste?",
      q2: "¿Qué deberías haber delegado y no lo hiciste?",
      q3: "¿Tu negocio avanzó sin ti o te necesitó demasiado?",
      alignmentLabel: "¿Dirigiste o te dejaste llevar?",
    },
    weekly: {
      opening: "¿Esta semana lideraste o gestionaste?",
      strategicQuestion: "¿Qué parte del negocio necesita tu atención estratégica ahora?",
    },
  },
};
