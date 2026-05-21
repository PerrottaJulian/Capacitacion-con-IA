# Tareas de Integración con la API de Capacity AR

- `[x]` Crear capa de integración de la API (cliente API)
  - `[x]` Definir tipos e interfaces TypeScript para los modelos de la API (`StoredLearningPath`, `GeneratedModule`, `GeneratedUnit`, etc.)
  - `[x]` Crear cliente de peticiones con Axios/fetch apuntando a la URL base de la API externa
  - `[x]` Definir datos fallback/mock que repliquen la estructura de la API para resiliencia ante errores
- `[x]` Integrar datos dinámicos en la pantalla de capacitación
  - `[x]` Configurar `useQuery` para traer la ruta de aprendizaje de `lucia@example.com`
  - `[x]` Reemplazar la caja estática de `ModuloIA.tsx` por el título y contenido de la unidad correspondiente
  - `[x]` Manejar estados de carga (skeletons) y de error/reconexión
- `[x]` Verificación y Pruebas
  - `[x]` Verificar compilación de TypeScript (`npm run build` o equivalente)
  - `[x]` Validar funcionamiento en el navegador local
