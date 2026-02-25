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
  cilDollar,
  cilArrowTop,
  cilArrowBottom,
  cilInfo,
  cilWallet,
  cilGraph,
  cilBolt,
  cilWarning,
  cilCheckCircle,
  cilBarChart,
  cilChartPie,
  cilHistory,
  cilClock,
  cilBank,
  cilSpeedometer,
  cilCalculator,
  cilLineSpacing,
} from '@coreui/icons';
import currency from 'currency.js';

const AvailableMargin = () => {
  // State
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  // Margin data
  const marginData = {
    availableMargin: 8330.15,
    totalEquity: 13250.30,
    totalBalance: 12580.45,
    usedMargin: 4250.15,
    marginLevel: 311.8,
    marginUsage: 32.1,
    freeMargin: 9000.15,
    currency: 'USD',
    leverage: '1:100',
    openPositions: 5,
    maxPositionSize: 833015.00,
    buyingPower: 833015.00,
    reservedForFees: 25.50,
    minPositionSize: 10.00,
  };

  // Margin availability by position type
  const marginAvailability = [
    { type: 'Forex', available: 4165.08, percentage: 50, color: 'info', icon: cilGraph },
    { type: 'Crypto', available: 2499.05, percentage: 30, color: 'warning', icon: cilBarChart },
    { type: 'Indices', available: 1665.02, percentage: 20, color: 'success', icon: cilChartPie },
  ];

  // Margin history
  const marginHistory = [
    { time: '09:30', available: 8330.15, change: +125.50, equity: 13250.30, usage: 32.1 },
    { time: '09:00', available: 8204.65, change: -85.30, equity: 13120.40, usage: 31.8 },
    { time: '08:30', available: 8289.95, change: +210.45, equity: 13180.60, usage: 32.5 },
    { time: '08:00', available: 8079.50, change: -95.20, equity: 13045.80, usage: 31.2 },
    { time: '07:30', available: 8174.70, change: +162.80, equity: 13110.20, usage: 31.9 },
    { time: '07:00', available: 8011.90, change: -45.50, equity: 12980.50, usage: 30.8 },
    { time: '06:30', available: 8057.40, change: +98.35, equity: 13020.30, usage: 31.0 },
  ];

  // Position suggestions based on available margin
  const positionSuggestions = [
    { symbol: 'EUR/USD', suggestedLots: 0.8, requiredMargin: 866.00, potentialReturn: 173.20, risk: 'Low' },
    { symbol: 'BTC/USD', suggestedLots: 0.02, requiredMargin: 863.00, potentialReturn: 431.50, risk: 'High' },
    { symbol: 'GBP/USD', suggestedLots: 0.5, requiredMargin: 632.50, potentialReturn: 126.50, risk: 'Low' },
    { symbol: 'ETH/USD', suggestedLots: 0.3, requiredMargin: 960.00, potentialReturn: 288.00, risk: 'Medium' },
  ];

  // Format functions
  const formatCurrency = (value) => currency(value, { precision: 2, symbol: '$' }).format();
  const formatNumber = (value, decimals = 2) => Number(value).toFixed(decimals);
  const formatTime = (time) => time;

  // Calculate metrics
  const getMarginStatus = () => {
    if (marginData.marginUsage < 30) return { text: 'HIGH AVAILABILITY', color: 'success', icon: cilCheckCircle };
    if (marginData.marginUsage < 50) return { text: 'MODERATE', color: 'info', icon: cilInfo };
    if (marginData.marginUsage < 70) return { text: 'LIMITED', color: 'warning', icon: cilWarning };
    return { text: 'CRITICAL', color: 'danger', icon: cilWarning };
  };

  const marginStatus = getMarginStatus();

  const calculateNewPositionCapacity = () => {
    return Math.floor(marginData.availableMargin / 500); // Assuming average $500 per position
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Low': return 'success';
      case 'Medium': return 'warning';
      case 'High': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <CCard className="mb-4">
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <div>
          <h4 className="mb-0">
            <CIcon icon={cilDollar} className="me-2 text-success" />
            Available Margin
          </h4>
          <small className="text-muted">Real-time margin available for new trades and position sizing</small>
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

        {/* Main Available Margin Display */}
        <CRow className="mb-4">
          <CCol md={12}>
            <div className="text-center p-4 border rounded">
              <div className="text-muted mb-2">CURRENT AVAILABLE MARGIN</div>
              <div className="display-3 fw-bold mb-2 text-success">{formatCurrency(marginData.availableMargin)}</div>
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
                  <CIcon icon={cilSpeedometer} className="me-1" />
                  Used: {formatCurrency(marginData.usedMargin)}
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
                <span className="small text-muted">Free Margin</span>
                <CIcon icon={cilWallet} className="text-success" />
              </div>
              <div className="fw-bold fs-4 text-success">{formatCurrency(marginData.freeMargin)}</div>
              <small className="text-muted">Unused collateral</small>
            </div>
          </CCol>
          <CCol md={6}>
            <div className="border rounded p-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="small text-muted">Used Margin</span>
                <CIcon icon={cilSpeedometer} className="text-warning" />
              </div>
              <div className="fw-bold fs-4 text-warning">{formatCurrency(marginData.usedMargin)}</div>
              <small className="text-muted">Locked in positions</small>
            </div>
          </CCol>
          <CCol md={6}>
            <div className="border rounded p-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="small text-muted">Margin Level</span>
                <CIcon icon={cilGraph} className="text-info" />
              </div>
              <div className="fw-bold fs-4 text-info">{formatNumber(marginData.marginLevel)}%</div>
              <small className="text-muted">Health indicator</small>
            </div>
          </CCol>
          <CCol md={6}>
            <div className="border rounded p-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="small text-muted">Margin Usage</span>
                <CIcon icon={cilChartPie} className="text-primary" />
              </div>
              <div className="fw-bold fs-4 text-primary">{marginData.marginUsage}%</div>
              <small className="text-muted">of equity used</small>
            </div>
          </CCol>
        </CRow>

        {/* Margin Usage Progress Bar */}
        <div className="mb-4">
          <div className="d-flex justify-content-between mb-1">
            <span className="text-muted">Margin Usage</span>
            <span className={`fw-semibold text-${marginStatus.color}`}>{marginData.marginUsage}% Used</span>
          </div>
          <CProgress height={12}>
            <CProgressBar
              value={marginData.marginUsage}
              color={marginStatus.color}
              label={`${marginData.marginUsage}%`}
            />
            <CProgressBar
              value={100 - marginData.marginUsage}
              color="light"
              label={`${100 - marginData.marginUsage}% Available`}
            />
          </CProgress>
          <div className="d-flex justify-content-between mt-1 small text-muted">
            <span>0% Used</span>
            <span>50% Used</span>
            <span>100% Used</span>
          </div>
        </div>

        {/* Buying Power and Capacity */}
        <CRow className="mb-4 g-3">
          <CCol md={4}>
            <div className="border rounded p-2">
              <div className="small text-muted">Buying Power</div>
              <div className="fw-semibold fs-5 text-info">{formatCurrency(marginData.buyingPower)}</div>
              <small className="text-muted">With current leverage</small>
            </div>
          </CCol>
          <CCol md={4}>
            <div className="border rounded p-2">
              <div className="small text-muted">Max Position Size</div>
              <div className="fw-semibold fs-5 text-warning">{formatCurrency(marginData.maxPositionSize)}</div>
              <small className="text-muted">Single position limit</small>
            </div>
          </CCol>
          <CCol md={4}>
            <div className="border rounded p-2">
              <div className="small text-muted">New Positions Capacity</div>
              <div className="fw-semibold fs-5 text-success">{calculateNewPositionCapacity()}</div>
              <small className="text-muted">Avg $500 per position</small>
            </div>
          </CCol>
        </CRow>

        {/* Margin Availability by Position Type */}
        <div className="mb-4">
          <h6 className="mb-3">
            <CIcon icon={cilChartPie} className="me-2" />
            Margin Allocation by Asset Class
          </h6>
          <CRow className="g-3">
            {marginAvailability.map((item, index) => (
              <CCol md={4} key={index}>
                <div className="border rounded p-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="small text-muted">{item.type}</span>
                    <CIcon icon={item.icon} className={`text-${item.color}`} />
                  </div>
                  <div className="fw-bold fs-5">{formatCurrency(item.available)}</div>
                  <div className="d-flex align-items-center gap-2 mt-2">
                    <CProgress className="flex-grow-1" height={4} value={item.percentage} color={item.color} />
                    <span className="small fw-semibold">{item.percentage}%</span>
                  </div>
                </div>
              </CCol>
            ))}
          </CRow>
        </div>

        {/* Position Suggestions */}
        <div className="mb-4">
          <h6 className="mb-3">
            <CIcon icon={cilCalculator} className="me-2" />
            Suggested Positions Based on Available Margin
          </h6>
          <CTable hover responsive size="sm" className="mb-0 border">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell className="small">Symbol</CTableHeaderCell>
                <CTableHeaderCell className="small text-end">Suggested Lots</CTableHeaderCell>
                <CTableHeaderCell className="small text-end">Required Margin</CTableHeaderCell>
                <CTableHeaderCell className="small text-end">Potential Return</CTableHeaderCell>
                <CTableHeaderCell className="small">Risk Level</CTableHeaderCell>
                <CTableHeaderCell className="small">Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {positionSuggestions.map((pos, index) => (
                <CTableRow key={index}>
                  <CTableDataCell className="fw-semibold small">{pos.symbol}</CTableDataCell>
                  <CTableDataCell className="text-end small">{pos.suggestedLots}</CTableDataCell>
                  <CTableDataCell className="text-end text-warning small">{formatCurrency(pos.requiredMargin)}</CTableDataCell>
                  <CTableDataCell className="text-end text-success small">+{formatCurrency(pos.potentialReturn)}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={getRiskColor(pos.risk)}>{pos.risk}</CBadge>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton size="sm" color="primary" variant="outline" className="py-0 px-2">
                      Trade
                    </CButton>
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
              Available Margin History
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
                <CTableHeaderCell className="small text-end">Available Margin</CTableHeaderCell>
                <CTableHeaderCell className="small text-end">Change</CTableHeaderCell>
                <CTableHeaderCell className="small text-end">Equity</CTableHeaderCell>
                <CTableHeaderCell className="small text-end">Usage %</CTableHeaderCell>
                <CTableHeaderCell className="small">Status</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {marginHistory.map((item, index) => {
                const usageStatus = item.usage < 30 ? 'success' : item.usage < 50 ? 'info' : item.usage < 70 ? 'warning' : 'danger';
                return (
                  <CTableRow key={index}>
                    <CTableDataCell className="small">
                      <CIcon icon={cilClock} size="sm" className="me-1 text-muted" />
                      {item.time}
                    </CTableDataCell>
                    <CTableDataCell className="text-end fw-semibold text-success small">
                      {formatCurrency(item.available)}
                    </CTableDataCell>
                    <CTableDataCell className={`text-end small ${item.change >= 0 ? 'text-success' : 'text-danger'}`}>
                      {item.change >= 0 ? '+' : ''}{formatCurrency(item.change)}
                    </CTableDataCell>
                    <CTableDataCell className="text-end small">{formatCurrency(item.equity)}</CTableDataCell>
                    <CTableDataCell className={`text-end fw-semibold small text-${usageStatus}`}>
                      {item.usage}%
                    </CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={usageStatus}>
                        {usageStatus === 'success' ? 'HIGH' :
                          usageStatus === 'info' ? 'MODERATE' :
                            usageStatus === 'warning' ? 'LIMITED' : 'CRITICAL'}
                      </CBadge>
                    </CTableDataCell>
                  </CTableRow>
                );
              })}
            </CTableBody>
          </CTable>
        </div>

        {/* Additional Metrics - 2x2 Grid */}
        <CRow className="g-3">
          <CCol md={3}>
            <div className="border rounded p-2">
              <div className="small text-muted">Reserved for Fees</div>
              <div className="fw-semibold text-warning">{formatCurrency(marginData.reservedForFees)}</div>
            </div>
          </CCol>
          <CCol md={3}>
            <div className="border rounded p-2">
              <div className="small text-muted">Min Position Size</div>
              <div className="fw-semibold">{formatCurrency(marginData.minPositionSize)}</div>
            </div>
          </CCol>
          <CCol md={3}>
            <div className="border rounded p-2">
              <div className="small text-muted">Margin/Equity Ratio</div>
              <div className="fw-semibold">{(marginData.usedMargin / marginData.totalEquity * 100).toFixed(1)}%</div>
            </div>
          </CCol>
          <CCol md={3}>
            <div className="border rounded p-2">
              <div className="small text-muted">Available/Equity</div>
              <div className="fw-semibold text-success">{(marginData.availableMargin / marginData.totalEquity * 100).toFixed(1)}%</div>
            </div>
          </CCol>
        </CRow>
      </CCardBody>

      {/* Footer */}
      <CCardFooter className="d-flex justify-content-between align-items-center small text-muted">
        <div className="d-flex align-items-center">
          <CIcon icon={cilInfo} className="me-2" />
          Available margin is the free collateral for new positions. Updates in real-time based on market movements.
        </div>
        <div className="d-flex gap-3">
          <span>Connection: <span className="fw-semibold text-success">WebSocket</span></span>
          <span>Buying Power: <span className="fw-semibold text-info">{formatCurrency(marginData.buyingPower)}</span></span>
          <span>Next Update: <span className="fw-semibold">~2s</span></span>
        </div>
      </CCardFooter>
    </CCard>
  );
};

export default AvailableMargin;