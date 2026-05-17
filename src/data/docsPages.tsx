import { Stack, Text, List, Blockquote, Anchor } from "@mantine/core";
import { Link } from "react-router-dom";

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
            <strong>Taxes:</strong> simplified optional modeling for deductible
            mortgage interest and residential rental depreciation—not a substitute
            for tax advice or a full Schedule&nbsp;E.
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
          <List.Item>
            <strong>House hack:</strong> optional gross rental income offsets and
            a simplified depreciation tax shield (
            <Anchor component={Link} to="/docs/house-hack">
              Documentation → House hack
            </Anchor>
            ).
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
    slug: "house-hack",
    title: "House hack (optional)",
    summary:
      "Rent part of your home, offset owning costs, and understand the depreciation shorthand—without mistaking modeled tax savings for a full Schedule E simulation.",
    content: (
      <Stack gap="sm">
        <Text>
          Enabling House hack feeds <strong>gross</strong> tenant rent straight
          into the cash-loss math plus an optional depreciation tax shield. Vacancy,
          repairs, management fees, HOA splits, capex reserves, financing points,
          and real-world depreciation conventions are deliberately omitted—the goal
          is a directional knob, not a landlord P&amp;L.
        </Text>
        <Text>
          Income follows the same <strong>annual step</strong> pattern as tenant
          rent inputs: rent is flat within each calendar year, then bumps once when
          a new year starts.
        </Text>
        <Text fw={600}>Square footage sanity check</Text>
        <Text>
          1,300 rented sq ft ÷ 3,000 total ≈ <strong>43.3%</strong> of interior
          area—not ~30%. A ~30% share would imply ≈900 ÷ 3,000. Also remember the
          model separates <strong>land</strong> (not depreciated) via the land %
          slider before applying the rented fraction to depreciable{" "}
          <strong>building</strong> basis.
        </Text>
        <Text fw={600}>Depreciation disclaimer</Text>
        <Text>
          The tool approximates depreciation as rental building allocation ÷ 27.5
          years, then treats the deduction&apos;s valuation like other toggles{" "}
          (deduction × marginal rate ÷ month). Actual returns involve mid-month
          rules, allocations, passive activity limits, capital accounts, basis
          changes, and <strong>recapture</strong> when you exit—none of which are
          net-worth-layered yet. Discuss strategy with a tax pro before banking on
          the cash-flow wedge.
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
