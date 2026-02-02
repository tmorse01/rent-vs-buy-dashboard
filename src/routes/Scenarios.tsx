import { useState, useTransition } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Title,
  Text,
  Paper,
  Stack,
  Group,
  ActionIcon,
  Grid,
  Divider,
  Box,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Trash, Home, Percentage, Calendar, Clock } from "tabler-icons-react";
import {
  listScenarios,
  getScenarioMetadata,
  loadScenario,
  deleteScenario,
  type SavedScenario,
} from "../features/scenario/scenarioStorage";
import { useScenario } from "../context/ScenarioContext";
import { formatCurrency, formatPercent } from "../utils/formatting";
import type { ScenarioInputs } from "../features/scenario/ScenarioInputs";

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

interface ScenarioCardProps {
  scenario: SavedScenario;
  onLoad: (e: React.MouseEvent, name: string) => void;
  onDelete: (name: string) => void;
}

function ScenarioCard({ scenario, onLoad, onDelete }: ScenarioCardProps) {
  const inputs = scenario.inputs;

  const calculateDownPayment = (inputs: ScenarioInputs): number => {
    return (inputs.homePrice * inputs.downPaymentPercent) / 100;
  };

  const calculateLoanAmount = (inputs: ScenarioInputs): number => {
    return inputs.homePrice - calculateDownPayment(inputs);
  };

  return (
    <Paper
      p="lg"
      withBorder
      radius="md"
      shadow="xs"
      style={{
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: "pointer",
      }}
      styles={{
        root: {
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "var(--mantine-shadow-md)",
          },
        },
      }}
    >
      <Stack gap="md">
        {/* Header */}
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <Box style={{ flex: 1 }}>
            <Link
              to="/"
              onClick={(e) => onLoad(e, scenario.name)}
              style={{
                textDecoration: "none",
                color: "inherit",
                cursor: "pointer",
              }}
            >
              <Title
                order={4}
                style={{
                  marginBottom: 4,
                }}
                styles={{
                  root: {
                    "&:hover": {
                      color: "var(--mantine-color-blue-6)",
                      textDecoration: "underline",
                    },
                  },
                }}
              >
                {scenario.name}
              </Title>
            </Link>
            <Text size="xs" c="dimmed">
              Saved on {formatDate(scenario.savedAt)}
            </Text>
          </Box>
          <ActionIcon
            color="red"
            variant="light"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(scenario.name);
            }}
            aria-label={`Delete ${scenario.name}`}
          >
            <Trash size={16} />
          </ActionIcon>
        </Group>

        <Divider />

        {/* Key Metrics Grid */}
        <Grid gutter="md">
          <Grid.Col span={{ base: 6, sm: 4 }}>
            <Stack gap={4}>
              <Group gap={4} align="center">
                <Home
                  size={16}
                  style={{ color: "var(--mantine-color-gray-6)" }}
                />
                <Text size="xs" c="dimmed" fw={500}>
                  Home Price
                </Text>
              </Group>
              <Text size="lg" fw={600}>
                {formatCurrency(inputs.homePrice)}
              </Text>
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 6, sm: 4 }}>
            <Stack gap={4}>
              <Group gap={4} align="center">
                <Percentage
                  size={16}
                  style={{ color: "var(--mantine-color-gray-6)" }}
                />
                <Text size="xs" c="dimmed" fw={500}>
                  Down Payment
                </Text>
              </Group>
              <Text size="lg" fw={600}>
                {formatPercent(inputs.downPaymentPercent, 0)} (
                {formatCurrency(calculateDownPayment(inputs))})
              </Text>
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 6, sm: 4 }}>
            <Stack gap={4}>
              <Group gap={4} align="center">
                <Percentage
                  size={16}
                  style={{ color: "var(--mantine-color-gray-6)" }}
                />
                <Text size="xs" c="dimmed" fw={500}>
                  Interest Rate
                </Text>
              </Group>
              <Text size="lg" fw={600}>
                {formatPercent(inputs.interestRate, 2)}
              </Text>
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 6, sm: 4 }}>
            <Stack gap={4}>
              <Group gap={4} align="center">
                <Calendar
                  size={16}
                  style={{ color: "var(--mantine-color-gray-6)" }}
                />
                <Text size="xs" c="dimmed" fw={500}>
                  Loan Term
                </Text>
              </Group>
              <Text size="lg" fw={600}>
                {inputs.loanTermYears} years
              </Text>
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 6, sm: 4 }}>
            <Stack gap={4}>
              <Group gap={4} align="center">
                <Home
                  size={16}
                  style={{ color: "var(--mantine-color-gray-6)" }}
                />
                <Text size="xs" c="dimmed" fw={500}>
                  Monthly Rent
                </Text>
              </Group>
              <Text size="lg" fw={600}>
                {formatCurrency(inputs.currentRent)}
              </Text>
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 6, sm: 4 }}>
            <Stack gap={4}>
              <Group gap={4} align="center">
                <Clock
                  size={16}
                  style={{ color: "var(--mantine-color-gray-6)" }}
                />
                <Text size="xs" c="dimmed" fw={500}>
                  Time Horizon
                </Text>
              </Group>
              <Text size="lg" fw={600}>
                {inputs.horizonYears} years
              </Text>
            </Stack>
          </Grid.Col>
        </Grid>

        {/* Additional Info */}
        <Group gap="xl" wrap="wrap">
          <Text size="xs" c="dimmed">
            Loan: {formatCurrency(calculateLoanAmount(inputs))}
          </Text>
          <Text size="xs" c="dimmed">
            Appreciation: {formatPercent(inputs.annualAppreciationRate, 1)}/yr
          </Text>
          <Text size="xs" c="dimmed">
            Investment Return: {formatPercent(inputs.annualReturnRate, 1)}/yr
          </Text>
          {inputs.pmiEnabled && inputs.downPaymentPercent < 20 && (
            <Text size="xs" c="dimmed">
              PMI: {formatPercent(inputs.pmiRate, 2)}
            </Text>
          )}
        </Group>
      </Stack>
    </Paper>
  );
}

function loadScenarios(): SavedScenario[] {
  const scenarioNames = listScenarios();
  return scenarioNames
    .map((name) => getScenarioMetadata(name))
    .filter((scenario): scenario is SavedScenario => scenario !== null)
    .sort((a, b) => {
      // Sort by saved date, most recent first
      return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime();
    });
}

export function Scenarios() {
  const navigate = useNavigate();
  const { setInputs } = useScenario();
  const [, startTransition] = useTransition();
  const [scenarios, setScenarios] = useState<SavedScenario[]>(loadScenarios);

  const fetchScenarios = () => {
    setScenarios(loadScenarios());
  };

  const handleLoad = (e: React.MouseEvent, name: string) => {
    e.preventDefault();
    const inputs = loadScenario(name);
    if (inputs) {
      startTransition(() => {
        setInputs(inputs);
        notifications.show({
          title: "Scenario loaded",
          message: `Scenario "${name}" has been loaded successfully.`,
          color: "blue",
        });
        navigate("/");
      });
    } else {
      notifications.show({
        title: "Error",
        message: `Failed to load scenario "${name}".`,
        color: "red",
      });
      // Refresh list in case scenario was deleted elsewhere
      fetchScenarios();
    }
  };

  const handleDelete = (name: string) => {
    deleteScenario(name);
    notifications.show({
      title: "Scenario deleted",
      message: `Scenario "${name}" has been deleted.`,
      color: "green",
    });
    fetchScenarios();
  };

  return (
    <Container size="xl" py="lg">
      <Stack gap="lg">
        <Title order={1}>Saved Scenarios</Title>

        {scenarios.length === 0 ? (
          <Paper p="xl" withBorder radius="md">
            <Text c="dimmed" ta="center">
              No saved scenarios yet. Create and save scenarios from the
              scenario inputs sidebar to see them here.
            </Text>
          </Paper>
        ) : (
          <Stack gap="md">
            {scenarios.map((scenario) => (
              <ScenarioCard
                key={scenario.name}
                scenario={scenario}
                onLoad={handleLoad}
                onDelete={handleDelete}
              />
            ))}
          </Stack>
        )}
      </Stack>
    </Container>
  );
}
