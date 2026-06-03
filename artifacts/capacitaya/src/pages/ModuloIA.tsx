import React, { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { BrainCircuit, HelpCircle, ArrowRight, ArrowLeft, MessageSquare, BookOpen, Clock, AlertTriangle } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { getStudentLearningPaths } from "@/lib/api";

function parseMarkdown(text: string): React.ReactNode[] {
  const lines = text.split("\n");
  let inList = false;
  let listItems: React.ReactNode[] = [];
  const nodes: React.ReactNode[] = [];

  const parseInline = (lineText: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    let currentText = lineText;
    const boldRegex = /\*\*([^*]+)\*\*/;
    const codeRegex = /`([^`]+)`/;
    let key = 0;

    while (currentText) {
      const boldMatch = boldRegex.exec(currentText);
      const codeMatch = codeRegex.exec(currentText);

      if (boldMatch && (!codeMatch || boldMatch.index < codeMatch.index)) {
        if (boldMatch.index > 0) {
          parts.push(<span key={`text-${key++}`}>{currentText.substring(0, boldMatch.index)}</span>);
        }
        parts.push(<strong key={`bold-${key++}`} className="font-extrabold text-slate-800 dark:text-white">{boldMatch[1]}</strong>);
        currentText = currentText.substring(boldMatch.index + boldMatch[0].length);
      } else if (codeMatch) {
        if (codeMatch.index > 0) {
          parts.push(<span key={`text-${key++}`}>{currentText.substring(0, codeMatch.index)}</span>);
        }
        parts.push(
          <code key={`code-${key++}`} className="bg-slate-100 dark:bg-slate-800 text-[var(--cy-primary)] px-1.5 py-0.5 rounded font-mono text-sm border border-slate-200/50 dark:border-slate-700/50">
            {codeMatch[1]}
          </code>
        );
        currentText = currentText.substring(codeMatch.index + codeMatch[0].length);
      } else {
        parts.push(<span key={`text-${key++}`}>{currentText}</span>);
        break;
      }
    }
    return parts;
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    if (!trimmed.startsWith("* ") && !trimmed.startsWith("- ")) {
      if (inList) {
        nodes.push(
          <ul key={`list-${idx}`} className="list-disc pl-6 mb-5 space-y-2 text-slate-600 dark:text-slate-300">
            {listItems}
          </ul>
        );
        listItems = [];
        inList = false;
      }
    }

    if (trimmed.startsWith("### ")) {
      nodes.push(
        <h4 key={`h3-${idx}`} className="text-base font-bold text-slate-800 dark:text-white mt-5 mb-2 tracking-tight">
          {parseInline(trimmed.substring(4))}
        </h4>
      );
    } else if (trimmed.startsWith("## ")) {
      nodes.push(
        <h3 key={`h2-${idx}`} className="text-lg font-extrabold text-slate-800 dark:text-white mt-7 mb-3 tracking-tight border-b border-slate-100 dark:border-slate-800 pb-1.5">
          {parseInline(trimmed.substring(3))}
        </h3>
      );
    } else if (trimmed.startsWith("# ")) {
      nodes.push(
        <h2 key={`h1-${idx}`} className="text-xl font-black text-slate-900 dark:text-white mt-9 mb-4 tracking-tight">
          {parseInline(trimmed.substring(2))}
        </h2>
      );
    } else if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
      inList = true;
      listItems.push(
        <li key={`li-${idx}`} className="leading-relaxed text-sm">
          {parseInline(trimmed.substring(2))}
        </li>
      );
    } else if (trimmed.startsWith("> ")) {
      nodes.push(
        <blockquote key={`bq-${idx}`} className="border-l-4 border-[var(--cy-primary)] pl-4 py-2 my-4 bg-indigo-50/20 dark:bg-indigo-950/10 italic text-slate-600 dark:text-slate-300 rounded-r text-sm">
          {parseInline(trimmed.substring(2))}
        </blockquote>
      );
    } else if (trimmed === "") {
      // Spacer
    } else {
      nodes.push(
        <p key={`p-${idx}`} className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4 text-sm">
          {parseInline(trimmed)}
        </p>
      );
    }
  });

  if (inList) {
    nodes.push(
      <ul key="list-last" className="list-disc pl-6 mb-5 space-y-2 text-slate-600 dark:text-slate-300">
        {listItems}
      </ul>
    );
  }

  return nodes;
}
//extra
export function ModuloIA() {
  const [, setLocation] = useLocation();
  const [currentUnitIndex, setCurrentUnitIndex] = useState(1); // Default to Paso 2

  const { data: paths, isLoading, error, refetch } = useQuery({
    queryKey: ["learningPaths", "lucia@example.com"],
    queryFn: () => getStudentLearningPaths("lucia@example.com"),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const path = paths?.[0];
  // Buscamos el módulo de "Gestión Documental" o caemos en el primero disponible
  const activeModule = path?.modules.find(m => m.skill_name === "Gestión Documental") || path?.modules[0];
  const units = activeModule?.units || [];
  const currentUnit = units[currentUnitIndex];
  const totalUnits = units.length || 5;

  const handleNext = () => {
    if (currentUnitIndex < totalUnits - 1) {
      setCurrentUnitIndex(currentUnitIndex + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setLocation("/evaluacion");
    }
  };

  const handlePrev = () => {
    if (currentUnitIndex > 0) {
      setCurrentUnitIndex(currentUnitIndex - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setLocation("/plan");
    }
  };

  return (
    <AppLayout activePage="Capacitación">
      <div className="max-w-[760px] mx-auto pb-24">
        {/* Header content */}
        <div className="mb-6 text-center">
          <p className="text-[var(--cy-primary)] font-semibold mb-2">
            {activeModule ? `Módulo ${activeModule.order_index + 1}: ${activeModule.skill_name}` : "Módulo de Capacitación"}
          </p>
          <div className="flex items-center justify-center gap-2.5">
            {Array.from({ length: totalUnits }).map((_, idx) => {
              let bgClass = "bg-slate-200 dark:bg-slate-700";
              if (idx < currentUnitIndex) {
                bgClass = "bg-emerald-500";
              } else if (idx === currentUnitIndex) {
                bgClass = "bg-[var(--cy-primary)]";
              }
              return (
                <div
                  key={idx}
                  className={`h-1.5 w-12 rounded-full transition-colors duration-300 ${bgClass}`}
                ></div>
              );
            })}
          </div>
          <p className="text-xs font-medium text-slate-500 mt-2.5">
            Paso {currentUnitIndex + 1} de {totalUnits}
          </p>
        </div>

        {/* IA Content Area */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/80 p-8 min-h-[420px] flex flex-col mb-6">
          {isLoading ? (
            <div className="flex-1 flex flex-col justify-center space-y-4 animate-pulse">
              <div className="h-6 bg-slate-100 dark:bg-slate-700 rounded-md w-3/4 mx-auto"></div>
              <div className="space-y-2.5">
                <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded-md w-full"></div>
                <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded-md w-11/12"></div>
                <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded-md w-5/6"></div>
                <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded-md w-full"></div>
              </div>
              <div className="h-28 bg-slate-50 dark:bg-slate-700/40 rounded-xl w-full border border-slate-100 dark:border-slate-700"></div>
            </div>
          ) : error ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <AlertTriangle className="w-12 h-12 text-amber-500 mb-3" />
              <h3 className="font-bold text-slate-800 dark:text-white mb-1.5">No se pudo cargar el contenido</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-4">
                Hubo un inconveniente al comunicarse con la API de Capacity AR.
              </p>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-[var(--cy-primary)] text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Reintentar conexión
              </button>
            </div>
          ) : currentUnit ? (
            <div className="flex-1 flex flex-col">
              {/* Unit Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4 mb-6">
                <div className="flex items-center gap-2 text-[var(--cy-primary)] dark:text-indigo-400">
                  <BrainCircuit className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Generado por IA</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-semibold">
                  <Clock className="w-4 h-4" />
                  <span>{currentUnit.estimated_minutes} min de lectura</span>
                </div>
              </div>

              {/* Unit Title */}
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-5 tracking-tight">
                {currentUnit.title}
              </h1>

              {/* Unit Body Content */}
              <div className="flex-1 text-slate-700 dark:text-slate-300 text-left">
                {parseMarkdown(currentUnit.content)}
              </div>

              {/* Embedded Resources / Recommendations (if present) */}
              {currentUnit.resources && currentUnit.resources.length > 0 && (
                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
                  <h4 className="font-bold text-sm text-slate-800 dark:text-white mb-3 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-emerald-500" /> Recursos recomendados por IA:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentUnit.resources.map((res, rIdx) => (
                      <a
                        key={rIdx}
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl border border-slate-200/50 dark:border-slate-700 flex flex-col justify-between transition-all group"
                      >
                        <div>
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1">
                            {res.type === "video" ? "🎥 Video" : "📖 Guía"}
                          </span>
                          <span className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-[var(--cy-primary)] transition-colors block leading-tight">
                            {res.title}
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500">
              <BrainCircuit className="w-12 h-12 text-slate-300 mb-3" />
              <p className="text-sm">No hay contenido disponible para este paso.</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="flex-1 py-3.5 px-6 bg-white border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
            <HelpCircle className="w-5 h-5 text-slate-400" /> Necesito ayuda
          </button>
          <button
            onClick={handleNext}
            className="flex-[2] w-full py-3.5 px-6 bg-[var(--cy-primary)] hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            {currentUnitIndex === totalUnits - 1 ? "Ir a la evaluación" : "Entendido, continuar"} <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 md:left-[240px] bg-white border-t border-slate-200 py-4 px-6 md:px-8 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={handlePrev}
            className="py-2.5 px-4 bg-white border border-slate-200 text-slate-500 font-medium rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> {currentUnitIndex === 0 ? "Volver al plan" : "Anterior"}
          </button>

          <div className="hidden sm:block text-sm font-bold text-slate-800">
            Paso {currentUnitIndex + 1} de {totalUnits}
          </div>

          <Link href="/canal-tutor">
            <button className="py-2.5 px-4 bg-amber-50 border border-amber-200 text-amber-600 font-semibold rounded-lg hover:bg-amber-100 transition-colors flex items-center gap-2 text-sm">
              Consultar con mi tutora <MessageSquare className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}

