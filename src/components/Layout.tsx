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
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Folder, HomeStats, LayoutSidebar } from "tabler-icons-react";
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
  const [
    isScenarioModalOpen,
    { open: openScenarioModal, close: closeScenarioModal },
  ] = useDisclosure(false);

  return (
    <AppShell
      header={{ height: HEADER_HEIGHT, offset: false }}
      navbar={{
        width: NAVBAR_WIDTH,
        breakpoint: "md",
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding={0}
    >
      {/* Header */}
      <AppShell.Header
        px="md"
        className="header-shimmer"
        style={{
          background: SOLID_COLORS.hero,
          border: "none",
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
          top: `${HEADER_HEIGHT}px`,
          height: `calc(100vh - ${HEADER_HEIGHT}px)`,
        }}
      >
        <AppShell.Section grow component={ScrollArea}>
          <Stack gap="md" p="lg">
            <Group justify="space-between" align="center" wrap="nowrap">
              <Title order={3} fw={600}>
                Scenario Inputs
              </Title>
              <Tooltip label="Open or save scenario" withArrow>
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  size="md"
                  onClick={openScenarioModal}
                  aria-label="Open or save scenario"
                >
                  <Folder size={18} />
                </ActionIcon>
              </Tooltip>
            </Group>
            <ScenarioForm
              onInputsChange={setInputs}
              isScenarioModalOpen={isScenarioModalOpen}
              onScenarioModalClose={closeScenarioModal}
            />
          </Stack>
        </AppShell.Section>
      </AppShell.Navbar>

      {/* Main Content */}
      <AppShell.Main
        style={{
          background: theme.colors.gray[0],
          paddingTop: `${HEADER_HEIGHT}px`,
          height: "100vh",
        }}
      >
        <ScrollArea h={`calc(100vh - ${HEADER_HEIGHT}px)`}>
          {children}
        </ScrollArea>
      </AppShell.Main>
    </AppShell>
  );
}
