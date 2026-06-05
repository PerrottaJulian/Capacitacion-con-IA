import { useState, useEffect, ComponentType } from "react";
import "./index.css";
import { modules } from "./.generated/mockup-components";

function getPreviewKey(): string | null {
  const base = (import.meta.env.BASE_URL ?? "").replace(/\/$/, "");
  const pathname = window.location.pathname;
  const previewPrefix = `${base}/preview/`;
  if (!pathname.startsWith(previewPrefix)) return null;
  const rest = pathname.slice(previewPrefix.length).replace(/\/$/, "");
  if (!rest) return null;
  return `./components/mockups/${rest}.tsx`;
}

function PreviewHost({ moduleKey }: { moduleKey: string }) {
  const [Component, setComponent] = useState<ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loader = modules[moduleKey];
    if (!loader) {
      setError(`Componente no encontrado: ${moduleKey}`);
      return;
    }
    loader()
      .then((mod) => {
        const exports = Object.values(mod).filter((v) => typeof v === "function");
        if (exports.length === 0) {
          setError(`Sin exportaciones en: ${moduleKey}`);
          return;
        }
        setComponent(() => exports[0] as ComponentType);
      })
      .catch((err) => setError(String(err)));
  }, [moduleKey]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-red-500 text-sm font-mono p-8">{error}</div>
      </div>
    );
  }
  if (!Component) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-400 text-sm">Cargando...</div>
      </div>
    );
  }
  return <Component />;
}

export default function App() {
  const key = getPreviewKey();

  if (key) {
    return <PreviewHost moduleKey={key} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Capacit<span className="text-amber-600">AR</span></h1>
        <p className="text-slate-500">Selecciona una pantalla desde el panel de vistas previas</p>
      </div>
    </div>
  );
}
