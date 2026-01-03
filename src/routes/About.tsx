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
            <Title order={3}>Unrecoverable Costs: The Key Concept</Title>
            <Text>
              <strong>Unrecoverable costs</strong> are expenses that don't build
              equity or wealth—money you spend that you'll never get back. This
              is the most important concept for understanding the rent vs. buy
              decision.
            </Text>
            <Text>
              <strong>Why it matters:</strong> When comparing renting vs.
              buying, you need to look at what you're "losing" each month—the
              money that goes out the door and never comes back. These costs
              compound over time and can make a huge difference in your
              long-term financial position.
            </Text>
            <Title order={4}>Owner Unrecoverable Costs</Title>
            <Text>For homeowners, unrecoverable costs include:</Text>
            <List>
              <List.Item>
                <strong>Mortgage Interest:</strong> The interest portion of your
                monthly mortgage payment. This is money paid to the bank that
                doesn't build equity.
              </List.Item>
              <List.Item>
                <strong>Property Taxes:</strong> Annual taxes based on your
                home's assessed value. These typically increase over time as
                your home value appreciates.
              </List.Item>
              <List.Item>
                <strong>Homeowners Insurance:</strong> Monthly insurance
                premiums to protect your property.
              </List.Item>
              <List.Item>
                <strong>Maintenance & Repairs:</strong> Ongoing costs to keep
                your home in good condition. This includes everything from
                routine maintenance to major repairs like roof replacement or
                HVAC systems.
              </List.Item>
              <List.Item>
                <strong>PMI (Private Mortgage Insurance):</strong> Additional
                insurance required if your down payment is less than 20% of the
                home value. This typically drops off once you reach 20% equity.
              </List.Item>
            </List>
            <Text>
              <strong>What's NOT unrecoverable:</strong> The principal portion
              of your mortgage payment builds equity—it's money you're
              essentially paying to yourself. Home appreciation also builds
              wealth, though selling costs reduce the net benefit.
            </Text>
            <Title order={4}>Renter Unrecoverable Costs</Title>
            <Text>For renters, the primary unrecoverable cost is:</Text>
            <List>
              <List.Item>
                <strong>Rent:</strong> Your monthly rent payment. This is 100%
                unrecoverable—you pay it and it's gone forever. Unlike a
                mortgage principal payment, rent doesn't build any equity or
                ownership stake.
              </List.Item>
            </List>
            <Title order={4}>Example: How Unrecoverable Costs Accumulate</Title>
            <Text>
              Let's say you're comparing a $2,500/month rent vs. a $3,200/month
              mortgage payment. At first glance, renting seems cheaper. But
              consider:
            </Text>
            <List>
              <List.Item>
                If $800 of that mortgage payment goes to principal (building
                equity), your actual unrecoverable cost is only $2,400/month.
              </List.Item>
              <List.Item>
                Over 10 years, the renter pays $300,000 in rent (assuming 2%
                annual increases), all of which is unrecoverable.
              </List.Item>
              <List.Item>
                The owner might pay $288,000 in unrecoverable costs over the
                same period, but also builds $96,000 in equity through principal
                payments, plus benefits from home appreciation.
              </List.Item>
            </List>
            <Text>
              <strong>The key insight:</strong> Unrecoverable costs are what
              truly matter for cash flow comparison. The principal you pay on a
              mortgage is forced savings—money that builds wealth. Rent is money
              that disappears forever.
            </Text>
          </Stack>
        </Paper>

        <Paper p="xl" withBorder radius="md">
          <Stack gap="md">
            <Title order={3}>Other Key Metrics Explained</Title>
            <List>
              <List.Item>
                <strong>Cash-Loss Break-Even:</strong> The year when the owner's
                average monthly unrecoverable costs become less than or equal to
                the renter's average monthly rent. This is when owning becomes
                cheaper on a monthly cash-flow basis.
              </List.Item>
              <List.Item>
                <strong>Net-Worth Break-Even:</strong> The year when the owner's
                net worth exceeds the renter's net worth. This accounts for
                equity, appreciation, and investment returns.
              </List.Item>
              <List.Item>
                <strong>Net Worth Delta:</strong> The difference between owner
                and renter net worth at specific time points (5, 10, 15 years).
                Positive values mean the owner is ahead financially.
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
