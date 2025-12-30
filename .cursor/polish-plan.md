# Rent vs Buy Dashboard - Polish & Enhancement Plan

## Overview

This plan focuses on improving the user experience, visual polish, and adding navigation capabilities to make the dashboard more professional and easier to use.

## Goals

1. **Navigation**: Add React Router for multi-page navigation
2. **Layout Polish**: Improve spacing, visual hierarchy, and responsive design
3. **Simplified Metrics**: Make key metrics easier to understand at a glance
4. **Chart Improvements**: Better legends, labels, and readability
5. **UX Enhancements**: Loading states, error handling, better feedback

---

## Phase 1: Navigation Setup

### 1.1 Install React Router DOM

- Install `react-router-dom` package
- Set up router configuration in `main.tsx` or `App.tsx`
- Create route structure

### 1.2 Create Route Structure

- **Home/Dashboard** (`/`): Main analysis page (current App.tsx content)
- **Scenarios** (`/scenarios`): Manage saved scenarios (list, delete, compare)
- **About/Help** (`/about`): Explanation of calculations and assumptions

### 1.3 Navigation Component

- Create `Navigation.tsx` component with:
  - Mantine `NavLink` components for routing
  - Active route highlighting
  - Responsive mobile menu (burger menu for small screens)
  - Logo/branding area

### 1.4 Update AppShell

- Integrate navigation into AppShell sidebar or navbar
- Update header to include navigation links
- Make navigation persistent across routes

---

## Phase 2: Layout Improvements

### 2.1 Dashboard Layout Refinement

- **Form Section**:

  - Add collapsible sections (Accordion) for form groups
  - Better visual separation between input groups
  - Sticky form header when scrolling
  - Add "Reset to Defaults" button

- **Results Section**:
  - Add visual hierarchy with better spacing
  - Create distinct sections with clear headings
  - Add section dividers or cards
  - Improve responsive breakpoints

### 2.2 Metrics Section Redesign

- **Simplified Metrics Display**:

  - Create "Key Insights" section with 3-4 most important metrics
  - Use larger, more prominent cards for primary metrics
  - Add visual indicators (up/down arrows, color coding)
  - Group related metrics together
  - Add "Learn More" tooltips explaining what each metric means

- **Primary Metrics to Highlight**:

  1. **Break-Even Year** (Cash-loss and Net-worth) - Most important
  2. **Net Worth Advantage at 10 years** - Key decision point
  3. **Total Cost Difference** (Owner vs Renter at horizon)
  4. **Monthly Cost Comparison** (Current month)

- **Secondary Metrics**:
  - Move detailed metrics to expandable section or separate tab
  - Keep all metrics available but less prominent

### 2.3 Chart Layout Improvements

- **Chart Grid**:

  - Better spacing between charts
  - Consistent chart heights
  - Add chart descriptions/context above each chart
  - Responsive chart sizing (full width on mobile)

- **Chart Cards**:
  - Wrap each chart in a Paper component with subtle shadow
  - Add chart title and subtitle
  - Add "What this shows" explanation text

---

## Phase 3: Chart Legend & Readability Improvements

### 3.1 Legend Improvements

- **Positioning**:

  - Move legends to top of charts (more readable)
  - Use horizontal layout for legends
  - Add icons or color swatches that match line colors

- **Legend Labels**:

  - Use clear, descriptive names:
    - "Owner Monthly Costs" instead of "Owner (Avg Monthly)"
    - "Renter Monthly Costs" instead of "Renter (Avg Monthly)"
    - "Owner Net Worth" instead of "Owner Net Worth"
    - "Renter Net Worth" instead of "Renter Net Worth"

- **Legend Styling**:
  - Increase font size for better readability
  - Add hover states to highlight corresponding chart elements
  - Use consistent color scheme across all charts

### 3.2 Chart Formatting

- **Axis Labels**:

  - More descriptive axis labels
  - Add units clearly ($, years, %)
  - Format large numbers (e.g., "$500K" instead of "$500,000")

- **Tooltips**:

  - Improve tooltip formatting
  - Add context (e.g., "Year 5: $2,500/month")
  - Show multiple values in tooltip when hovering
  - Add comparison text (e.g., "Owner pays $200 more than renter")

- **Reference Lines**:
  - Make 5/10/15 year markers more prominent
  - Add labels that explain significance
  - Use consistent styling across charts

### 3.3 Color Scheme Consistency

- **Standardize Colors**:

  - Owner: Blue (#228be6) - consistent across all charts
  - Renter: Red/Orange (#fa5252) - consistent across all charts
  - Net Worth Positive: Green (#51cf66)
  - Net Worth Negative: Red (#fa5252)
  - Reference lines: Gray (#868e96)

- **Accessibility**:
  - Ensure color contrast meets WCAG standards
  - Add pattern/texture options for colorblind users
  - Test with colorblind simulators

---

## Phase 4: Simplified Metrics Display

### 4.1 Create Key Insights Component

- **New Component**: `KeyInsights.tsx`
  - Display 3-4 most important metrics prominently
  - Large, easy-to-read numbers
  - Visual indicators (trend arrows, color coding)
  - Short explanations

### 4.2 Metric Card Improvements

- **Redesign MetricCard**:
  - Larger font sizes for values
  - Better visual hierarchy
  - Add trend indicators (↑/↓)
  - Color coding for positive/negative values
  - Icons for different metric types

### 4.3 Metric Grouping

- **Organize Metrics by Category**:

  1. **Decision Points** (Break-evens)
  2. **Financial Impact** (Net worth differences)
  3. **Cost Comparison** (Total unrecoverable costs)
  4. **Time-Based Analysis** (5/10/15 year snapshots)

- **Use Tabs or Accordion**:
  - Primary metrics always visible
  - Secondary metrics in expandable sections

### 4.4 Metric Explanations

- Add "?" icon next to each metric
- Tooltip or modal explaining:
  - What the metric means
  - How it's calculated
  - Why it matters
  - Example interpretation

---

## Phase 5: UX Polish & Enhancements

### 5.1 Loading States

- Add loading skeleton/spinner when:
  - Calculating timeline (for large horizons)
  - Loading saved scenarios
  - Exporting data

### 5.2 Error Handling

- Form validation feedback:

  - Inline error messages
  - Visual error states on inputs
  - Summary of errors at top of form

- Calculation errors:
  - Handle edge cases (e.g., negative values, division by zero)
  - Show user-friendly error messages
  - Suggest fixes

### 5.3 Success Feedback

- Toast notifications for:
  - Scenario saved successfully
  - Scenario loaded successfully
  - Export completed
  - Form reset

### 5.4 Empty States

- Handle empty states:
  - No saved scenarios
  - No data to display
  - First-time user guidance

### 5.5 Responsive Design

- **Mobile Optimizations**:

  - Stack form and results vertically on mobile
  - Full-width charts on mobile
  - Collapsible navigation menu
  - Touch-friendly button sizes
  - Optimize chart rendering for mobile

- **Tablet Optimizations**:
  - 2-column layout for charts
  - Side-by-side form and results when space allows

---

## Phase 6: Additional Polish

### 6.1 Typography

- Consistent heading hierarchy
- Better line heights and spacing
- Readable font sizes (minimum 14px for body text)

### 6.2 Spacing & Padding

- Use Mantine spacing scale consistently
- Add breathing room between sections
- Consistent padding in cards and containers

### 6.3 Visual Hierarchy

- Use color, size, and weight to establish hierarchy
- Important information stands out
- Related items grouped visually

### 6.4 Animations & Transitions

- Smooth transitions for:

  - Route changes
  - Form updates
  - Chart data changes
  - Modal/drawer openings

- Subtle animations:
  - Hover states on buttons
  - Chart tooltip appearances
  - Metric card interactions

### 6.5 Accessibility

- Keyboard navigation support
- ARIA labels for interactive elements
- Focus indicators
- Screen reader support
- Alt text for any images/icons

---

## Implementation Order

### Week 1: Foundation

1. Install React Router DOM
2. Set up routing structure
3. Create navigation component
4. Create route pages (Home, Scenarios, About)

### Week 2: Layout & Metrics

5. Redesign metrics display (Key Insights)
6. Improve metric cards
7. Refine dashboard layout
8. Add loading states

### Week 3: Charts & Polish

9. Improve chart legends and labels
10. Standardize color scheme
11. Enhance tooltips
12. Add chart descriptions

### Week 4: UX & Final Polish

13. Add error handling
14. Implement toast notifications
15. Responsive design improvements
16. Accessibility audit and fixes
17. Final visual polish

---

## Files to Create/Modify

### New Files

- `src/routes/Home.tsx` - Main dashboard page
- `src/routes/Scenarios.tsx` - Scenario management page
- `src/routes/About.tsx` - About/help page
- `src/components/Navigation.tsx` - Navigation component
- `src/components/KeyInsights.tsx` - Simplified metrics display
- `src/components/LoadingSpinner.tsx` - Loading component
- `src/components/Toast.tsx` - Toast notification component

### Modified Files

- `src/App.tsx` - Add router, update layout
- `src/main.tsx` - Add router provider
- `src/components/MetricCard.tsx` - Enhanced design
- `src/components/MetricsDisplay.tsx` - Simplified, reorganized
- `src/features/charts/*.tsx` - Improved legends and formatting
- `package.json` - Add react-router-dom dependency

---

## Success Criteria

- [ ] Navigation works smoothly between pages
- [ ] Key metrics are immediately understandable
- [ ] Chart legends are clear and readable
- [ ] Layout is responsive and polished
- [ ] Loading and error states are handled gracefully
- [ ] App feels professional and production-ready

---

## Notes

- Keep calculations unchanged (they're working correctly)
- Focus on presentation and UX, not functionality
- Maintain accessibility standards
- Test on multiple screen sizes
- Get user feedback on metric clarity
