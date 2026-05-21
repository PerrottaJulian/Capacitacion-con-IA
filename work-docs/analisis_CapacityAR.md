# Análisis de la API de Capacity AR

Este documento contiene un resumen del análisis realizado sobre la API externa **Capacity AR**, obtenido desde su especificación OpenAPI (Swagger) en `https://capacity-ar-ap.onrender.com/openapi.json` el 21 de mayo de 2026.

## ¿Qué hace la API?
La API de **Capacity AR** es una plataforma diseñada para evaluar brechas de habilidades (*Skill Gap Analysis*), generar rutas de aprendizaje personalizadas y realizar el seguimiento/calificación del desempeño del estudiante.

### Flujo de Trabajo Principal
1. **Evaluación de Habilidades (Gap Analysis)**: Se cargan dos documentos (generalmente en formato PDF: el CV del estudiante y la descripción del puesto de trabajo deseado). La API procesa ambos documentos y devuelve un nivel de preparación (*Readiness Score*) junto con las brechas detectadas (*Gap Skills*).
2. **Generación de Ruta de Aprendizaje (Learning Path)**: A partir de la brecha, la API genera un plan educativo con módulos, unidades y actividades específicas de aprendizaje.
3. **Ejecución y Feedback (Attempts)**: El estudiante realiza los ejercicios teóricos y prácticos dentro de la plataforma. La API evalúa las respuestas devolviendo un puntaje, la corrección y un feedback generado por IA. Al mismo tiempo, actualiza la métrica de dominio del tema (*Skill Mastery*).

## Endpoints Disponibles

### 🏥 Salud del Sistema
*   `GET /api/health`: Estado general del servidor.

### 👥 Usuarios
Administración de cuentas con roles (`student`, `tutor`, `company_admin`, `admin`):
*   `GET /api/users`: Lista de usuarios (con paginación).
*   `POST /api/users`: Creación de un usuario.
*   `GET /api/users/{user_id}`: Detalle de usuario.
*   `PATCH /api/users/{user_id}`: Modificación parcial.
*   `DELETE /api/users/{user_id}`: Baja del usuario.

### 🔍 Análisis de Brechas (Gap Analysis)
*   `POST /api/gap-analyses`: Recibe mediante un formulario multi-part los archivos `student_doc` (CV) y `position_doc` (Puesto) y devuelve el informe de compatibilidad.
*   `GET /api/gap-analyses/{gap_id}`: Recupera un análisis específico.
*   `GET /api/students/{email}/gap-analyses`: Historial de análisis de un estudiante.
*   `POST /api/students/{email}/generate-learning-path`: Dispara la creación de una ruta educativa a partir del análisis del alumno.

### 🗺️ Rutas de Aprendizaje (Learning Paths)
*   `POST /api/learning-paths`: Crea una ruta de aprendizaje.
*   `GET /api/learning-paths`: Lista general de rutas.
*   `GET /api/learning-paths/{path_id}`: Obtiene el árbol completo de módulos, unidades, recursos y ejercicios.
*   `GET /api/students/{email}/learning-paths`: Rutas asignadas al estudiante.

### 📝 Intentos (Attempts)
*   `POST /api/attempts`: Envía la respuesta de un ejercicio. Retorna corrección y feedback de IA.
*   `GET /api/attempts/{attempt_id}`: Detalle de un intento.
*   `GET /api/students/{email}/attempts`: Historial de respuestas por alumno.

## Modelos de Datos Clave
*   `UserResponse`: ID, nombre, email, rol, fechas de creación/actualización.
*   `GapAnalysisResponse`: ID, emails, puntaje de preparación, resumen textual, listado de habilidades y ID de la ruta de aprendizaje generada.
*   `StoredLearningPath`: Módulos asociados con prioridades, unidades de aprendizaje (clasificadas en fases como *pasión*, *juego* o *práctica*), recursos adicionales y ejercicios prácticos.
*   `AttemptResponse`: Respuestas ingresadas, resultado de la evaluación, feedback detallado de la IA y el porcentaje de dominio actual de la habilidad.

---
*Nota: Este archivo fue generado automáticamente para servir como referencia y memoria del análisis técnico realizado.*
