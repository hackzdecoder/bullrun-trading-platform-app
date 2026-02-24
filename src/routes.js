import React from 'react'

// Dashboard
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

// Trading
const OrderPanel = React.lazy(() => import('./views/trading/OrderPanel'))
const TradeHistory = React.lazy(() => import('./views/trading/TradeHistory'))
const PnLTracker = React.lazy(() => import('./views/trading/PnLTracker'))
const PositionCalculator = React.lazy(() => import('./views/trading/PositionCalculator'))

// Positions
const BuyPositions = React.lazy(() => import('./views/positions/BuyPositions'))
const SellPositions = React.lazy(() => import('./views/positions/SellPositions'))
const ClosePosition = React.lazy(() => import('./views/positions/ClosePosition'))

// Market Data
const LiveCharts = React.lazy(() => import('./views/trading/LiveCharts'))
const MarketData = React.lazy(() => import('./views/trading/MarketData'))
const PriceFeed = React.lazy(() => import('./views/market/PriceFeed'))

// Account
const AccountOverview = React.lazy(() => import('./views/account/AccountOverview'))
const Balance = React.lazy(() => import('./views/account/Balance'))
const Equity = React.lazy(() => import('./views/account/Equity'))
const FreeMargin = React.lazy(() => import('./views/account/FreeMargin'))
const UsedMargin = React.lazy(() => import('./views/account/UsedMargin'))
const DepositFunds = React.lazy(() => import('./views/account/DepositFunds'))
const WithdrawFunds = React.lazy(() => import('./views/account/WithdrawFunds'))
const Transactions = React.lazy(() => import('./views/account/Transactions'))

// Risk Management
const MarginMonitor = React.lazy(() => import('./views/risk/MarginMonitor'))
const MarginLevel = React.lazy(() => import('./views/risk/MarginLevel'))
const LockedMargin = React.lazy(() => import('./views/risk/LockedMargin'))
const AvailableMargin = React.lazy(() => import('./views/risk/AvailableMargin'))
const RiskSettings = React.lazy(() => import('./views/risk/RiskSettings'))
const StopLossTakeProfit = React.lazy(() => import('./views/risk/StopLossTakeProfit'))

const routes = [
  { path: '/', exact: true, name: 'Home' },

  // Main Dashboard
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },

  // Trading
  { path: '/order-panel', name: 'Order Panel', element: OrderPanel },
  { path: '/history', name: 'Trade History', element: TradeHistory },
  { path: '/pnl-tracker', name: 'PnL Tracker', element: PnLTracker },
  { path: '/position-calculator', name: 'Position Calculator', element: PositionCalculator },

  // Positions
  { path: '/positions/buy', name: 'Buy Positions', element: BuyPositions },
  { path: '/positions/sell', name: 'Sell Positions', element: SellPositions },
  { path: '/positions/close', name: 'Close Position', element: ClosePosition },

  // Market Data
  { path: '/live-charts', name: 'Live Charts', element: LiveCharts },
  { path: '/market', name: 'Market Data', element: MarketData },
  { path: '/price-feed', name: 'Price Feed', element: PriceFeed },

  // Account
  { path: '/account', name: 'Account Overview', element: AccountOverview },
  { path: '/account/balance', name: 'Balance', element: Balance },
  { path: '/account/equity', name: 'Equity', element: Equity },
  { path: '/account/free-margin', name: 'Free Margin', element: FreeMargin },
  { path: '/account/used-margin', name: 'Used Margin', element: UsedMargin },
  { path: '/deposit', name: 'Deposit Funds', element: DepositFunds },
  { path: '/withdraw', name: 'Withdraw Funds', element: WithdrawFunds },
  { path: '/transactions', name: 'Transactions', element: Transactions },

  // Risk Management
  { path: '/margin', name: 'Margin Monitor', element: MarginMonitor },
  { path: '/margin/level', name: 'Margin Level', element: MarginLevel },
  { path: '/margin/locked', name: 'Locked Margin', element: LockedMargin },
  { path: '/margin/available', name: 'Available Margin', element: AvailableMargin },
  { path: '/risk-settings', name: 'Risk Settings', element: RiskSettings },
  { path: '/sl-tp', name: 'Stop Loss/Take Profit', element: StopLossTakeProfit },
]

export default routes