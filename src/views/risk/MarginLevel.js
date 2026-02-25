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
  CInputGroupText,
  CFormSelect,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilSpeedometer,
  cilInfo,
  cilReload,
  cilWarning,
  cilCheckCircle,
  cilArrowTop,
  cilArrowBottom,
  cilClock,
  cilChart,
  cilCalculator,
  cilSearch,
  cilFilter,
  cilLocationPin,
} from '@coreui/icons';
import currency from 'currency.js';

const MarginLevel = () => {
  // State
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [showHistory, setShowHistory] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');

  // Account data (simulated)
  const [accountData, setAccountData] = useState({
    balance: 25000.00,
    equity: 25750.50,
    usedMargin: 8450.75,
    freeMargin: 17299.75,
    marginLevel: 304.5,
    openPositions: 5,
  });

  // Margin level history
  const [marginHistory, setMarginHistory] = useState([
    { id: 1, time: '09:30:15', level: 304.5, change: 0, equity: 25750.50, usedMargin: 8450.75, status: 'Safe' },
    { id: 2, time: '09:25:15', level: 302.8, change: -1.7, equity: 25680.25, usedMargin: 8475.50, status: 'Safe' },
    { id: 3, time: '09:20:15', level: 305.2, change: +2.4, equity: 25890.75, usedMargin: 8480.25, status: 'Safe' },
    { id: 4, time: '09:15:15', level: 298.5, change: -6.7, equity: 25250.50, usedMargin: 8460.75, status: 'Warning' },
    { id: 5, time: '09:10:15', level: 312.3, change: +13.8, equity: 26450.25, usedMargin: 8475.50, status: 'Safe' },
    { id: 6, time: '09:05:15', level: 289.7, change: -22.6, equity: 24580.75, usedMargin: 8485.25, status: 'Warning' },
    { id: 7, time: '09:00:15', level: 295.2, change: +5.5, equity: 25050.50, usedMargin: 8480.75, status: 'Warning' },
    { id: 8, time: '08:55:15', level: 278.4, change: -16.8, equity: 23650.25, usedMargin: 8495.50, status: 'High Risk' },
    { id: 9, time: '08:50:15', level: 265.8, change: -12.6, equity: 22680.75, usedMargin: 8525.25, status: 'High Risk' },
    { id: 10, time: '08:45:15', level: 245.2, change: -20.6, equity: 20950.50, usedMargin: 8540.75, status: 'Liquidation Risk' },
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
      // Simulate small random changes
      setAccountData(prev => {
        const change = (Math.random() - 0.5) * 15;
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

      // Add new history entry
      setMarginHistory(prev => {
        const newEntry = {
          id: prev.length + 1,
          time: new Date().toLocaleTimeString(),
          level: accountData.marginLevel,
          change: accountData.marginLevel - (prev[0]?.level || accountData.marginLevel),
          equity: accountData.equity,
          usedMargin: accountData.usedMargin,
          status: getMarginLevelStatus(accountData.marginLevel).text,
        };
        return [newEntry, ...prev.slice(0, 19)];
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [accountData]);

  // Format functions
  const formatCurrency = (value) => currency(value, { precision: 2, symbol: '$' }).format();
  const formatPercent = (value) => value.toFixed(1) + '%';
  const formatNumber = (value, decimals = 2) => value.toFixed(decimals);

  // Margin level status
  const getMarginLevelStatus = (level) => {
    if (level > 300) return { text: 'Safe', color: 'success', icon: cilCheckCircle, description: 'Healthy margin level - low risk' };
    if (level > 150) return { text: 'Warning', color: 'warning', icon: cilWarning, description: 'Moderate risk - monitor closely' };
    if (level > 120) return { text: 'High Risk', color: 'danger', icon: cilWarning, description: 'High risk - consider reducing positions' };
    return { text: 'Liquidation Risk', color: 'dark', icon: cilLocationPin, description: 'Critical - liquidation imminent' };
  };

  const marginStatus = getMarginLevelStatus(accountData.marginLevel);

  // Risk thresholds
  const thresholds = {
    safe: 300,
    warning: 150,
    highRisk: 120,
    liquidation: 100,
  };

  // Distance to thresholds
  const distanceToLiquidation = accountData.marginLevel - thresholds.liquidation;
  const distanceToWarning = accountData.marginLevel - thresholds.warning;
  const distanceToSafe = accountData.marginLevel - thresholds.safe;

  // Required margin changes
  const requiredDropToLiquidation = accountData.marginLevel - thresholds.liquidation;
  const requiredDropToWarning = accountData.marginLevel - thresholds.warning;
  const requiredEquityDropToLiquidation = (accountData.usedMargin * thresholds.liquidation / 100) - accountData.equity;

  // Filter margin history
  const filteredHistory = marginHistory.filter(item => {
    const matchesSearch = searchTerm === '' ||
      item.time.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formatPercent(item.level).includes(searchTerm);

    const matchesRisk = riskFilter === 'all' || item.status === riskFilter;

    return matchesSearch && matchesRisk;
  });

  // Get unique statuses for filter
  const riskLevels = ['all', 'Safe', 'Warning', 'High Risk', 'Liquidation Risk'];

  return (
    <CCard className="mb-4">
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <div>
          <h4 className="mb-0">
            <CIcon icon={cilSpeedometer} className="me-2" />
            Margin Level
          </h4>
          <small className="text-muted">Real-time margin health and risk monitoring</small>
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

        {/* Main Margin Level Display */}
        <CRow className="mb-4">
          <CCol md={8}>
            <div className="border rounded p-4 text-center">
              <small className="text-muted text-uppercase">Current Margin Level</small>
              <div className={`fw-bold fs-1 text-${marginStatus.color}`}>
                {formatPercent(accountData.marginLevel)}
              </div>
              <div className="d-flex justify-content-center gap-4 mt-3">
                <div>
                  <small className="text-muted d-block">Equity</small>
                  <span className="fw-semibold">{formatCurrency(accountData.equity)}</span>
                </div>
                <div>
                  <small className="text-muted d-block">Used Margin</small>
                  <span className="fw-semibold text-warning">{formatCurrency(accountData.usedMargin)}</span>
                </div>
                <div>
                  <small className="text-muted d-block">Free Margin</small>
                  <span className="fw-semibold text-success">{formatCurrency(accountData.freeMargin)}</span>
                </div>
              </div>
            </div>
          </CCol>
          <CCol md={4}>
            <div className="border rounded p-3 h-100 d-flex flex-column justify-content-center">
              <div className="mb-2">
                <small className="text-muted d-block">Status</small>
                <CBadge color={marginStatus.color} className="mt-1 px-3 py-2">
                  <CIcon icon={marginStatus.icon} className="me-2" />
                  {marginStatus.text}
                </CBadge>
              </div>
              <div>
                <small className="text-muted d-block">Description</small>
                <p className="mb-0 small">{marginStatus.description}</p>
              </div>
            </div>
          </CCol>
        </CRow>

        {/* Margin Level Progress Bar */}
        <div className="mb-4">
          <div className="d-flex justify-content-between mb-2">
            <span className="text-muted small">Liquidation (100%)</span>
            <span className="text-muted small">Warning (150%)</span>
            <span className="text-muted small">Safe (300%+)</span>
          </div>
          <CProgress height={20} className="mb-2">
            <CProgressBar
              value={100}
              max={500}
              color="dark"
              style={{ opacity: 0.3 }}
            />
            <CProgressBar
              value={Math.min(accountData.marginLevel, 500)}
              max={500}
              color={marginStatus.color}
              className="position-absolute"
              style={{ zIndex: 2 }}
            />
          </CProgress>
          <div className="position-relative" style={{ height: '30px' }}>
            {/* Threshold markers */}
            <div className="position-absolute start-0 translate-middle-x" style={{ left: '20%' }}>
              <CBadge color="dark" className="small">100%</CBadge>
            </div>
            <div className="position-absolute start-0 translate-middle-x" style={{ left: '30%' }}>
              <CBadge color="dark" className="small">150%</CBadge>
            </div>
            <div className="position-absolute start-0 translate-middle-x" style={{ left: '60%' }}>
              <CBadge color="dark" className="small">300%</CBadge>
            </div>
            {/* Current level marker */}
            <div
              className="position-absolute translate-middle-x"
              style={{
                left: `${Math.min((accountData.marginLevel / 500) * 100, 100)}%`,
                top: '5px'
              }}
            >
              <CIcon icon={cilLocationPin} className={`text-${marginStatus.color}`} size="lg" />
            </div>
          </div>
        </div>

        {/* Risk Metrics Cards */}
        <CRow className="mb-4 g-3">
          <CCol md={3}>
            <div className="border rounded p-2">
              <small className="text-muted d-block">Distance to Liquidation</small>
              <span className={`fw-bold fs-5 ${distanceToLiquidation <= 20 ? 'text-danger' : distanceToLiquidation <= 50 ? 'text-warning' : 'text-success'}`}>
                {distanceToLiquidation.toFixed(1)}%
              </span>
              <small className="text-muted d-block mt-1">
                {formatCurrency(Math.abs(requiredEquityDropToLiquidation))} equity drop
              </small>
            </div>
          </CCol>
          <CCol md={3}>
            <div className="border rounded p-2">
              <small className="text-muted d-block">Distance to Warning</small>
              <span className={`fw-bold fs-5 ${distanceToWarning <= 20 ? 'text-warning' : 'text-success'}`}>
                {distanceToWarning.toFixed(1)}%
              </span>
              <small className="text-muted d-block mt-1">
                {formatPercent(accountData.marginLevel - thresholds.warning)} below warning
              </small>
            </div>
          </CCol>
          <CCol md={3}>
            <div className="border rounded p-2">
              <small className="text-muted d-block">Distance to Safe</small>
              <span className={`fw-bold fs-5 ${distanceToSafe >= 0 ? 'text-success' : 'text-warning'}`}>
                {Math.abs(distanceToSafe).toFixed(1)}% {distanceToSafe >= 0 ? 'above' : 'below'}
              </span>
              <small className="text-muted d-block mt-1">
                {distanceToSafe >= 0 ? 'Healthy' : 'Needs improvement'}
              </small>
            </div>
          </CCol>
          <CCol md={3}>
            <div className="border rounded p-2">
              <small className="text-muted d-block">Open Positions</small>
              <span className="fw-bold fs-5">{accountData.openPositions}</span>
              <small className="text-muted d-block mt-1">
                {accountData.openPositions === 0 ? 'No positions' : `${accountData.openPositions} active`}
              </small>
            </div>
          </CCol>
        </CRow>

        {/* Risk Analysis */}
        <div className="mb-4">
          <h6 className="mb-3">
            <CIcon icon={cilCalculator} className="me-2" />
            Risk Analysis
          </h6>
          <CRow className="g-3">
            <CCol md={4}>
              <div className="border rounded p-2">
                <small className="text-muted d-block">Margin Usage</small>
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1 me-2">
                    <CProgress height={8}>
                      <CProgressBar
                        value={(accountData.usedMargin / accountData.equity) * 100}
                        color={marginStatus.color}
                      />
                    </CProgress>
                  </div>
                  <span className="fw-semibold">{((accountData.usedMargin / accountData.equity) * 100).toFixed(1)}%</span>
                </div>
                <small className="text-muted">of equity used as margin</small>
              </div>
            </CCol>
            <CCol md={4}>
              <div className="border rounded p-2">
                <small className="text-muted d-block">Required for Warning</small>
                <div className="fw-semibold text-warning">
                  {formatCurrency(Math.abs((accountData.usedMargin * thresholds.warning / 100) - accountData.equity))}
                </div>
                <small className="text-muted">equity drop to reach warning level</small>
              </div>
            </CCol>
            <CCol md={4}>
              <div className="border rounded p-2">
                <small className="text-muted d-block">Required for Liquidation</small>
                <div className="fw-semibold text-danger">
                  {formatCurrency(Math.abs((accountData.usedMargin * thresholds.liquidation / 100) - accountData.equity))}
                </div>
                <small className="text-muted">equity drop to reach liquidation</small>
              </div>
            </CCol>
          </CRow>
        </div>

        {/* Margin Level History with Search */}
        <div className="mt-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="mb-0">
              <CIcon icon={cilClock} className="me-2" />
              Margin Level History
            </h6>
            <div className="d-flex gap-2">
              {/* Risk Level Filter */}
              <CInputGroup size="sm" style={{ width: '150px' }}>
                <CInputGroupText>
                  <CIcon icon={cilFilter} />
                </CInputGroupText>
                <CFormSelect
                  value={riskFilter}
                  onChange={(e) => setRiskFilter(e.target.value)}
                >
                  {riskLevels.map(level => (
                    <option key={level} value={level}>
                      {level === 'all' ? 'All Levels' : level}
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

              <CButton
                size="sm"
                color="secondary"
                variant="outline"
                onClick={() => setShowHistory(!showHistory)}
              >
                <CIcon icon={cilChart} className="me-1" />
                {showHistory ? 'Hide Chart' : 'Show Chart'}
              </CButton>
            </div>
          </div>

          {/* Mini Chart (Conditional) */}
          {showHistory && (
            <div className="border rounded p-3 mb-3">
              <div className="d-flex justify-content-between align-items-end mb-2">
                {marginHistory.slice(0, 10).reverse().map((item, index) => {
                  const height = Math.min((item.level / 400) * 60, 60);
                  return (
                    <div key={item.id} className="text-center" style={{ width: '10%' }}>
                      <div
                        style={{
                          height: `${height}px`,
                          backgroundColor: item.status === 'Safe' ? '#28a745' :
                            item.status === 'Warning' ? '#ffc107' :
                              item.status === 'High Risk' ? '#dc3545' : '#343a40',
                          width: '100%',
                          borderRadius: '3px 3px 0 0',
                        }}
                      />
                      <small className="text-muted" style={{ fontSize: '8px' }}>{item.time}</small>
                    </div>
                  );
                })}
              </div>
              <div className="text-center small text-muted">Last 10 updates</div>
            </div>
          )}

          <CTable hover responsive size="sm" className="mb-0 border">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell className="small">Time</CTableHeaderCell>
                <CTableHeaderCell className="small text-end">Margin Level</CTableHeaderCell>
                <CTableHeaderCell className="small text-end">Change</CTableHeaderCell>
                <CTableHeaderCell className="small text-end">Equity</CTableHeaderCell>
                <CTableHeaderCell className="small text-end">Used Margin</CTableHeaderCell>
                <CTableHeaderCell className="small">Status</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {filteredHistory.length > 0 ? (
                filteredHistory.map((item) => {
                  const status = getMarginLevelStatus(item.level);
                  return (
                    <CTableRow key={item.id}>
                      <CTableDataCell className="fw-semibold small">{item.time}</CTableDataCell>
                      <CTableDataCell className={`text-end fw-semibold text-${status.color}`}>
                        {formatPercent(item.level)}
                      </CTableDataCell>
                      <CTableDataCell className={`text-end ${item.change >= 0 ? 'text-success' : 'text-danger'}`}>
                        {item.change >= 0 ? '+' : ''}{item.change.toFixed(1)}%
                      </CTableDataCell>
                      <CTableDataCell className="text-end">{formatCurrency(item.equity)}</CTableDataCell>
                      <CTableDataCell className="text-end text-warning">{formatCurrency(item.usedMargin)}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={status.color} size="sm">
                          {status.text}
                        </CBadge>
                      </CTableDataCell>
                    </CTableRow>
                  );
                })
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan={6} className="text-center py-4 text-muted">
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

        {/* Margin Level Tips */}
        <CAlert color="info" className="mt-4 mb-0 small">
          <CRow className="align-items-center">
            <CCol md="auto">
              <CIcon icon={cilInfo} size="lg" className="me-2" />
            </CCol>
            <CCol>
              <strong>Margin Level Tips:</strong> Keep your margin level above 300% for safe trading.
              Current level is {formatPercent(accountData.marginLevel)} ({marginStatus.text}).
              {distanceToLiquidation <= 20 ?
                ' ⚠️ Critical level - consider reducing positions immediately!' :
                distanceToWarning <= 20 ?
                  ' ⚠️ Approaching warning level - monitor closely.' :
                  ' ✅ Your margin level is healthy.'}
            </CCol>
          </CRow>
        </CAlert>
      </CCardBody>

      <CCardFooter className="d-flex justify-content-between align-items-center small text-muted">
        <div className="d-flex align-items-center">
          <CIcon icon={cilInfo} className="me-2" />
          Margin level updates in real-time. Values update every 5 seconds.
        </div>
        <div>
          <span className="me-3">Status: <span className={`fw-semibold text-${marginStatus.color}`}>{marginStatus.text}</span></span>
          <span>Open Positions: <span className="fw-semibold">{accountData.openPositions}</span></span>
        </div>
      </CCardFooter>
    </CCard>
  );
};

export default MarginLevel;