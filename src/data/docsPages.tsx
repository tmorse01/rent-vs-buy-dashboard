import { Stack, Text, List, Blockquote } from "@mantine/core";

export const DOC_PAGES = [
  {
    slug: "overview",
    title: "Overview (60‑second guide)",
    summary: "What this dashboard does, who it’s for, and how to use it fast.",
    content: (
      <Stack gap="sm">
        <Text>
          This dashboard helps first‑time buyers who are currently renting
          compare renting vs. buying in today’s affordability crunch (where a
          “starter home” can be $500k). It answers one core question: which
          option leaves you with higher net worth after N years?
        </Text>
        <Text>
          It also answers a cash‑flow question from the home dashboard: when do
          owner unrecoverable costs (interest, taxes, insurance, maintenance,
          PMI) drop to or below rent?
        </Text>
        <List spacing="md">
          <List.Item>
            <strong>Who it’s for:</strong> first‑time buyers, move‑up buyers, or
            renters evaluating when ownership makes sense.
          </List.Item>
          <List.Item>
            <strong>What a scenario is:</strong> a set of inputs for one
            strategy (Base, Conservative, Aggressive).
          </List.Item>
          <List.Item>
            <strong>What the output answers:</strong> net worth at year N,
            break‑even timing, and monthly cash‑loss comparison.
          </List.Item>
          <List.Item>
            <strong>Where to look:</strong> Key Insights → Analysis Charts →
            Detailed Metrics → Break‑even & Recommendation.
          </List.Item>
        </List>
        <Text>
          How to use it in 60 seconds: set your scenario inputs, scan Key
          Insights, then check the break‑even section and charts for context.
        </Text>
      </Stack>
    ),
  },
  {
    slug: "assumptions-definitions",
    title: "Key Assumptions & Definitions",
    summary: "The concepts that prevent 90% of confusion.",
    content: (
      <Stack gap="sm">
        <Text>
          The model is simple on purpose so the decision is clear. Here are the
          concepts that matter most.
        </Text>
        <List spacing="md">
          <List.Item>
            <strong>Time horizon:</strong> results change dramatically between 5
            vs. 10 vs. 15 years because compounding needs time.
          </List.Item>
          <List.Item>
            <strong>Unrecoverable costs:</strong> interest, taxes, insurance,
            maintenance, and PMI. Principal is not unrecoverable.
          </List.Item>
          <List.Item>
            <strong>Owner vs renter:</strong> owner unrecoverable costs are the
            non‑equity costs above; renter unrecoverable cost is rent.
          </List.Item>
          <List.Item>
            <strong>Opportunity cost:</strong> if you rent, the down payment is
            invested; if you buy, it’s tied up as equity.
          </List.Item>
          <List.Item>
            <strong>Nominal dollars:</strong> results are not inflation‑adjusted
            unless you set lower real growth rates.
          </List.Item>
          <List.Item>
            <strong>Taxes:</strong> not modeled in detail; treat outputs as
            directional, not advice.
          </List.Item>
        </List>
        <Text>
          Beginner tip: mortgages are front‑loaded with interest, so early
          payments feel expensive. That is why break‑even timing matters.
        </Text>
      </Stack>
    ),
  },
  {
    slug: "inputs-reference",
    title: "Inputs Reference (Buy, Mortgage, Ongoing, Rent, Investing)",
    summary: "What each input means and why it matters.",
    content: (
      <Stack gap="sm">
        <Text>
          If you are unsure, keep defaults and focus on three drivers: time
          horizon, interest rate, and maintenance/taxes.
        </Text>
        <Text>
          These inputs drive the Key Insights cards and the analysis charts on
          the Home dashboard.
        </Text>
        <List spacing="md">
          <List.Item>
            <strong>Buy:</strong> price, down payment, closing costs, selling
            costs (one‑time costs with big impact at $500k).
          </List.Item>
          <List.Item>
            <strong>Mortgage:</strong> rate, term, PMI rules (low down payments
            can stretch cash‑loss break‑even).
          </List.Item>
          <List.Item>
            <strong>Ongoing ownership:</strong> property tax, insurance,
            maintenance (these are the “silent” costs that surprise first‑time
            buyers).
          </List.Item>
          <List.Item>
            <strong>Rent:</strong> starting rent and growth rate.
          </List.Item>
          <List.Item>
            <strong>Investing:</strong> return rate and “invest the difference”
            rule for monthly surplus.
          </List.Item>
        </List>
      </Stack>
    ),
  },
  {
    slug: "results-metrics",
    title: "Results & Metrics Reference",
    summary: "What each output means and how to interpret it.",
    content: (
      <Stack gap="sm">
        <List spacing="md">
          <List.Item>
            <strong>Net worth:</strong> owner equity (after selling costs)
            versus renter investment balance.
          </List.Item>
          <List.Item>
            <strong>Net worth delta:</strong> owner minus renter at a given
            year.
          </List.Item>
          <List.Item>
            <strong>Cash‑loss break‑even:</strong> first year owning’s average
            unrecoverable cost is at or below rent.
          </List.Item>
          <List.Item>
            <strong>Net‑worth break‑even:</strong> first year ownership net
            worth exceeds renting.
          </List.Item>
          <List.Item>
            <strong>Monthly cost view:</strong> why owning can feel more
            expensive early but still win long‑term.
          </List.Item>
        </List>
        <Text>
          These map directly to the Home sections: Net Worth chart,
          Unrecoverable Costs chart, Wealth Stack, and the Break‑even
          recommendation.
        </Text>
        <Text>
          Example: on a $500k home, a $3,000 payment might be $1,800 interest
          and $1,200 principal. The $1,800 is cash‑loss; the $1,200 builds
          equity.
        </Text>
      </Stack>
    ),
  },
  {
    slug: "faq",
    title: "FAQ (Top Confusions)",
    summary: "Plain‑English answers to common questions.",
    content: (
      <Stack gap="sm">
        <List spacing="md">
          <List.Item>
            <strong>
              Why does renting win even though buying builds equity?
            </strong>
            <Blockquote color="blue" radius="sm">
              Renting can win when rates, prices, and fees are high and your
              income‑to‑price ratio is low. High rates push more of each payment
              into interest, high prices magnify taxes and insurance, and fees
              make short horizons expensive. If rent is lower than owning’s
              unrecoverable costs, renting can stay ahead for years.
            </Blockquote>
          </List.Item>
          <List.Item>
            <strong>
              Why is owning monthly cost higher but net worth higher?
            </strong>
            <Blockquote color="blue" radius="sm">
              Because principal paydown and appreciation can compound even when
              monthly cash‑loss is larger.
            </Blockquote>
          </List.Item>
          <List.Item>
            <strong>Why does break‑even feel far away?</strong>
            <Blockquote color="blue" radius="sm">
              Mortgages are interest‑heavy at the start, and in high‑rate
              markets that interest share grows. When income hasn’t kept pace
              with home prices, it takes longer for equity and appreciation to
              overcome the monthly cash‑loss gap.
            </Blockquote>
          </List.Item>
          <List.Item>
            <strong>
              What does “income‑to‑price ratio” have to do with renting winning?
            </strong>
            <Blockquote color="blue" radius="sm">
              When income grows slower than home prices, buyers stretch to
              afford payments. That increases the share of unrecoverable costs
              and delays break‑even, making renting the financially safer
              baseline in the near term.
            </Blockquote>
          </List.Item>
          <List.Item>
            <strong>What should I set maintenance to?</strong>
            <Blockquote color="blue" radius="sm">
              Use 1% of home value as a starting point, then stress‑test higher.
            </Blockquote>
          </List.Item>
          <List.Item>
            <strong>Break‑even is never?</strong>
            <Blockquote color="blue" radius="sm">
              That usually means the horizon is too short or costs are too high
              for ownership to catch up.
            </Blockquote>
          </List.Item>
        </List>
      </Stack>
    ),
  },
] as const;

export type DocPage = (typeof DOC_PAGES)[number];
