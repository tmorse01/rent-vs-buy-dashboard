import { useMemo } from "react";
import {
  Container,
  Grid,
  Title,
  Stack,
  Divider,
  Box,
  Group,
} from "@mantine/core";
import { UnrecoverableCostChart } from "../features/charts/UnrecoverableCostChart";
import { NetWorthChart } from "../features/charts/NetWorthChart";
import { WealthStackChart } from "../features/charts/WealthStackChart";
import { KeyInsights } from "../components/KeyInsights";
import { MetricsDisplay } from "../components/MetricsDisplay";
import { ExportMenu } from "../components/ExportMenu";
import { NetWorthStackComparison } from "../components/NetWorthStackComparison";
import { BreakEvenRecommendation } from "../components/BreakEvenRecommendation";
import { buildTimeline } from "../calculations/timeline";
import { computeMetrics } from "../calculations/metrics";
import { useScenario } from "../context/ScenarioContext";

export function Home() {
  const { inputs } = useScenario();

  const timeline = useMemo(() => buildTimeline(inputs), [inputs]);
  const metrics = useMemo(
    () => computeMetrics(timeline, inputs),
    [timeline, inputs],
  );

  return (
    <Container size="xl" style={{ maxWidth: "100%" }} py="lg">
      <Stack gap="xl">
        {/* Page Header with Export Menu */}
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <Box style={{ flex: 1 }} />
          <ExportMenu inputs={inputs} timeline={timeline} metrics={metrics} />
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
            <NetWorthStackComparison timeline={timeline} inputs={inputs} />
            <NetWorthChart timeline={timeline} />
            <Grid gutter="lg">
              <Grid.Col span={{ base: 12, md: 6 }}>
                <WealthStackChart timeline={timeline} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <UnrecoverableCostChart timeline={timeline} />
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
