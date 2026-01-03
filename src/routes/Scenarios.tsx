import { Container, Title, Text, Paper, Stack } from "@mantine/core";

export function Scenarios() {
  return (
    <Container size="xl">
      <Stack gap="lg">
        <Title order={1}>Saved Scenarios</Title>
        <Paper p="xl" withBorder radius="md">
          <Text c="dimmed">
            Scenario management functionality coming soon. You'll be able to
            save, load, and compare different scenarios here.
          </Text>
        </Paper>
      </Stack>
    </Container>
  );
}
