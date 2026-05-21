# Integración de Contenido de Capacitación desde la API de Capacity AR

Este plan detalla los pasos para conectar la aplicación frontend con la API externa de **Capacity AR** y renderizar dinámicamente el contenido educativo generado por IA dentro de la pantalla de capacitación (`ModuloIA.tsx`).

## User Review Required

> [!IMPORTANT]
> **Consumo y Fallbacks de la API**: Como el backend está alojado en una instancia gratuita de Render, la primera petición puede tardar unos segundos en responder debido a la inactividad (*cold start*). Implementaremos un estado de carga visualmente atractivo y un fallback con datos estructurados locales (que replican exactamente el esquema de la API) para garantizar que la interfaz no se rompa y responda de inmediato si la API está caída o tarda demasiado.

> [!NOTE]
> **Usuario de Pruebas**: Usaremos `lucia@example.com` como el email de estudiante por defecto para las consultas a la API.

## Open Questions

> [!NOTE]
> **Visualización de Markdown**: El contenido generado por la IA en la API viene en formato Markdown. ¿Preferís que usemos una librería simple para renderizar Markdown a HTML (como `react-markdown`) o hacemos un formateador simple propio para evitar agregar más dependencias externas? 
> *(Para este primer paso, el plan propone usar un renderizador simple basado en estilos estándar de CSS para evitar dependencias pesadas).*

---

## Proposed Changes

### [API Integration Layer]

Crearemos un cliente API simple y tipado para centralizar las peticiones a la API externa de Capacity AR.

#### [NEW] [api.ts](file:///c:/Users/jperrotta/dev/Capacitacion-con-IA/artifacts/capacitaya/src/lib/api.ts)
* Crear funciones para:
  * `getStudentLearningPaths(email)`: Llama a `GET /api/students/{email}/learning-paths`
  * `getLearningPath(pathId)`: Llama a `GET /api/learning-paths/{path_id}`
* Definir las interfaces de TypeScript alineadas con los esquemas de la API: `StoredLearningPath`, `GeneratedModule`, `GeneratedUnit`, `GeneratedExercise`.
* Incluir datos fallback con la misma estructura para asegurar el correcto renderizado ante fallas o demoras del servidor.

---

### [UI Components and Pages]

Modificaremos la pantalla de capacitación para que consuma los datos de la API utilizando `@tanstack/react-query` y muestre el contenido interactivo de la unidad actual.

#### [MODIFY] [ModuloIA.tsx](file:///c:/Users/jperrotta/dev/Capacitacion-con-IA/artifacts/capacitaya/src/pages/ModuloIA.tsx)
* Integrar `useQuery` de `@tanstack/react-query` para consumir la ruta de aprendizaje de la estudiante.
* Obtener el módulo actual (por ejemplo, el módulo en progreso) y la unidad seleccionada (basada en el paso actual del usuario).
* Reemplazar el recuadro estático con un renderizador dinámico que muestre:
  * El título de la unidad actual.
  * El contenido educativo generado por la IA (con soporte para saltos de línea y formateo básico).
  * Tiempo estimado de la unidad.
* Implementar estados visuales de "Cargando..." (Skeleton loaders) y "Error" coherentes con la estética moderna de la app.

---

## Verification Plan

### Automated Tests
* Ejecutar en consola `npx pnpm@9 run build` para asegurar que las definiciones de tipos de TypeScript compilan sin errores.

### Manual Verification
* Levantar el servidor local con `npx pnpm@9 --filter @workspace/capacitaya dev`.
* Navegar a la sección **Capacitación** (`/modulo`) y verificar que:
  1. Se vea un indicador de carga mientras la API responde.
  2. El contenido estático de prueba sea reemplazado por el contenido real devuelto por la API (o el mock estructurado de fallback si la llamada falla).
  3. Los controles de navegación ("Anterior", "Continuar") sigan funcionando correctamente.
