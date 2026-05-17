import type { ScenarioInputs } from './ScenarioInputs';
import { mergeScenarioInputs } from './scenarioDefaults';

const STORAGE_KEY_PREFIX = 'rent-vs-buy-scenario-';
const SCENARIO_LIST_KEY = 'rent-vs-buy-scenario-list';
const ACTIVE_SAVED_SCENARIO_KEY = 'rent-vs-buy-active-saved-scenario';

/** Last scenario chosen in the dashboard Scenario dropdown (survives tab navigation). */
export function getActiveSavedScenarioName(): string | null {
  return localStorage.getItem(ACTIVE_SAVED_SCENARIO_KEY);
}

export function setActiveSavedScenarioName(name: string | null): void {
  if (name) {
    localStorage.setItem(ACTIVE_SAVED_SCENARIO_KEY, name);
  } else {
    localStorage.removeItem(ACTIVE_SAVED_SCENARIO_KEY);
  }
}

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
    return mergeScenarioInputs(scenario.inputs);
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

  if (getActiveSavedScenarioName() === name) {
    setActiveSavedScenarioName(null);
  }

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

