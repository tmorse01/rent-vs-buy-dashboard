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
    {
      to: "/docs/overview",
      label: "Documentation",
      icon: InfoCircle,
      match: (pathname: string) => pathname.startsWith("/docs"),
    },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <Group gap="xs" visibleFrom="md" wrap="nowrap">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.match
            ? item.match(location.pathname)
            : location.pathname === item.to;
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
                  color: isActive ? theme.colors.blue[6] : theme.colors.gray[7],
                  height: 40,
                  paddingInline: 16,
                  borderRadius: theme.radius.md,
                  borderBottom: isActive
                    ? `3px solid ${theme.colors.blue[6]}`
                    : "3px solid transparent",
                  backgroundColor: isActive
                    ? rgba(theme.colors.blue[6], 0.12)
                    : "transparent",
                  "&:hover": {
                    backgroundColor: rgba(theme.colors.blue[6], 0.08),
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
          const isActive = item.match
            ? item.match(location.pathname)
            : location.pathname === item.to;
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
                color: isActive ? theme.colors.blue[6] : theme.colors.gray[7],
                backgroundColor: isActive
                  ? rgba(theme.colors.blue[6], 0.12)
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
