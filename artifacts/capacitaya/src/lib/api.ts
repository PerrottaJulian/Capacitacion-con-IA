// API client for connecting to the Capacity AR backend API

export interface ResourceView {
  type: "video" | "guide" | "sandbox" | "reading";
  title: string;
  url: string;
  description?: string;
  duration_minutes?: number;
  source?: string;
  language?: string;
}

export interface GeneratedExercise {
  prompt: string;
  type: "multiple_choice" | "text" | "code";
  expected_answer: string;
  difficulty: number;
}

export interface GeneratedUnit {
  phase: "pasion" | "play" | "practica";
  title: string;
  content: string;
  estimated_minutes: number;
  exercises?: GeneratedExercise[];
  resources?: ResourceView[];
}

export interface GeneratedModule {
  skill_name: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  order_index: number;
  units: GeneratedUnit[];
}

export interface StoredLearningPath {
  id: number;
  student_email: string;
  student_name: string;
  company_name: string;
  target_role_title: string;
  gap_analysis_id: number | null;
  readiness_score_initial: number;
  status: "ACTIVE" | "COMPLETED" | "ABANDONED";
  estimated_total_hours: number;
  generator_used: string;
  modules: GeneratedModule[];
  created_at: string;
  updated_at: string;
}

const API_BASE_URL = "https://capacity-ar-ap.onrender.com";

// Fallback robust mock data matching StoredLearningPath schema
export const MOCK_LEARNING_PATH: StoredLearningPath = {
  id: 42,
  student_email: "lucia@example.com",
  student_name: "Lucía Ramírez",
  company_name: "Empresa Demo",
  target_role_title: "Asistente Administrativo",
  gap_analysis_id: null,
  readiness_score_initial: 47,
  status: "ACTIVE",
  estimated_total_hours: 12,
  generator_used: "gpt-4",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  modules: [
    {
      skill_name: "Excel Básico",
      priority: "HIGH",
      order_index: 0,
      units: [
        {
          phase: "pasion",
          title: "Introducción a Hojas de Cálculo",
          content: "Las hojas de cálculo son herramientas fundamentales para organizar y analizar información numérica y textual en filas y columnas.",
          estimated_minutes: 30
        }
      ]
    },
    {
      skill_name: "Gestión Documental",
      priority: "HIGH",
      order_index: 1,
      units: [
        {
          phase: "pasion",
          title: "1. Fundamentos de la Gestión Documental",
          content: `La **Gestión Documental** consiste en el almacenamiento, organización, control y seguimiento de documentos dentro de una organización. 

En la era moderna, la transición al archivo digital es clave. Los objetivos principales son:
* **Accesibilidad**: Encontrar cualquier archivo en menos de 10 segundos.
* **Seguridad**: Evitar fugas de información confidencial.
* **Colaboración**: Compartir documentos en tiempo real de forma segura.

### Conceptos Clave:
* **Ciclo de vida del documento**: Creación, revisión, archivo activo, archivo pasivo y destrucción/preservación histórica.
* **Trazabilidad**: Saber quién creó, modificó o visualizó un documento y cuándo.`,
          estimated_minutes: 45
        },
        {
          phase: "play",
          title: "2. Organización y Nomenclatura de Archivos",
          content: `Una correcta **nomenclatura de archivos** evita el caos de tener nombres como "documento_final_v2_este_si.pdf".

### Buenas Prácticas de Nomenclatura:
1. **Consistencia**: Usar un formato unificado (ej: AAAA-MM-DD_NombreProyecto_Descripcion_V[Versión]).
2. **Evitar caracteres especiales**: No usar acentos, espacios en blanco (preferir guiones medios '-' o bajos '_') ni símbolos como / o \\.
3. **Control de Versiones**: Usar numeración secuencial clara como \`V1.0\`, \`V1.1\`, \`V2.0\`.

### Estructura de Directorios Lógica:
* **Root / Principal**:
  * \`01_Finanzas\`
  * \`02_Proyectos\`
    * \`2026_CapacitaYa\`
      * \`01_Entregables\`
      * \`02_Minutas\`
  * \`03_Legal\``,
          estimated_minutes: 50,
          exercises: [
            {
              prompt: "¿Cuál es el mejor nombre para la versión final del contrato de CapacitaYa firmado hoy (21 de mayo de 2026)?",
              type: "multiple_choice",
              expected_answer: "2026-05-21_Contrato_CapacitaYa_Firmado_V1.0.pdf",
              difficulty: 2
            }
          ]
        },
        {
          phase: "practica",
          title: "3. Herramientas en la Nube y Control de Cambios",
          content: `Las herramientas de almacenamiento y colaboración como Google Workspace (Drive, Docs) y Microsoft 365 (OneDrive, SharePoint) permiten:

* **Edición concurrente**: Múltiples usuarios escriben y editan un mismo documento a la vez.
* **Historial de versiones**: Posibilidad de restaurar versiones anteriores en cualquier momento.
* **Niveles de Permisos**:
  * **Lector (Viewer)**: Solo lectura de contenido.
  * **Comentarista (Commenter)**: Sugerencias y comentarios, sin modificar texto directo.
  * **Editor**: Modificación directa.
  * **Propietario (Owner)**: Control total, incluyendo permisos y borrado.`,
          estimated_minutes: 55
        },
        {
          phase: "practica",
          title: "4. Seguridad y Cumplimiento Normativo",
          content: `La seguridad documental protege la propiedad intelectual y los datos personales de la empresa y sus clientes (ej: cumplimiento de normativas de protección de datos).

* **Encriptación**: Proteger archivos con contraseña o cifrado de extremo a extremo.
* **Backup (Copias de Seguridad)**: Automatizar copias de respaldo semanales o diarias en ubicaciones físicas/nube separadas.
* **Políticas de Retención**: Definir cuánto tiempo se deben conservar ciertos archivos antes de su destrucción segura.`,
          estimated_minutes: 40
        },
        {
          phase: "practica",
          title: "5. Evaluación del Módulo",
          content: `¡Felicitaciones! Has completado el aprendizaje teórico del Módulo 2: Gestión Documental.

En la siguiente pantalla realizarás una evaluación integral para certificar tus habilidades en:
* Nomenclatura estándar de archivos.
* Gestión de accesos en herramientas de nube.
* Seguridad y confidencialidad básica de documentos.`,
          estimated_minutes: 30
        }
      ]
    }
  ]
};

export async function getStudentLearningPaths(email: string): Promise<StoredLearningPath[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/students/${encodeURIComponent(email)}/learning-paths`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
    // Si no tiene rutas asignadas pero la respuesta es exitosa
    return [MOCK_LEARNING_PATH];
  } catch (error) {
    console.warn("Error fetching learning paths from API. Using fallback mock data.", error);
    return [MOCK_LEARNING_PATH];
  }
}

export async function getLearningPath(pathId: number): Promise<StoredLearningPath> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/learning-paths/${pathId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn(`Error fetching learning path ${pathId} from API. Using fallback mock data.`, error);
    return MOCK_LEARNING_PATH;
  }
}
