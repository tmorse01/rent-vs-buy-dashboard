import { useState, useLayoutEffect, useRef } from "react";
import {
  Paper,
  Text,
  Title,
  Group,
  Tooltip,
  ActionIcon,
  Stack,
  Box,
} from "@mantine/core";
import { Sparkline } from "@mantine/charts";
import { InfoCircle, TrendingUp, TrendingDown } from "tabler-icons-react";
import { formatMetricValue } from "../utils/formatting";

interface MetricCardProps {
  title: string;
  value: string | number | null;
  description?: string;
  icon?: React.ReactNode;
  tooltip?: string;
  trend?: "up" | "down" | "neutral";
  sparklineData?: number[];
  sparklineColor?: string;
}

export function MetricCard({
  title,
  value,
  description,
  icon,
  tooltip,
  trend,
  sparklineData,
  sparklineColor,
}: MetricCardProps) {
  const [isReady, setIsReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleContainerRef = (node: HTMLDivElement | null) => {
    if (node && sparklineData && sparklineData.length > 0) {
      containerRef.current = node;
      // Use requestAnimationFrame to ensure DOM is laid out
      requestAnimationFrame(() => {
        const { width, height } = node.getBoundingClientRect();
        if (width > 0 && height > 0) {
          setIsReady(true);
        }
      });
    } else {
      setIsReady(false);
    }
  };

  useLayoutEffect(() => {
    if (!sparklineData || sparklineData.length === 0) {
      setIsReady(false);
      return;
    }
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setIsReady(true);
        }
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [sparklineData]);

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

  const getSparklineColor = () => {
    if (sparklineColor) return sparklineColor;
    const valueColor = getValueColor();
    if (valueColor === "green.7") return "green";
    if (valueColor === "red.7") return "red";
    return "blue";
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
        {sparklineData && sparklineData.length > 0 && (
          <Box
            ref={handleContainerRef}
            mt="xs"
            style={{ minWidth: 0, width: "100%", minHeight: 60, height: 60 }}
          >
            {isReady && (
              <Sparkline
                w="100%"
                h={60}
                data={sparklineData}
                curveType="linear"
                color={getSparklineColor()}
                fillOpacity={0.6}
                strokeWidth={2}
              />
            )}
          </Box>
        )}
        {description && (
          <Text size="sm" c="dimmed" mt="xs">
            {description}
          </Text>
        )}
      </Stack>
    </Paper>
  );
}
