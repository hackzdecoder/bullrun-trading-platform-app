import React, { useState, useEffect } from 'react';
import {
  CCard,
  CCardHeader,
  CCardBody,
  CCardFooter,
  CRow,
  CCol,
  CBadge,
  CProgress,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilWallet,
  cilDollar,
  cilArrowTop,
  cilArrowBottom,
  cilChart,
  cilHistory,
  cilInfo,
  cilGraph,
  cilSpeedometer,
  cilCheckCircle,
  cilWarning,
  cilTransfer,
  cilCalendar,
  cilCreditCard,
  cilChartPie,
  cilBolt,
  cilBank,
  cilEqualizer,
  cilBarChart,
  cilChartLine,
  cilOptions,
} from '@coreui/icons';
import currency from 'currency.js';

const Balance = () => {
  // State
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [selectedPeriod, setSelectedPeriod] = useState('1m');

  // Balance data
  const balanceData = {
    currentBalance: 12580.45,
    previousBalance: 12315.60,
    dailyChange: +264.85,
    dailyChangePercent: +2.15,
    weeklyChange: +1245.30,
    weeklyChangePercent: +10.98,
    monthlyChange: +3840.75,
    monthlyChangePercent: +43.92,
    yearlyChange: +4250.50,
    yearlyChangePercent: +51.02,
    currency: 'USD',
    accountType: 'Premium',
    leverage: '1:100',
    openPositions: 5,
    totalDeposits: 15000.00,
    totalWithdrawals: 2419.55,
    netDeposits: 12580.45,
    averageBalance: 11250.30,
    highestBalance: 12850.45,
    lowestBalance: 9850.20,
    daysInProfit: 18,
    daysInLoss: 7,
    winRate: 72.0,
    profitFactor: 2.15,
  };

  // Balance history data
  const balanceHistory = [
    { date: '2024-01-15', balance: 12580.45, change: +264.85, changePercent: +2.15, type: 'profit', note: 'Trading profits' },
    { date: '2024-01-14', balance: 12315.60, change: -125.30, changePercent: -1.01, type: 'loss', note: 'Market correction' },
    { date: '2024-01-13', balance: 12440.90, change: +342.50, changePercent: +2.83, type: 'profit', note: 'EUR/USD gain' },
    { date: '2024-01-12', balance: 12098.40, change: +185.20, changePercent: +1.55, type: 'profit', note: 'BTC rally' },
    { date: '2024-01-11', balance: 11913.20, change: -78.90, changePercent: -0.66, type: 'loss', note: 'GBP drop' },
    { date: '2024-01-10', balance: 11992.10, change: +425.75, changePercent: +3.68, type: 'profit', note: 'Strong day' },
    { date: '2024-01-09', balance: 11566.35, change: +231.45, changePercent: +2.04, type: 'profit', note: 'Consistent gains' },
    { date: '2024-01-08', balance: 11334.90, change: -45.20, changePercent: -0.40, type: 'loss', note: 'Minor setback' },
    { date: '2024-01-07', balance: 11380.10, change: +189.30, changePercent: +1.69, type: 'profit', note: 'Weekend trading' },
    { date: '2024-01-06', balance: 11190.80, change: +312.60, changePercent: +2.87, type: 'profit', note: 'New high' },
  ];

  // Transaction history
  const transactionHistory = [
    { id: 1, date: '2024-01-15 09:30', type: 'deposit', amount: 2500.00, method: 'Bank Transfer', status: 'completed', reference: 'DEP-2024-001', fee: 0.00 },
    { id: 2, date: '2024-01-14 14:20', type: 'withdrawal', amount: -500.00, method: 'PayPal', status: 'pending', reference: 'WDR-2024-023', fee: 2.50 },
    { id: 3, date: '2024-01-15 11:45', type: 'trade', amount: 264.85, method: 'EUR/USD', status: 'profit', reference: 'TRD-2024-089', fee: 1.20 },
    { id: 4, date: '2024-01-14 10:15', type: 'trade', amount: -125.30, method: 'GBP/USD', status: 'loss', reference: 'TRD-2024-088', fee: 1.20 },
    { id: 5, date: '2024-01-15 08:00', type: 'fee', amount: -2.50, method: 'Commission', status: 'completed', reference: 'FEE-2024-012', fee: 0.00 },
    { id: 6, date: '2024-01-13 16:30', type: 'deposit', amount: 1000.00, method: 'Credit Card', status: 'completed', reference: 'DEP-2024-002', fee: 0.00 },
    { id: 7, date: '2024-01-12 11:20', type: 'trade', amount: 342.50, method: 'BTC/USD', status: 'profit', reference: 'TRD-2024-087', fee: 1.50 },
    { id: 8, date: '2024-01-11 15:45', type: 'withdrawal', amount: -300.00, method: 'Bank Transfer', status: 'completed', reference: 'WDR-2024-022', fee: 1.50 },
  ];

  // Monthly summary
  const monthlySummary = [
    { month: 'Jan 2024', starting: 9850.20, ending: 12580.45, deposits: 3500.00, withdrawals: 800.00, tradingPL: +2030.25, netChange: +2730.25 },
    { month: 'Dec 2023', starting: 8920.45, ending: 9850.20, deposits: 1000.00, withdrawals: 500.00, tradingPL: +429.75, netChange: +929.75 },
    { month: 'Nov 2023', starting: 8340.60, ending: 8920.45, deposits: 500.00, withdrawals: 200.00, tradingPL: +279.85, netChange: +579.85 },
    { month: 'Oct 2023', starting: 7950.30, ending: 8340.60, deposits: 300.00, withdrawals: 150.00, tradingPL: +240.30, netChange: +390.30 },
  ];

  // Format functions
  const formatCurrency = (value) => currency(value, { precision: 2, symbol: '$' }).format();
  const formatNumber = (value, decimals = 2) => Number(value).toFixed(decimals);
  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const formatDateTime = (date) => new Date(date).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  // Calculate metrics
  const getBalanceStatus = () => {
    if (balanceData.dailyChange > 0) return { text: 'INCREASING', color: 'success', icon: cilArrowTop };
    if (balanceData.dailyChange < 0) return { text: 'DECREASING', color: 'danger', icon: cilArrowBottom };
    return { text: 'STABLE', color: 'warning', icon: cilEqualizer };
  };

  const balanceStatus = getBalanceStatus();

  // Calculate totals
  const totalDeposits = transactionHistory
    .filter(t => t.type === 'deposit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalWithdrawals = transactionHistory
    .filter(t => t.type === 'withdrawal')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalFees = transactionHistory
    .filter(t => t.type === 'fee' || t.fee > 0)
    .reduce((sum, t) => sum + Math.abs(t.fee || t.amount), 0);

  const tradingPL = transactionHistory
    .filter(t => t.type === 'trade')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <CCard className="mb-4">
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <div>
          <h4 className="mb-0">
            <CIcon icon={cilWallet} className="me-2" />
            Balance Overview
          </h4>
          <small className="text-muted">Real-time account balance and transaction history</small>
        </div>
        <div className="d-flex align-items-center gap-2">
          <CBadge color="info">
            <CIcon icon={cilBolt} className="me-1" size="sm" />
            LIVE
          </CBadge>
          <span className="text-muted small">
            Last Update: {lastUpdate.toLocaleTimeString()}
          </span>
        </div>
      </CCardHeader>

      <CCardBody>
        {/* Live Status Bar */}
        <div className="border rounded p-2 mb-4 small">
          <CRow className="align-items-center">
            <CCol md="auto">
              <CIcon icon={cilBolt} className="me-2 text-info" />
              <strong>Balance Status: {balanceStatus.text}</strong>
            </CCol>
            <CCol md="auto" className="text-muted">
              Currency: <span className="fw-semibold">{balanceData.currency}</span>
            </CCol>
            <CCol md="auto" className="text-muted">
              Account Type: <span className="fw-semibold">{balanceData.accountType}</span>
            </CCol>
            <CCol md="auto" className="text-muted">
              Leverage: <span className="fw-semibold">{balanceData.leverage}</span>
            </CCol>
          </CRow>
        </div>

        {/* Main Balance Display */}
        <CRow className="mb-4">
          <CCol md={12}>
            <div className="text-center p-4 border rounded">
              <div className="text-muted mb-2">CURRENT BALANCE</div>
              <div className="display-3 fw-bold mb-2">{formatCurrency(balanceData.currentBalance)}</div>
              <div className="d-flex justify-content-center gap-4">
                <span className={`fw-semibold ${balanceData.dailyChange >= 0 ? 'text-success' : 'text-danger'}`}>
                  <CIcon icon={balanceData.dailyChange >= 0 ? cilArrowTop : cilArrowBottom} className="me-1" />
                  Daily: {balanceData.dailyChange >= 0 ? '+' : ''}{formatCurrency(balanceData.dailyChange)} ({balanceData.dailyChangePercent}%)
                </span>
                <span className={`fw-semibold ${balanceData.weeklyChange >= 0 ? 'text-success' : 'text-danger'}`}>
                  <CIcon icon={balanceData.weeklyChange >= 0 ? cilArrowTop : cilArrowBottom} className="me-1" />
                  Weekly: {balanceData.weeklyChange >= 0 ? '+' : ''}{formatCurrency(balanceData.weeklyChange)} ({balanceData.weeklyChangePercent}%)
                </span>
              </div>
            </div>
          </CCol>
        </CRow>

        {/* Key Metrics Cards */}
        <CRow className="mb-4 g-3">
          <CCol md={3}>
            <div className="border rounded p-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="small text-muted">Daily Change</span>
                <CIcon icon={cilChart} className="text-info" />
              </div>
              <div className={`fw-bold fs-4 ${balanceData.dailyChange >= 0 ? 'text-success' : 'text-danger'}`}>
                {balanceData.dailyChange >= 0 ? '+' : ''}{formatCurrency(balanceData.dailyChange)}
              </div>
              <small className={`${balanceData.dailyChangePercent >= 0 ? 'text-success' : 'text-danger'}`}>
                {balanceData.dailyChangePercent >= 0 ? '+' : ''}{balanceData.dailyChangePercent}%
              </small>
            </div>
          </CCol>
          <CCol md={3}>
            <div className="border rounded p-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="small text-muted">Weekly Change</span>
                <CIcon icon={cilChartLine} className="text-success" />
              </div>
              <div className={`fw-bold fs-4 ${balanceData.weeklyChange >= 0 ? 'text-success' : 'text-danger'}`}>
                {balanceData.weeklyChange >= 0 ? '+' : ''}{formatCurrency(balanceData.weeklyChange)}
              </div>
              <small className={`${balanceData.weeklyChangePercent >= 0 ? 'text-success' : 'text-danger'}`}>
                {balanceData.weeklyChangePercent >= 0 ? '+' : ''}{balanceData.weeklyChangePercent}%
              </small>
            </div>
          </CCol>
          <CCol md={3}>
            <div className="border rounded p-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="small text-muted">Monthly Change</span>
                <CIcon icon={cilBarChart} className="text-warning" />
              </div>
              <div className={`fw-bold fs-4 ${balanceData.monthlyChange >= 0 ? 'text-success' : 'text-danger'}`}>
                {balanceData.monthlyChange >= 0 ? '+' : ''}{formatCurrency(balanceData.monthlyChange)}
              </div>
              <small className={`${balanceData.monthlyChangePercent >= 0 ? 'text-success' : 'text-danger'}`}>
                {balanceData.monthlyChangePercent >= 0 ? '+' : ''}{balanceData.monthlyChangePercent}%
              </small>
            </div>
          </CCol>
          <CCol md={3}>
            <div className="border rounded p-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="small text-muted">Yearly Change</span>
                <CIcon icon={cilWallet} className="text-primary" />
              </div>
              <div className={`fw-bold fs-4 ${balanceData.yearlyChange >= 0 ? 'text-success' : 'text-danger'}`}>
                {balanceData.yearlyChange >= 0 ? '+' : ''}{formatCurrency(balanceData.yearlyChange)}
              </div>
              <small className={`${balanceData.yearlyChangePercent >= 0 ? 'text-success' : 'text-danger'}`}>
                {balanceData.yearlyChangePercent >= 0 ? '+' : ''}{balanceData.yearlyChangePercent}%
              </small>
            </div>
          </CCol>
        </CRow>

        {/* Balance Statistics */}
        <CRow className="mb-4 g-3">
          <CCol md={4}>
            <div className="border rounded p-3">
              <div className="small text-muted mb-2">Balance Range</div>
              <div className="d-flex justify-content-between mb-1">
                <span>Highest:</span>
                <span className="fw-semibold text-success">{formatCurrency(balanceData.highestBalance)}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Lowest:</span>
                <span className="fw-semibold text-danger">{formatCurrency(balanceData.lowestBalance)}</span>
              </div>
            </div>
          </CCol>
          <CCol md={4}>
            <div className="border rounded p-3">
              <div className="small text-muted mb-2">Average Balance</div>
              <div className="fw-bold fs-4 text-info">{formatCurrency(balanceData.averageBalance)}</div>
              <small className="text-muted">30-day average</small>
            </div>
          </CCol>
          <CCol md={4}>
            <div className="border rounded p-3">
              <div className="small text-muted mb-2">Performance</div>
              <div className="d-flex justify-content-between mb-1">
                <span>Days in Profit:</span>
                <span className="fw-semibold text-success">{balanceData.daysInProfit}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Days in Loss:</span>
                <span className="fw-semibold text-danger">{balanceData.daysInLoss}</span>
              </div>
            </div>
          </CCol>
        </CRow>

        {/* Balance History with Period Filter */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="mb-0">
              <CIcon icon={cilHistory} className="me-2" />
              Balance History
            </h6>
            <div className="d-flex gap-2">
              {['1w', '2w', '1m', '3m'].map(period => (
                <CButton
                  key={period}
                  size="sm"
                  color={selectedPeriod === period ? 'primary' : 'secondary'}
                  variant={selectedPeriod === period ? undefined : 'outline'}
                  onClick={() => setSelectedPeriod(period)}
                >
                  {period}
                </CButton>
              ))}
            </div>
          </div>
          <CTable hover responsive size="sm" className="mb-0 border">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell className="small">Date</CTableHeaderCell>
                <CTableHeaderCell className="small text-end">Balance</CTableHeaderCell>
                <CTableHeaderCell className="small text-end">Change</CTableHeaderCell>
                <CTableHeaderCell className="small text-end">Change %</CTableHeaderCell>
                <CTableHeaderCell className="small">Type</CTableHeaderCell>
                <CTableHeaderCell className="small">Note</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {balanceHistory.map((item, index) => (
                <CTableRow key={index}>
                  <CTableDataCell className="fw-semibold">{formatDate(item.date)}</CTableDataCell>
                  <CTableDataCell className="text-end">{formatCurrency(item.balance)}</CTableDataCell>
                  <CTableDataCell className={`text-end ${item.change >= 0 ? 'text-success' : 'text-danger'}`}>
                    {item.change >= 0 ? '+' : ''}{formatCurrency(item.change)}
                  </CTableDataCell>
                  <CTableDataCell className={`text-end ${item.changePercent >= 0 ? 'text-success' : 'text-danger'}`}>
                    {item.changePercent >= 0 ? '+' : ''}{item.changePercent}%
                  </CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={item.type === 'profit' ? 'success' : 'danger'}>
                      {item.type === 'profit' ? 'PROFIT' : 'LOSS'}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell className="small text-muted">{item.note}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </div>

        {/* Transaction History */}
        <div className="mb-4">
          <h6 className="mb-3">
            <CIcon icon={cilCreditCard} className="me-2" />
            Recent Transactions
          </h6>
          <CTable hover responsive size="sm" className="mb-0 border">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell className="small">Date</CTableHeaderCell>
                <CTableHeaderCell className="small">Type</CTableHeaderCell>
                <CTableHeaderCell className="small">Method</CTableHeaderCell>
                <CTableHeaderCell className="small text-end">Amount</CTableHeaderCell>
                <CTableHeaderCell className="small text-end">Fee</CTableHeaderCell>
                <CTableHeaderCell className="small">Status</CTableHeaderCell>
                <CTableHeaderCell className="small">Reference</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {transactionHistory.map(transaction => (
                <CTableRow key={transaction.id}>
                  <CTableDataCell className="small text-muted">
                    {formatDateTime(transaction.date)}
                  </CTableDataCell>
                  <CTableDataCell>
                    <CBadge
                      color={
                        transaction.type === 'deposit' ? 'success' :
                          transaction.type === 'withdrawal' ? 'warning' :
                            transaction.type === 'trade' && transaction.amount > 0 ? 'success' :
                              transaction.type === 'trade' && transaction.amount < 0 ? 'danger' : 'secondary'
                      }
                    >
                      {transaction.type.toUpperCase()}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell className="small">{transaction.method}</CTableDataCell>
                  <CTableDataCell className={`text-end fw-semibold ${transaction.amount >= 0 ? 'text-success' : 'text-danger'}`}>
                    {transaction.amount >= 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                  </CTableDataCell>
                  <CTableDataCell className="text-end text-danger">
                    {transaction.fee > 0 ? `-${formatCurrency(transaction.fee)}` : '-'}
                  </CTableDataCell>
                  <CTableDataCell>
                    <CBadge
                      color={
                        transaction.status === 'completed' ? 'success' :
                          transaction.status === 'pending' ? 'warning' :
                            transaction.status === 'profit' ? 'success' :
                              transaction.status === 'loss' ? 'danger' : 'secondary'
                      }
                    >
                      {transaction.status.toUpperCase()}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell className="small text-muted">{transaction.reference}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </div>

        {/* Monthly Summary */}
        <div className="mb-4">
          <h6 className="mb-3">
            <CIcon icon={cilCalendar} className="me-2" />
            Monthly Summary
          </h6>
          <CTable hover responsive size="sm" className="mb-0 border">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell className="small">Month</CTableHeaderCell>
                <CTableHeaderCell className="small text-end">Starting</CTableHeaderCell>
                <CTableHeaderCell className="small text-end">Ending</CTableHeaderCell>
                <CTableHeaderCell className="small text-end">Deposits</CTableHeaderCell>
                <CTableHeaderCell className="small text-end">Withdrawals</CTableHeaderCell>
                <CTableHeaderCell className="small text-end">Trading P&L</CTableHeaderCell>
                <CTableHeaderCell className="small text-end">Net Change</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {monthlySummary.map((month, index) => (
                <CTableRow key={index}>
                  <CTableDataCell className="fw-semibold">{month.month}</CTableDataCell>
                  <CTableDataCell className="text-end">{formatCurrency(month.starting)}</CTableDataCell>
                  <CTableDataCell className="text-end">{formatCurrency(month.ending)}</CTableDataCell>
                  <CTableDataCell className="text-end text-success">+{formatCurrency(month.deposits)}</CTableDataCell>
                  <CTableDataCell className="text-end text-danger">-{formatCurrency(month.withdrawals)}</CTableDataCell>
                  <CTableDataCell className={`text-end ${month.tradingPL >= 0 ? 'text-success' : 'text-danger'}`}>
                    {month.tradingPL >= 0 ? '+' : ''}{formatCurrency(month.tradingPL)}
                  </CTableDataCell>
                  <CTableDataCell className={`text-end fw-semibold ${month.netChange >= 0 ? 'text-success' : 'text-danger'}`}>
                    {month.netChange >= 0 ? '+' : ''}{formatCurrency(month.netChange)}
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </div>

        {/* Financial Summary Cards */}
        <CRow className="g-3">
          <CCol md={3}>
            <div className="border rounded p-3">
              <div className="small text-muted mb-1">Total Deposits</div>
              <div className="fw-bold fs-5 text-success">+{formatCurrency(totalDeposits)}</div>
            </div>
          </CCol>
          <CCol md={3}>
            <div className="border rounded p-3">
              <div className="small text-muted mb-1">Total Withdrawals</div>
              <div className="fw-bold fs-5 text-danger">-{formatCurrency(totalWithdrawals)}</div>
            </div>
          </CCol>
          <CCol md={3}>
            <div className="border rounded p-3">
              <div className="small text-muted mb-1">Trading P&L</div>
              <div className={`fw-bold fs-5 ${tradingPL >= 0 ? 'text-success' : 'text-danger'}`}>
                {tradingPL >= 0 ? '+' : ''}{formatCurrency(tradingPL)}
              </div>
            </div>
          </CCol>
          <CCol md={3}>
            <div className="border rounded p-3">
              <div className="small text-muted mb-1">Total Fees</div>
              <div className="fw-bold fs-5 text-warning">-{formatCurrency(totalFees)}</div>
            </div>
          </CCol>
        </CRow>

        {/* Performance Metrics */}
        <CRow className="mt-3 g-3">
          <CCol md={4}>
            <div className="border rounded p-2">
              <div className="small text-muted">Win Rate</div>
              <div className="fw-semibold fs-5 text-success">{balanceData.winRate}%</div>
            </div>
          </CCol>
          <CCol md={4}>
            <div className="border rounded p-2">
              <div className="small text-muted">Profit Factor</div>
              <div className="fw-semibold fs-5 text-info">{balanceData.profitFactor}</div>
            </div>
          </CCol>
          <CCol md={4}>
            <div className="border rounded p-2">
              <div className="small text-muted">Net Deposits</div>
              <div className="fw-semibold fs-5 text-primary">{formatCurrency(balanceData.netDeposits)}</div>
            </div>
          </CCol>
        </CRow>
      </CCardBody>

      <CCardFooter className="d-flex justify-content-between align-items-center small text-muted">
        <div className="d-flex align-items-center">
          <CIcon icon={cilInfo} className="me-2" />
          Balance updates in real-time. All amounts shown in {balanceData.currency}.
        </div>
        <div className="d-flex gap-3">
          <span>Connection: <span className="fw-semibold text-success">Secure</span></span>
          <span>Open Positions: <span className="fw-semibold">{balanceData.openPositions}</span></span>
          <span>Win Rate: <span className="fw-semibold text-success">{balanceData.winRate}%</span></span>
        </div>
      </CCardFooter>
    </CCard>
  );
};

export default Balance;