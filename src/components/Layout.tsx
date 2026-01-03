import type { ReactNode } from "react";
import {
  AppShell,
  Title,
  Group,
  Text,
  Stack,
  ScrollArea,
  useMantineTheme,
  ActionIcon,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { HomeStats, LayoutSidebar } from "tabler-icons-react";
import { ScenarioForm } from "../features/scenario/ScenarioForm";
import { Navigation } from "./Navigation";
import { useScenario } from "../context/ScenarioContext";
import { SOLID_COLORS } from "../theme/colors";

interface LayoutProps {
  children: ReactNode;
}

const NAVBAR_WIDTH = 360;
const HEADER_HEIGHT = 56;

export function Layout({ children }: LayoutProps) {
  const theme = useMantineTheme();
  const { setInputs } = useScenario();
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  return (
    <AppShell
      header={{ height: HEADER_HEIGHT }}
      navbar={{
        width: NAVBAR_WIDTH,
        breakpoint: "md",
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding="md"
    >
      {/* Header */}
      <AppShell.Header
        px="md"
        className="header-shimmer"
        style={{
          background: SOLID_COLORS.hero,
          border: "none",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Group h="100%" justify="space-between" wrap="nowrap" gap="xs">
          <Group gap="xs" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
            <ActionIcon
              onClick={toggleMobile}
              hiddenFrom="md"
              size="lg"
              variant="subtle"
              color="white"
              aria-label="Toggle sidebar"
            >
              <LayoutSidebar size={20} />
            </ActionIcon>
            <ActionIcon
              onClick={toggleDesktop}
              visibleFrom="md"
              size="lg"
              variant="subtle"
              color="white"
              aria-label="Toggle sidebar"
            >
              <LayoutSidebar size={20} />
            </ActionIcon>
            <HomeStats size={24} color="white" style={{ flexShrink: 0 }} />
            <Stack gap={0} style={{ flex: 1, minWidth: 0 }}>
              <Title
                order={4}
                c="white"
                fw={700}
                hiddenFrom="sm"
                style={{
                  lineHeight: 1.2,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                Rent vs Buy
              </Title>
              <Title
                order={3}
                c="white"
                fw={700}
                visibleFrom="sm"
                style={{
                  lineHeight: 1.2,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                Rent vs Buy Dashboard
              </Title>
              <Text
                size="xs"
                c="white"
                style={{ opacity: 0.9 }}
                visibleFrom="md"
              >
                Compare your options with confidence
              </Text>
            </Stack>
          </Group>
          <Navigation />
        </Group>
      </AppShell.Header>

      {/* Sidebar */}
      <AppShell.Navbar
        style={{
          background: theme.colors.gray[0],
          borderRight: `1px solid ${theme.colors.gray[2]}`,
        }}
      >
        <AppShell.Section grow component={ScrollArea}>
          <Stack gap="md" p="lg">
            <Title order={3} fw={600}>
              Scenario Inputs
            </Title>
            <ScenarioForm onInputsChange={setInputs} />
          </Stack>
        </AppShell.Section>
      </AppShell.Navbar>

      {/* Main Content */}
      <AppShell.Main
        style={{
          background: theme.colors.gray[0],
          minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
        }}
      >
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
