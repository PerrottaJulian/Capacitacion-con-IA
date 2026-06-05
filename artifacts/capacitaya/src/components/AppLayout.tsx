import React from "react";
import { Link, useLocation } from "wouter";
import { Bell, Home, BookOpen, GraduationCap, LineChart, MessageSquare, Users, AlertCircle, FileText, LogOut } from "lucide-react";
import { ThemePicker } from "@/components/ThemePicker";
import { useAuth } from "@/contexts/AuthContext";

interface AppLayoutProps {
  children: React.ReactNode;
  activePage: string;
  userRole?: "candidato" | "tutor";
  userName?: string;
}

export function AppLayout({ children, activePage, userRole = "candidato", userName: propUserName }: AppLayoutProps) {
  const { studentName, logout } = useAuth();
  const [, setLocation] = useLocation();
  const isCandidato = userRole === "candidato";
  const displayUserName = studentName || propUserName || "Estudiante";

  const candidatoLinks = [
    { name: "Inicio", path: "/", icon: Home },
    { name: "Mi Plan", path: "/plan", icon: BookOpen },
    { name: "Capacitación", path: "/modulo", icon: GraduationCap },
    { name: "Progreso", path: "/progreso", icon: LineChart },
    { name: "Mi Tutor", path: "/canal-tutor", icon: MessageSquare },
  ];

  const tutorLinks = [
    { name: "Mis Candidatos", path: "/panel-tutor", icon: Users },
    { name: "Alertas", path: "/panel-tutor", icon: AlertCircle },
    { name: "Reportes", path: "/panel-tutor", icon: FileText },
  ];

  const links = isCandidato ? candidatoLinks : tutorLinks;

  const initials = displayUserName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    logout();
    setLocation("/login");
  };

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] dark:bg-slate-900 overflow-hidden text-[#1E293B] dark:text-slate-100 font-sans">
      {/* Sidebar */}
      <aside className="w-[240px] flex-shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 flex flex-col justify-between shadow-sm z-10">
        <div>
          <div className="p-6">
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--cy-primary)" }}>CapacitaYa</h1>
          </div>
          <nav className="px-4 space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = activePage === link.name;
              return (
                <Link key={link.name} href={link.path}>
                  <div
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                      isActive
                        ? "dark:bg-slate-800"
                        : "text-[#64748B] dark:text-slate-400 hover:text-[#1E293B] dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                    style={isActive ? {
                      backgroundColor: "var(--cy-light-bg)",
                      color: "var(--cy-primary)",
                    } : {}}
                  >
                    <Icon className="w-5 h-5" />
                    {link.name}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {isCandidato && (
          <div className="p-4 mt-auto">
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
              <div className="text-xs font-semibold text-[#64748B] dark:text-slate-400 mb-3 uppercase tracking-wider">Tu Tutora</div>
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: "var(--cy-light-bg)", color: "var(--cy-primary)" }}>
                    AG
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#10B981] border-2 border-white dark:border-slate-800 rounded-full"></div>
                </div>
                <div>
                  <div className="font-semibold text-sm text-[#1E293B] dark:text-slate-100">Ana García</div>
                  <div className="text-xs text-[#10B981]">En línea</div>
                </div>
              </div>
              <Link href="/canal-tutor">
                <button className="w-full py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm font-medium rounded-xl text-[#1E293B] dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">
                  Enviar mensaje
                </button>
              </Link>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar */}
        <header className="h-[72px] flex-shrink-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-8 z-10">
          <h2 className="text-xl font-bold text-[#1E293B] dark:text-slate-100">{activePage}</h2>
          <div className="flex items-center gap-3">
            <ThemePicker />
            <button className="relative text-[#64748B] dark:text-slate-400 hover:text-[#1E293B] dark:hover:text-slate-100 transition-colors mr-2">
              <Bell className="w-6 h-6" />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>
            <div className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-700 pl-4">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-semibold text-[#1E293B] dark:text-slate-100">{displayUserName}</div>
                <div className="text-xs text-[#64748B] dark:text-slate-400 capitalize">{userRole}</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold">
                {initials}
              </div>
              <button
                onClick={handleLogout}
                title="Cerrar sesión"
                className="ml-2 p-2 text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
