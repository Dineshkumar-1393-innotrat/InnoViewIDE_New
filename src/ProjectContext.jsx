import { createContext, useContext, useState, useEffect } from "react";
import { getUserInfo } from "./utilities";

const hasLocalStorage = () =>
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const ProjectContext = createContext();

export function ProjectProvider({ children }) {
  // Load user info from localStorage
  const [user, setUser] = useState(getUserInfo);

  // Load project details from localStorage
  const [activeProjectId, setActiveProjectId] = useState(() => {
    if (!hasLocalStorage()) {
      return null;
    }
    return localStorage.getItem("activeProjectId") || null;
  });
  const [activeProjectName, setActiveProjectName] = useState(() => {
    if (!hasLocalStorage()) {
      return null;
    }
    return localStorage.getItem("activeProjectName") || null;
  });

  // Load product details from localStorage
  const [activeProductId, setActiveProductId] = useState(() => {
    if (!hasLocalStorage()) {
      return null;
    }
    return localStorage.getItem("activeProductId") || null;
  });
  const [activeProductName, setActiveProductName] = useState(() => {
    if (!hasLocalStorage()) {
      return null;
    }
    return localStorage.getItem("activeProductName") || null;
  });

  // Update localStorage when activeProjectId changes
  useEffect(() => {
    if (!hasLocalStorage()) {
      return;
    }
    if (activeProjectId) {
      localStorage.setItem("activeProjectId", activeProjectId);
    } else {
      localStorage.removeItem("activeProjectId");
    }
  }, [activeProjectId]);

  // Update localStorage when activeProjectName changes
  useEffect(() => {
    if (!hasLocalStorage()) {
      return;
    }
    if (activeProjectName) {
      localStorage.setItem("activeProjectName", activeProjectName);
    } else {
      localStorage.removeItem("activeProjectName");
    }
  }, [activeProjectName]);

  // Update localStorage when activeProductId changes
  useEffect(() => {
    if (!hasLocalStorage()) {
      return;
    }
    if (activeProductId) {
      localStorage.setItem("activeProductId", activeProductId);
    } else {
      localStorage.removeItem("activeProductId");
    }
  }, [activeProductId]);

  // Update localStorage when activeProductName changes
  useEffect(() => {
    if (!hasLocalStorage()) {
      return;
    }
    if (activeProductName) {
      localStorage.setItem("activeProductName", activeProductName);
    } else {
      localStorage.removeItem("activeProductName");
    }
  }, [activeProductName]);

  useEffect(() => {
    console.log("Updated Project:", activeProjectId, activeProjectName);
  }, [activeProjectId, activeProjectName]);

  return (
    <ProjectContext.Provider
      value={{
        user,
        setUser,
        activeProjectId,
        setActiveProjectId,
        activeProjectName,
        setActiveProjectName,
        activeProductId,
        setActiveProductId,
        activeProductName,
        setActiveProductName,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  return useContext(ProjectContext);
}

