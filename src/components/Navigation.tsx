import { Button, Group, Menu, ActionIcon, rgba } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useLocation, Link } from "react-router-dom";
import { Home, List, InfoCircle, DotsVertical } from "tabler-icons-react";
import { useAppTheme } from "../theme/useAppTheme";

export function Navigation() {
  const location = useLocation();
  const [opened, { toggle }] = useDisclosure(false);
  const { theme } = useAppTheme();

  const navItems = [
    { to: "/", label: "Home", icon: Home },
    { to: "/scenarios", label: "Scenarios", icon: List },
    { to: "/about", label: "About", icon: InfoCircle },
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
              variant={isActive ? "filled" : "subtle"}
              leftSection={<Icon size={18} />}
              size="sm"
              style={{
                color: theme.white,
                backgroundColor: isActive
                  ? rgba(theme.white, 0.2)
                  : "transparent",
              }}
              styles={{
                root: {
                  "&:hover": {
                    backgroundColor: rgba(theme.white, 0.15),
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
      <Menu
        shadow="md"
        width={200}
        position="bottom-end"
        opened={opened}
        onChange={toggle}
      >
        <Menu.Target>
          <ActionIcon
            size="lg"
            variant="subtle"
            style={{ color: theme.white }}
            aria-label="Toggle navigation"
            hiddenFrom="md"
          >
            <DotsVertical size={20} />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <Menu.Item
                key={item.to}
                component={Link}
                to={item.to}
                leftSection={<Icon size={16} />}
                onClick={toggle}
                style={{
                  backgroundColor: isActive
                    ? rgba(theme.colors.blue[6], 0.1)
                    : "transparent",
                }}
              >
                {item.label}
              </Menu.Item>
            );
          })}
        </Menu.Dropdown>
      </Menu>
    </>
  );
}
