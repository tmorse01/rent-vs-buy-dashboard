import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { ScenarioInputs } from "../features/scenario/ScenarioInputs";
import { DEFAULT_SCENARIO_INPUTS } from "../features/scenario/scenarioDefaults";
import { getScenarioFromUrl } from "../utils/shareScenario";

interface ScenarioContextType {
  inputs: ScenarioInputs;
  setInputs: (inputs: ScenarioInputs) => void;
}

const ScenarioContext = createContext<ScenarioContextType | undefined>(
  undefined
);

export function ScenarioProvider({ children }: { children: ReactNode }) {
  // Check for scenario in URL on mount
  const [inputs, setInputs] = useState<ScenarioInputs>(() => {
    const urlScenario = getScenarioFromUrl();
    if (urlScenario) {
      return urlScenario;
    }
    return DEFAULT_SCENARIO_INPUTS;
  });

  // Update inputs when URL changes (e.g., user navigates with back/forward)
  useEffect(() => {
    const handlePopState = () => {
      const urlScenario = getScenarioFromUrl();
      if (urlScenario) {
        setInputs(urlScenario);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return (
    <ScenarioContext.Provider value={{ inputs, setInputs }}>
      {children}
    </ScenarioContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useScenario() {
  const context = useContext(ScenarioContext);
  if (context === undefined) {
    throw new Error("useScenario must be used within a ScenarioProvider");
  }
  return context;
}
