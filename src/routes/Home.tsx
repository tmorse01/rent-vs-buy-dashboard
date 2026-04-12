import { lazy, Suspense, useDeferredValue, useMemo, useState } from "react";
import {
  Container,
  Grid,
  Title,
  Stack,
  Divider,
  Box,
  Group,
  Text,
  Paper,
  Collapse,
  UnstyledButton,
  ActionIcon,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { ChevronDown, ChevronUp, Folder } from "tabler-icons-react";
import { KeyInsights } from "../components/KeyInsights";
import { MetricsDisplay } from "../components/MetricsDisplay";
import { ExportMenu } from "../components/ExportMenu";
import { BreakEvenRecommendation } from "../components/BreakEvenRecommendation";
import { buildTimeline } from "../calculations/timeline";
import { computeMetrics } from "../calculations/metrics";
import { useScenario } from "../context/ScenarioContext";
import { ScenarioForm } from "../features/scenario/ScenarioForm";
import {
  DASHBOARD_SECTION_IDS,
  DASHBOARD_SECTION_SCROLL_MARGIN_PX,
} from "../constants/dashboardSections";

const NetWorthStackComparison = lazy(() =>
  import("../components/NetWorthStackComparison").then((module) => ({
    default: module.NetWorthStackComparison,
  })),
);
const NetWorthChart = lazy(() =>
  import("../features/charts/NetWorthChart").then((module) => ({
    default: module.NetWorthChart,
  })),
);
const WealthStackChart = lazy(() =>
  import("../features/charts/WealthStackChart").then((module) => ({
    default: module.WealthStackChart,
  })),
);
const UnrecoverableCostChart = lazy(() =>
  import("../features/charts/UnrecoverableCostChart").then((module) => ({
    default: module.UnrecoverableCostChart,
  })),
);
const AmortizationRentBreakdown = lazy(() =>
  import("../features/charts/AmortizationRentBreakdown").then((module) => ({
    default: module.AmortizationRentBreakdown,
  })),
);

function ChartFallback({ label }: { label: string }) {
  return (
    <Box
      p="md"
      style={{
        border: "1px solid var(--mantine-color-gray-3)",
        borderRadius: 12,
        background: "var(--mantine-color-gray-0)",
      }}
    >
      <Text size="sm" c="dimmed">
        Loading {label}...
      </Text>
    </Box>
  );
}

export function Home() {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);
  const { inputs, setInputs } = useScenario();
  const [scenarioExpanded, setScenarioExpanded] = useState(true);
  const [
    isScenarioModalOpen,
    { open: openScenarioModal, close: closeScenarioModal },
  ] = useDisclosure(false);

  const deferredInputs = useDeferredValue(inputs);
  const timeline = useMemo(
    () => buildTimeline(deferredInputs),
    [deferredInputs],
  );
  const metrics = useMemo(
    () => computeMetrics(timeline, deferredInputs),
    [timeline, deferredInputs],
  );

  const sectionAnchorStyle = {
    scrollMarginTop: DASHBOARD_SECTION_SCROLL_MARGIN_PX,
  } as const;

  return (
    <Container size="xl" style={{ maxWidth: "100%" }} py="lg">
      <Stack gap="xl">
        {isMobile && (
          <Paper withBorder radius="md" style={{ overflow: "hidden" }}>
            <UnstyledButton
              onClick={() => setScenarioExpanded((v) => !v)}
              w="100%"
              p="md"
              style={{
                display: "block",
                borderBottom: scenarioExpanded
                  ? "1px solid var(--mantine-color-gray-3)"
                  : undefined,
              }}
              aria-expanded={scenarioExpanded}
              aria-controls="dashboard-scenario-inputs"
              id="dashboard-scenario-inputs-toggle"
            >
              <Group justify="space-between" align="flex-start" wrap="nowrap">
                <Group gap="sm" align="flex-start" wrap="nowrap">
                  <Box mt={2} c="dimmed">
                    {scenarioExpanded ? (
                      <ChevronUp size={22} />
                    ) : (
                      <ChevronDown size={22} />
                    )}
                  </Box>
                  <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
                    <Title order={3} fw={600} ta="left">
                      Scenario inputs
                    </Title>
                    <Text size="xs" c="dimmed" lh={1.35}>
                      {scenarioExpanded
                        ? "Adjust assumptions; results below update shortly after you stop typing."
                        : "Expand to edit home price, rent, horizon, taxes, and saved scenarios."}
                    </Text>
                  </Stack>
                </Group>
                <Tooltip
                  label="Saved scenarios — add a new snapshot or overwrite a name"
                  withArrow
                  multiline
                  w={260}
                >
                  <ActionIcon
                    variant="subtle"
                    color="gray"
                    size="md"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      openScenarioModal();
                    }}
                    aria-label="Saved scenarios: save or load multiple versions"
                  >
                    <Folder size={18} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </UnstyledButton>
            <Collapse in={scenarioExpanded}>
              <Box id="dashboard-scenario-inputs" p="md" pt="sm">
                <ScenarioForm
                  onInputsChange={setInputs}
                  isScenarioModalOpen={isScenarioModalOpen}
                  onScenarioModalClose={closeScenarioModal}
                />
              </Box>
            </Collapse>
          </Paper>
        )}

        {/* Page Header with Export Menu */}
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <Box style={{ flex: 1 }} />
          <ExportMenu
            inputs={deferredInputs}
            timeline={timeline}
            metrics={metrics}
          />
        </Group>
        {/* Key Insights - Hero Section */}
        <Box>
          <Title order={2} mb="md" fw={600}>
            Key Insights
          </Title>
          <KeyInsights
            metrics={metrics}
            timeline={timeline}
            inputs={deferredInputs}
          />
        </Box>

        <Divider />

        {/* Charts Section */}
        <Box>
          <Title order={2} mb="lg" fw={600}>
            Analysis Charts
          </Title>
          <Stack gap="xl">
            <Suspense
              fallback={<ChartFallback label="Net worth & unrecoverable breakdown" />}
            >
              <Box
                id={DASHBOARD_SECTION_IDS.netWorthComparison}
                style={sectionAnchorStyle}
              >
                <NetWorthStackComparison
                  timeline={timeline}
                  inputs={deferredInputs}
                />
              </Box>
            </Suspense>
            <Suspense fallback={<ChartFallback label="Net Worth" />}>
              <NetWorthChart timeline={timeline} />
            </Suspense>
            <Grid gutter="lg">
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Suspense fallback={<ChartFallback label="Wealth Stack" />}>
                  <WealthStackChart timeline={timeline} />
                </Suspense>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Suspense
                  fallback={<ChartFallback label="Unrecoverable Cost" />}
                >
                  <Box
                    id={DASHBOARD_SECTION_IDS.unrecoverableCosts}
                    style={sectionAnchorStyle}
                  >
                    <UnrecoverableCostChart timeline={timeline} />
                  </Box>
                </Suspense>
              </Grid.Col>
            </Grid>
          </Stack>
        </Box>

        <Divider />

        {/* Amortization: principal vs interest vs rent */}
        <Box>
          <Title order={2} mb="lg" fw={600}>
            Amortization breakdown
          </Title>
          <Suspense
            fallback={<ChartFallback label="Amortization breakdown" />}
          >
            <AmortizationRentBreakdown timeline={timeline} />
          </Suspense>
        </Box>

        <Divider />

        {/* Detailed Metrics */}
        <Box>
          <Title order={2} mb="lg" fw={600}>
            Detailed Metrics
          </Title>
          <MetricsDisplay metrics={metrics} timeline={timeline} />
        </Box>

        <Divider />

        {/* Break-even analysis and recommendation */}
        <Box
          id={DASHBOARD_SECTION_IDS.breakEven}
          style={sectionAnchorStyle}
        >
          <Title order={2} mb="lg" fw={600}>
            Break-even & Recommendation
          </Title>
          <BreakEvenRecommendation metrics={metrics} timeline={timeline} />
        </Box>
      </Stack>
    </Container>
  );
}
