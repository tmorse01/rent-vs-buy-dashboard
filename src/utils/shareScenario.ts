import type { ScenarioInputs } from "../features/scenario/ScenarioInputs";
import { mergeScenarioInputs } from "../features/scenario/scenarioDefaults";

/** Query key for the dashboard saved-scenario name (localStorage snapshot). */
export const SAVED_SCENARIO_QUERY_KEY = "saved";
export const COMPARED_SCENARIOS_QUERY_KEY = "compare";

/**
 * Encode scenario inputs into a URL-safe string
 */
export function encodeScenario(inputs: ScenarioInputs): string {
  const json = JSON.stringify(inputs);
  // Use base64 encoding for URL safety
  return btoa(json).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

/**
 * Decode scenario inputs from a URL-safe string
 */
export function decodeScenario(encoded: string): ScenarioInputs | null {
  try {
    // Restore base64 padding and characters
    let base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    // Add padding if needed
    while (base64.length % 4) {
      base64 += "=";
    }
    const json = atob(base64);
    return mergeScenarioInputs(JSON.parse(json) as Partial<ScenarioInputs>);
  } catch (error) {
    console.error("Error decoding scenario:", error);
    return null;
  }
}

/**
 * Generate a shareable URL with scenario data
 */
export function generateShareUrl(inputs: ScenarioInputs): string {
  const encoded = encodeScenario(inputs);
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}?scenario=${encoded}`;
}

/**
 * Extract scenario from URL parameters
 */
export function getScenarioFromUrl(): ScenarioInputs | null {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get("scenario");
  if (!encoded) {
    return null;
  }
  return decodeScenario(encoded);
}
