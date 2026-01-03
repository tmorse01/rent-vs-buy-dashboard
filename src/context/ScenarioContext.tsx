import { createContext, useContext, useState, ReactNode } from "react";
import type { ScenarioInputs } from "../features/scenario/ScenarioInputs";

interface ScenarioContextType {
  inputs: ScenarioInputs;
  setInputs: (inputs: ScenarioInputs) => void;
}

const ScenarioContext = createContext<ScenarioContextType | undefined>(
  undefined
);

export function ScenarioProvider({ children }: { children: ReactNode }) {
  const [inputs, setInputs] = useState<ScenarioInputs>({
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
  });

  return (
    <ScenarioContext.Provider value={{ inputs, setInputs }}>
      {children}
    </ScenarioContext.Provider>
  );
}

export function useScenario() {
  const context = useContext(ScenarioContext);
  if (context === undefined) {
    throw new Error("useScenario must be used within a ScenarioProvider");
  }
  return context;
}
