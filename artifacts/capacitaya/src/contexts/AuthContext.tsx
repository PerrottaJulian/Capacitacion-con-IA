import React, { createContext, useContext, useState, useEffect } from "react";
import { getStudentLearningPaths, StoredLearningPath } from "@/lib/api";

interface AuthContextType {
  email: string | null;
  studentName: string | null;
  companyName: string | null;
  targetRole: string | null;
  learningPath: StoredLearningPath | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [email, setEmail] = useState<string | null>(() => localStorage.getItem("cy_email"));
  const [studentName, setStudentName] = useState<string | null>(() => localStorage.getItem("cy_student_name"));
  const [companyName, setCompanyName] = useState<string | null>(() => localStorage.getItem("cy_company_name"));
  const [targetRole, setTargetRole] = useState<string | null>(() => localStorage.getItem("cy_target_role"));
  const [learningPath, setLearningPath] = useState<StoredLearningPath | null>(() => {
    const saved = localStorage.getItem("cy_learning_path");
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = async (inputEmail: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const paths = await getStudentLearningPaths(inputEmail);
      if (paths && paths.length > 0) {
        const path = paths[0];
        setEmail(inputEmail);
        setStudentName(path.student_name);
        setCompanyName(path.company_name);
        setTargetRole(path.target_role_title);
        setLearningPath(path);

        localStorage.setItem("cy_email", inputEmail);
        localStorage.setItem("cy_student_name", path.student_name);
        localStorage.setItem("cy_company_name", path.company_name);
        localStorage.setItem("cy_target_role", path.target_role_title);
        localStorage.setItem("cy_learning_path", JSON.stringify(path));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setEmail(null);
    setStudentName(null);
    setCompanyName(null);
    setTargetRole(null);
    setLearningPath(null);
    localStorage.removeItem("cy_email");
    localStorage.removeItem("cy_student_name");
    localStorage.removeItem("cy_company_name");
    localStorage.removeItem("cy_target_role");
    localStorage.removeItem("cy_learning_path");
  };

  return (
    <AuthContext.Provider
      value={{
        email,
        studentName,
        companyName,
        targetRole,
        learningPath,
        isAuthenticated: !!email,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
