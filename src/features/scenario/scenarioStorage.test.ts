import { beforeEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_SCENARIO_INPUTS } from "./scenarioDefaults";
import {
  clearAllScenarios,
  exportAllScenarios,
  importScenarios,
  listScenarios,
  saveScenario,
} from "./scenarioStorage";
import { getInitialsFromDisplayName } from "../../context/UserProfileContext";

function createLocalStorageMock(): Storage {
  const store = new Map<string, string>();

  return {
    get length() {
      return store.size;
    },
    clear() {
      store.clear();
    },
    getItem(key: string) {
      return store.get(key) ?? null;
    },
    key(index: number) {
      return Array.from(store.keys())[index] ?? null;
    },
    removeItem(key: string) {
      store.delete(key);
    },
    setItem(key: string, value: string) {
      store.set(key, value);
    },
  };
}

describe("getInitialsFromDisplayName", () => {
  it("returns U for empty names", () => {
    expect(getInitialsFromDisplayName("")).toBe("U");
    expect(getInitialsFromDisplayName("   ")).toBe("U");
  });

  it("returns first two letters for a single word", () => {
    expect(getInitialsFromDisplayName("Alex")).toBe("AL");
  });

  it("returns first letters for multiple words", () => {
    expect(getInitialsFromDisplayName("Alex Morgan")).toBe("AM");
  });
});

describe("scenarioStorage export/import", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", createLocalStorageMock());
    clearAllScenarios();
  });

  it("exports and imports saved scenarios", () => {
    saveScenario("Base", DEFAULT_SCENARIO_INPUTS);
    saveScenario("Conservative", {
      ...DEFAULT_SCENARIO_INPUTS,
      homePrice: 450000,
    });

    const exported = exportAllScenarios();
    clearAllScenarios();

    expect(listScenarios()).toEqual([]);

    const result = importScenarios(exported, { merge: true });
    expect(result).toEqual({ imported: 2, skipped: 0 });
    expect(listScenarios().sort()).toEqual(["Base", "Conservative"]);
  });

  it("skips existing scenarios when merge is false", () => {
    saveScenario("Base", DEFAULT_SCENARIO_INPUTS);

    const exported = exportAllScenarios();
    exported.scenarios.push({
      name: "Imported",
      inputs: DEFAULT_SCENARIO_INPUTS,
      savedAt: new Date().toISOString(),
    });

    const result = importScenarios(exported, { merge: false });
    expect(result).toEqual({ imported: 1, skipped: 1 });
    expect(listScenarios()).toEqual(["Base", "Imported"]);
  });

  it("clears all saved scenarios", () => {
    saveScenario("Base", DEFAULT_SCENARIO_INPUTS);
    clearAllScenarios();
    expect(listScenarios()).toEqual([]);
  });
});
