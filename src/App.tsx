import { useState, useMemo } from 'react';
import { MantineProvider, AppShell, Container, Grid, Title, Stack, ScrollArea } from '@mantine/core';
import { ScenarioForm } from './features/scenario/ScenarioForm';
import { UnrecoverableCostChart } from './features/charts/UnrecoverableCostChart';
import { MonthlyCostChart } from './features/charts/MonthlyCostChart';
import { NetWorthChart } from './features/charts/NetWorthChart';
import { WealthStackChart } from './features/charts/WealthStackChart';
import { MetricsDisplay } from './components/MetricsDisplay';
import { ExportButtons } from './components/ExportButtons';
import { buildTimeline } from './calculations/timeline';
import { computeMetrics } from './calculations/metrics';
import type { ScenarioInputs } from './features/scenario/ScenarioInputs';

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

  const [notes, setNotes] = useState('');

  const timeline = useMemo(() => buildTimeline(inputs), [inputs]);
  const metrics = useMemo(() => computeMetrics(timeline, inputs), [timeline, inputs]);

  return (
    <MantineProvider>
      <AppShell
        header={{ height: 60 }}
        padding="md"
      >
        <AppShell.Header>
          <Container size="xl" h="100%" style={{ display: 'flex', alignItems: 'center' }}>
            <Title order={2}>Rent vs Buy Dashboard</Title>
          </Container>
        </AppShell.Header>

        <AppShell.Main>
          <Container size="xl">
            <Stack gap="lg">
              <Grid>
                <Grid.Col span={{ base: 12, lg: 4 }}>
                  <ScrollArea h={800}>
                    <ScenarioForm onInputsChange={setInputs} />
                  </ScrollArea>
                </Grid.Col>

                <Grid.Col span={{ base: 12, lg: 8 }}>
                  <Stack gap="lg">
                    <Title order={3}>Key Metrics</Title>
                    <MetricsDisplay metrics={metrics} />

                    <Title order={3}>Charts</Title>
                    <Grid>
                      <Grid.Col span={{ base: 12, md: 6 }}>
                        <UnrecoverableCostChart timeline={timeline} />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, md: 6 }}>
                        <MonthlyCostChart timeline={timeline} />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, md: 6 }}>
                        <NetWorthChart timeline={timeline} />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, md: 6 }}>
                        <WealthStackChart timeline={timeline} />
                      </Grid.Col>
                    </Grid>

                    <Title order={3}>Export</Title>
                    <ExportButtons
                      inputs={inputs}
                      timeline={timeline}
                      metrics={metrics}
                      notes={notes}
                      onNotesChange={setNotes}
                    />
                  </Stack>
                </Grid.Col>
              </Grid>
            </Stack>
          </Container>
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}

export default App;
