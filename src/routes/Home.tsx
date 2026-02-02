import { lazy, Suspense, useDeferredValue, useMemo } from "react";
import {
  Container,
  Grid,
  Title,
  Stack,
  Divider,
  Box,
  Group,
  Text,
} from "@mantine/core";
import { KeyInsights } from "../components/KeyInsights";
import { MetricsDisplay } from "../components/MetricsDisplay";
import { ExportMenu } from "../components/ExportMenu";
import { BreakEvenRecommendation } from "../components/BreakEvenRecommendation";
import { buildTimeline } from "../calculations/timeline";
import { computeMetrics } from "../calculations/metrics";
import { useScenario } from "../context/ScenarioContext";

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
  const { inputs } = useScenario();

  const deferredInputs = useDeferredValue(inputs);
  const timeline = useMemo(
    () => buildTimeline(deferredInputs),
    [deferredInputs],
  );
  const metrics = useMemo(
    () => computeMetrics(timeline, deferredInputs),
    [timeline, deferredInputs],
  );

  return (
    <Container size="xl" style={{ maxWidth: "100%" }} py="lg">
      <Stack gap="xl">
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
          <KeyInsights metrics={metrics} timeline={timeline} />
        </Box>

        <Divider />

        {/* Charts Section */}
        <Box>
          <Title order={2} mb="lg" fw={600}>
            Analysis Charts
          </Title>
          <Stack gap="xl">
            <Suspense fallback={<ChartFallback label="Net Worth Comparison" />}>
              <NetWorthStackComparison
                timeline={timeline}
                inputs={deferredInputs}
              />
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
                  <UnrecoverableCostChart timeline={timeline} />
                </Suspense>
              </Grid.Col>
            </Grid>
          </Stack>
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
        <Box>
          <Title order={2} mb="lg" fw={600}>
            Break-even & Recommendation
          </Title>
          <BreakEvenRecommendation metrics={metrics} timeline={timeline} />
        </Box>
      </Stack>
    </Container>
  );
}
