import { Switch, Route, Redirect, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import NotFound from "@/pages/not-found";
import { Dashboard } from "@/pages/Dashboard";
import { PlanCapacitacion } from "@/pages/PlanCapacitacion";
import { ModuloIA } from "@/pages/ModuloIA";
import { Evaluacion } from "@/pages/Evaluacion";
import { ProgresoyLogros } from "@/pages/ProgresoyLogros";
import { CanalTutor } from "@/pages/CanalTutor";
import { PanelTutor } from "@/pages/PanelTutor";
import { DetalleCandidato } from "@/pages/DetalleCandidato";
import { Login } from "@/pages/Login";

const queryClient = new QueryClient();

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Component /> : <Redirect to="/login" />;
}

function Router() {
  const { isAuthenticated } = useAuth();
  return (
    <Switch>
      <Route path="/login">
        {isAuthenticated ? <Redirect to="/" /> : <Login />}
      </Route>
      <Route path="/">
        {() => <ProtectedRoute component={Dashboard} />}
      </Route>
      <Route path="/plan">
        {() => <ProtectedRoute component={PlanCapacitacion} />}
      </Route>
      <Route path="/modulo">
        {() => <ProtectedRoute component={ModuloIA} />}
      </Route>
      <Route path="/evaluacion">
        {() => <ProtectedRoute component={Evaluacion} />}
      </Route>
      <Route path="/progreso">
        {() => <ProtectedRoute component={ProgresoyLogros} />}
      </Route>
      <Route path="/canal-tutor">
        {() => <ProtectedRoute component={CanalTutor} />}
      </Route>
      <Route path="/panel-tutor">
        {() => <ProtectedRoute component={PanelTutor} />}
      </Route>
      <Route path="/detalle-candidato">
        {() => <ProtectedRoute component={DetalleCandidato} />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
