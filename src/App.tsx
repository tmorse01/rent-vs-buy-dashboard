import { useState, useMemo } from "react";
import {
  MantineProvider,
  Container,
  Grid,
  Title,
  Stack,
  Divider,
  Box,
} from "@mantine/core";
import { UnrecoverableCostChart } from "./features/charts/UnrecoverableCostChart";
import { MonthlyCostChart } from "./features/charts/MonthlyCostChart";
import { NetWorthChart } from "./features/charts/NetWorthChart";
import { WealthStackChart } from "./features/charts/WealthStackChart";
import { KeyInsights } from "./components/KeyInsights";
import { MetricsDisplay } from "./components/MetricsDisplay";
import { ExportButtons } from "./components/ExportButtons";
import { Layout } from "./components/Layout";
import { buildTimeline } from "./calculations/timeline";
import { computeMetrics } from "./calculations/metrics";
import type { ScenarioInputs } from "./features/scenario/ScenarioInputs";

function App() {
  const [inputs, setInputs] = useState<ScenarioInputs>({
    homePrice: 500000,
    downPaymentPercent: 20,
    interestRate: 6.5,
    loanTermYears: 30,
    propertyTaxRate: 1.2,
    insuranceMonthly: 150,
    maintenanceRate: 1,
    sellingCostRate: 8,
    closingCostRate: 3,
    currentRent: 2500,
    rentGrowthRate: 3,
    annualReturnRate: 6,
    annualAppreciationRate: 3,
    horizonYears: 15,
    pmiEnabled: true,
    pmiRate: 0.5,
  });

  const [notes, setNotes] = useState("");

  const timeline = useMemo(() => buildTimeline(inputs), [inputs]);
  const metrics = useMemo(
    () => computeMetrics(timeline, inputs),
    [timeline, inputs]
  );

  return (
    <MantineProvider>
      <Layout onInputsChange={setInputs}>
        <Container size="xl" style={{ maxWidth: "100%" }}>
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
      </Layout>
    </MantineProvider>
  );
}

export default App;
