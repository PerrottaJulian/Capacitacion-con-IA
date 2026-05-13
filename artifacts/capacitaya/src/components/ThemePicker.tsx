import React, { useState, useRef, useEffect } from "react";
import { Palette, Sun, Moon } from "lucide-react";
import { useTheme, COLOR_SCHEMES } from "@/contexts/ThemeContext";

export function ThemePicker() {
  const { mode, color, setMode, setColor } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-9 h-9 rounded-xl flex items-center justify-center text-[#64748B] hover:text-[#1E293B] dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        title="Personalizar apariencia"
      >
        <Palette className="w-5 h-5" />
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-4 z-50">
          {/* Header */}
          <p className="text-xs font-bold text-[#64748B] dark:text-slate-400 uppercase tracking-wider mb-4">
            Personalizar apariencia
          </p>

          {/* Modo */}
          <div className="mb-5">
            <p className="text-sm font-semibold text-[#1E293B] dark:text-slate-100 mb-2.5">Modo</p>
            <div className="flex gap-2">
              <button
                onClick={() => setMode("light")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                  mode === "light"
                    ? "border-[--theme-primary] bg-[--theme-accent] text-[--theme-primary]"
                    : "border-slate-200 dark:border-slate-600 text-[#64748B] dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                }`}
              >
                <Sun className="w-4 h-4" /> Claro
              </button>
              <button
                onClick={() => setMode("dark")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                  mode === "dark"
                    ? "border-[--theme-primary] bg-[--theme-accent] text-[--theme-primary]"
                    : "border-slate-200 dark:border-slate-600 text-[#64748B] dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                }`}
              >
                <Moon className="w-4 h-4" /> Oscuro
              </button>
            </div>
          </div>

          {/* Color */}
          <div>
            <p className="text-sm font-semibold text-[#1E293B] dark:text-slate-100 mb-2.5">Color principal</p>
            <div className="flex gap-2 flex-wrap">
              {COLOR_SCHEMES.map((scheme) => (
                <button
                  key={scheme.id}
                  onClick={() => setColor(scheme.id)}
                  title={scheme.label}
                  className={`w-10 h-10 rounded-xl transition-all ${
                    color === scheme.id
                      ? "ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-800 scale-110"
                      : "hover:scale-105 opacity-80 hover:opacity-100"
                  }`}
                  style={{
                    backgroundColor: scheme.hex,
                    ringColor: scheme.hex,
                    outlineColor: color === scheme.id ? scheme.hex : "transparent",
                    outline: color === scheme.id ? `2px solid ${scheme.hex}` : "none",
                    outlineOffset: "3px",
                  }}
                />
              ))}
            </div>
            <div className="mt-2 flex gap-2 flex-wrap">
              {COLOR_SCHEMES.map((scheme) => (
                <div key={scheme.id} className="w-10 text-center">
                  <span className={`text-[10px] font-medium ${color === scheme.id ? "text-[#1E293B] dark:text-slate-100" : "text-[#94A3B8] dark:text-slate-500"}`}>
                    {scheme.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
