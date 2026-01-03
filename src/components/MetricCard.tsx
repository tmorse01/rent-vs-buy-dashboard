import { Paper, Text, Title } from '@mantine/core';

interface MetricCardProps {
  title: string;
  value: string | number | null;
  description?: string;
}

export function MetricCard({ title, value, description }: MetricCardProps) {
  const displayValue = value === null ? 'N/A' : typeof value === 'number' ? value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }) : value;

  return (
    <Paper p="lg" withBorder radius="md" shadow="xs" style={{ height: '100%' }}>
      <Title order={5} mb="xs">
        {title}
      </Title>
      <Text size="xl" fw={700} c={value === null ? 'dimmed' : undefined}>
        {displayValue}
      </Text>
      {description && (
        <Text size="sm" c="dimmed" mt="xs">
          {description}
        </Text>
      )}
    </Paper>
  );
}

