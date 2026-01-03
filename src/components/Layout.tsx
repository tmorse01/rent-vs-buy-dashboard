import type { ReactNode } from "react";
import { AppShell, Title, Group, Text, Stack, ScrollArea } from "@mantine/core";
import { ScenarioForm } from "../features/scenario/ScenarioForm";
import type { ScenarioInputs } from "../features/scenario/ScenarioInputs";

interface LayoutProps {
  children: ReactNode;
  onInputsChange: (inputs: ScenarioInputs) => void;
}

const NAVBAR_WIDTH = 360;
const HEADER_HEIGHT = 70;

export function Layout({ children, onInputsChange }: LayoutProps) {
  return (
    <AppShell
      header={{ height: HEADER_HEIGHT }}
      navbar={{
        width: NAVBAR_WIDTH,
        breakpoint: "md",
      }}
      padding="md"
    >
      {/* Header */}
      <AppShell.Header
        px="xl"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          border: "none",
        }}
      >
        <Group h="100%" gap="md">
          <Title order={2} c="white" fw={700}>
            Rent vs Buy Dashboard
          </Title>
          <Text size="sm" c="white" style={{ opacity: 0.9 }}>
            Compare your options with confidence
          </Text>
        </Group>
      </AppShell.Header>

      {/* Sidebar */}
      <AppShell.Navbar
        style={{
          background: "white",
          borderRight: "1px solid #e9ecef",
        }}
      >
        <AppShell.Section grow component={ScrollArea}>
          <Stack gap="md" p="lg">
            <Title order={3} fw={600}>
              Scenario Inputs
            </Title>
            <ScenarioForm onInputsChange={onInputsChange} />
          </Stack>
        </AppShell.Section>
      </AppShell.Navbar>

      {/* Main Content */}
      <AppShell.Main
        style={{
          background: "#f8f9fa",
          minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
        }}
      >
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
