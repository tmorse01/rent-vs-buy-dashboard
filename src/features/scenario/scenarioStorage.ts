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

export interface ScenarioExportPayload {
  version: 1;
  exportedAt: string;
  scenarios: SavedScenario[];
}

export function exportAllScenarios(): ScenarioExportPayload {
  const scenarios = listScenarios()
    .map((name) => getScenarioMetadata(name))
    .filter((scenario): scenario is SavedScenario => scenario !== null);

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    scenarios,
  };
}

function isSavedScenario(value: unknown): value is SavedScenario {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Partial<SavedScenario>;
  return (
    typeof candidate.name === 'string' &&
    typeof candidate.savedAt === 'string' &&
    typeof candidate.inputs === 'object' &&
    candidate.inputs !== null
  );
}

function isScenarioExportPayload(value: unknown): value is ScenarioExportPayload {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Partial<ScenarioExportPayload>;
  return (
    candidate.version === 1 &&
    typeof candidate.exportedAt === 'string' &&
    Array.isArray(candidate.scenarios) &&
    candidate.scenarios.every(isSavedScenario)
  );
}

export interface ImportScenariosOptions {
  merge?: boolean;
}

export interface ImportScenariosResult {
  imported: number;
  skipped: number;
}

export function importScenarios(
  json: unknown,
  options: ImportScenariosOptions = {},
): ImportScenariosResult {
  if (!isScenarioExportPayload(json)) {
    throw new Error('Invalid scenario export file.');
  }

  const merge = options.merge ?? false;
  let imported = 0;
  let skipped = 0;

  for (const scenario of json.scenarios) {
    const existingNames = listScenarios();
    if (existingNames.includes(scenario.name) && !merge) {
      skipped += 1;
      continue;
    }

    saveScenario(scenario.name, mergeScenarioInputs(scenario.inputs));
    imported += 1;
  }

  return { imported, skipped };
}

export function clearAllScenarios(): void {
  for (const name of listScenarios()) {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}${name}`);
  }

  localStorage.removeItem(SCENARIO_LIST_KEY);
  setActiveSavedScenarioName(null);
}

