import { useState, type ReactNode } from "react";
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
  Checkbox,
  UnstyledButton,
  Box,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useDisclosure, useLocalStorage, useMediaQuery } from "@mantine/hooks";
import {
  DeviceFloppy,
  HomeStats,
  Settings,
  UserCircle,
  LayoutSidebar,
  X,
  Trash,
  Edit,
} from "tabler-icons-react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ScenarioForm } from "../features/scenario/ScenarioForm";
import { Navigation } from "./Navigation";
import { useScenario } from "../context/ScenarioContext";
import { useUserProfile } from "../context/UserProfileContext";
import { COLORS, SOLID_COLORS } from "../theme/colors";
import { DOC_PAGES } from "../data/docsPages";
import {
  getScenarioMetadata,
  listScenarios,
  deleteScenario,
  type SavedScenario,
} from "../features/scenario/scenarioStorage";
import {
  COMPARED_SCENARIOS_QUERY_KEY,
  SAVED_SCENARIO_QUERY_KEY,
} from "../utils/shareScenario";
import { formatCurrency } from "../utils/formatting";

interface LayoutProps {
  children: ReactNode;
}

const SCENARIO_NAVBAR_WIDTH = 360;
const HEADER_HEIGHT = 56;

function formatSavedDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function loadSavedScenariosSorted(): SavedScenario[] {
  return listScenarios()
    .map((name) => getScenarioMetadata(name))
    .filter((scenario): scenario is SavedScenario => scenario !== null)
    .sort(
      (a, b) =>
        new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime(),
    );
}

export function Layout({ children }: LayoutProps) {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setInputs } = useScenario();
  const { initials, displayName } = useUserProfile();
  const [, setScenarioListVersion] = useState(0);
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [
    isScenarioModalOpen,
    { open: openScenarioModal, close: closeScenarioModal },
  ] = useDisclosure(false);
  const [onboardingDismissed, setOnboardingDismissed] = useLocalStorage({
    key: "rvb_onboarding_dismissed",
    defaultValue: false,
  });
  const isDashboard = location.pathname === "/dashboard";
  const isDocs = location.pathname.startsWith("/docs");
  const isScenarioPage = location.pathname.startsWith("/scenarios");
  const showNavbar = !isMobile || isDocs;
  const savedScenarios = isScenarioPage ? loadSavedScenariosSorted() : [];
  const allSavedScenarioNames = savedScenarios.map((scenario) => scenario.name);
  const comparedScenarioParams = searchParams
    .getAll(COMPARED_SCENARIOS_QUERY_KEY)
    .filter(Boolean);
  const hasExplicitComparisonSelection = searchParams.has(
    COMPARED_SCENARIOS_QUERY_KEY,
  );
  const selectedComparisonNames = hasExplicitComparisonSelection
    ? comparedScenarioParams
    : allSavedScenarioNames;

  const updateComparisonSelection = (nextNames: string[]) => {
    const params = new URLSearchParams(location.search);
    params.delete(COMPARED_SCENARIOS_QUERY_KEY);
    if (nextNames.length === 0) {
      params.append(COMPARED_SCENARIOS_QUERY_KEY, "");
    } else {
      nextNames.forEach((name) =>
        params.append(COMPARED_SCENARIOS_QUERY_KEY, name),
      );
    }
    navigate(
      {
        pathname: "/scenarios",
        search: params.toString() ? `?${params.toString()}` : "",
      },
      { replace: true },
    );
  };

  const toggleScenarioComparison = (name: string, checked: boolean) => {
    const currentNames = hasExplicitComparisonSelection
      ? comparedScenarioParams
      : allSavedScenarioNames;
    const nextNames = checked
      ? Array.from(new Set([...currentNames, name]))
      : currentNames.filter((currentName) => currentName !== name);

    updateComparisonSelection(nextNames);
  };

  const handleDeleteSavedScenario = (name: string) => {
    deleteScenario(name);
    setScenarioListVersion((version) => version + 1);
    notifications.show({
      title: "Scenario deleted",
      message: `Scenario "${name}" has been deleted.`,
      color: "green",
    });

    updateComparisonSelection(
      selectedComparisonNames.filter((currentName) => currentName !== name),
    );
  };

  return (
    <AppShell
      header={{ height: HEADER_HEIGHT, offset: false }}
      navbar={
        showNavbar
          ? {
              width: SCENARIO_NAVBAR_WIDTH,
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
          background: "var(--mantine-color-body)",
          borderBottom: "1px solid var(--mantine-color-default-border)",
          overflow: "hidden",
        }}
      >
        <Group h="100%" justify="space-between" wrap="nowrap" gap="xs">
          <Group gap="xs" wrap="nowrap">
            <UnstyledButton
              component={Link}
              to="/"
              aria-label="HomeEdge home"
              style={{
                borderRadius: theme.radius.xl,
              }}
            >
              <Group gap="xs" wrap="nowrap">
                <Box
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: theme.radius.xl,
                    backgroundColor: COLORS.brand.primary,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: theme.white,
                  }}
                >
                  <HomeStats size={20} />
                </Box>
                <Text
                  fw={700}
                  size="lg"
                  visibleFrom="sm"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  HomeEdge
                </Text>
              </Group>
            </UnstyledButton>
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
              component={Link}
              to="/settings"
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
                    {displayName.trim() ? (
                      initials
                    ) : (
                      <UserCircle size={20} color={theme.white} />
                    )}
                  </Avatar>
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Profile</Menu.Label>
                <Menu.Item
                  component={Link}
                  to="/profile"
                  leftSection={<UserCircle size={16} />}
                >
                  View profile
                </Menu.Item>
                <Menu.Item
                  component={Link}
                  to="/settings"
                  leftSection={<Settings size={16} />}
                >
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
            background: "var(--mantine-color-body)",
            borderRight: "1px solid var(--mantine-color-default-border)",
            top: `${HEADER_HEIGHT}px`,
            height: `calc(100vh - ${HEADER_HEIGHT}px)`,
            transition:
              "width 180ms cubic-bezier(0.22, 1, 0.36, 1), transform 180ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <AppShell.Section grow component={ScrollArea}>
            {isDashboard && !isMobile && (
              <Stack gap="md" p="lg">
                <Group justify="space-between" align="flex-start" wrap="nowrap">
                  <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
                    <Title order={3} fw={600}>
                      Scenario inputs
                    </Title>
                    <Text size="xs" c="dimmed" lh={1.35}>
                      Use the Scenario menu below to switch saved setups; the
                      save icon opens the dialog to add a snapshot or overwrite a name.
                    </Text>
                  </Stack>
                  <Tooltip
                    label="Saved scenarios — add new ones or switch between them"
                    withArrow
                    multiline
                    w={260}
                  >
                    <ActionIcon
                      variant="subtle"
                      color="gray"
                      size="md"
                      onClick={openScenarioModal}
                      aria-label="Saved scenarios: save or load multiple versions"
                    >
                      <DeviceFloppy size={18} />
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
            {isScenarioPage && !isMobile && (
              <Stack gap="md" p="lg">
                <Title order={3} fw={600}>
                  Saved scenarios
                </Title>
                {savedScenarios.length > 0 ? (
                  <Stack gap="xs">
                    {savedScenarios.map((scenario) => (
                      <Paper
                        key={scenario.name}
                        withBorder
                        radius="sm"
                        p="xs"
                      >
                        <Stack gap={6}>
                          <Checkbox
                            checked={selectedComparisonNames.includes(
                              scenario.name,
                            )}
                            onChange={(event) =>
                              toggleScenarioComparison(
                                scenario.name,
                                event.currentTarget.checked,
                              )
                            }
                            label={
                              <Stack gap={2}>
                                <Text size="sm" fw={600} lineClamp={1}>
                                  {scenario.name}
                                </Text>
                                <Text size="xs" c="dimmed" lineClamp={1}>
                                  {formatCurrency(scenario.inputs.homePrice)}{" "}
                                  home | {formatSavedDate(scenario.savedAt)}
                                </Text>
                              </Stack>
                            }
                            styles={{
                              label: {
                                width: "100%",
                              },
                              body: {
                                alignItems: "flex-start",
                              },
                            }}
                          />
                          <Group justify="flex-end" gap={4}>
                            <Tooltip label="Edit on dashboard" withArrow>
                              <ActionIcon
                                component={Link}
                                to={`/dashboard?${SAVED_SCENARIO_QUERY_KEY}=${encodeURIComponent(scenario.name)}`}
                                variant="subtle"
                                color="blue"
                                size="sm"
                                aria-label={`Edit ${scenario.name}`}
                              >
                                <Edit size={15} />
                              </ActionIcon>
                            </Tooltip>
                            <Tooltip label="Delete scenario" withArrow>
                              <ActionIcon
                                variant="subtle"
                                color="red"
                                size="sm"
                                onClick={() =>
                                  handleDeleteSavedScenario(scenario.name)
                                }
                                aria-label={`Delete ${scenario.name}`}
                              >
                                <Trash size={15} />
                              </ActionIcon>
                            </Tooltip>
                          </Group>
                        </Stack>
                      </Paper>
                    ))}
                  </Stack>
                ) : (
                  <Text size="sm" c="dimmed" lh={1.4}>
                    Saved setups will appear here after you save them from the
                    dashboard scenario inputs.
                  </Text>
                )}
                <Button component={Link} to="/dashboard" variant="light" size="xs">
                  Edit current inputs
                </Button>
              </Stack>
            )}
            {!isDashboard && !isDocs && !isScenarioPage && !isMobile && (
              <Stack gap="md" p="lg">
                <Title order={3} fw={600}>
                  Workspace
                </Title>
                <Stack gap="xs">
                  {[
                    { to: "/", label: "Home" },
                    { to: "/dashboard", label: "Dashboard" },
                    { to: "/scenarios", label: "Scenarios" },
                    { to: "/docs/overview", label: "Documentation" },
                    { to: "/profile", label: "Profile" },
                    { to: "/settings", label: "Settings" },
                  ].map((item) => (
                    <NavLink
                      key={item.to}
                      label={item.label}
                      component={Link}
                      to={item.to}
                      variant="light"
                      color="gray"
                    />
                  ))}
                </Stack>
              </Stack>
            )}
          </AppShell.Section>
        </AppShell.Navbar>
      )}

      {/* Main Content */}
      <AppShell.Main
        style={{
          background: "var(--mantine-color-body)",
          paddingTop: `${HEADER_HEIGHT}px`,
          height: "100vh",
          transition:
            "padding-left 180ms cubic-bezier(0.22, 1, 0.36, 1), padding-inline-start 180ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {showNavbar && (
          <ActionIcon
            onClick={toggleMobile}
            hiddenFrom="md"
            size="lg"
            radius="xl"
            variant="filled"
            aria-label="Toggle documentation navigation"
            style={{
              position: "fixed",
              bottom: 24,
              left: 24,
              zIndex: 200,
              backgroundColor: "var(--mantine-color-body)",
              color: SOLID_COLORS.hero,
              boxShadow: theme.shadows.md,
            }}
          >
            <LayoutSidebar size={20} />
          </ActionIcon>
        )}
        <ScrollArea
          h={`calc(100vh - ${HEADER_HEIGHT}px)`}
          styles={{
            root: { background: "var(--mantine-color-body)" },
            viewport: { background: "var(--mantine-color-body)" },
            content: { background: "var(--mantine-color-body)" },
          }}
        >
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
            }}
          >
            <Group justify="space-between" align="flex-start" wrap="nowrap">
              <Stack gap={6} style={{ flex: 1 }}>
                <Text fw={600}>New here? Start with the basics.</Text>
                <Text c="dimmed" size="sm">
                  This app compares renting vs. buying using cash-loss
                  (unrecoverable costs) and net worth. On a wide screen, adjust
                  inputs in the left sidebar; on mobile, expand Scenario inputs
                  at the top. Use the save icon to open saved scenarios, then
                  review the key insights and charts.
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
