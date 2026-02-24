import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
  cilCart,
  cilList,
  cilHistory,
  cilChart,
  cilGraph,
  cilUser,
  cilWarning,
  cilSettings,
  cilSpreadsheet,
  cilArrowTop,
  cilArrowBottom,
  cilCalculator,
  cilMoney,
  cilZoom
} from '@coreui/icons'
import { CNavTitle, CNavItem, CNavGroup } from '@coreui/react'

const _nav = [
  {
    component: CNavTitle,
    name: 'MAIN',
  },
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'primary',
      text: 'LIVE',
    }
  },

  {
    component: CNavTitle,
    name: 'TRADING',
  },
  {
    component: CNavItem,
    name: 'Order Panel',
    to: '/order-panel',
    icon: <CIcon icon={cilCart} customClassName="nav-icon" />,
    badge: {
      color: 'success',
      text: 'BUY/SELL',
    }
  },
  {
    component: CNavGroup,
    name: 'Open Positions',
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
    badge: {
      color: 'danger',
      text: '3',
    },
    items: [
      {
        component: CNavItem,
        name: 'Buy / Long Positions',
        to: '/positions/buy',
        badge: {
          color: 'success',
          text: '2',
        }
      },
      {
        component: CNavItem,
        name: 'Sell / Short Positions',
        to: '/positions/sell',
        badge: {
          color: 'danger',
          text: '1',
        }
      },
      {
        component: CNavItem,
        name: 'Close Position',
        to: '/positions/close',
      }
    ]
  },
  {
    component: CNavItem,
    name: 'Trade History',
    to: '/history',
    icon: <CIcon icon={cilHistory} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'PnL Tracker',
    to: '/pnl-tracker',
    icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
    badge: {
      color: 'warning',
      text: 'FLOATING',
    }
  },
  {
    component: CNavItem,
    name: 'Position Calculator',
    to: '/position-calculator',
    icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
  },

  {
    component: CNavTitle,
    name: 'MARKET DATA',
  },
  {
    component: CNavItem,
    name: 'Live Charts',
    to: '/live-charts',
    icon: <CIcon icon={cilGraph} customClassName="nav-icon" />,
    badge: {
      color: 'success',
      text: 'REAL-TIME',
    }
  },
  {
    component: CNavItem,
    name: 'Market Data',
    to: '/market',
    icon: <CIcon icon={cilChart} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'BID/ASK',
    }
  },
  {
    component: CNavItem,
    name: 'Price Feed',
    to: '/price-feed',
    icon: <CIcon icon={cilZoom} customClassName="nav-icon" />,
  },

  {
    component: CNavTitle,
    name: 'ACCOUNT',
  },
  {
    component: CNavGroup,
    name: 'Account Overview',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Balance',
        to: '/account/balance',
        badge: {
          color: 'primary',
          text: '$12,580',
        }
      },
      {
        component: CNavItem,
        name: 'Equity',
        to: '/account/equity',
        badge: {
          color: 'success',
          text: '$13,250',
        }
      },
      {
        component: CNavItem,
        name: 'Free Margin',
        to: '/account/free-margin',
        badge: {
          color: 'info',
          text: '$8,330',
        }
      },
      {
        component: CNavItem,
        name: 'Used Margin',
        to: '/account/used-margin',
        badge: {
          color: 'warning',
          text: '$4,250',
        }
      }
    ]
  },
  {
    component: CNavItem,
    name: 'Deposit Funds',
    to: '/deposit',
    icon: <CIcon icon={cilArrowBottom} customClassName="nav-icon" />,
    badge: {
      color: 'success',
      text: '+',
    }
  },
  {
    component: CNavItem,
    name: 'Withdraw Funds',
    to: '/withdraw',
    icon: <CIcon icon={cilArrowTop} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Transactions',
    to: '/transactions',
    icon: <CIcon icon={cilSpreadsheet} customClassName="nav-icon" />,
    badge: {
      color: 'warning',
      text: '!',
    }
  },

  {
    component: CNavTitle,
    name: 'RISK MANAGEMENT',
  },
  {
    component: CNavGroup,
    name: 'Margin Monitor',
    icon: <CIcon icon={cilWarning} customClassName="nav-icon" />,
    badge: {
      color: 'danger',
      text: '312%',
    },
    items: [
      {
        component: CNavItem,
        name: 'Margin Level',
        to: '/margin/level',
        badge: {
          color: 'warning',
          text: '312%',
        }
      },
      {
        component: CNavItem,
        name: 'Locked Margin',
        to: '/margin/locked',
        badge: {
          color: 'secondary',
          text: '$4,250',
        }
      },
      {
        component: CNavItem,
        name: 'Available Margin',
        to: '/margin/available',
        badge: {
          color: 'success',
          text: '$8,330',
        }
      }
    ]
  },
  {
    component: CNavItem,
    name: 'Risk Settings',
    to: '/risk-settings',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Stop Loss / Take Profit',
    to: '/sl-tp',
    icon: <CIcon icon={cilWarning} customClassName="nav-icon" />,
  },
]

export default _nav