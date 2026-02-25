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
  CProgressBar,
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
  cilGraph,
  cilArrowTop,
  cilArrowBottom,
  cilChart,
  cilHistory,
  cilInfo,
  cilSpeedometer,
  cilCheckCircle,
  cilWarning,
  cilCalculator,
  cilChartPie,
  cilBolt,
  cilEqualizer,
  cilBarChart,
  cilWallet,
  cilDollar,
  cilLineSpacing,
  cilChartLine,
} from '@coreui/icons';
import currency from 'currency.js';

const Equity = () => {
  // State
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [selectedPeriod, setSelectedPeriod] = useState('1d');

  // Equity data
  const equityData = {
    currentEquity: 13250.30,
    balance: 12580.45,
    floatingPL: 669.85,
    floatingPLPercent: 5.32,
    usedMargin: 2340.15,
    freeMargin: 10910.15,
    marginLevel: 566.28,
    dailyChange: +425.75,
    dailyChangePercent: +3.32,
    weeklyChange: +1245.30,
    weeklyChangePercent: +10.38,
    monthlyChange: +3840.75,
    monthlyChangePercent: +40.82,
    yearlyChange: +4250.50,
    yearlyChangePercent: +47.25,
    currency: 'USD',
    openPositions: 5,
    totalPL: 15680.40,
    bestPosition: '+$450.00',
    worstPosition: '-$125.30',
    averagePL: '+$125.50',
    winRate: 68.5,
    profitFactor: 1.85,
    sharpeRatio: 1.42,
    maxDrawdown: 8.5,
  };

  // Equity history data (simulated)
  const equityHistory = [
    { time: '09:30', equity: 12850.20, change: +45.20, type: 'up' },
    { time: '10:00', equity: 12920.45, change: +70.25, type: 'up' },
    { time: '10:30', equity: 12880.30, change: -40.15, type: 'down' },
    { time: '11:00', equity: 12950.75, change: +70.45, type: 'up' },
    { time: '11:30', equity: 13010.20, change: +59.45, type: 'up' },
    { time: '12:00', equity: 12980.50, change: -29.70, type: 'down' },
    { time: '12:30', equity: 13045.80, change: +65.30, type: 'up' },
    { time: '13:00', equity: 13120.40, change: +74.60, type: 'up' },
    { time: '13:30', equity: 13085.60, change: -34.80, type: 'down' },
    { time: '14:00', equity: 13150.25, change: +64.65, type: 'up' },
    { time: '14:30', equity: 13210.45, change: +60.20, type: 'up' },
    { time: '15:00', equity: 13250.30, change: +39.85, type: 'up' },
  ];

  // Equity breakdown by position
  const positionBreakdown = [
    { id: 1, symbol: 'EUR/USD', type: 'BUY', lots: 0.5, entry: 1.0825, current: 1.0850, pl: 125.00, plPercent: 2.31, contribution: 18.7 },
    { id: 2, symbol: 'GBP/USD', type: 'SELL', lots: 0.3, entry: 1.2650, current: 1.2620, pl: 90.00, plPercent: 2.37, contribution: 13.4 },
    { id: 3, symbol: 'USD/JPY', type: 'BUY', lots: 1.0, entry: 148.25, current: 148.28, pl: 30.00, plPercent: 0.20, contribution: 4.5 },
    { id: 4, symbol: 'BTC/USD', type: 'BUY', lots: 0.05, entry: 42850, current: 43150, pl: 150.00, plPercent: 0.70, contribution: 22.4 },
    { id: 5, symbol: 'AUD/USD', type: 'SELL', lots: 0.8, entry: 0.6590, current: 0.6580, pl: 80.00, plPercent: 1.52, contribution: 11.9 },
  ];

  // Daily equity snapshots
  const dailySnapshots = [
    { date: '2024-01-15', equity: 13250.30, change: +264.85, changePercent: +2.04, high: 13320.45, low: 13010.20 },
    { date: '2024-01-14', equity: 12985.45, change: -125.30, changePercent: -0.96, high: 13150.30, low: 12890.15 },
    { date: '2024-01-13', equity: 13110.75, change: +342.50, changePercent: +2.68, high: 13180.60, low: 12845.30 },
    { date: '2024-01-12', equity: 12768.25, change: +185.20, changePercent: +1.47, high: 12820.45, low: 12630.80 },
    { date: '2024-01-11', equity: 12583.05, change: -78.90, changePercent: -0.62, high: 12710.30, low: 12540.15 },
  ];

  // Format functions
  const formatCurrency = (value) => currency(value, { precision: 2, symbol: '$' }).format();
  const formatNumber = (value, decimals = 2) => Number(value).toFixed(decimals);
  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const formatTime = (time) => time;

  // Calculate metrics
  const getEquityStatus = () => {
    if (equityData.floatingPL > 0) return { text: 'PROFIT', color: 'success', icon: cilArrowTop };
    if (equityData.floatingPL < 0) return { text: 'LOSS', color: 'danger', icon: cilArrowBottom };
    return { text: 'BREAK EVEN', color: 'warning', icon: cilEqualizer };
  };

  const equityStatus = getEquityStatus();

  const getMarginLevelColor = () => {
    if (equityData.marginLevel > 300) return 'success';
    if (equityData.marginLevel > 150) return 'warning';
    return 'danger';
  };

  // Calculate total contribution percentage
  const totalContribution = positionBreakdown.reduce((sum, p) => sum + p.contribution, 0);

  return (
    <CCard className="mb-4">
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <div>
          <h4 className="mb-0">
            <CIcon icon={cilGraph} className="me-2" />
            Equity Overview
          </h4>
          <small className="text-muted">Real-time equity tracking and performance metrics</small>
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
              <strong>Equity Status: {equityStatus.text}</strong>
            </CCol>
            <CCol md="auto" className="text-muted">
              Currency: <span className="fw-semibold">{equityData.currency}</span>
            </CCol>
            <CCol md="auto" className="text-muted">
              Open Positions: <span className="fw-semibold">{equityData.openPositions}</span>
            </CCol>
            <CCol md="auto" className="text-muted">
              Win Rate: <span className="fw-semibold text-success">{equityData.winRate}%</span>
            </CCol>
          </CRow>
        </div>

        {/* Main Equity Display */}
        <CRow className="mb-4">
          <CCol md={6}>
            <div className="text-center p-4 border rounded">
              <div className="text-muted mb-2">CURRENT EQUITY</div>
              <div className="display-3 fw-bold mb-2">{formatCurrency(equityData.currentEquity)}</div>
              <div className={`fw-semibold ${equityData.floatingPL >= 0 ? 'text-success' : 'text-danger'}`}>
                <CIcon icon={equityData.floatingPL >= 0 ? cilArrowTop : cilArrowBottom} className="me-1" />
                Floating P/L: {equityData.floatingPL >= 0 ? '+' : ''}{formatCurrency(equityData.floatingPL)} ({equityData.floatingPLPercent}%)
              </div>
            </div>
          </CCol>
          <CCol md={6}>
            <div className="text-center p-4 border rounded">
              <div className="text-muted mb-2">ACCOUNT BALANCE</div>
              <div className="display-3 fw-bold mb-2">{formatCurrency(equityData.balance)}</div>
              <div className="d-flex justify-content-center gap-3">
                <span className="text-muted small">
                  Used Margin: {formatCurrency(equityData.usedMargin)}
                </span>
                <span className="text-muted small">
                  Free: {formatCurrency(equityData.freeMargin)}
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
              <div className={`fw-bold fs-4 ${equityData.dailyChange >= 0 ? 'text-success' : 'text-danger'}`}>
                {equityData.dailyChange >= 0 ? '+' : ''}{formatCurrency(equityData.dailyChange)}
              </div>
              <small className={`${equityData.dailyChangePercent >= 0 ? 'text-success' : 'text-danger'}`}>
                {equityData.dailyChangePercent >= 0 ? '+' : ''}{equityData.dailyChangePercent}%
              </small>
            </div>
          </CCol>
          <CCol md={3}>
            <div className="border rounded p-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="small text-muted">Weekly Change</span>
                <CIcon icon={cilChartLine} className="text-success" />
              </div>
              <div className={`fw-bold fs-4 ${equityData.weeklyChange >= 0 ? 'text-success' : 'text-danger'}`}>
                {equityData.weeklyChange >= 0 ? '+' : ''}{formatCurrency(equityData.weeklyChange)}
              </div>
              <small className={`${equityData.weeklyChangePercent >= 0 ? 'text-success' : 'text-danger'}`}>
                {equityData.weeklyChangePercent >= 0 ? '+' : ''}{equityData.weeklyChangePercent}%
              </small>
            </div>
          </CCol>
          <CCol md={3}>
            <div className="border rounded p-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="small text-muted">Monthly Change</span>
                <CIcon icon={cilBarChart} className="text-warning" />
              </div>
              <div className={`fw-bold fs-4 ${equityData.monthlyChange >= 0 ? 'text-success' : 'text-danger'}`}>
                {equityData.monthlyChange >= 0 ? '+' : ''}{formatCurrency(equityData.monthlyChange)}
              </div>
              <small className={`${equityData.monthlyChangePercent >= 0 ? 'text-success' : 'text-danger'}`}>
                {equityData.monthlyChangePercent >= 0 ? '+' : ''}{equityData.monthlyChangePercent}%
              </small>
            </div>
          </CCol>
          <CCol md={3}>
            <div className="border rounded p-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="small text-muted">Yearly Change</span>
                <CIcon icon={cilWallet} className="text-primary" />
              </div>
              <div className={`fw-bold fs-4 ${equityData.yearlyChange >= 0 ? 'text-success' : 'text-danger'}`}>
                {equityData.yearlyChange >= 0 ? '+' : ''}{formatCurrency(equityData.yearlyChange)}
              </div>
              <small className={`${equityData.yearlyChangePercent >= 0 ? 'text-success' : 'text-danger'}`}>
                {equityData.yearlyChangePercent >= 0 ? '+' : ''}{equityData.yearlyChangePercent}%
              </small>
            </div>
          </CCol>
        </CRow>

        {/* Equity vs Balance Comparison */}
        <CRow className="mb-4 g-3">
          <CCol md={6}>
            <div className="border rounded p-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">Equity vs Balance</h6>
                <CBadge color={equityData.currentEquity > equityData.balance ? 'success' : 'danger'}>
                  {equityData.currentEquity > equityData.balance ? 'ABOVE' : 'BELOW'}
                </CBadge>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Difference:</span>
                <span className={`fw-semibold ${equityData.currentEquity - equityData.balance >= 0 ? 'text-success' : 'text-danger'}`}>
                  {equityData.currentEquity - equityData.balance >= 0 ? '+' : ''}{formatCurrency(equityData.currentEquity - equityData.balance)}
                </span>
              </div>
              <CProgress height={8} className="mb-2">
                <CProgressBar
                  value={(equityData.balance / equityData.currentEquity) * 100}
                  color="info"
                  label={`Balance: ${((equityData.balance / equityData.currentEquity) * 100).toFixed(1)}%`}
                />
                <CProgressBar
                  value={((equityData.currentEquity - equityData.balance) / equityData.currentEquity) * 100}
                  color={equityData.floatingPL >= 0 ? 'success' : 'danger'}
                  label={`Floating: ${(((equityData.currentEquity - equityData.balance) / equityData.currentEquity) * 100).toFixed(1)}%`}
                />
              </CProgress>
            </div>
          </CCol>
          <CCol md={6}>
            <div className="border rounded p-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">Margin Metrics</h6>
                <CBadge color={getMarginLevelColor()}>Level: {formatNumber(equityData.marginLevel)}%</CBadge>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Used Margin:</span>
                <span className="fw-semibold text-warning">{formatCurrency(equityData.usedMargin)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Free Margin:</span>
                <span className="fw-semibold text-success">{formatCurrency(equityData.freeMargin)}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Margin Level:</span>
                <span className={`fw-semibold text-${getMarginLevelColor()}`}>{formatNumber(equityData.marginLevel)}%</span>
              </div>
            </div>
          </CCol>
        </CRow>

        {/* Intraday Equity Movement */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="mb-0">
              <CIcon icon={cilChartLine} className="me-2" />
              Intraday Equity Movement
            </h6>
            <div className="d-flex gap-2">
              {['1h', '4h', '1d', '1w'].map(period => (
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
          <div className="border rounded p-3">
            <CTable hover responsive size="sm" className="mb-0">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell className="small">Time</CTableHeaderCell>
                  <CTableHeaderCell className="small text-end">Equity</CTableHeaderCell>
                  <CTableHeaderCell className="small text-end">Change</CTableHeaderCell>
                  <CTableHeaderCell className="small">Movement</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {equityHistory.map((item, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell className="fw-semibold">{item.time}</CTableDataCell>
                    <CTableDataCell className="text-end">{formatCurrency(item.equity)}</CTableDataCell>
                    <CTableDataCell className={`text-end ${item.change >= 0 ? 'text-success' : 'text-danger'}`}>
                      {item.change >= 0 ? '+' : ''}{formatCurrency(item.change)}
                    </CTableDataCell>
                    <CTableDataCell>
                      <CIcon
                        icon={item.type === 'up' ? cilArrowTop : cilArrowBottom}
                        className={item.type === 'up' ? 'text-success' : 'text-danger'}
                      />
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </div>
        </div>

        {/* Position Breakdown */}
        <div className="mb-4">
          <h6 className="mb-3">
            <CIcon icon={cilChartPie} className="me-2" />
            Equity Breakdown by Position
          </h6>
          <CTable hover responsive size="sm" className="mb-0 border">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell className="small">Symbol</CTableHeaderCell>
                <CTableHeaderCell className="small">Type</CTableHeaderCell>
                <CTableHeaderCell className="small text-end">Lots</CTableHeaderCell>
                <CTableHeaderCell className="small text-end">Entry</CTableHeaderCell>
                <CTableHeaderCell className="small text-end">Current</CTableHeaderCell>
                <CTableHeaderCell className="small text-end">P&L</CTableHeaderCell>
                <CTableHeaderCell className="small text-end">P&L %</CTableHeaderCell>
                <CTableHeaderCell className="small text-end">Contribution</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {positionBreakdown.map(pos => (
                <CTableRow key={pos.id}>
                  <CTableDataCell className="fw-semibold">{pos.symbol}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={pos.type === 'BUY' ? 'success' : 'danger'}>
                      {pos.type}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell className="text-end">{pos.lots.toFixed(2)}</CTableDataCell>
                  <CTableDataCell className="text-end">{pos.entry.toFixed(4)}</CTableDataCell>
                  <CTableDataCell className="text-end">{pos.current.toFixed(4)}</CTableDataCell>
                  <CTableDataCell className={`text-end fw-semibold ${pos.pl >= 0 ? 'text-success' : 'text-danger'}`}>
                    {pos.pl >= 0 ? '+' : ''}{formatCurrency(pos.pl)}
                  </CTableDataCell>
                  <CTableDataCell className={`text-end ${pos.plPercent >= 0 ? 'text-success' : 'text-danger'}`}>
                    {pos.plPercent >= 0 ? '+' : ''}{pos.plPercent}%
                  </CTableDataCell>
                  <CTableDataCell className="text-end">
                    <div className="d-flex align-items-center justify-content-end gap-2">
                      <span className="fw-semibold">{pos.contribution}%</span>
                      <div style={{ width: '50px' }}>
                        <CProgress height={4} value={(pos.contribution / totalContribution) * 100} color={pos.pl >= 0 ? 'success' : 'danger'} />
                      </div>
                    </div>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </div>

        {/* Daily Snapshots */}
        <div className="mb-4">
          <h6 className="mb-3">
            <CIcon icon={cilHistory} className="me-2" />
            Daily Equity Snapshots
          </h6>
          <CTable hover responsive size="sm" className="mb-0 border">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell className="small">Date</CTableHeaderCell>
                <CTableHeaderCell className="small text-end">Equity</CTableHeaderCell>
                <CTableHeaderCell className="small text-end">Change</CTableHeaderCell>
                <CTableHeaderCell className="small text-end">Change %</CTableHeaderCell>
                <CTableHeaderCell className="small text-end">Daily High</CTableHeaderCell>
                <CTableHeaderCell className="small text-end">Daily Low</CTableHeaderCell>
                <CTableHeaderCell className="small">Range</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {dailySnapshots.map((day, index) => (
                <CTableRow key={index}>
                  <CTableDataCell className="fw-semibold">{formatDate(day.date)}</CTableDataCell>
                  <CTableDataCell className="text-end">{formatCurrency(day.equity)}</CTableDataCell>
                  <CTableDataCell className={`text-end ${day.change >= 0 ? 'text-success' : 'text-danger'}`}>
                    {day.change >= 0 ? '+' : ''}{formatCurrency(day.change)}
                  </CTableDataCell>
                  <CTableDataCell className={`text-end ${day.changePercent >= 0 ? 'text-success' : 'text-danger'}`}>
                    {day.changePercent >= 0 ? '+' : ''}{day.changePercent}%
                  </CTableDataCell>
                  <CTableDataCell className="text-end text-success">{formatCurrency(day.high)}</CTableDataCell>
                  <CTableDataCell className="text-end text-danger">{formatCurrency(day.low)}</CTableDataCell>
                  <CTableDataCell>
                    <small className="text-muted">
                      {formatCurrency(day.low)} - {formatCurrency(day.high)}
                    </small>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </div>

        {/* Performance Metrics */}
        <CRow className="g-3">
          <CCol md={3}>
            <div className="border rounded p-2">
              <div className="small text-muted">Total P&L</div>
              <div className="fw-semibold fs-5 text-success">+{formatCurrency(equityData.totalPL)}</div>
            </div>
          </CCol>
          <CCol md={3}>
            <div className="border rounded p-2">
              <div className="small text-muted">Win Rate</div>
              <div className="fw-semibold fs-5 text-info">{equityData.winRate}%</div>
            </div>
          </CCol>
          <CCol md={3}>
            <div className="border rounded p-2">
              <div className="small text-muted">Profit Factor</div>
              <div className="fw-semibold fs-5 text-success">{equityData.profitFactor}</div>
            </div>
          </CCol>
          <CCol md={3}>
            <div className="border rounded p-2">
              <div className="small text-muted">Sharpe Ratio</div>
              <div className="fw-semibold fs-5 text-info">{equityData.sharpeRatio}</div>
            </div>
          </CCol>
        </CRow>
      </CCardBody>

      <CCardFooter className="d-flex justify-content-between align-items-center small text-muted">
        <div className="d-flex align-items-center">
          <CIcon icon={cilInfo} className="me-2" />
          Equity updates in real-time based on open positions and market movements.
        </div>
        <div className="d-flex gap-3">
          <span>Connection: <span className="fw-semibold text-success">Secure</span></span>
          <span>Max Drawdown: <span className="fw-semibold text-warning">{equityData.maxDrawdown}%</span></span>
          <span>Best/Worst: <span className="fw-semibold text-success">{equityData.bestPosition}</span> / <span className="fw-semibold text-danger">{equityData.worstPosition}</span></span>
        </div>
      </CCardFooter>
    </CCard>
  );
};

export default Equity;