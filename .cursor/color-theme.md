# Rent vs Buy Dashboard - Color Theme

## Design Philosophy

This color theme is designed for a **financial decision-making tool** that needs to:

- Inspire **trust and confidence** (professional, not playful)
- Provide **clear visual distinction** between owner and renter scenarios
- Ensure **excellent readability** and accessibility
- Feel **modern and polished** without being distracting
- Work well for **data visualization** (charts, graphs, metrics)

## Quick Reference

**Owner Scenario**: Blue (`blue[6]` = `#2563eb`)  
**Renter Scenario**: Cyan (`cyan[6]` = `#0891b2`)  
**Accent Color**: Violet (`violet[6]` = `#7c3aed`)  
**Primary Color**: Blue (used for buttons, links, focus states)

## Mantine Theme

The theme is configured in `src/theme/theme.ts` and applied via `MantineProvider`.

### Color Usage in Components

```tsx
// Use Mantine color props
<Button color="blue">Owner Action</Button>
<Button color="cyan">Renter Action</Button>
<Badge color="violet">Accent Badge</Badge>

// Access colors via theme
import { useMantineTheme } from '@mantine/core';
const theme = useMantineTheme();
const ownerColor = theme.colors.blue[6]; // #2563eb
const renterColor = theme.colors.cyan[6]; // #0891b2

// Or use the colors constant file
import { COLORS } from './theme/colors';
const ownerColor = COLORS.owner.primary;
```

## Color Palette

### Primary Colors (Mantine Theme)

**Blue** - Owner scenario, primary brand color

- `blue[6]` = `#2563eb` - Main owner color (charts, primary actions)
- `blue[3]` = `#93c5fd` - Light fills, backgrounds
- `blue[8]` = `#1e40af` - Dark variant for gradients

**Cyan** - Renter scenario (distinct from blue)

- `cyan[6]` = `#0891b2` - Main renter color (charts, renter actions)
- `cyan[3]` = `#67e8f9` - Light fills, backgrounds
- `cyan[8]` = `#0e7490` - Dark variant for gradients

**Violet** - Accent color for highlights

- `violet[6]` = `#7c3aed` - Accent highlights, special metrics
- `violet[4]` = `#a78bfa` - Light accents

**Why Blue + Cyan?**

- Complementary but clearly distinct
- Both professional and trustworthy
- High contrast for accessibility
- Work well in both light and dark modes
- Avoid red/orange which can imply "danger" or "loss"

### Semantic Colors (Mantine Defaults)

Use Mantine's built-in semantic colors:

- **Success**: `green` (positive metrics, gains)
- **Warning**: `yellow` or `orange` (warnings, important notices)
- **Error**: `red` (errors, critical issues - use sparingly)
- **Info**: `blue` or `violet` (informational elements)

### Neutral Colors

**Backgrounds**

- Primary: `#ffffff` (White) - Main content background
- Secondary: `#f8fafc` (Slate 50) - Page background, subtle sections
- Tertiary: `#f1f5f9` (Slate 100) - Card backgrounds, inputs
- Elevated: `#ffffff` (White) - Cards, modals, dropdowns

**Borders & Dividers**

- Light: `#e2e8f0` (Slate 200) - Subtle borders
- Medium: `#cbd5e1` (Slate 300) - Standard borders
- Dark: `#94a3b8` (Slate 400) - Emphasis borders

**Text**

- Primary: `#0f172a` (Slate 900) - Main text, headings
- Secondary: `#475569` (Slate 600) - Secondary text, labels
- Tertiary: `#64748b` (Slate 500) - Muted text, hints
- Disabled: `#94a3b8` (Slate 400) - Disabled text

### Chart-Specific Colors

**Reference Lines & Markers**

- 5/10/15 Year Markers: `#64748b` (Slate 500) - Subtle but visible
- Grid Lines: `#e2e8f0` (Slate 200) - Very subtle
- Zero Line: `#cbd5e1` (Slate 300) - Medium visibility

**Wealth Stack Chart Colors**

- Principal Paid: `#2563eb` (Blue 600)
- Net Appreciation: `green[6]` (Mantine success color)
- Interest Paid (narrative): `#f59e0b` (Amber 500) - Optional, for explanation

**Net Worth Chart**

- Owner: `#2563eb` (Blue 600)
- Renter: `#0891b2` (Cyan 600)
- Positive Delta: `green[6]` (Mantine success color)
- Negative Delta: `red[6]` (Mantine danger color)

### Gradient Combinations

**Hero/Header Gradient**

- `linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)`
- Professional, modern, trustworthy

**Key Metric Cards (KeyInsights Component)**

The top 4 key metric cards in the Key Insights section use a consistent color palette that matches the chart theme. **Purple colors are avoided** in favor of blue, teal, yellow, and emerald:

1. **Monthly Payment**: `GRADIENTS.owner`
   - Blue gradient: `#2563eb` → `#1e40af`
   - Matches owner color in charts (`blue.6`)
   - Represents owner-related costs

2. **Unrecoverable (10yr)**: `GRADIENTS.warning`
   - Amber/Yellow gradient: `#f59e0b` → `#d97706`
   - Highlights important cost information
   - Matches warning/attention colors in charts

3. **Break-Even**: `GRADIENTS.teal`
   - Teal gradient: `#14b8a6` → `#0d9488`
   - Distinct color for break-even metrics
   - Complements the cyan/teal used for renter scenarios

4. **NW Advantage**: `GRADIENTS.positive`
   - Emerald/Green gradient: `#10b981` → `#059669`
   - Always uses emerald (matches positive values in charts)
   - Consistent with success/positive indicators

**Color Philosophy**: The Key Insights cards intentionally avoid purple/indigo/violet colors to maintain consistency with the chart color scheme (blue for owner, cyan/teal for renter, green for positive, yellow/amber for warnings).

**Available Metric Card Gradients**

All gradients are available in `src/theme/colors.ts` via `GRADIENTS`:

**Key Insights Cards (Top Section)** - Uses only these 4:

- `owner`: Blue gradient (`#2563eb` to `#1e40af`) - Monthly Payment
- `warning`: Amber gradient (`#f59e0b` to `#d97706`) - Unrecoverable
- `teal`: Teal gradient (`#14b8a6` to `#0d9488`) - Break-Even
- `positive`: Emerald gradient (`#10b981` to `#059669`) - NW Advantage

**Detailed Metric Cards (MetricsDisplay Component)** - Uses various gradients for uniqueness:

- `renter`: Cyan gradient (`#0891b2` to `#0e7490`)
- `breakEvenCash`: Blue gradient (`#2563eb` to `#1e40af`)
- `breakEvenNetWorth`: Indigo gradient (`#6366f1` to `#4f46e5`) - Not used in Key Insights
- `negative`: Violet gradient (`#7c3aed` to `#6d28d9`) - Not used in Key Insights
- `rose`: Rose gradient (`#f43f5e` to `#e11d48`)
- `emerald`: Emerald gradient (`#10b981` to `#059669`)
- `sky`: Sky blue gradient (`#0ea5e9` to `#0284c7`)
- `purple`: Purple gradient (`#a855f7` to `#9333ea`) - Not used in Key Insights
- `orange`: Orange gradient (`#fb923c` to `#f97316`)
- `pink`: Pink gradient (`#ec4899` to `#db2777`)
- `lime`: Lime gradient (`#84cc16` to `#65a30d`)

**Note**: Key Insights intentionally avoids purple/indigo/violet colors to maintain consistency with chart colors.

**Subtle Background Gradients**

- `linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)`
- `linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%)` - Light blue tint

## Dark Mode

Mantine handles dark mode automatically. The theme colors work in both light and dark modes. For dark mode, Mantine will use lighter shades of the same colors (e.g., `blue[4]` instead of `blue[6]` for better contrast).

## Implementation

The theme is already configured in `src/theme/theme.ts` and applied in `App.tsx`.

### Using Colors in Charts

```tsx
import { useMantineTheme } from '@mantine/core';

function MyChart() {
  const theme = useMantineTheme();

  return (
    <Line
      dataKey="owner"
      stroke={theme.colors.blue[6]} // #2563eb
      name="Owner"
    />
    <Line
      dataKey="renter"
      stroke={theme.colors.cyan[6]} // #0891b2
      name="Renter"
    />
  );
}
```

### Using Colors in Components

```tsx
// Via Mantine props (recommended)
<Button color="blue">Owner Action</Button>
<Badge color="cyan">Renter Badge</Badge>
<Paper c="violet">Accent Card</Paper>

// Direct color access
import { COLORS } from './theme/colors';
<div style={{ color: COLORS.owner.primary }}>Owner Text</div>
```

### Color Constants (Recommended)

For direct color access without theme, use `src/theme/colors.ts`:

```typescript
import { COLORS, GRADIENTS } from "./theme/colors";

// Direct color values
const ownerColor = COLORS.owner.primary; // #2563eb
const renterColor = COLORS.renter.primary; // #0891b2

// Gradients for Key Insights cards (matches chart theme)
const ownerGradient = GRADIENTS.owner; // Blue - Monthly Payment
const warningGradient = GRADIENTS.warning; // Yellow/Amber - Unrecoverable
const tealGradient = GRADIENTS.teal; // Teal - Break-Even
const positiveGradient = GRADIENTS.positive; // Emerald - NW Advantage

// Additional gradients available for detailed metric cards
const renterGradient = GRADIENTS.renter; // Cyan
const negativeGradient = GRADIENTS.negative; // Violet (available but not used in Key Insights)
const skyGradient = GRADIENTS.sky;
const purpleGradient = GRADIENTS.purple; // Available but avoided in Key Insights
// ... and more (see colors.ts for full list)
```

**Important Notes**:

- Key Insights cards use: **Blue, Teal, Yellow, and Emerald** (no purple)
- The `negative` gradient is violet (`#7c3aed` to `#6d28d9`) but is not used in Key Insights
- Purple/indigo colors are intentionally avoided in Key Insights to match chart color scheme

## Accessibility Considerations

1. **Contrast Ratios**
   - All text meets WCAG AA standards (4.5:1 for normal text, 3:1 for large text)
   - Interactive elements have 3:1 contrast minimum

2. **Color Blindness**
   - Blue and Teal are distinguishable for most colorblind users
   - Don't rely solely on color - use icons, patterns, or labels
   - Test with colorblind simulators

3. **Focus States**
   - Use `#2563eb` with 2px outline for focus indicators
   - Ensure focus is visible on all interactive elements

## Usage Examples

### Metric Cards

**Key Insights Cards (Top Section)**

```tsx
import { GRADIENTS } from "./theme/colors";

// Monthly Payment - Blue (owner)
<Paper
  style={{
    background: GRADIENTS.owner,
    color: "white",
    border: "none",
  }}
>
  Monthly Payment
</Paper>

// Unrecoverable - Yellow/Amber (warning)
<Paper
  style={{
    background: GRADIENTS.warning,
    color: "white",
    border: "none",
  }}
>
  Unrecoverable (10yr)
</Paper>

// Break-Even - Teal
<Paper
  style={{
    background: GRADIENTS.teal,
    color: "white",
    border: "none",
  }}
>
  Break-Even
</Paper>

// NW Advantage - Emerald (positive)
<Paper
  style={{
    background: GRADIENTS.positive,
    color: "white",
    border: "none",
  }}
>
  NW Advantage
</Paper>
```

**Detailed Metric Cards (MetricsDisplay Component)**

```tsx
import { GRADIENTS } from "./theme/colors";
import { MetricCard } from "./components/MetricCard";

<MetricCard
  title="Net Worth Delta (5 years)"
  value={metrics.netWorthDelta5}
  cardColor={GRADIENTS.teal} // Unique color for each card
  // ... other props
/>;
```

**Note**: All metric cards use white text when a `cardColor` gradient is applied for optimal contrast and readability.

### Charts

```tsx
// Owner: theme.colors.blue[6] or COLORS.owner.primary
// Renter: theme.colors.cyan[6] or COLORS.renter.primary
// Reference lines: theme.colors.gray[5]
// Grid: theme.colors.gray[2]
```

### Buttons & Actions

```tsx
<Button color="blue">Primary Action</Button>
<Button color="cyan" variant="outline">Secondary</Button>
<Button color="green">Success</Button>
<Button color="red">Danger</Button>
```

## Visual Hierarchy

1. **Most Important** (Hero metrics): Bold gradients, large text
2. **Important** (Charts, key data): Colored lines, prominent cards
3. **Supporting** (Labels, descriptions): Muted text, smaller sizes
4. **Background** (Borders, dividers): Very subtle, minimal

## Summary

This color theme creates a **professional, trustworthy, and clear** visual experience for a financial decision-making tool. The blue/teal pairing for owner/renter scenarios is distinct yet harmonious, and the overall palette supports excellent readability and accessibility.

### Key Insights Color Strategy

The Key Insights section (top 4 metric cards) uses a focused color palette that directly matches the chart colors:

- **Blue** for owner-related metrics
- **Teal** for break-even and complementary metrics
- **Yellow/Amber** for warnings and important cost information
- **Emerald/Green** for positive outcomes and advantages

This creates visual consistency between the key metrics and the detailed charts below, making it easier for users to connect the summary information with the detailed visualizations.
