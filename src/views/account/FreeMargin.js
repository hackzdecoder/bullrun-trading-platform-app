import React, { useState, useEffect } from 'react';
import {
  CCard,
  CCardHeader,
  CCardBody,
  CCardFooter,
  CRow,
  CCol,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CButton,
  CProgress,
  CProgressBar,
  CAlert,
  CInputGroup,
  CFormInput,
  CFormSelect,
  CInputGroupText,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilWallet,
  cilDollar,
  cilInfo,
  cilReload,
  cilSpeedometer,
  cilArrowTop,
  cilArrowBottom,
  cilChart,
  cilCalculator,
  cilClock,
  cilWarning,
  cilCheckCircle,
  cilSearch,
  cilFilter,
} from '@coreui/icons';
import currency from 'currency.js';

const FreeMargin = () => {
  // State
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [showDetails, setShowDetails] = useState(false);
  const [marginHistory, setMarginHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // New search state
  const [statusFilter, setStatusFilter] = useState('all'); // New filter state

  // Account data (simulated)
  const [accountData, setAccountData] = useState({
    balance: 25000.00,
    equity: 25750.50,
    usedMargin: 8450.75,
    freeMargin: 17299.75,
    marginLevel: 304.5,
    openPositions: 5,
    totalPnl: 750.50,
    dailyPnl: 125.25,
    weeklyPnl: 450.75,
    monthlyPnl: 1850.50,
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
      // Simulate small random changes
      setAccountData(prev => {
        const change = (Math.random() - 0.5) * 10;
        const newEquity = prev.equity + change;
        const newFreeMargin = newEquity - prev.usedMargin;
        const newMarginLevel = (newEquity / prev.usedMargin) * 100;

        return {
          ...prev,
          equity: newEquity,
          freeMargin: newFreeMargin,
          marginLevel: newMarginLevel,
        };
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Generate margin history data
  useEffect(() => {
    const history = [];
    let margin = accountData.freeMargin;
    const statuses = ['Safe', 'Warning', 'High Risk', 'Liquidation Risk'];

    for (let i = 0; i < 20; i++) {
      margin = margin + (Math.random() - 0.5) * 50;
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      history.push({
        id: i,
        time: new Date(Date.now() - i * 60000).toLocaleTimeString(),
        value: margin,
        status: randomStatus,
        change: (Math.random() - 0.5) * 30,
      });
    }
    setMarginHistory(history.reverse());
  }, [accountData.freeMargin]);

  // Format functions
  const formatCurrency = (value) => currency(value, { precision: 2, symbol: '$' }).format();
  const formatPercent = (value) => value.toFixed(1) + '%';
  const formatNumber = (value, decimals = 2) => value.toFixed(decimals);

  // Margin level status
  const getMarginLevelStatus = (level) => {
    if (level > 300) return { text: 'Safe', color: 'success', icon: cilCheckCircle };
    if (level > 150) return { text: 'Warning', color: 'warning', icon: cilWarning };
    if (level > 120) return { text: 'High Risk', color: 'danger', icon: cilWarning };
    return { text: 'Liquidation Risk', color: 'dark', icon: cilWarning };
  };

  const marginStatus = getMarginLevelStatus(accountData.marginLevel);

  // Buying power calculations
  const buyingPower1x = accountData.freeMargin;
  const buyingPower10x = accountData.freeMargin * 10;
  const buyingPower50x = accountData.freeMargin * 50;
  const buyingPower100x = accountData.freeMargin * 100;

  // Risk metrics
  const riskPercentage = (accountData.usedMargin / accountData.equity) * 100;
  const safeThreshold = accountData.equity * 0.3;
  const warningThreshold = accountData.equity * 0.5;
  const criticalThreshold = accountData.equity * 0.8;

  // Margin call level
  const marginCallLevel = accountData.usedMargin * 1.2;
  const stopOutLevel = accountData.usedMargin * 1.5;

  // Filter margin history based on search and status
  const filteredHistory = marginHistory.filter(item => {
    // Search filter (search in time and value)
    const matchesSearch = searchTerm === '' ||
      item.time.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formatCurrency(item.value).includes(searchTerm) ||
      item.status.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Get unique statuses for filter
  const statuses = ['all', ...new Set(marginHistory.map(item => item.status))];

  return (
    <CCard className="mb-4">
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <div>
          <h4 className="mb-0">
            <CIcon icon={cilWallet} className="me-2" />
            Free Margin
          </h4>
          <small className="text-muted">Real-time margin availability and usage</small>
        </div>
        <div className="d-flex gap-2 align-items-center">
          <CBadge color={marginStatus.color} className="me-2">
            <CIcon icon={marginStatus.icon} className="me-1" size="sm" />
            {marginStatus.text}
          </CBadge>
          <CButton size="sm" color="secondary" variant="outline" onClick={() => setLastUpdate(new Date())}>
            <CIcon icon={cilReload} className="me-1" />
            Refresh
          </CButton>
        </div>
      </CCardHeader>

      <CCardBody>
        {/* Live Status Bar */}
        <div className="border rounded p-2 mb-4 small">
          <CRow className="align-items-center">
            <CCol md="auto">
              <span className="text-success">
                <span className="me-2">●</span>
                <strong>Live Data</strong>
              </span>
            </CCol>
            <CCol md="auto" className="text-muted">
              Last Update: {lastUpdate.toLocaleTimeString()}
            </CCol>
            <CCol md="auto" className="text-muted">
              Connection: <span className="fw-semibold text-success">WebSocket</span>
            </CCol>
          </CRow>
        </div>

        {/* Main Free Margin Card */}
        <CRow className="mb-4">
          <CCol md={6}>
            <div className="border rounded p-4 text-center" style={{ backgroundColor: 'var(--cui-card-bg)' }}>
              <small className="text-muted text-uppercase">Available Free Margin</small>
              <div className="fw-bold fs-1" style={{ color: marginStatus.color === 'success' ? '#28a745' : marginStatus.color === 'warning' ? '#ffc107' : '#dc3545' }}>
                {formatCurrency(accountData.freeMargin)}
              </div>
              <div className="d-flex justify-content-center gap-3 mt-2">
                <div>
                  <small className="text-muted d-block">Equity</small>
                  <span className="fw-semibold">{formatCurrency(accountData.equity)}</span>
                </div>
                <div>
                  <small className="text-muted d-block">Used Margin</small>
                  <span className="fw-semibold text-warning">{formatCurrency(accountData.usedMargin)}</span>
                </div>
              </div>
            </div>
          </CCol>
          <CCol md={6}>
            <div className="border rounded p-3">
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Margin Level</span>
                <span className={`fw-bold fs-4 text-${marginStatus.color}`}>
                  {formatPercent(accountData.marginLevel)}
                </span>
              </div>
              <CProgress height={12} className="mb-3">
                <CProgressBar
                  value={Math.min(accountData.marginLevel, 500)}
                  max={500}
                  color={marginStatus.color}
                />
              </CProgress>
              <div className="d-flex justify-content-between small text-muted">
                <span>Liquidation (100%)</span>
                <span>Warning (150%)</span>
                <span>Safe (300%)</span>
              </div>
            </div>
          </CCol>
        </CRow>

        {/* Account Summary Cards */}
        <CRow className="mb-4 g-3">
          <CCol md={3}>
            <div className="border rounded p-2">
              <small className="text-muted d-block">Balance</small>
              <span className="fw-bold fs-5">{formatCurrency(accountData.balance)}</span>
            </div>
          </CCol>
          <CCol md={3}>
            <div className="border rounded p-2">
              <small className="text-muted d-block">Equity</small>
              <span className="fw-bold fs-5 text-info">{formatCurrency(accountData.equity)}</span>
            </div>
          </CCol>
          <CCol md={3}>
            <div className="border rounded p-2">
              <small className="text-muted d-block">Used Margin</small>
              <span className="fw-bold fs-5 text-warning">{formatCurrency(accountData.usedMargin)}</span>
            </div>
          </CCol>
          <CCol md={3}>
            <div className="border rounded p-2">
              <small className="text-muted d-block">Open Positions</small>
              <span className="fw-bold fs-5">{accountData.openPositions}</span>
            </div>
          </CCol>
        </CRow>

        {/* Profit & Loss Cards */}
        <CRow className="mb-4 g-3">
          <CCol md={3}>
            <div className="border rounded p-2">
              <small className="text-muted d-block">Total P&L</small>
              <span className={`fw-bold fs-5 ${accountData.totalPnl >= 0 ? 'text-success' : 'text-danger'}`}>
                {accountData.totalPnl >= 0 ? '+' : ''}{formatCurrency(accountData.totalPnl)}
              </span>
            </div>
          </CCol>
          <CCol md={3}>
            <div className="border rounded p-2">
              <small className="text-muted d-block">Daily P&L</small>
              <span className={`fw-bold fs-5 ${accountData.dailyPnl >= 0 ? 'text-success' : 'text-danger'}`}>
                {accountData.dailyPnl >= 0 ? '+' : ''}{formatCurrency(accountData.dailyPnl)}
              </span>
            </div>
          </CCol>
          <CCol md={3}>
            <div className="border rounded p-2">
              <small className="text-muted d-block">Weekly P&L</small>
              <span className={`fw-bold fs-5 ${accountData.weeklyPnl >= 0 ? 'text-success' : 'text-danger'}`}>
                {accountData.weeklyPnl >= 0 ? '+' : ''}{formatCurrency(accountData.weeklyPnl)}
              </span>
            </div>
          </CCol>
          <CCol md={3}>
            <div className="border rounded p-2">
              <small className="text-muted d-block">Monthly P&L</small>
              <span className={`fw-bold fs-5 ${accountData.monthlyPnl >= 0 ? 'text-success' : 'text-danger'}`}>
                {accountData.monthlyPnl >= 0 ? '+' : ''}{formatCurrency(accountData.monthlyPnl)}
              </span>
            </div>
          </CCol>
        </CRow>

        {/* Buying Power Section */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="mb-0">
              <CIcon icon={cilDollar} className="me-2" />
              Buying Power by Leverage
            </h6>
            <CButton
              size="sm"
              color="secondary"
              variant="outline"
              onClick={() => setShowDetails(!showDetails)}
            >
              <CIcon icon={cilCalculator} className="me-1" />
              {showDetails ? 'Hide Details' : 'Show Details'}
            </CButton>
          </div>
          <CRow className="g-3">
            <CCol md={3}>
              <div className="border rounded p-2">
                <small className="text-muted d-block">1x Leverage</small>
                <span className="fw-bold fs-6">{formatCurrency(buyingPower1x)}</span>
              </div>
            </CCol>
            <CCol md={3}>
              <div className="border rounded p-2">
                <small className="text-muted d-block">10x Leverage</small>
                <span className="fw-bold fs-6">{formatCurrency(buyingPower10x)}</span>
              </div>
            </CCol>
            <CCol md={3}>
              <div className="border rounded p-2">
                <small className="text-muted d-block">50x Leverage</small>
                <span className="fw-bold fs-6">{formatCurrency(buyingPower50x)}</span>
              </div>
            </CCol>
            <CCol md={3}>
              <div className="border rounded p-2">
                <small className="text-muted d-block">100x Leverage</small>
                <span className="fw-bold fs-6">{formatCurrency(buyingPower100x)}</span>
              </div>
            </CCol>
          </CRow>
        </div>

        {/* Risk Analysis */}
        {showDetails && (
          <div className="border rounded p-3 mb-4">
            <h6 className="mb-3">
              <CIcon icon={cilSpeedometer} className="me-2" />
              Risk Analysis
            </h6>
            <CRow className="g-3">
              <CCol md={6}>
                <div className="mb-2">
                  <div className="d-flex justify-content-between small">
                    <span className="text-muted">Margin Usage</span>
                    <span className="fw-semibold">{riskPercentage.toFixed(1)}%</span>
                  </div>
                  <CProgress height={4}>
                    <CProgressBar
                      value={riskPercentage}
                      color={riskPercentage > 80 ? 'danger' : riskPercentage > 50 ? 'warning' : 'success'}
                    />
                  </CProgress>
                </div>
                <div className="d-flex justify-content-between small text-muted mt-1">
                  <span>Safe (&lt;30%)</span>
                  <span>Warning (30-50%)</span>
                  <span>Critical (&gt;50%)</span>
                </div>
              </CCol>
              <CCol md={6}>
                <CTable borderless size="sm" className="mb-0">
                  <CTableBody>
                    <CTableRow>
                      <CTableHeaderCell className="ps-0 text-muted">Safe Threshold</CTableHeaderCell>
                      <CTableDataCell className="text-end fw-semibold text-success">{formatCurrency(safeThreshold)}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableHeaderCell className="ps-0 text-muted">Warning Threshold</CTableHeaderCell>
                      <CTableDataCell className="text-end fw-semibold text-warning">{formatCurrency(warningThreshold)}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableHeaderCell className="ps-0 text-muted">Critical Threshold</CTableHeaderCell>
                      <CTableDataCell className="text-end fw-semibold text-danger">{formatCurrency(criticalThreshold)}</CTableDataCell>
                    </CTableRow>
                  </CTableBody>
                </CTable>
              </CCol>
            </CRow>
          </div>
        )}

        {/* Margin Call & Stop Out Levels */}
        <CRow className="mb-4 g-3">
          <CCol md={6}>
            <div className="border rounded p-2">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-muted d-block">Margin Call Level</small>
                  <span className="fw-bold fs-6 text-warning">{formatCurrency(marginCallLevel)}</span>
                </div>
                <CIcon icon={cilWarning} className="text-warning" size="lg" />
              </div>
              <small className="text-muted">When equity falls below 120% of used margin</small>
            </div>
          </CCol>
          <CCol md={6}>
            <div className="border rounded p-2">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-muted d-block">Stop Out Level</small>
                  <span className="fw-bold fs-6 text-danger">{formatCurrency(stopOutLevel)}</span>
                </div>
                <CIcon icon={cilWarning} className="text-danger" size="lg" />
              </div>
              <small className="text-muted">When equity falls below 150% of used margin</small>
            </div>
          </CCol>
        </CRow>

        {/* Margin History Table with Search */}
        <div className="mt-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="mb-0">
              <CIcon icon={cilClock} className="me-2" />
              Recent Margin History
            </h6>
            <div className="d-flex gap-2">
              {/* Status Filter */}
              <CInputGroup size="sm" style={{ width: '150px' }}>
                <CInputGroupText>
                  <CIcon icon={cilFilter} />
                </CInputGroupText>
                <CFormSelect
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>
                      {status === 'all' ? 'All Status' : status}
                    </option>
                  ))}
                </CFormSelect>
              </CInputGroup>

              {/* Search Input */}
              <CInputGroup size="sm" style={{ width: '220px' }}>
                <CInputGroupText>
                  <CIcon icon={cilSearch} />
                </CInputGroupText>
                <CFormInput
                  placeholder="Search history..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoComplete="off"
                />
              </CInputGroup>
            </div>
          </div>

          <CTable hover responsive size="sm" className="mb-0 border">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell className="small">Time</CTableHeaderCell>
                <CTableHeaderCell className="small text-end">Free Margin</CTableHeaderCell>
                <CTableHeaderCell className="small text-end">Change</CTableHeaderCell>
                <CTableHeaderCell className="small">Status</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {filteredHistory.length > 0 ? (
                filteredHistory.map((item) => {
                  const status = getMarginLevelStatus((accountData.equity / accountData.usedMargin) * 100);

                  return (
                    <CTableRow key={item.id}>
                      <CTableDataCell className="fw-semibold">{item.time}</CTableDataCell>
                      <CTableDataCell className="text-end">{formatCurrency(item.value)}</CTableDataCell>
                      <CTableDataCell className={`text-end ${item.change >= 0 ? 'text-success' : 'text-danger'}`}>
                        {item.change >= 0 ? '+' : ''}{formatCurrency(item.change)}
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={item.status === 'Safe' ? 'success' : item.status === 'Warning' ? 'warning' : item.status === 'High Risk' ? 'danger' : 'dark'} size="sm">
                          {item.status}
                        </CBadge>
                      </CTableDataCell>
                    </CTableRow>
                  );
                })
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan={4} className="text-center py-4 text-muted">
                    No history entries found matching "{searchTerm}"
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>

          {/* Search Results Count */}
          {searchTerm && filteredHistory.length > 0 && (
            <div className="text-end mt-1 small text-muted">
              Found {filteredHistory.length} result(s)
            </div>
          )}
        </div>

        {/* Margin Usage Tips */}
        <CAlert color="info" className="mt-4 mb-0 small">
          <CRow className="align-items-center">
            <CCol md="auto">
              <CIcon icon={cilInfo} size="lg" className="me-2" />
            </CCol>
            <CCol>
              <strong>Margin Tips:</strong> Keep your margin level above 300% for safe trading.
              Margin calls occur at 120% and stop outs at 150%. Free margin of {formatCurrency(accountData.freeMargin)}
              allows you to open new positions worth up to {formatCurrency(buyingPower100x)} with 100x leverage.
            </CCol>
          </CRow>
        </CAlert>
      </CCardBody>

      <CCardFooter className="d-flex justify-content-between align-items-center small text-muted">
        <div className="d-flex align-items-center">
          <CIcon icon={cilInfo} className="me-2" />
          Free margin updates in real-time. Values are indicative and subject to market changes.
        </div>
        <div>
          <span className="me-3">Last Update: <span className="fw-semibold">{lastUpdate.toLocaleTimeString()}</span></span>
          <span>Status: <span className="fw-semibold text-success">Live</span></span>
        </div>
      </CCardFooter>
    </CCard>
  );
};

export default FreeMargin;