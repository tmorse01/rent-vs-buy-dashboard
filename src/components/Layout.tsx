import type { ReactNode } from "react";
import {
  AppShell,
  Title,
  Group,
  Stack,
  ScrollArea,
  useMantineTheme,
  ActionIcon,
  Tooltip,
  Menu,
  Avatar,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  Folder,
  HomeStats,
  Settings,
  UserCircle,
  LayoutSidebar,
} from "tabler-icons-react";
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
        collapsed: { mobile: !mobileOpened, desktop: false },
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
          <Group gap="xs" wrap="nowrap">
            <ActionIcon
              size="lg"
              radius="xl"
              variant="filled"
              aria-label="Rent vs Buy"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                color: SOLID_COLORS.hero,
              }}
            >
              <HomeStats size={20} />
            </ActionIcon>
          </Group>
          <Group
            gap="xs"
            wrap="nowrap"
            justify="center"
            style={{ flex: 1, minWidth: 0 }}
          >
            <Navigation />
          </Group>
          <Group gap="xs" wrap="nowrap">
            <ActionIcon
              size="lg"
              radius="xl"
              variant="subtle"
              color="white"
              aria-label="Settings"
            >
              <Settings size={20} />
            </ActionIcon>
            <Menu width={180} position="bottom-end" shadow="md">
              <Menu.Target>
                <ActionIcon
                  size="lg"
                  radius="xl"
                  variant="subtle"
                  color="white"
                  aria-label="Profile menu"
                >
                  <Avatar size={28} radius="xl" color="white" variant="filled">
                    <UserCircle size={20} color={SOLID_COLORS.hero} />
                  </Avatar>
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Profile</Menu.Label>
                <Menu.Item leftSection={<UserCircle size={16} />}>
                  View profile
                </Menu.Item>
                <Menu.Item leftSection={<Settings size={16} />}>
                  Account settings
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
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
        <ActionIcon
          onClick={toggleMobile}
          hiddenFrom="md"
          size="lg"
          radius="xl"
          variant="filled"
          aria-label="Toggle scenario inputs"
          style={{
            position: "fixed",
            bottom: 24,
            left: 24,
            zIndex: 200,
            backgroundColor: theme.white,
            color: SOLID_COLORS.hero,
            boxShadow: theme.shadows.md,
          }}
        >
          <LayoutSidebar size={20} />
        </ActionIcon>
        <ScrollArea h={`calc(100vh - ${HEADER_HEIGHT}px)`}>
          {children}
        </ScrollArea>
      </AppShell.Main>
    </AppShell>
  );
}
