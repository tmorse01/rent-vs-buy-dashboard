import { Container, Title, Text, Paper, Stack, List } from "@mantine/core";

export function About() {
  return (
    <Container size="xl" py="lg">
      <Stack gap="lg">
        <Title order={1}>About This Calculator</Title>

        <Paper p="xl" withBorder radius="md">
          <Stack gap="md">
            <Title order={3}>How It Works</Title>
            <Text>
              This rent vs. buy calculator compares the financial outcomes of
              renting versus buying a home over a specified time horizon. It
              accounts for all major costs and benefits of each option.
            </Text>
          </Stack>
        </Paper>

        <Paper p="xl" withBorder radius="md">
          <Stack gap="md">
            <Title order={3}>Key Metrics Explained</Title>
            <List>
              <List.Item>
                <strong>Cash-Loss Break-Even:</strong> The year when the owner's
                average monthly unrecoverable costs become less than or equal to
                the renter's average monthly rent.
              </List.Item>
              <List.Item>
                <strong>Net-Worth Break-Even:</strong> The year when the owner's
                net worth exceeds the renter's net worth.
              </List.Item>
              <List.Item>
                <strong>Net Worth Delta:</strong> The difference between owner
                and renter net worth at specific time points (5, 10, 15 years).
              </List.Item>
              <List.Item>
                <strong>Unrecoverable Costs:</strong> Costs that don't build
                equity, such as rent, interest, property taxes, insurance, and
                maintenance.
              </List.Item>
            </List>
          </Stack>
        </Paper>

        <Paper p="xl" withBorder radius="md">
          <Stack gap="md">
            <Title order={3}>Assumptions</Title>
            <Text>
              The calculator assumes consistent growth rates for rent, home
              appreciation, and investment returns. Actual results may vary
              based on market conditions and individual circumstances.
            </Text>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}
