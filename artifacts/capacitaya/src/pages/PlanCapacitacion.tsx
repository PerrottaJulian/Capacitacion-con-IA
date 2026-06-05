import React, { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Check, Lock, Star, Clock, FileText, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";

export function PlanCapacitacion() {
  const { learningPath } = useAuth();
  const [selectedIdx, setSelectedIdx] = useState(0);

  const modules = learningPath?.modules || [];
  const totalMinutes = modules.reduce((acc, m) => 
    acc + m.units.reduce((uAcc, u) => uAcc + u.estimated_minutes, 0)
  , 0);
  const totalHours = Math.round((totalMinutes / 60) * 10) / 10;
  const progressValue = learningPath?.readiness_score_initial ?? 47;

  const currentModule = modules[selectedIdx] || null;
  const currentModuleHours = currentModule 
    ? Math.round((currentModule.units.reduce((acc, u) => acc + u.estimated_minutes, 0) / 60) * 10) / 10
    : 0;

  return (
    <AppLayout activePage="Mi Plan">
      <div className="space-y-6">
        {/* Top Header */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
            <div>
              <h2 className="text-xl font-bold">Tu ruta de aprendizaje</h2>
              <p className="text-[#64748B] dark:text-slate-400">
                Tiempo total estimado: {totalHours} horas · {modules.length} módulos
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block bg-indigo-50 dark:bg-indigo-950/50 text-[var(--cy-primary)] font-bold px-3 py-1 rounded-lg text-sm mb-2">
                {progressValue}% completado
              </span>
            </div>
          </div>
          <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-[var(--cy-primary)] rounded-full transition-all duration-1000" style={{ width: `${progressValue}%` }}></div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Columna Izquierda: Lista de módulos */}
          <div className="w-full lg:w-[40%] bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-lg">Módulos</h3>
              <div className="flex items-center gap-1 text-sm font-semibold text-[#F59E0B] bg-amber-50 dark:bg-amber-950/20 px-2.5 py-1 rounded-md">
                <Star className="w-4 h-4 fill-current" /> 520 XP ganados
              </div>
            </div>

            <div className="space-y-4">
              {modules.map((m, idx) => {
                const isSelected = selectedIdx === idx;
                const isCompleted = idx < selectedIdx; // Just a simple progression mock
                const mHours = Math.round((m.units.reduce((acc, u) => acc + u.estimated_minutes, 0) / 60) * 10) / 10;

                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedIdx(idx)}
                    className={`flex gap-4 items-start relative p-3 rounded-xl cursor-pointer transition-all border ${
                      isSelected
                        ? "bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-100 dark:border-indigo-900"
                        : "border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    {idx < modules.length - 1 && (
                      <div className={`absolute left-7 top-10 bottom-[-16px] w-0.5 ${
                        isCompleted ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-800"
                      }`}></div>
                    )}
                    
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 mt-1 ${
                      isCompleted 
                        ? "bg-[#10B981] text-white" 
                        : isSelected 
                          ? "bg-[var(--cy-primary)] text-white shadow-md ring-4 ring-indigo-50 dark:ring-indigo-950" 
                          : "bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-400"
                    }`}>
                      {isCompleted ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <span className="text-xs font-bold">{idx + 1}</span>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className={`font-bold ${
                          isCompleted 
                            ? "text-slate-500 line-through decoration-slate-400" 
                            : isSelected 
                              ? "text-[var(--cy-primary)]" 
                              : "text-slate-700 dark:text-slate-300"
                        }`}>
                          Módulo {idx + 1}: {m.skill_name}
                        </h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase flex-shrink-0 ${
                          isCompleted
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : isSelected
                              ? "bg-indigo-100 text-[var(--cy-primary)] dark:bg-indigo-950 dark:text-indigo-300"
                              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                        }`}>
                          {isCompleted ? "Completado" : isSelected ? "En Progreso" : "Pendiente"}
                        </span>
                      </div>
                      <p className={`text-sm flex items-center gap-1 mt-1 ${
                        isSelected ? "text-[var(--cy-primary)] opacity-80" : "text-slate-500"
                      }`}>
                        <Clock className="w-3 h-3" /> {mHours}h
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Columna Derecha: Detalle del módulo seleccionado */}
          <div className="w-full lg:w-[60%]">
            {currentModule ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden sticky top-6">
                <div className="h-32 bg-indigo-50 dark:bg-indigo-950/20 relative overflow-hidden flex items-center justify-center">
                  <FileText className="w-16 h-16 text-indigo-200 dark:text-indigo-900 absolute -right-4 -bottom-4 transform rotate-12" />
                  <div className="w-16 h-16 bg-[var(--cy-primary)] rounded-2xl flex items-center justify-center shadow-lg transform -translate-y-4">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                </div>

                <div className="p-8 relative -mt-10 bg-white dark:bg-slate-900 rounded-t-3xl">
                  <div className="inline-block bg-indigo-100 dark:bg-indigo-950 text-[var(--cy-primary)] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
                    Detalle del Módulo
                  </div>
                  <h2 className="text-2xl font-bold mb-4">{currentModule.skill_name}</h2>

                  <p className="text-[#64748B] dark:text-slate-400 text-lg leading-relaxed mb-8">
                    Desarrolla competencias específicas en {currentModule.skill_name.toLowerCase()}. Este módulo incluye contenido guiado, explicaciones conceptuales y evaluaciones de práctica interactiva.
                  </p>

                  <div className="mb-8">
                    <h4 className="text-sm font-semibold text-[#1E293B] dark:text-slate-200 mb-3">Unidades de aprendizaje:</h4>
                    <div className="space-y-2">
                      {currentModule.units.map((unit, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl">
                          <div className="w-6 h-6 rounded-md bg-indigo-100 dark:bg-indigo-950 text-[var(--cy-primary)] flex items-center justify-center text-xs font-bold uppercase">
                            {unit.phase[0]}
                          </div>
                          <div className="flex-1">
                            <span className="font-semibold text-sm block">{unit.title}</span>
                            <span className="text-xs text-slate-500">{unit.estimated_minutes} min · fase {unit.phase}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-6 mb-8 text-[#64748B] dark:text-slate-400">
                    <div className="flex items-center gap-2 font-medium">
                      <Clock className="w-5 h-5" /> {currentModuleHours} horas
                    </div>
                    <div className="flex items-center gap-2 font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div> {currentModule.units.length} unidades
                    </div>
                  </div>

                  <Link href="/modulo">
                    <button className="w-full flex items-center justify-center gap-2 bg-[var(--cy-primary)] hover:bg-indigo-700 text-white py-4 rounded-xl font-bold text-lg transition-colors shadow-sm">
                      Iniciar o continuar capacitación <ArrowRight className="w-6 h-6" />
                    </button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-400">
                Selecciona un módulo de la lista para ver el detalle.
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
