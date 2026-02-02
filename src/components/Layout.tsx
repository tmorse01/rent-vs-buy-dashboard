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
  Paper,
  Text,
  Button,
  NavLink,
} from "@mantine/core";
import { useDisclosure, useLocalStorage, useMediaQuery } from "@mantine/hooks";
import {
  Folder,
  HomeStats,
  Settings,
  UserCircle,
  LayoutSidebar,
  X,
} from "tabler-icons-react";
import { Link, useLocation } from "react-router-dom";
import { ScenarioForm } from "../features/scenario/ScenarioForm";
import { Navigation } from "./Navigation";
import { useScenario } from "../context/ScenarioContext";
import { COLORS, SOLID_COLORS } from "../theme/colors";
import { DOC_PAGES } from "../data/docsPages";

interface LayoutProps {
  children: ReactNode;
}

const NAVBAR_WIDTH = 360;
const HEADER_HEIGHT = 56;

export function Layout({ children }: LayoutProps) {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);
  const location = useLocation();
  const { setInputs } = useScenario();
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [
    isScenarioModalOpen,
    { open: openScenarioModal, close: closeScenarioModal },
  ] = useDisclosure(false);
  const [onboardingDismissed, setOnboardingDismissed] = useLocalStorage({
    key: "rvb_onboarding_dismissed",
    defaultValue: false,
  });
  const isDashboard = location.pathname === "/";
  const isDocs = location.pathname.startsWith("/docs");
  const showNavbar = isDashboard || isDocs;
  const navbarWidth = isDocs ? 260 : NAVBAR_WIDTH;

  return (
    <AppShell
      header={{ height: HEADER_HEIGHT, offset: false }}
      navbar={
        showNavbar
          ? {
              width: navbarWidth,
              breakpoint: "md",
              collapsed: { mobile: !mobileOpened, desktop: false },
            }
          : undefined
      }
      padding={0}
    >
      {/* Header */}
      <AppShell.Header
        px="md"
        className="header-shimmer"
        style={{
          background: COLORS.neutral.bgPrimary,
          borderBottom: `1px solid ${COLORS.neutral.borderLight}`,
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
                backgroundColor: COLORS.brand.primary,
                color: theme.white,
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
              color="blue"
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
                  color="blue"
                  aria-label="Profile menu"
                >
                  <Avatar size={28} radius="xl" color="blue" variant="filled">
                    <UserCircle size={20} color={theme.white} />
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
      {showNavbar && (
        <AppShell.Navbar
          style={{
            background: theme.colors.gray[0],
            borderRight: `1px solid ${theme.colors.gray[2]}`,
            top: `${HEADER_HEIGHT}px`,
            height: `calc(100vh - ${HEADER_HEIGHT}px)`,
          }}
        >
          <AppShell.Section grow component={ScrollArea}>
            {isDashboard && (
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
            )}
            {isDocs && (
              <Stack gap="md" p="lg">
                <Title order={3} fw={600}>
                  Docs Navigation
                </Title>
                <Stack gap="xs">
                  {DOC_PAGES.map((doc) => {
                    const isActive = location.pathname === `/docs/${doc.slug}`;
                    return (
                      <NavLink
                        key={doc.slug}
                        label={doc.title}
                        component={Link}
                        to={`/docs/${doc.slug}`}
                        active={isActive}
                        variant="light"
                        color={isActive ? "blue" : "gray"}
                      />
                    );
                  })}
                </Stack>
              </Stack>
            )}
          </AppShell.Section>
        </AppShell.Navbar>
      )}

      {/* Main Content */}
      <AppShell.Main
        style={{
          background: theme.colors.gray[0],
          paddingTop: `${HEADER_HEIGHT}px`,
          height: "100vh",
        }}
      >
        {showNavbar && (
          <ActionIcon
            onClick={toggleMobile}
            hiddenFrom="md"
            size="lg"
            radius="xl"
            variant="filled"
            aria-label={
              isDocs
                ? "Toggle documentation navigation"
                : "Toggle scenario inputs"
            }
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
        )}
        <ScrollArea h={`calc(100vh - ${HEADER_HEIGHT}px)`}>
          {children}
        </ScrollArea>
        {!onboardingDismissed && (
          <Paper
            withBorder
            shadow="md"
            radius="lg"
            p="md"
            style={{
              position: "fixed",
              right: isMobile ? 16 : 24,
              left: isMobile ? 16 : "auto",
              bottom: isMobile ? 16 : 24,
              width: isMobile ? "auto" : 360,
              zIndex: 300,
              backgroundColor: theme.white,
            }}
          >
            <Group justify="space-between" align="flex-start" wrap="nowrap">
              <Stack gap={6} style={{ flex: 1 }}>
                <Text fw={600}>New here? Start with the basics.</Text>
                <Text c="dimmed" size="sm">
                  This app compares renting vs. buying using cash-loss
                  (unrecoverable costs) and net worth. Set your scenario in the
                  dashboard sidebar, then review the key insights and charts.
                </Text>
              </Stack>
              <ActionIcon
                variant="subtle"
                color="gray"
                aria-label="Dismiss onboarding"
                onClick={() => setOnboardingDismissed(true)}
              >
                <X size={16} />
              </ActionIcon>
            </Group>
            <Group mt="sm" justify="flex-start" gap="sm">
              <Button
                component={Link}
                to="/docs/overview"
                size="xs"
                variant="light"
              >
                View TL;DR docs
              </Button>
              <Button
                size="xs"
                variant="subtle"
                onClick={() => setOnboardingDismissed(true)}
              >
                Dismiss
              </Button>
            </Group>
          </Paper>
        )}
      </AppShell.Main>
    </AppShell>
  );
}
