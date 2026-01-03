import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { ScenarioInputs } from "../features/scenario/ScenarioInputs";
import { getScenarioFromUrl } from "../utils/shareScenario";

interface ScenarioContextType {
  inputs: ScenarioInputs;
  setInputs: (inputs: ScenarioInputs) => void;
}

const ScenarioContext = createContext<ScenarioContextType | undefined>(
  undefined
);

const defaultInputs: ScenarioInputs = {
  homePrice: 500000,
  downPaymentPercent: 20,
  interestRate: 6.5,
  loanTermYears: 30,
  propertyTaxRate: 1.2,
  insuranceMonthly: 150,
  maintenanceRate: 1,
  sellingCostRate: 8,
  closingCostRate: 3,
  currentRent: 2500,
  rentGrowthRate: 3,
  annualReturnRate: 6,
  annualAppreciationRate: 3,
  horizonYears: 15,
  pmiEnabled: true,
  pmiRate: 0.5,
  extraPrincipalPayment: 0,
};

export function ScenarioProvider({ children }: { children: ReactNode }) {
  // Check for scenario in URL on mount
  const [inputs, setInputs] = useState<ScenarioInputs>(() => {
    const urlScenario = getScenarioFromUrl();
    if (urlScenario) {
      return urlScenario;
    }
    return defaultInputs;
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
