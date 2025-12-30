# Rent vs Buy Dashboard

A comprehensive React web dashboard that helps users compare **Rent vs Buy** scenarios over time, using both cash-loss (unrecoverable costs) and net worth (balance-sheet) views.

## Features

- **Interactive Scenario Inputs**: Configure home details, owner costs, rent assumptions, investment returns, and time horizon
- **Live-Updating Charts**: Four comprehensive charts showing:
  - Average monthly unrecoverable cost comparison
  - Monthly cost over time
  - Net worth over time
  - Owner wealth stack breakdown at 5/10/15 years
- **Key Metrics**: Break-even calculations, net worth deltas, and total unrecoverable costs
- **Export Functionality**: Export scenarios, timeline data, and analysis packets in JSON/CSV formats
- **Scenario Management**: Save and load scenarios from localStorage

## Tech Stack

- React 19 + TypeScript + Vite
- Mantine UI component library
- Recharts for data visualization

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. Install dependencies:
```bash
npm install
```

### Development

Run the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

Build for production:
```bash
npm run build
```

### Preview Production Build

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── features/
│   ├── scenario/          # Scenario form and storage
│   └── charts/            # Chart components
├── calculations/          # Pure calculation functions
│   ├── amortization.ts
│   ├── rent.ts
│   ├── homeValue.ts
│   ├── netWorth.ts
│   ├── timeline.ts
│   └── metrics.ts
├── components/           # Reusable UI components
│   ├── MetricCard.tsx
│   ├── MetricsDisplay.tsx
│   └── ExportButtons.tsx
└── App.tsx               # Main application component
```

## Usage

1. **Configure Your Scenario**: Use the form on the left to input:
   - Home price, down payment, interest rate, loan term
   - Property tax, insurance, maintenance rates
   - Current rent and rent growth rate
   - Investment return and home appreciation assumptions
   - Time horizon (1-30 years)

2. **View Results**: Charts and metrics update automatically as you change inputs

3. **Save Scenarios**: Enter a name and click "Save" to store your scenario in localStorage

4. **Export Data**: Use the export buttons to download:
   - Scenario JSON (inputs only)
   - Timeline CSV (monthly data)
   - Analysis Packet JSON (complete analysis with metrics and snapshots)

## Calculation Details

### Owner Unrecoverable Costs (Monthly)
- Mortgage interest
- Property tax (based on current home value)
- Insurance
- Maintenance (based on current home value)
- PMI (if down payment < 20%)

### Net Worth Calculations
- **Owner**: `(homeValue * (1 - sellingCostRate)) - mortgageBalance`
- **Renter**: Investment balance with monthly compounding

### Monthly Compounding
All rates use monthly compounding: `monthlyRate = (1 + annualRate)^(1/12) - 1`

## License

MIT
