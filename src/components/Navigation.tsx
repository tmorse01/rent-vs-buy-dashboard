import { Button, Group, ActionIcon, rgba } from "@mantine/core";
import { useLocation, Link } from "react-router-dom";
import { Home, AdjustmentsHorizontal, InfoCircle } from "tabler-icons-react";
import { useAppTheme } from "../theme/useAppTheme";

export function Navigation() {
  const location = useLocation();
  const { theme } = useAppTheme();

  const navItems = [
    { to: "/", label: "Dashboard", icon: Home },
    { to: "/scenarios", label: "Scenarios", icon: AdjustmentsHorizontal },
    { to: "/about", label: "Documentation", icon: InfoCircle },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <Group gap="xs" visibleFrom="md" wrap="nowrap">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;
          return (
            <Button
              key={item.to}
              component={Link}
              to={item.to}
              variant="subtle"
              leftSection={<Icon size={18} />}
              size="sm"
              aria-current={isActive ? "page" : undefined}
              styles={{
                root: {
                  color: theme.white,
                  height: 40,
                  paddingInline: 16,
                  borderRadius: theme.radius.md,
                  borderBottom: isActive
                    ? `3px solid ${theme.white}`
                    : "3px solid transparent",
                  backgroundColor: isActive
                    ? rgba(theme.white, 0.18)
                    : "transparent",
                  "&:hover": {
                    backgroundColor: rgba(theme.white, 0.12),
                  },
                },
              }}
            >
              {item.label}
            </Button>
          );
        })}
      </Group>

      {/* Mobile Navigation */}
      <Group gap="xs" hiddenFrom="md" wrap="nowrap">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;
          return (
            <ActionIcon
              key={item.to}
              component={Link}
              to={item.to}
              size="lg"
              radius="xl"
              variant="subtle"
              aria-label={item.label}
              style={{
                color: theme.white,
                backgroundColor: isActive
                  ? rgba(theme.white, 0.18)
                  : "transparent",
              }}
            >
              <Icon size={20} />
            </ActionIcon>
          );
        })}
      </Group>
    </>
  );
}
