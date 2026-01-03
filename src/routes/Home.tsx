import { useState, useMemo } from "react";
import { Container, Grid, Title, Stack, Divider, Box } from "@mantine/core";
import { UnrecoverableCostChart } from "../features/charts/UnrecoverableCostChart";
import { MonthlyCostChart } from "../features/charts/MonthlyCostChart";
import { NetWorthChart } from "../features/charts/NetWorthChart";
import { WealthStackChart } from "../features/charts/WealthStackChart";
import { KeyInsights } from "../components/KeyInsights";
import { MetricsDisplay } from "../components/MetricsDisplay";
import { ExportButtons } from "../components/ExportButtons";
import { buildTimeline } from "../calculations/timeline";
import { computeMetrics } from "../calculations/metrics";
import { useScenario } from "../context/ScenarioContext";

export function Home() {
  const { inputs } = useScenario();
  const [notes, setNotes] = useState("");

  const timeline = useMemo(() => buildTimeline(inputs), [inputs]);
  const metrics = useMemo(
    () => computeMetrics(timeline, inputs),
    [timeline, inputs]
  );

  return (
    <Container size="xl" style={{ maxWidth: "100%" }} py="lg">
      <Stack gap="xl">
        {/* Key Insights - Hero Section */}
        <Box>
          <Title order={2} mb="md" fw={600}>
            Key Insights
          </Title>
          <KeyInsights metrics={metrics} />
        </Box>

        <Divider />

        {/* Charts Section */}
        <Box>
          <Title order={2} mb="lg" fw={600}>
            Analysis Charts
          </Title>
          <Stack gap="xl">
            <UnrecoverableCostChart timeline={timeline} />
            <NetWorthChart timeline={timeline} />
            <Grid gutter="lg">
              <Grid.Col span={{ base: 12, md: 6 }}>
                <MonthlyCostChart timeline={timeline} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <WealthStackChart timeline={timeline} />
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
          <MetricsDisplay metrics={metrics} />
        </Box>

        <Divider />

        {/* Export Section */}
        <Box>
          <Title order={2} mb="lg" fw={600}>
            Export Data
          </Title>
          <ExportButtons
            inputs={inputs}
            timeline={timeline}
            metrics={metrics}
            notes={notes}
            onNotesChange={setNotes}
          />
        </Box>
      </Stack>
    </Container>
  );
}
