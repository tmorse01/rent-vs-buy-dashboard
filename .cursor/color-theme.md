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
- Net Appreciation: `#10b981` (Emerald 500)
- Interest Paid (narrative): `#f59e0b` (Amber 500) - Optional, for explanation

**Net Worth Chart**

- Owner: `#2563eb` (Blue 600)
- Renter: `#0891b2` (Cyan 600)
- Positive Delta: `#10b981` (Emerald 500)
- Negative Delta: `#ef4444` (Red 500) - Only if needed

### Gradient Combinations

**Hero/Header Gradient**

- `linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)`
- Professional, modern, trustworthy

**Key Metric Cards**

- Break-Even (Cash): `linear-gradient(135deg, #2563eb 0%, #1e40af 100%)`
- Break-Even (Net Worth): `linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)`
- Positive Advantage: `linear-gradient(135deg, #10b981 0%, #059669 100%)`
- Negative/Neutral: `linear-gradient(135deg, #64748b 0%, #475569 100%)`

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

### Color Constants (Optional)

For direct color access without theme, use `src/theme/colors.ts`:

```typescript
import { COLORS, GRADIENTS } from "./theme/colors";

// Direct color values
const ownerColor = COLORS.owner.primary; // #2563eb
const renterColor = COLORS.renter.primary; // #0891b2

// Gradients for cards
const ownerGradient = GRADIENTS.owner;
const renterGradient = GRADIENTS.renter;
```

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

```tsx
<Paper
  style={{
    background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
    color: "white",
  }}
>
  Owner Metric
</Paper>
```

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
