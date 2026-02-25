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
  cilSpeedometer,
  cilArrowTop,
  cilArrowBottom,
  cilInfo,
  cilChart,
  cilWallet,
  cilDollar,
  cilGraph,
  cilBolt,
  cilWarning,
  cilCheckCircle,
  cilBarChart,
  cilChartPie,
  cilHistory,
  cilClock,
  cilLockLocked,
  cilBank,
} from '@coreui/icons';
import currency from 'currency.js';

const UsedMargin = () => {
  // State
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  // Margin data
  const marginData = {
    usedMargin: 4250.15,
    totalEquity: 13250.30,
    totalBalance: 12580.45,
    freeMargin: 9000.15,
    marginLevel: 311.8,
    marginUsage: 32.1,
    initialMargin: 4000.00,
    maintenanceMargin: 4250.15,
    marginCallLevel: 120.5,
    stopOutLevel: 80.0,
    currency: 'USD',
    leverage: '1:100',
    openPositions: 5,
    totalPositionValue: 425015.00,
  };

  // Margin breakdown by position
  const marginBreakdown = [
    { id: 1, symbol: 'EUR/USD', type: 'BUY', lots: 0.5, entry: 1.0825, current: 1.0850, margin: 541.25, marginPercent: 12.7, pnl: 125.00, status: 'profitable' },
    { id: 2, symbol: 'GBP/USD', type: 'SELL', lots: 0.3, entry: 1.2650, current: 1.2620, margin: 379.50, marginPercent: 8.9, pnl: 90.00, status: 'profitable' },
    { id: 3, symbol: 'USD/JPY', type: 'BUY', lots: 1.0, entry: 148.25, current: 148.28, margin: 1482.80, marginPercent: 34.9, pnl: 30.00, status: 'profitable' },
    { id: 4, symbol: 'BTC/USD', type: 'BUY', lots: 0.05, entry: 42850, current: 43150, margin: 2157.50, marginPercent: 50.8, pnl: 150.00, status: 'profitable' },
    { id: 5, symbol: 'AUD/USD', type: 'SELL', lots: 0.8, entry: 0.6590, current: 0.6580, margin: 526.40, marginPercent: 12.4, pnl: 80.00, status: 'profitable' },
  ];

  // Margin history
  const marginHistory = [
    { time: '09:30', margin: 4250.15, change: +50.25, equity: 13250.30, level: 311.8 },
    { time: '09:00', margin: 4199.90, change: -25.30, equity: 13120.40, level: 312.4 },
    { time: '08:30', margin: 4225.20, change: +75.45, equity: 13180.60, level: 311.9 },
    { time: '08:00', margin: 4149.75, change: -35.20, equity: 13045.80, level: 314.3 },
    { time: '07:30', margin: 4184.95, change: +62.80, equity: 13110.20, level: 313.3 },
    { time: '07:00', margin: 4122.15, change: -18.50, equity: 12980.50, level: 314.9 },
    { time: '06:30', margin: 4140.65, change: +42.35, equity: 13020.30, level: 314.5 },
  ];

  // Margin alerts
  const marginAlerts = [
    { id: 1, level: 350, message: 'Margin level healthy', status: 'safe', time: '10:30' },
    { id: 2, level: 250, message: 'Approaching warning zone', status: 'warning', time: '09:15' },
    { id: 3, level: 150, message: 'Margin call level', status: 'danger', time: '08:45' },
    { id: 4, level: 80, message: 'Stop out level', status: 'critical', time: '08:00' },
  ];

  // Format functions
  const formatCurrency = (value) => currency(value, { precision: 2, symbol: '$' }).format();
  const formatNumber = (value, decimals = 2) => Number(value).toFixed(decimals);
  const formatTime = (time) => time;

  // Calculate metrics
  const getMarginLevelStatus = () => {
    if (marginData.marginLevel > 300) return { text: 'SAFE', color: 'success', icon: cilCheckCircle };
    if (marginData.marginLevel > 150) return { text: 'WARNING', color: 'warning', icon: cilWarning };
    if (marginData.marginLevel > 100) return { text: 'HIGH RISK', color: 'danger', icon: cilWarning };
    return { text: 'LIQUIDATION', color: 'danger', icon: cilWarning };
  };

  const marginStatus = getMarginLevelStatus();

  const getDistanceToMarginCall = () => {
    return ((marginData.marginLevel - marginData.marginCallLevel) / marginData.marginCallLevel * 100).toFixed(1);
  };

  const getDistanceToStopOut = () => {
    return ((marginData.marginLevel - marginData.stopOutLevel) / marginData.stopOutLevel * 100).toFixed(1);
  };

  // Calculate totals
  const totalMargin = marginBreakdown.reduce((sum, pos) => sum + pos.margin, 0);
  const avgMarginPerPosition = totalMargin / marginBreakdown.length;
  const largestMarginPosition = Math.max(...marginBreakdown.map(p => p.margin));
  const smallestMarginPosition = Math.min(...marginBreakdown.map(p => p.margin));

  return (
    <CCard className="mb-4">
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <div>
          <h4 className="mb-0">
            <CIcon icon={cilLockLocked} className="me-2 text-warning" />
            Used Margin
          </h4>
          <small className="text-muted">Real-time margin usage and position collateral tracking</small>
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
              <strong>Margin Status: {marginStatus.text}</strong>
            </CCol>
            <CCol md="auto" className="text-muted">
              Currency: <span className="fw-semibold">{marginData.currency}</span>
            </CCol>
            <CCol md="auto" className="text-muted">
              Leverage: <span className="fw-semibold">{marginData.leverage}</span>
            </CCol>
            <CCol md="auto" className="text-muted">
              Open Positions: <span className="fw-semibold">{marginData.openPositions}</span>
            </CCol>
          </CRow>
        </div>

        {/* Main Margin Display */}
        <CRow className="mb-4">
          <CCol md={12}>
            <div className="text-center p-4 border rounded">
              <div className="text-muted mb-2">CURRENT USED MARGIN</div>
              <div className="display-3 fw-bold mb-2 text-warning">{formatCurrency(marginData.usedMargin)}</div>
              <div className="d-flex justify-content-center gap-4">
                <span className="text-muted">
                  <CIcon icon={cilWallet} className="me-1" />
                  Equity: {formatCurrency(marginData.totalEquity)}
                </span>
                <span className="text-muted">
                  <CIcon icon={cilBank} className="me-1" />
                  Balance: {formatCurrency(marginData.totalBalance)}
                </span>
                <span className="text-muted">
                  <CIcon icon={cilDollar} className="me-1" />
                  Free: {formatCurrency(marginData.freeMargin)}
                </span>
              </div>
            </div>
          </CCol>
        </CRow>

        {/* Summary Cards - 2x2 Grid */}
        <CRow className="mb-4 g-3">
          <CCol md={6}>
            <div className="border rounded p-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="small text-muted">Margin Level</span>
                <CIcon icon={cilSpeedometer} className={`text-${marginStatus.color}`} />
              </div>
              <div className={`fw-bold fs-4 text-${marginStatus.color}`}>{formatNumber(marginData.marginLevel)}%</div>
              <CBadge color={marginStatus.color} className="mt-1">{marginStatus.text}</CBadge>
            </div>
          </CCol>
          <CCol md={6}>
            <div className="border rounded p-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="small text-muted">Margin Usage</span>
                <CIcon icon={cilChartPie} className="text-info" />
              </div>
              <div className="fw-bold fs-4">{marginData.marginUsage}%</div>
              <small className="text-muted">of equity used as margin</small>
            </div>
          </CCol>
          <CCol md={6}>
            <div className="border rounded p-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="small text-muted">Initial Margin</span>
                <CIcon icon={cilLockLocked} className="text-secondary" />
              </div>
              <div className="fw-bold fs-4">{formatCurrency(marginData.initialMargin)}</div>
              <small className="text-muted">Required to open positions</small>
            </div>
          </CCol>
          <CCol md={6}>
            <div className="border rounded p-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="small text-muted">Maintenance Margin</span>
                <CIcon icon={cilLockLocked} className="text-warning" />
              </div>
              <div className="fw-bold fs-4">{formatCurrency(marginData.maintenanceMargin)}</div>
              <small className="text-muted">To keep positions open</small>
            </div>
          </CCol>
        </CRow>

        {/* Margin Level Progress Bar */}
        <div className="mb-4">
          <div className="d-flex justify-content-between mb-1">
            <span className="text-muted">Margin Level Scale</span>
            <span className={`fw-semibold text-${marginStatus.color}`}>{formatNumber(marginData.marginLevel)}%</span>
          </div>
          <CProgress height={12}>
            <CProgressBar value={25} color="danger" label="Stop Out (80%)" />
            <CProgressBar value={15} color="warning" label="Margin Call (120%)" />
            <CProgressBar value={15} color="info" label="Warning (150%)" />
            <CProgressBar value={45} color="success" label="Safe (300%+)" />
            <CProgressBar
              value={Math.min(marginData.marginLevel, 500) - 100}
              color="dark"
              variant="striped"
              animated
              style={{ opacity: 0.5 }}
            />
          </CProgress>
          <div className="d-flex justify-content-between mt-1 small text-muted">
            <span>Stop Out 80%</span>
            <span>Margin Call 120%</span>
            <span>Warning 150%</span>
            <span>Safe 300%+</span>
          </div>
        </div>

        {/* Danger Zone Indicators */}
        <CRow className="mb-4 g-3">
          <CCol md={4}>
            <div className={`border rounded p-2 ${marginData.marginLevel <= marginData.marginCallLevel ? 'bg-danger bg-opacity-10' : ''}`}>
              <div className="d-flex justify-content-between align-items-center">
                <span className="small text-muted">Distance to Margin Call</span>
                <CBadge color={parseFloat(getDistanceToMarginCall()) < 20 ? 'danger' : 'warning'}>
                  {getDistanceToMarginCall()}%
                </CBadge>
              </div>
              <div className="fw-semibold mt-1">
                Need {(marginData.marginCallLevel - marginData.marginLevel).toFixed(1)}% drop
              </div>
            </div>
          </CCol>
          <CCol md={4}>
            <div className={`border rounded p-2 ${marginData.marginLevel <= marginData.stopOutLevel ? 'bg-danger bg-opacity-10' : ''}`}>
              <div className="d-flex justify-content-between align-items-center">
                <span className="small text-muted">Distance to Stop Out</span>
                <CBadge color={parseFloat(getDistanceToStopOut()) < 30 ? 'danger' : 'warning'}>
                  {getDistanceToStopOut()}%
                </CBadge>
              </div>
              <div className="fw-semibold mt-1">
                Need {(marginData.stopOutLevel - marginData.marginLevel).toFixed(1)}% drop
              </div>
            </div>
          </CCol>
          <CCol md={4}>
            <div className="border rounded p-2">
              <div className="d-flex justify-content-between align-items-center">
                <span className="small text-muted">Total Position Value</span>
                <CBadge color="info">1:{marginData.leverage.split(':')[1]}x</CBadge>
              </div>
              <div className="fw-semibold mt-1 text-info">
                {formatCurrency(marginData.totalPositionValue)}
              </div>
            </div>
          </CCol>
        </CRow>

        {/* Margin Breakdown by Position */}
        <div className="mb-4">
          <h6 className="mb-3">
            <CIcon icon={cilBarChart} className="me-2" />
            Margin Breakdown by Position
          </h6>
          <CTable hover responsive size="sm" className="mb-0 border">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell className="small">Symbol</CTableHeaderCell>
                <CTableHeaderCell className="small">Type</CTableHeaderCell>
                <CTableHeaderCell className="small text-end">Lots</CTableHeaderCell>
                <CTableHeaderCell className="small text-end">Entry</CTableHeaderCell>
                <CTableHeaderCell className="small text-end">Current</CTableHeaderCell>
                <CTableHeaderCell className="small text-end">Margin</CTableHeaderCell>
                <CTableHeaderCell className="small text-end">% of Total</CTableHeaderCell>
                <CTableHeaderCell className="small text-end">P&L</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {marginBreakdown.map(pos => (
                <CTableRow key={pos.id}>
                  <CTableDataCell className="fw-semibold small">{pos.symbol}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={pos.type === 'BUY' ? 'success' : 'danger'}>
                      {pos.type}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell className="text-end small">{pos.lots.toFixed(2)}</CTableDataCell>
                  <CTableDataCell className="text-end small">{pos.entry.toFixed(4)}</CTableDataCell>
                  <CTableDataCell className="text-end small">{pos.current.toFixed(4)}</CTableDataCell>
                  <CTableDataCell className="text-end fw-semibold text-warning small">
                    {formatCurrency(pos.margin)}
                  </CTableDataCell>
                  <CTableDataCell className="text-end small">
                    <div className="d-flex align-items-center justify-content-end gap-2">
                      <span>{pos.marginPercent}%</span>
                      <div style={{ width: '50px' }}>
                        <CProgress height={4} value={pos.marginPercent} color="warning" />
                      </div>
                    </div>
                  </CTableDataCell>
                  <CTableDataCell className={`text-end small ${pos.pnl >= 0 ? 'text-success' : 'text-danger'}`}>
                    {pos.pnl >= 0 ? '+' : ''}{formatCurrency(pos.pnl)}
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </div>

        {/* Margin History Table */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="mb-0">
              <CIcon icon={cilHistory} className="me-2" />
              Margin History (Last 2 Hours)
            </h6>
            <div className="d-flex gap-2">
              {['today', 'week', 'month'].map(period => (
                <CButton
                  key={period}
                  size="sm"
                  color={selectedPeriod === period ? 'primary' : 'secondary'}
                  variant={selectedPeriod === period ? undefined : 'outline'}
                  onClick={() => setSelectedPeriod(period)}
                >
                  {period === 'today' ? 'Today' : period === 'week' ? 'Week' : 'Month'}
                </CButton>
              ))}
            </div>
          </div>
          <CTable hover responsive size="sm" className="mb-0 border">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell className="small">Time</CTableHeaderCell>
                <CTableHeaderCell className="small text-end">Used Margin</CTableHeaderCell>
                <CTableHeaderCell className="small text-end">Change</CTableHeaderCell>
                <CTableHeaderCell className="small text-end">Equity</CTableHeaderCell>
                <CTableHeaderCell className="small text-end">Margin Level</CTableHeaderCell>
                <CTableHeaderCell className="small">Status</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {marginHistory.map((item, index) => {
                const levelStatus = item.level > 300 ? 'success' : item.level > 150 ? 'warning' : 'danger';
                return (
                  <CTableRow key={index}>
                    <CTableDataCell className="small">
                      <CIcon icon={cilClock} size="sm" className="me-1 text-muted" />
                      {item.time}
                    </CTableDataCell>
                    <CTableDataCell className="text-end fw-semibold text-warning small">
                      {formatCurrency(item.margin)}
                    </CTableDataCell>
                    <CTableDataCell className={`text-end small ${item.change >= 0 ? 'text-success' : 'text-danger'}`}>
                      {item.change >= 0 ? '+' : ''}{formatCurrency(item.change)}
                    </CTableDataCell>
                    <CTableDataCell className="text-end small">{formatCurrency(item.equity)}</CTableDataCell>
                    <CTableDataCell className={`text-end fw-semibold small text-${levelStatus}`}>
                      {item.level.toFixed(1)}%
                    </CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={levelStatus}>
                        {levelStatus === 'success' ? 'SAFE' : levelStatus === 'warning' ? 'WARNING' : 'RISK'}
                      </CBadge>
                    </CTableDataCell>
                  </CTableRow>
                );
              })}
            </CTableBody>
          </CTable>
        </div>

        {/* Margin Alert Levels */}
        <div className="mb-4">
          <h6 className="mb-3">
            <CIcon icon={cilWarning} className="me-2" />
            Margin Alert Levels
          </h6>
          <CRow className="g-3">
            {marginAlerts.map(alert => (
              <CCol md={3} key={alert.id}>
                <div className={`border rounded p-2 ${alert.status === 'safe' ? 'border-success' :
                    alert.status === 'warning' ? 'border-warning' :
                      alert.status === 'danger' ? 'border-danger' : 'border-dark'
                  }`}>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="small text-muted">{alert.level}%</span>
                    <CBadge
                      color={
                        alert.status === 'safe' ? 'success' :
                          alert.status === 'warning' ? 'warning' :
                            alert.status === 'danger' ? 'danger' : 'dark'
                      }
                    >
                      {alert.time}
                    </CBadge>
                  </div>
                  <div className="fw-semibold mt-1 small">{alert.message}</div>
                </div>
              </CCol>
            ))}
          </CRow>
        </div>

        {/* Margin Statistics - 2x2 Grid */}
        <CRow className="g-3">
          <CCol md={3}>
            <div className="border rounded p-2">
              <div className="small text-muted">Avg Margin/Position</div>
              <div className="fw-semibold text-warning">{formatCurrency(avgMarginPerPosition)}</div>
            </div>
          </CCol>
          <CCol md={3}>
            <div className="border rounded p-2">
              <div className="small text-muted">Largest Margin</div>
              <div className="fw-semibold text-warning">{formatCurrency(largestMarginPosition)}</div>
              <small className="text-muted">{marginBreakdown.find(p => p.margin === largestMarginPosition)?.symbol}</small>
            </div>
          </CCol>
          <CCol md={3}>
            <div className="border rounded p-2">
              <div className="small text-muted">Smallest Margin</div>
              <div className="fw-semibold text-warning">{formatCurrency(smallestMarginPosition)}</div>
              <small className="text-muted">{marginBreakdown.find(p => p.margin === smallestMarginPosition)?.symbol}</small>
            </div>
          </CCol>
          <CCol md={3}>
            <div className="border rounded p-2">
              <div className="small text-muted">Margin/Equity Ratio</div>
              <div className="fw-semibold">{(marginData.usedMargin / marginData.totalEquity * 100).toFixed(1)}%</div>
            </div>
          </CCol>
        </CRow>
      </CCardBody>

      {/* Footer */}
      <CCardFooter className="d-flex justify-content-between align-items-center small text-muted">
        <div className="d-flex align-items-center">
          <CIcon icon={cilInfo} className="me-2" />
          Used margin is the collateral locked for open positions. Updates in real-time.
        </div>
        <div className="d-flex gap-3">
          <span>Connection: <span className="fw-semibold text-success">WebSocket</span></span>
          <span>Margin Call: <span className="fw-semibold text-warning">{marginData.marginCallLevel}%</span></span>
          <span>Stop Out: <span className="fw-semibold text-danger">{marginData.stopOutLevel}%</span></span>
        </div>
      </CCardFooter>
    </CCard>
  );
};

export default UsedMargin;