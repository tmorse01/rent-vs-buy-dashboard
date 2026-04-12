import { useEffect, useMemo, useState, useTransition } from "react";
import { useForm } from "@mantine/form";
import {
  NumberInput,
  TextInput,
  Button,
  Stack,
  Group,
  Switch,
  Select,
  Tooltip,
  Divider,
  SegmentedControl,
  Text,
  Modal,
  Accordion,
  Badge,
  Anchor,
} from "@mantine/core";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { useDebouncedValue } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { InfoCircle } from "tabler-icons-react";
import type { ScenarioInputs } from "./ScenarioInputs";
import { saveScenario, loadScenario, listScenarios } from "./scenarioStorage";
import { useScenario } from "../../context/ScenarioContext";
import {
  getScenarioFromUrl,
  SAVED_SCENARIO_QUERY_KEY,
} from "../../utils/shareScenario";

interface ScenarioFormProps {
  onInputsChange: (inputs: ScenarioInputs) => void;
  isScenarioModalOpen: boolean;
  onScenarioModalClose: () => void;
}

const InfoTooltip = ({ label }: { label: string }) => (
  <Tooltip label={label} withArrow>
    <InfoCircle size={16} style={{ cursor: "help" }} />
  </Tooltip>
);

export function ScenarioForm({
  onInputsChange,
  isScenarioModalOpen,
  onScenarioModalClose,
}: ScenarioFormProps) {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { inputs: contextInputs, setInputs: setContextInputs } = useScenario();
  const [saveAsName, setSaveAsName] = useState("");
  const [selectedSavedScenario, setSelectedSavedScenario] = useState<
    string | null
  >(null);
  const [inputsSnapshot, setInputsSnapshot] = useState<ScenarioInputs | null>(
    null,
  );
  const [, startTransition] = useTransition();
  const [savedScenarios, setSavedScenarios] = useState<string[]>(() =>
    listScenarios(),
  );

  const form = useForm<ScenarioInputs>({
    initialValues: contextInputs,
    validate: {
      homePrice: (value) =>
        value > 0 ? null : "Home price must be greater than 0",
      downPaymentPercent: (value) =>
        value >= 0 && value <= 100
          ? null
          : "Down payment must be between 0% and 100%",
      interestRate: (value) =>
        value >= 0 && value <= 30
          ? null
          : "Interest rate must be between 0% and 30%",
      loanTermYears: (value) =>
        [15, 20, 30].includes(value)
          ? null
          : "Loan term must be 15, 20, or 30 years",
      propertyTaxRate: (value) =>
        value >= 0 ? null : "Property tax rate must be >= 0%",
      insuranceMonthly: (value) =>
        value >= 0 ? null : "Insurance must be >= 0",
      maintenanceRate: (value) =>
        value >= 0 ? null : "Maintenance rate must be >= 0%",
      sellingCostRate: (value) =>
        value >= 0 && value <= 20
          ? null
          : "Selling cost must be between 0% and 20%",
      closingCostRate: (value) =>
        value >= 0 && value <= 10
          ? null
          : "Closing cost must be between 0% and 10%",
      currentRent: (value) =>
        value > 0 ? null : "Rent must be greater than 0",
      rentGrowthRate: (value) =>
        value >= -5 && value <= 20
          ? null
          : "Rent growth must be between -5% and 20%",
      annualReturnRate: (value) =>
        value >= -10 && value <= 20
          ? null
          : "Return rate must be between -10% and 20%",
      annualAppreciationRate: (value) =>
        value >= -10 && value <= 20
          ? null
          : "Appreciation must be between -10% and 20%",
      horizonYears: (value) =>
        value >= 1 && value <= 30
          ? null
          : "Horizon must be between 1 and 30 years",
      pmiRate: (value) =>
        value >= 0 && value <= 2 ? null : "PMI rate must be between 0% and 2%",
      extraPrincipalPayment: (value) =>
        value >= 0 ? null : "Extra principal payment must be >= 0",
    },
  });

  const [debouncedInputs] = useDebouncedValue(form.values, 500);

  const savedParam = searchParams.get(SAVED_SCENARIO_QUERY_KEY);

  const syncSavedNameToUrl = (name: string | null) => {
    if (location.pathname !== "/") return;
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete("scenario");
        if (name) {
          next.set(SAVED_SCENARIO_QUERY_KEY, name);
        } else {
          next.delete(SAVED_SCENARIO_QUERY_KEY);
        }
        return next;
      },
      { replace: true },
    );
  };

  useEffect(() => {
    if (location.pathname !== "/") return;

    const hasEncodedShare = getScenarioFromUrl() !== null;
    if (hasEncodedShare) {
      if (savedParam) {
        setSearchParams(
          (prev) => {
            const next = new URLSearchParams(prev);
            next.delete(SAVED_SCENARIO_QUERY_KEY);
            return next;
          },
          { replace: true },
        );
      }
      return;
    }

    if (!savedParam) return;

    if (!savedScenarios.includes(savedParam)) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.delete(SAVED_SCENARIO_QUERY_KEY);
          return next;
        },
        { replace: true },
      );
      return;
    }

    const loaded = loadScenario(savedParam);
    if (!loaded) return;

    if (
      selectedSavedScenario === savedParam &&
      inputsSnapshot &&
      JSON.stringify(inputsSnapshot) === JSON.stringify(loaded)
    ) {
      return;
    }

    form.setValues(loaded);
    startTransition(() => {
      setContextInputs(loaded);
    });
    setSelectedSavedScenario(savedParam);
    setInputsSnapshot(loaded);
    setSaveAsName(savedParam);
  }, [
    location.pathname,
    savedParam,
    savedScenarios,
    selectedSavedScenario,
    inputsSnapshot,
    setSearchParams,
    setContextInputs,
  ]);

  useEffect(() => {
    startTransition(() => {
      setContextInputs(debouncedInputs);
      onInputsChange(debouncedInputs);
    });
  }, [debouncedInputs, onInputsChange, setContextInputs]);

  useEffect(() => {
    if (isScenarioModalOpen) {
      setSavedScenarios(listScenarios());
      setSaveAsName(selectedSavedScenario ?? "");
    }
  }, [isScenarioModalOpen, selectedSavedScenario]);

  useEffect(() => {
    if (location.pathname === "/") {
      setSavedScenarios(listScenarios());
    }
  }, [location.pathname]);

  useEffect(() => {
    if (
      selectedSavedScenario &&
      !savedScenarios.includes(selectedSavedScenario)
    ) {
      setSelectedSavedScenario(null);
      setInputsSnapshot(null);
    }
  }, [savedScenarios, selectedSavedScenario]);

  const isDirty = useMemo(() => {
    if (!inputsSnapshot) return false;
    return JSON.stringify(form.values) !== JSON.stringify(inputsSnapshot);
  }, [form.values, inputsSnapshot]);

  useEffect(() => {
    if (location.pathname !== "/") return;
    if (!isDirty) return;
    if (!savedParam) return;
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete(SAVED_SCENARIO_QUERY_KEY);
        return next;
      },
      { replace: true },
    );
  }, [isDirty, location.pathname, savedParam, setSearchParams]);

  const handleSave = () => {
    const name = saveAsName.trim();
    if (!name) {
      notifications.show({
        title: "Name your scenario",
        message:
          "Enter a name so this snapshot can be saved alongside your other scenarios.",
        color: "orange",
      });
      return;
    }
    saveScenario(name, form.values);
    const updated = listScenarios();
    setSavedScenarios(updated);
    setSelectedSavedScenario(name);
    setInputsSnapshot(form.values);
    syncSavedNameToUrl(name);
    notifications.show({
      title: "Scenario saved",
      message: `"${name}" is in your list. You can save more with different names or open it anytime.`,
      color: "green",
    });
  };

  const handleLoad = (name: string) => {
    const inputs = loadScenario(name);
    if (inputs) {
      form.setValues(inputs);
      startTransition(() => {
        setContextInputs(inputs);
      });
      setSelectedSavedScenario(name);
      setInputsSnapshot(inputs);
      setSaveAsName(name);
      syncSavedNameToUrl(name);
      notifications.show({
        title: "Scenario loaded",
        message: `Scenario "${name}" has been loaded successfully.`,
        color: "blue",
      });
    } else {
      notifications.show({
        title: "Scenario not found",
        message: `Scenario "${name}" could not be found.`,
        color: "red",
      });
    }
  };

  const handleSidebarScenarioChange = (value: string | null) => {
    if (value === null) {
      setSelectedSavedScenario(null);
      setInputsSnapshot(null);
      syncSavedNameToUrl(null);
      return;
    }
    handleLoad(value);
  };

  return (
    <Stack gap="md" style={{ width: "100%" }}>
      <Modal
        opened={isScenarioModalOpen}
        onClose={onScenarioModalClose}
        title={
          <Group justify="space-between" gap="md" wrap="nowrap" pr="md">
            <Text fw={600}>Saved scenarios</Text>
            {savedScenarios.length > 0 && (
              <Badge variant="light" color="gray" size="sm">
                {savedScenarios.length} saved
              </Badge>
            )}
          </Group>
        }
        centered
      >
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            Build several what-ifs: each name stores a full copy of your inputs
            (home price, rent, horizon, and the rest). Switch between them here,
            or review and delete them on the Scenarios page.
          </Text>

          <Stack gap="xs">
            <Text size="sm" fw={600}>
              Add another scenario
            </Text>
            <Group align="flex-end" wrap="nowrap" gap="sm">
              <TextInput
                label="Scenario name"
                description="Use a new name for a new comparison. Reusing a name replaces that snapshot."
                placeholder="e.g. Base case, High rent, 15-year horizon"
                value={saveAsName}
                onChange={(e) => setSaveAsName(e.target.value)}
                style={{ flex: 1 }}
              />
              <Button onClick={handleSave}>Save scenario</Button>
            </Group>
          </Stack>

          <Text size="sm" c="dimmed">
            To open a saved scenario, use the <strong>Scenario</strong> dropdown
            above the form fields.
          </Text>

          {savedScenarios.length === 0 && (
            <Text size="sm" c="dimmed">
              You have no saved scenarios yet. Name the setup above, click Save
              scenario, then repeat with different assumptions to grow your list.
            </Text>
          )}

          <Anchor component={Link} to="/scenarios" size="sm" onClick={onScenarioModalClose}>
            View all scenarios, compare, and delete →
          </Anchor>
        </Stack>
      </Modal>

      <Select
        label="Scenario"
        description={
          savedScenarios.length === 0
            ? "Save your first scenario with the save icon, then pick it here to switch between setups."
            : isDirty
              ? "You changed inputs — open saved scenarios (save icon) and Save scenario to update the stored copy."
              : selectedSavedScenario
                ? `Loaded “${selectedSavedScenario}”. Choose another to switch.`
                : "Choose a saved snapshot, or edit numbers below and save a new one."
        }
        placeholder={
          savedScenarios.length === 0
            ? "No saved scenarios yet"
            : "Select a saved scenario…"
        }
        data={savedScenarios}
        value={
          selectedSavedScenario &&
          savedScenarios.includes(selectedSavedScenario)
            ? selectedSavedScenario
            : null
        }
        onChange={handleSidebarScenarioChange}
        searchable
        clearable
        disabled={savedScenarios.length === 0}
        comboboxProps={{ withinPortal: true, zIndex: 400 }}
      />

      <Divider label="General Filters" labelPosition="left" />

      <Stack gap="xs">
        <Group justify="space-between" align="center">
          <Text size="sm" fw={600}>
            Time Horizon
          </Text>
          <Text size="xs" c="dimmed">
            Quick presets
          </Text>
        </Group>
        <SegmentedControl
          fullWidth
          value={
            [5, 10, 15, 20, 30].includes(form.values.horizonYears)
              ? form.values.horizonYears.toString()
              : "custom"
          }
          onChange={(value) => {
            if (value !== "custom") {
              form.setFieldValue("horizonYears", parseInt(value, 10));
            }
          }}
          data={[
            { label: "5y", value: "5" },
            { label: "10y", value: "10" },
            { label: "15y", value: "15" },
            { label: "20y", value: "20" },
            { label: "30y", value: "30" },
            { label: "Custom", value: "custom" },
          ]}
        />
      </Stack>

      <NumberInput
        label="Annual Investment Return"
        suffix="%"
        min={-10}
        max={20}
        step={0.1}
        decimalScale={2}
        {...form.getInputProps("annualReturnRate")}
        rightSection={
          <InfoTooltip label="Expected annual return on investments (default: 6%)" />
        }
      />

      <NumberInput
        label="Home Appreciation Rate"
        suffix="%"
        min={-10}
        max={20}
        step={0.1}
        decimalScale={2}
        {...form.getInputProps("annualAppreciationRate")}
        rightSection={
          <InfoTooltip label="Annual home appreciation rate (default: 3%)" />
        }
      />

      <Divider label="Buy Scenario" labelPosition="left" />

      <NumberInput
        label="Home Price"
        prefix="$"
        thousandSeparator=","
        {...form.getInputProps("homePrice")}
        rightSection={<InfoTooltip label="The purchase price of the home" />}
      />

      <NumberInput
        label="Down Payment"
        suffix="%"
        min={0}
        max={100}
        {...form.getInputProps("downPaymentPercent")}
        rightSection={
          <InfoTooltip label="Down payment as percentage of home price" />
        }
      />

      <NumberInput
        label="Interest Rate"
        suffix="%"
        min={0}
        max={30}
        step={0.1}
        decimalScale={2}
        {...form.getInputProps("interestRate")}
        rightSection={<InfoTooltip label="Annual mortgage interest rate" />}
      />

      <Select
        label="Loan Term"
        data={[
          { value: "15", label: "15 years" },
          { value: "20", label: "20 years" },
          { value: "30", label: "30 years" },
        ]}
        value={form.values.loanTermYears.toString()}
        onChange={(value) =>
          form.setFieldValue("loanTermYears", parseInt(value || "30"))
        }
        rightSection={<InfoTooltip label="Mortgage loan term in years" />}
      />

      <Accordion variant="separated">
        <Accordion.Item value="additional-details">
          <Accordion.Control>Additional details</Accordion.Control>
          <Accordion.Panel>
            <Stack gap="sm">
              <NumberInput
                label="Property Tax Rate"
                suffix="%"
                min={0}
                step={0.1}
                decimalScale={2}
                {...form.getInputProps("propertyTaxRate")}
                rightSection={
                  <InfoTooltip label="Annual property tax as percentage of home value" />
                }
              />

              <NumberInput
                label="Insurance (Monthly)"
                prefix="$"
                min={0}
                {...form.getInputProps("insuranceMonthly")}
                rightSection={
                  <InfoTooltip label="Monthly homeowners insurance cost" />
                }
              />

              <NumberInput
                label="Maintenance Rate"
                suffix="%"
                min={0}
                step={0.1}
                decimalScale={2}
                {...form.getInputProps("maintenanceRate")}
                rightSection={
                  <InfoTooltip label="Annual maintenance as percentage of home value (default: 1%)" />
                }
              />

              <NumberInput
                label="Selling Cost Rate"
                suffix="%"
                min={0}
                max={20}
                step={0.1}
                decimalScale={2}
                {...form.getInputProps("sellingCostRate")}
                rightSection={
                  <InfoTooltip label="Total selling costs as percentage (default: 8% includes realtor fees, etc.)" />
                }
              />

              <NumberInput
                label="Closing Cost Rate"
                suffix="%"
                min={0}
                max={10}
                step={0.1}
                decimalScale={2}
                {...form.getInputProps("closingCostRate")}
                rightSection={
                  <InfoTooltip label="Closing costs as percentage of home price (default: 3%)" />
                }
              />

              <Switch
                label="Enable PMI"
                {...form.getInputProps("pmiEnabled", { type: "checkbox" })}
                disabled={form.values.downPaymentPercent >= 20}
                description={
                  form.values.downPaymentPercent >= 20
                    ? "PMI only applies when down payment is less than 20%"
                    : "Private Mortgage Insurance (only applies if down payment < 20%)"
                }
              />

              {form.values.pmiEnabled &&
                form.values.downPaymentPercent < 20 && (
                  <NumberInput
                    label="PMI Rate"
                    suffix="%"
                    min={0}
                    max={2}
                    step={0.1}
                    decimalScale={2}
                    {...form.getInputProps("pmiRate")}
                    rightSection={
                      <InfoTooltip label="Annual PMI rate as percentage of loan amount" />
                    }
                  />
                )}

              <NumberInput
                label="Extra Principal Payment (Monthly)"
                prefix="$"
                min={0}
                {...form.getInputProps("extraPrincipalPayment")}
                rightSection={
                  <InfoTooltip label="Additional principal payment each month to pay off loan faster and reduce total interest" />
                }
              />
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>

      <Divider label="Rent Scenario" labelPosition="left" />

      <NumberInput
        label="Current Rent (Monthly)"
        prefix="$"
        min={0}
        {...form.getInputProps("currentRent")}
        rightSection={<InfoTooltip label="Current monthly rent payment" />}
      />

      <NumberInput
        label="Rent Growth Rate"
        suffix="%"
        min={-5}
        max={20}
        step={0.1}
        decimalScale={2}
        {...form.getInputProps("rentGrowthRate")}
        rightSection={
          <InfoTooltip label="Annual rent growth rate (default: 3%)" />
        }
      />
    </Stack>
  );
}
