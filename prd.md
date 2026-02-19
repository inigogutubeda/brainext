# Product Design Requirements (PDR)
## App de Alineación Operativa con Propósito

---

## 1. Visión del producto

Desarrollar una aplicación móvil (iOS y Android) que ayude a emprendedores, freelancers y creativos a **tomar mejores decisiones sobre en qué invertir su tiempo y energía**, alineando sus acciones diarias con sus objetivos vitales y su realidad financiera.

La app no busca maximizar la productividad, sino **la claridad, coherencia y sentido** entre lo que el usuario hace cada día y lo que quiere construir a medio y largo plazo.

> “No te ayuda a hacer más cosas, te ayuda a hacer las cosas correctas.”

---

## 2. Problema a resolver

Los usuarios objetivo suelen:
- Estar constantemente ocupados pero con sensación de estancamiento.
- Tomar decisiones diarias sin un marco claro de prioridades.
- No revisar ni reflexionar de forma estructurada.
- Desconectar sus acciones del propósito vital.
- Ignorar el coste de oportunidad de su tiempo, especialmente en términos financieros.

El problema principal no es la falta de herramientas, sino la **falta de un sistema que conecte acción, propósito y realidad económica**.

---

## 3. Usuario objetivo

### 3.1 Perfiles
- Freelancers
- Emprendedores early-stage
- Creativos profesionales

### 3.2 Características comunes
- Muchos frentes abiertos.
- Alta carga cognitiva.
- Sensibilidad al coste de oportunidad.
- Rechazo a sistemas rígidos o motivación vacía.
- Necesidad de autonomía y sentido.

---

## 4. Principios de diseño

1. Cada interacción debe ayudar a tomar una **decisión más clara**.
2. El sistema es **exigente pero didáctico**.
3. El uso se integra en **momentos naturales**, no forzados.
4. La IA es un **facilitador**, no un protagonista.
5. El producto funciona **con y sin IA**.
6. Simplicidad operativa con profundidad conceptual.
7. Cada acción debe tener un **porqué explícito**.

---

## 5. Núcleo del producto

El producto gira en torno a **momentos de decisión**, no al uso diario obligatorio.

La pregunta central que el sistema ayuda a responder es:

> “¿Tiene sentido, hoy, en qué estoy invirtiendo mi tiempo y energía?”

---

## 6. Momentos clave del sistema

### 6.1 Inicio del día — Decidir

**Objetivo:**  
Evitar empezar el día en piloto automático.

**Funcionalidades:**
- Visualización de objetivos activos.
- Visualización de proyectos activos.
- Selección guiada de:
  - 1 foco principal.
  - 1–2 focos secundarios.
- Identificación explícita del coste de oportunidad.

**Duración esperada:** 2–5 minutos.

---

### 6.2 Cierre del día — Entender

**Objetivo:**  
Convertir la acción en aprendizaje.

**Funcionalidades:**
- Comparación entre intención y ejecución.
- Journal libre.
- Preguntas guiadas de reflexión.
- Evaluación subjetiva de alineación.

**Duración:** opcional, 3–10 minutos.

---

### 6.3 Revisión semanal — Ajustar

**Objetivo:**  
Evaluar coherencia estratégica y evitar semanas mal invertidas.

**Funcionalidades:**
- Revisión de proyectos activos.
- Evaluación cualitativa de esfuerzo vs retorno.
- Decisiones guiadas:
  - Continuar
  - Pausar
  - Cerrar proyectos

---

## 7. Entidades del sistema (modelo de datos base)

### 7.1 User

- id (UUID)
- email
- name
- profile_type (freelancer | entrepreneur | creative)
- created_at

---

### 7.2 Goal (Objetivo)

- id (UUID)
- user_id
- title
- description
- priority (1–3)
- horizon (short | mid | long)
- dimension (personal | professional | financial)
- status (active | paused | completed)
- created_at

Reglas:
- Máximo recomendado: 3 objetivos activos.

---

### 7.3 Project

- id (UUID)
- user_id
- goal_id
- name
- description
- income_type (income | non_income)
- status (active | paused | closed)
- created_at

Reglas:
- Todo proyecto debe estar asociado a un objetivo.

---

### 7.4 Action (Next Action)

- id (UUID)
- user_id
- project_id
- description
- effort_level (low | medium | high)
- perceived_impact (low | medium | high)
- status (pending | done | skipped)
- scheduled_for (date)
- created_at

---

### 7.5 DailyFocus

Entidad diferencial para capturar decisiones diarias.

- id (UUID)
- user_id
- date
- main_focus
- secondary_focus
- intention_notes
- created_at

---

### 7.6 JournalEntry

- id (UUID)
- user_id
- date
- free_text
- guided_answers (JSON)
- related_project_ids (array UUID)
- created_at

Ejemplo de `guided_answers`:
```json
{
  "what_happened": "",
  "what_i_avoided": "",
  "why": "",
  "alignment_score": 1
}
