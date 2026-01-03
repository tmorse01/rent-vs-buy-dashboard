import { NavLink, Burger, Group, Box, useMantineTheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useLocation, Link } from "react-router-dom";
import { Home, List, InfoCircle } from "tabler-icons-react";

export function Navigation() {
  const theme = useMantineTheme();
  const location = useLocation();
  const [opened, { toggle }] = useDisclosure(false);

  const navItems = [
    { to: "/", label: "Home", icon: Home },
    { to: "/scenarios", label: "Scenarios", icon: List },
    { to: "/about", label: "About", icon: InfoCircle },
  ];

  return (
    <Box>
      {/* Desktop Navigation */}
      <Group gap="xs" visibleFrom="md">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              component={Link}
              to={item.to}
              label={item.label}
              leftSection={<Icon size={18} />}
              active={isActive}
              style={{
                borderRadius: theme.radius.md,
              }}
            />
          );
        })}
      </Group>

      {/* Mobile Navigation */}
      <Burger opened={opened} onClick={toggle} hiddenFrom="md" size="sm" />
      {opened && (
        <Box
          hiddenFrom="md"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: theme.white,
            border: `1px solid ${theme.colors.gray[2]}`,
            borderRadius: theme.radius.md,
            padding: theme.spacing.md,
            zIndex: 1000,
            marginTop: theme.spacing.xs,
          }}
        >
          <Stack gap="xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <NavLink
                  key={item.to}
                  component={Link}
                  to={item.to}
                  label={item.label}
                  leftSection={<Icon size={18} />}
                  active={isActive}
                  onClick={() => toggle()}
                />
              );
            })}
          </Stack>
        </Box>
      )}
    </Box>
  );
}
