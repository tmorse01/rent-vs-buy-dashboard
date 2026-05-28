import type { ReactNode } from "react";
import {
  Box,
  Button,
  Container,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { Calendar, CurrencyDollar, TrendingUp } from "tabler-icons-react";
import { Link } from "react-router-dom";
import { COLORS } from "../theme/colors";

const FEATURES = [
  {
    title: "True cost comparison",
    description:
      "Compare mortgage payments, rent, taxes, insurance, maintenance, closing costs, and opportunity cost.",
    icon: CurrencyDollar,
  },
  {
    title: "Break-even timeline",
    description:
      "See how long it may take for buying to become financially stronger than renting.",
    icon: Calendar,
  },
  {
    title: "Long-term wealth view",
    description:
      "Visualize estimated equity, investment growth, and net worth over your selected time horizon.",
    icon: TrendingUp,
  },
];

export function Landing() {
  return (
    <Container size="md" py={{ base: "xl", md: 48 }} px="md">
      <Stack gap="xl">
        <Stack gap="md" ta="center" maw={640} mx="auto">
          <Text
            size="xs"
            tt="uppercase"
            fw={700}
            c={COLORS.brand.primary}
            style={{ letterSpacing: "0.12em" }}
          >
            HomeEdge
          </Text>
          <Title order={1} fw={700} lh={1.15}>
            Rent vs buy, calculated clearly.
          </Title>
          <Text size="lg" c="dimmed" lh={1.55}>
            HomeEdge helps you compare monthly cost, long-term wealth, equity
            growth, and break-even timing before you decide whether to rent or
            buy.
          </Text>
          <Group justify="center" gap="sm" mt="xs" wrap="wrap">
            <Button
              component={Link}
              to="/dashboard"
              size="md"
              style={{ fontWeight: 600 }}
            >
              Start Comparing
            </Button>
            <Button
              component={Link}
              to="/dashboard"
              variant="default"
              size="md"
            >
              View example scenario
            </Button>
          </Group>
        </Stack>

        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md" mt="lg">
          {FEATURES.map(({ title, description, icon: Icon }) => (
            <Paper key={title} p="lg" radius="md" withBorder>
              <Stack gap="sm">
                <ThemeIconWrapper>
                  <Icon size={22} />
                </ThemeIconWrapper>
                <Title order={4} fw={600}>
                  {title}
                </Title>
                <Text size="sm" c="dimmed" lh={1.55}>
                  {description}
                </Text>
              </Stack>
            </Paper>
          ))}
        </SimpleGrid>

        <Stack align="center" gap="xs" pt="xl" pb="md">
          <Text size="sm" c="dimmed" ta="center" maw={520} lh={1.5}>
            HomeEdge is an educational planning tool. Results are estimates
            based on your assumptions.
          </Text>
        </Stack>
      </Stack>
    </Container>
  );
}

function ThemeIconWrapper({ children }: { children: ReactNode }) {
  return (
    <Box
      w={42}
      h={42}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        backgroundColor: "rgba(37, 99, 235, 0.1)",
        color: COLORS.brand.primary,
      }}
    >
      {children}
    </Box>
  );
}
