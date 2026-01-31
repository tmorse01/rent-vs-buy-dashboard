import { useEffect, useState } from "react";
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
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { InfoCircle } from "tabler-icons-react";
import type { ScenarioInputs } from "./ScenarioInputs";
import { saveScenario, loadScenario, listScenarios } from "./scenarioStorage";
import { useScenario } from "../../context/ScenarioContext";

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
  const { inputs: contextInputs, setInputs: setContextInputs } = useScenario();
  const [scenarioName, setScenarioName] = useState("");
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

  useEffect(() => {
    setContextInputs(debouncedInputs);
    onInputsChange(debouncedInputs);
  }, [debouncedInputs, onInputsChange, setContextInputs]);

  const handleSave = () => {
    if (!scenarioName.trim()) {
      notifications.show({
        title: "Name required",
        message: "Please enter a scenario name before saving.",
        color: "orange",
      });
      return;
    }
    saveScenario(scenarioName, form.values);
    // Update saved scenarios list after save
    const updated = listScenarios();
    setSavedScenarios(updated);
    notifications.show({
      title: "Scenario saved",
      message: `Scenario "${scenarioName}" has been saved successfully.`,
      color: "green",
    });
  };

  const handleLoad = (name: string) => {
    const inputs = loadScenario(name);
    if (inputs) {
      form.setValues(inputs);
      setContextInputs(inputs);
      setScenarioName(name);
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

  return (
    <Stack gap="md" style={{ width: "100%" }}>
      <Modal
        opened={isScenarioModalOpen}
        onClose={onScenarioModalClose}
        title="Scenarios"
        centered
      >
        <Stack gap="sm">
          <Group>
            <TextInput
              placeholder="Scenario name"
              value={scenarioName}
              onChange={(e) => setScenarioName(e.target.value)}
              style={{ flex: 1 }}
            />
            <Button onClick={handleSave} variant="light">
              Save
            </Button>
          </Group>
          {savedScenarios.length > 0 && (
            <Select
              placeholder="Load scenario"
              data={savedScenarios}
              onChange={(value) => value && handleLoad(value)}
            />
          )}
        </Stack>
      </Modal>

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
