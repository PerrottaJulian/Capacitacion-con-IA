import React, { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, GraduationCap, ArrowRight, Sparkles } from "lucide-react";

export function Login() {
  const [emailInput, setEmailInput] = useState("");
  const { login, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      toast({
        variant: "destructive",
        title: "Correo requerido",
        description: "Por favor, ingresa tu correo electrónico para continuar.",
      });
      return;
    }

    const success = await login(emailInput.trim());
    if (success) {
      toast({
        title: "¡Bienvenido de nuevo!",
        description: "Has iniciado sesión exitosamente.",
      });
      setLocation("/");
    } else {
      toast({
        variant: "destructive",
        title: "Error al iniciar sesión",
        description: "No se pudo encontrar una ruta de aprendizaje para este correo electrónico. Intenta con lucia@example.com",
      });
    }
  };

  const handleQuickLogin = async (demoEmail: string) => {
    setEmailInput(demoEmail);
    const success = await login(demoEmail);
    if (success) {
      toast({
        title: "Sesión iniciada",
        description: `Ingresaste con la cuenta de prueba: ${demoEmail}`,
      });
      setLocation("/");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-4 relative overflow-hidden">
      {/* Background decoration elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px]" />

      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-4 animate-pulse">
            <GraduationCap className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Capacit<span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">AR</span>
          </h1>
          <p className="text-slate-400 mt-2 text-sm text-center">
            Plataforma de capacitación inteligente basada en brechas de habilidades
          </p>
        </div>

        <Card className="border-slate-800 bg-slate-950/80 backdrop-blur-xl shadow-2xl text-slate-100">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl font-bold text-center text-white">Ingresar a tu cuenta</CardTitle>
            <CardDescription className="text-slate-400 text-center text-xs">
              Ingresa tu correo para cargar tu plan de capacitación personalizado
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300 text-sm">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nombre@empresa.com"
                  className="bg-slate-900 border-slate-800 text-slate-100 placeholder-slate-500 focus-visible:ring-indigo-500"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Ingresar <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </form>
          <CardFooter className="flex flex-col space-y-4 border-t border-slate-900 pt-6">
            <div className="w-full">
              <p className="text-xs text-slate-500 mb-3 text-center uppercase tracking-wider font-semibold">
                Acceso Rápido (Prueba)
              </p>
              <button
                type="button"
                onClick={() => handleQuickLogin("lucia@example.com")}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700/80 transition-all text-left text-xs group"
                disabled={isLoading}
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-semibold block text-slate-300 group-hover:text-white">Lucía Ramírez</span>
                    <span className="text-[10px] text-slate-500">lucia@example.com</span>
                  </div>
                </div>
                <span className="text-indigo-400 font-semibold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                  Entrar
                </span>
              </button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
