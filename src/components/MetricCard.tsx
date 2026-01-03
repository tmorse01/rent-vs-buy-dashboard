import {
  Paper,
  Text,
  Title,
  Group,
  Tooltip,
  ActionIcon,
  Stack,
} from "@mantine/core";
import { InfoCircle, TrendingUp, TrendingDown } from "tabler-icons-react";
import { formatMetricValue } from "../utils/formatting";

interface MetricCardProps {
  title: string;
  value: string | number | null;
  description?: string;
  icon?: React.ReactNode;
  tooltip?: string;
  trend?: "up" | "down" | "neutral";
}

export function MetricCard({
  title,
  value,
  description,
  icon,
  tooltip,
  trend,
}: MetricCardProps) {
  const displayValue = formatMetricValue(value);
  const isPositive = typeof value === "number" && value > 0;
  const isNegative = typeof value === "number" && value < 0;

  const getTrendIcon = () => {
    if (trend === "up" || (trend === undefined && isPositive)) {
      return <TrendingUp size={18} />;
    }
    if (trend === "down" || (trend === undefined && isNegative)) {
      return <TrendingDown size={18} />;
    }
    return null;
  };

  const getValueColor = () => {
    if (value === null) return "dimmed";
    if (isPositive) return "green.7";
    if (isNegative) return "red.7";
    return undefined;
  };

  return (
    <Paper p="lg" withBorder radius="md" shadow="xs" style={{ height: "100%" }}>
      <Stack gap="xs">
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <Group gap="xs" wrap="nowrap" style={{ flex: 1 }}>
            {icon && (
              <div style={{ color: "var(--mantine-color-gray-6)" }}>{icon}</div>
            )}
            <Title order={5} style={{ flex: 1, lineHeight: 1.2 }}>
              {title}
            </Title>
          </Group>
          {tooltip && (
            <Tooltip
              label={tooltip}
              withArrow
              multiline
              style={{ maxWidth: 300 }}
            >
              <ActionIcon variant="subtle" size="sm" color="gray">
                <InfoCircle size={16} />
              </ActionIcon>
            </Tooltip>
          )}
        </Group>
        <Group gap="xs" align="center" wrap="nowrap">
          <Text size="xl" fw={700} c={getValueColor()} style={{ flex: 1 }}>
            {displayValue}
          </Text>
          {getTrendIcon() && (
            <div style={{ color: getValueColor() }}>{getTrendIcon()}</div>
          )}
        </Group>
        {description && (
          <Text size="sm" c="dimmed" mt="xs">
            {description}
          </Text>
        )}
      </Stack>
    </Paper>
  );
}
