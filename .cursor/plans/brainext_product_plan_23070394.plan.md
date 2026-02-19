---
name: BraiNext Product Plan
overview: Mejorar el PDR con las decisiones de diseno faltantes, definir la arquitectura tecnica (Expo + NestJS + PostgreSQL + AI abstracta), y crear 6 sprints con tareas atomicas para construir el primer prototipo funcional completo.
todos:
  - id: s0-1
    content: "Sprint 0: Crear monorepo con carpetas /app (Expo) y /api (NestJS)"
    status: pending
  - id: s0-2
    content: "Sprint 0: Inicializar proyecto Expo con TypeScript template (npx create-expo-app)"
    status: pending
  - id: s0-3
    content: "Sprint 0: Inicializar proyecto NestJS con TypeScript (nest new)"
    status: pending
  - id: s0-4
    content: "Sprint 0: Configurar Prisma ORM + schema inicial con todas las entidades del PDR"
    status: pending
  - id: s0-5
    content: "Sprint 0: Docker Compose con PostgreSQL para desarrollo local"
    status: pending
  - id: s0-6
    content: "Sprint 0: Configurar ESLint + Prettier compartido en el monorepo"
    status: pending
  - id: s0-7
    content: "Sprint 0: Configurar Nativewind (Tailwind CSS para RN) en Expo"
    status: pending
  - id: s0-8
    content: "Sprint 0: Configurar React Navigation (stack + tab navigator base)"
    status: pending
  - id: s0-9
    content: "Sprint 0: Crear API client base con Axios + interceptores de auth"
    status: pending
  - id: s0-10
    content: "Sprint 0: Configurar TanStack Query en el frontend"
    status: pending
  - id: s1-1
    content: "Sprint 1: Backend - Modulo de Auth: registro con email+password (bcrypt + JWT)"
    status: pending
  - id: s1-2
    content: "Sprint 1: Backend - Modulo de Auth: login + refresh token"
    status: pending
  - id: s1-3
    content: "Sprint 1: Backend - Guard de autenticacion JWT global"
    status: pending
  - id: s1-4
    content: "Sprint 1: Backend - CRUD de Users (GET /me, PATCH /me)"
    status: pending
  - id: s1-5
    content: "Sprint 1: Backend - CRUD de Goals (POST, GET all, GET one, PATCH, DELETE)"
    status: pending
  - id: s1-6
    content: "Sprint 1: Backend - CRUD de Projects vinculado a Goals"
    status: pending
  - id: s1-7
    content: "Sprint 1: Backend - Validacion: max 3 goals activos por usuario"
    status: pending
  - id: s1-8
    content: "Sprint 1: Frontend - Pantallas de Login y Register"
    status: pending
  - id: s1-9
    content: "Sprint 1: Frontend - Flujo de auth (store Zustand + token persistence con SecureStore)"
    status: pending
  - id: s1-10
    content: "Sprint 1: Frontend - Wizard de Onboarding paso 1: tipo de perfil (freelancer/entrepreneur/creative)"
    status: pending
  - id: s1-11
    content: "Sprint 1: Frontend - Wizard de Onboarding paso 2: crear 1-3 Goals"
    status: pending
  - id: s1-12
    content: "Sprint 1: Frontend - Wizard de Onboarding paso 3: crear 1 Project por Goal"
    status: pending
  - id: s1-13
    content: "Sprint 1: Frontend - Tab Navigator principal (Hoy, Proyectos, Objetivos, Perfil)"
    status: pending
  - id: s1-14
    content: "Sprint 1: Frontend - Pantalla de lista de Goals con estado visual"
    status: pending
  - id: s1-15
    content: "Sprint 1: Frontend - Pantalla de lista de Projects agrupados por Goal"
    status: pending
  - id: s1-16
    content: "Sprint 1: Frontend - Pantalla de detalle/edicion de Goal"
    status: pending
  - id: s1-17
    content: "Sprint 1: Frontend - Pantalla de detalle/edicion de Project"
    status: pending
  - id: s2-1
    content: "Sprint 2: Backend - CRUD de Actions vinculado a Projects"
    status: pending
  - id: s2-2
    content: "Sprint 2: Backend - Endpoint POST /daily-focus (crear foco del dia)"
    status: pending
  - id: s2-3
    content: "Sprint 2: Backend - Endpoint GET /daily-focus/today (obtener foco de hoy)"
    status: pending
  - id: s2-4
    content: "Sprint 2: Backend - Endpoint PATCH /actions/:id/complete (marcar como hecha)"
    status: pending
  - id: s2-5
    content: "Sprint 2: Frontend - Pantalla 'Hoy': vista principal con estado del dia (sin foco / con foco)"
    status: pending
  - id: s2-6
    content: "Sprint 2: Frontend - Modal/Flow 'Definir foco': mostrar goals+projects activos, seleccionar main+secondary"
    status: pending
  - id: s2-7
    content: "Sprint 2: Frontend - Selector de acciones del dia (filtrado por proyecto en foco)"
    status: pending
  - id: s2-8
    content: "Sprint 2: Frontend - Vista de acciones del dia con checkbox para completar"
    status: pending
  - id: s2-9
    content: "Sprint 2: Frontend - Indicador visual de coste de oportunidad (que NO estas haciendo hoy)"
    status: pending
  - id: s2-10
    content: "Sprint 2: Frontend - Pantalla de gestion de Actions dentro de un Project"
    status: pending
  - id: s2-11
    content: "Sprint 2: Frontend - Crear nueva Action (descripcion, esfuerzo, impacto)"
    status: pending
  - id: s3-1
    content: "Sprint 3: Backend - CRUD de JournalEntry"
    status: pending
  - id: s3-2
    content: "Sprint 3: Backend - Endpoint GET /journal/today"
    status: pending
  - id: s3-3
    content: "Sprint 3: Backend - Logica de preguntas guiadas (devolver set de preguntas por contexto)"
    status: pending
  - id: s3-4
    content: "Sprint 3: Frontend - Boton 'Cerrar el dia' en pantalla Hoy (visible desde X hora)"
    status: pending
  - id: s3-5
    content: "Sprint 3: Frontend - Flow de cierre: paso 1 - comparacion intencion vs ejecucion (visual)"
    status: pending
  - id: s3-6
    content: "Sprint 3: Frontend - Flow de cierre: paso 2 - preguntas guiadas (que paso, que evite, por que)"
    status: pending
  - id: s3-7
    content: "Sprint 3: Frontend - Flow de cierre: paso 3 - journal libre (texto abierto)"
    status: pending
  - id: s3-8
    content: "Sprint 3: Frontend - Flow de cierre: paso 4 - alignment score (slider 1-5)"
    status: pending
  - id: s3-9
    content: "Sprint 3: Frontend - Historial de journal entries (lista por fecha)"
    status: pending
  - id: s4-1
    content: "Sprint 4: Backend - Entidad WeeklyReview + migracion Prisma"
    status: pending
  - id: s4-2
    content: "Sprint 4: Backend - Endpoint GET /weekly-review/current (datos de la semana)"
    status: pending
  - id: s4-3
    content: "Sprint 4: Backend - Endpoint POST /weekly-review (guardar decisiones)"
    status: pending
  - id: s4-4
    content: "Sprint 4: Backend - Logica de agregacion semanal (daily focuses + journals + actions stats)"
    status: pending
  - id: s4-5
    content: "Sprint 4: Frontend - Trigger de revision semanal (deteccion de dia, boton en Hoy)"
    status: pending
  - id: s4-6
    content: "Sprint 4: Frontend - Flow revision: paso 1 - resumen de la semana (metricas visuales)"
    status: pending
  - id: s4-7
    content: "Sprint 4: Frontend - Flow revision: paso 2 - evaluacion por proyecto (esfuerzo vs retorno)"
    status: pending
  - id: s4-8
    content: "Sprint 4: Frontend - Flow revision: paso 3 - decisiones (continuar/pausar/cerrar por proyecto)"
    status: pending
  - id: s4-9
    content: "Sprint 4: Frontend - Historial de weekly reviews"
    status: pending
  - id: s5-1
    content: "Sprint 5: Backend - AI Service: interface abstracta IAIProvider con metodo generateResponse"
    status: pending
  - id: s5-2
    content: "Sprint 5: Backend - AI Service: implementacion OpenAIProvider (GPT-4o-mini)"
    status: pending
  - id: s5-3
    content: "Sprint 5: Backend - AI Service: factory pattern para seleccion de provider por config"
    status: pending
  - id: s5-4
    content: "Sprint 5: Backend - Endpoint POST /ai/daily-insight (input: contexto del dia, output: sugerencia de foco)"
    status: pending
  - id: s5-5
    content: "Sprint 5: Backend - Endpoint POST /ai/journal-reflection (input: journal+acciones, output: reflexion)"
    status: pending
  - id: s5-6
    content: "Sprint 5: Backend - Endpoint POST /ai/weekly-summary (input: datos semana, output: narrativa+recomendaciones)"
    status: pending
  - id: s5-7
    content: "Sprint 5: Backend - Entidad AIInsight + persistencia de outputs"
    status: pending
  - id: s5-8
    content: "Sprint 5: Backend - Prompt engineering: system prompts para cada momento (daily/journal/weekly)"
    status: pending
  - id: s5-9
    content: "Sprint 5: Frontend - Componente AIInsightCard reutilizable"
    status: pending
  - id: s5-10
    content: "Sprint 5: Frontend - Integrar AI insight en flujo de Daily Focus (sugerencia antes de elegir)"
    status: pending
  - id: s5-11
    content: "Sprint 5: Frontend - Integrar AI reflection en flujo de Journal (despues de escribir)"
    status: pending
  - id: s5-12
    content: "Sprint 5: Frontend - Integrar AI summary en Weekly Review (narrativa de la semana)"
    status: pending
  - id: s6-1
    content: "Sprint 6: Backend - Servicio de notificaciones push (Expo Notifications)"
    status: pending
  - id: s6-2
    content: "Sprint 6: Backend - Entidad NotificationPreference (horarios manana/noche/semanal)"
    status: pending
  - id: s6-3
    content: "Sprint 6: Frontend - Pantalla de configuracion de recordatorios"
    status: pending
  - id: s6-4
    content: "Sprint 6: Frontend - Registro de push token al login"
    status: pending
  - id: s6-5
    content: "Sprint 6: Frontend - Manejo de errores global (toasts, estados vacios, loading states)"
    status: pending
  - id: s6-6
    content: "Sprint 6: Frontend - Pantalla de perfil con stats basicos (dias activo, streak, alignment promedio)"
    status: pending
  - id: s6-7
    content: "Sprint 6: Frontend - Revision de UX: transiciones, feedback tactil, consistencia visual"
    status: pending
  - id: s6-8
    content: "Sprint 6: Testing manual end-to-end de todos los flujos"
    status: pending
isProject: false
---

# Plan: BraiNext - Del PDR al Prototipo

## Parte 1: Mejoras al PDR

El [pdr.md](pdr.md) actual tiene buena base conceptual pero le faltan secciones criticas para poder ejecutar. Se agregaran:

### 1.1 Secciones faltantes

- **Seccion 8 - Flujo de Onboarding**: Como entra el usuario por primera vez. Sin esto, no hay forma de arrancar el core loop. Propuesta: wizard de 3 pasos (perfil -> 1-3 goals -> 1 proyecto por goal).
- **Seccion 9 - Stack Tecnico**: Documentar las decisiones de tecnologia.
- **Seccion 10 - Arquitectura de IA**: Que hace el AI coach en cada momento, que datos consume, que genera.
- **Seccion 11 - Estrategia de Notificaciones**: Como se activan los "momentos naturales" (push notifications configurables).
- **Seccion 12 - Mapa de Pantallas**: Flujo de navegacion principal.

### 1.2 Entidades faltantes en el modelo de datos

- **WeeklyReview**: No existe en el PDR pero el momento "Revision semanal" la necesita.
- **AIInsight**: Para guardar los outputs del coach (pattern analysis, sugerencias).
- **NotificationPreference**: Configuracion de horarios de recordatorios.

### 1.3 Mejoras al modelo existente

- `DailyFocus.main_focus` y `secondary_focus` deberian ser FK a `Action` o `Project`, no texto libre.
- `JournalEntry.alignment_score` deberia ser 1-5 (no 1-10, reduce friction cognitiva).
- Agregar `Action.completed_at` para tracking temporal.
- Agregar `Goal.target_date` para horizontes temporales concretos.

---

## Parte 2: Decisiones de Diseno

### 2.1 Stack Tecnico

```
Frontend:  Expo (React Native) + TypeScript
           React Navigation (navegacion)
           Zustand (estado local)
           TanStack Query (estado servidor)
           Nativewind (Tailwind para RN)

Backend:   NestJS + TypeScript
           Prisma ORM + PostgreSQL
           JWT Auth (Passport)
           Docker para desarrollo local

AI:        Capa abstracta con interface comun
           OpenAI (GPT-4o-mini) como provider inicial
           Preparado para Anthropic como alternativa

Infra:     Docker Compose (dev)
           Railway o Render (deploy prototipo)
```

### 2.2 Arquitectura General

```mermaid
graph TB
    subgraph frontend [Frontend - Expo]
        screens[Screens]
        store[Zustand Store]
        api[API Client]
    end

    subgraph backend [Backend - NestJS]
        controllers[Controllers]
        services[Services]
        aiService[AI Service Layer]
        prisma[Prisma ORM]
    end

    subgraph external [External]
        openai[OpenAI API]
        anthropic[Anthropic API]
        db[(PostgreSQL)]
    end

    screens --> store
    screens --> api
    api -->|REST JSON| controllers
    controllers --> services
    services --> prisma
    services --> aiService
    aiService --> openai
    aiService --> anthropic
    prisma --> db
```



### 2.3 Flujo de Navegacion (Pantallas)

```mermaid
graph LR
    subgraph auth [Auth]
        login[Login]
        register[Register]
    end

    subgraph onboarding [Onboarding]
        ob1[Perfil]
        ob2[Goals]
        ob3[Proyectos]
    end

    subgraph main [Tab Navigator]
        today[Hoy]
        projects[Proyectos]
        goals[Objetivos]
        profile[Perfil]
    end

    subgraph flows [Flujos Modales]
        dailyFocus[Daily Focus]
        journal[Journal]
        weeklyReview[Weekly Review]
        aiChat[AI Coach]
    end

    login --> ob1
    register --> ob1
    ob1 --> ob2
    ob2 --> ob3
    ob3 --> today
    today --> dailyFocus
    today --> journal
    today --> weeklyReview
    today --> aiChat
```



### 2.4 Rol del AI Coach (por momento)


| Momento                                                      | Input para la IA | Output de la IA |
| ------------------------------------------------------------ | ---------------- | --------------- |
| No se pueden usar tablas en el plan. Reformulado como lista: |                  |                 |


**Inicio del dia (Decidir)**:

- Input: goals activos, proyectos, acciones pendientes, historial de los ultimos 7 dias
- Output: sugerencia de foco priorizado, alerta si hay patron de evitacion, pregunta provocadora

**Cierre del dia (Entender)**:

- Input: foco del dia, journal entry, acciones completadas/saltadas
- Output: reflexion sobre alineacion, deteccion de patrones (siempre saltas X tipo de tarea), pregunta de profundizacion

**Revision semanal (Ajustar)**:

- Input: todos los daily focuses + journals de la semana, estado de proyectos
- Output: resumen narrativo de la semana, recomendaciones (pausar proyecto X, doble down en Y), metricas de coherencia

---

## Parte 3: Sprints y Tareas Atomicas

### Sprint 0 - Fundacion (1 semana)

Setup de repositorio, tooling y estructura base. Sin funcionalidad visible.

### Sprint 1 - Auth + Onboarding + Modelo Base (2 semanas)

Registro, login, wizard de onboarding, CRUD de Goals y Projects.

### Sprint 2 - Daily Focus + Actions (2 semanas)

Flujo de inicio del dia, seleccion de foco, gestion de acciones.

### Sprint 3 - Journal + Cierre del dia (1.5 semanas)

Flujo de cierre del dia, journal con preguntas guiadas, evaluacion de alineacion.

### Sprint 4 - Weekly Review (1.5 semanas)

Flujo de revision semanal, evaluacion de proyectos, decisiones de continuar/pausar/cerrar.

### Sprint 5 - AI Coach (2 semanas)

Integracion de IA en los 3 momentos, capa de abstraccion de providers, generacion de insights.

### Sprint 6 - Polish + Notificaciones (1 semana)

Push notifications, ajustes de UX, manejo de errores, preparacion para testing real.

**Total estimado: ~11 semanas para el prototipo funcional completo.**

---

## Parte 4: Tareas Atomicas por Sprint

Ver los todos adjuntos para el desglose completo. Cada tarea es lo suficientemente pequena para completarse en 1-4 horas.