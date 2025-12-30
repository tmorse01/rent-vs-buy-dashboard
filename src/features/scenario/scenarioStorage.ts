import type { ScenarioInputs } from './ScenarioInputs';

const STORAGE_KEY_PREFIX = 'rent-vs-buy-scenario-';
const SCENARIO_LIST_KEY = 'rent-vs-buy-scenario-list';

export interface SavedScenario {
  name: string;
  inputs: ScenarioInputs;
  savedAt: string;
}

/**
 * Save a scenario to localStorage
 */
export function saveScenario(name: string, inputs: ScenarioInputs): void {
  const scenario: SavedScenario = {
    name,
    inputs,
    savedAt: new Date().toISOString(),
  };
  
  const key = `${STORAGE_KEY_PREFIX}${name}`;
  localStorage.setItem(key, JSON.stringify(scenario));
  
  // Update scenario list
  const list = listScenarios();
  if (!list.includes(name)) {
    list.push(name);
    localStorage.setItem(SCENARIO_LIST_KEY, JSON.stringify(list));
  }
}

/**
 * Load a scenario from localStorage
 */
export function loadScenario(name: string): ScenarioInputs | null {
  const key = `${STORAGE_KEY_PREFIX}${name}`;
  const data = localStorage.getItem(key);
  
  if (!data) {
    return null;
  }
  
  try {
    const scenario: SavedScenario = JSON.parse(data);
    return scenario.inputs;
  } catch (error) {
    console.error('Error loading scenario:', error);
    return null;
  }
}

/**
 * List all saved scenario names
 */
export function listScenarios(): string[] {
  const data = localStorage.getItem(SCENARIO_LIST_KEY);
  if (!data) {
    return [];
  }
  
  try {
    return JSON.parse(data) as string[];
  } catch (error) {
    console.error('Error listing scenarios:', error);
    return [];
  }
}

/**
 * Delete a scenario from localStorage
 */
export function deleteScenario(name: string): void {
  const key = `${STORAGE_KEY_PREFIX}${name}`;
  localStorage.removeItem(key);
  
  // Update scenario list
  const list = listScenarios().filter((n) => n !== name);
  localStorage.setItem(SCENARIO_LIST_KEY, JSON.stringify(list));
}

/**
 * Get saved scenario metadata
 */
export function getScenarioMetadata(name: string): SavedScenario | null {
  const key = `${STORAGE_KEY_PREFIX}${name}`;
  const data = localStorage.getItem(key);
  
  if (!data) {
    return null;
  }
  
  try {
    return JSON.parse(data) as SavedScenario;
  } catch (error) {
    console.error('Error loading scenario metadata:', error);
    return null;
  }
}

