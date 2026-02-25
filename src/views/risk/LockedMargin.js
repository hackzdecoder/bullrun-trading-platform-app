import React, { useState, useEffect } from 'react';
import {
  CCard,
  CCardHeader,
  CCardBody,
  CCardFooter,
  CRow,
  CCol,
  CButton,
  CFormSelect,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CProgress,
  CProgressBar,
  CSpinner,
  CPagination,
  CPaginationItem,
  CInputGroup,
  CFormInput,
  CInputGroupText,
  CTooltip,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilLockLocked,
  cilLockUnlocked,
  cilInfo,
  cilHistory,
  cilReload,
  cilClock,
  cilFilter,
  cilSearch,
  cilBan,
  cilMoney,
  cilBarChart,
  cilChartPie,
  cilBolt,
  cilSpeedometer,
  cilWallet,
  cilDollar,
  cilGraph,
  cilArrowTop,
  cilArrowBottom,
} from '@coreui/icons';
import currency from 'currency.js';

const LockedMargin = () => {
  // State
  const [loading, setLoading] = useState(true);
  const [marginData, setMarginData] = useState([]);
  const [filterSymbol, setFilterSymbol] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const itemsPerPage = 10;

  // Mock account data
  const accountData = {
    balance: 25840.75,
    equity: 26350.30,
    usedMargin: 4250.15,
    freeMargin: 22100.15,
    marginLevel: 325.8,
    currency: 'USD',
    openPositions: 5,
    initialMargin: 3850.50,
    maintenanceMargin: 2125.08,
    marginCallLevel: 100,
    stopOutLevel: 50,
  };

  // Mock margin breakdown by position
  const mockMarginData = [
    {
      id: 1,
      symbol: 'EUR/USD',
      type: 'BUY',
      lots: 0.5,
      entryPrice: 1.0825,
      currentPrice: 1.0850,
      marginUsed: 541.25,
      marginRequired: 541.25,
      marginPercent: 12.7,
      leverage: '1:100',
      pnl: 125.00,
      pnlPercent: 2.31,
      status: 'active',
    },
    {
      id: 2,
      symbol: 'GBP/USD',
      type: 'SELL',
      lots: 0.3,
      entryPrice: 1.2650,
      currentPrice: 1.2620,
      marginUsed: 379.50,
      marginRequired: 379.50,
      marginPercent: 8.9,
      leverage: '1:100',
      pnl: 90.00,
      pnlPercent: 2.37,
      status: 'active',
    },
    {
      id: 3,
      symbol: 'USD/JPY',
      type: 'BUY',
      lots: 1.0,
      entryPrice: 148.25,
      currentPrice: 148.28,
      marginUsed: 1482.80,
      marginRequired: 1482.80,
      marginPercent: 34.9,
      leverage: '1:100',
      pnl: 30.00,
      pnlPercent: 0.20,
      status: 'active',
    },
    {
      id: 4,
      symbol: 'BTC/USD',
      type: 'BUY',
      lots: 0.05,
      entryPrice: 42850,
      currentPrice: 43150,
      marginUsed: 2157.50,
      marginRequired: 2157.50,
      marginPercent: 50.8,
      leverage: '1:20',
      pnl: 150.00,
      pnlPercent: 0.70,
      status: 'active',
    },
    {
      id: 5,
      symbol: 'AUD/USD',
      type: 'SELL',
      lots: 0.8,
      entryPrice: 0.6590,
      currentPrice: 0.6580,
      marginUsed: 526.40,
      marginRequired: 526.40,
      marginPercent: 12.4,
      leverage: '1:100',
      pnl: 80.00,
      pnlPercent: 1.52,
      status: 'active',
    },
    {
      id: 6,
      symbol: 'ETH/USD',
      type: 'BUY',
      lots: 0.5,
      entryPrice: 2850,
      currentPrice: 2835,
      marginUsed: 1425.00,
      marginRequired: 1425.00,
      marginPercent: 33.5,
      leverage: '1:50',
      pnl: -75.00,
      pnlPercent: -0.53,
      status: 'active',
    },
  ];

  // Mock margin history
  const marginHistory = [
    { id: 1, date: '2024-01-15 09:30', event: 'Position Opened', symbol: 'EUR/USD', margin: 541.25, type: 'increase' },
    { id: 2, date: '2024-01-15 10:15', event: 'Position Opened', symbol: 'GBP/USD', margin: 379.50, type: 'increase' },
    { id: 3, date: '2024-01-15 11:45', event: 'Position Opened', symbol: 'BTC/USD', margin: 2157.50, type: 'increase' },
    { id: 4, date: '2024-01-15 13:20', event: 'Position Opened', symbol: 'AUD/USD', margin: 526.40, type: 'increase' },
    { id: 5, date: '2024-01-14 22:15', event: 'Position Opened', symbol: 'USD/JPY', margin: 1482.80, type: 'increase' },
    { id: 6, date: '2024-01-14 19:20', event: 'Position Opened', symbol: 'ETH/USD', margin: 1425.00, type: 'increase' },
    { id: 7, date: '2024-01-13 15:30', event: 'Position Closed', symbol: 'USD/CAD', margin: -807.90, type: 'decrease' },
    { id: 8, date: '2024-01-12 11:45', event: 'Position Closed', symbol: 'NZD/USD', margin: -245.60, type: 'decrease' },
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setMarginData(mockMarginData);
      setLastUpdate(new Date());
      setLoading(false);
    }, 800);
  }, []);

  // Filter margin data
  const filteredData = marginData.filter(item => {
    const matchesSymbol = filterSymbol === 'all' || item.symbol === filterSymbol;
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesSearch = searchQuery === '' ||
      item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.leverage.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSymbol && matchesType && matchesSearch;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Format functions
  const formatCurrency = (value) => currency(value, { precision: 2, symbol: '$' }).format();
  const formatPrice = (price, digits = 4) => {
    if (!price) return '0.0000';
    return typeof price === 'number' ? price.toFixed(digits) : price;
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSymbolDigits = (symbol) => {
    const digits = {
      'EUR/USD': 4,
      'GBP/USD': 4,
      'USD/JPY': 3,
      'BTC/USD': 1,
      'AUD/USD': 4,
      'ETH/USD': 1,
    };
    return digits[symbol] || 4;
  };

  // Calculate metrics
  const totalUsedMargin = filteredData.reduce((sum, item) => sum + item.marginUsed, 0);
  const avgMarginPerPosition = filteredData.length > 0 ? totalUsedMargin / filteredData.length : 0;
  const highestMargin = filteredData.length > 0 ? Math.max(...filteredData.map(item => item.marginUsed)) : 0;
  const lowestMargin = filteredData.length > 0 ? Math.min(...filteredData.map(item => item.marginUsed)) : 0;
  const marginUtilization = (totalUsedMargin / accountData.equity) * 100;

  // Get unique symbols and types
  const symbols = ['all', ...new Set(marginData.map(item => item.symbol))];
  const types = ['all', ...new Set(marginData.map(item => item.type))];

  // Get margin level status
  const getMarginLevelStatus = () => {
    if (accountData.marginLevel > 300) return { text: 'Safe', color: 'success', icon: cilLockUnlocked };
    if (accountData.marginLevel > 150) return { text: 'Warning', color: 'warning', icon: cilLockLocked };
    if (accountData.marginLevel > 100) return { text: 'High Risk', color: 'danger', icon: cilLockLocked };
    return { text: 'Critical', color: 'danger', icon: cilLockLocked };
  };

  const marginStatus = getMarginLevelStatus();

  return (
    <CCard className="mb-4">
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <div>
          <h4 className="mb-0">
            <CIcon icon={cilLockLocked} className="me-2 text-warning" />
            Locked Margin
          </h4>
          <small className="text-muted">Real-time margin usage and requirements</small>
        </div>
        <div className="d-flex align-items-center gap-3">
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
              <strong>Margin Status: <span className={`text-${marginStatus.color}`}>{marginStatus.text}</span></strong>
            </CCol>
            <CCol md="auto" className="text-muted">
              Open Positions: <span className="fw-semibold">{filteredData.length}</span>
            </CCol>
            <CCol md="auto" className="text-muted">
              Total Margin: <span className="fw-semibold text-warning">{formatCurrency(totalUsedMargin)}</span>
            </CCol>
            <CCol md="auto" className="text-muted">
              Utilization: <span className={`fw-semibold ${marginUtilization > 50 ? 'text-warning' : 'text-success'}`}>
                {marginUtilization.toFixed(1)}%
              </span>
            </CCol>
          </CRow>
        </div>

        {/* Main Margin Display */}
        <CRow className="mb-4">
          <CCol md={6}>
            <div className="text-center p-4 border rounded">
              <div className="text-muted mb-2">LOCKED MARGIN</div>
              <div className="display-3 fw-bold mb-2 text-warning">{formatCurrency(accountData.usedMargin)}</div>
              <div className="d-flex justify-content-center gap-3">
                <span className="text-muted small">
                  Initial: {formatCurrency(accountData.initialMargin)}
                </span>
                <span className="text-muted small">
                  Maintenance: {formatCurrency(accountData.maintenanceMargin)}
                </span>
              </div>
            </div>
          </CCol>
          <CCol md={6}>
            <div className="text-center p-4 border rounded">
              <div className="text-muted mb-2">FREE MARGIN</div>
              <div className="display-3 fw-bold mb-2 text-success">{formatCurrency(accountData.freeMargin)}</div>
              <div className="d-flex justify-content-center gap-3">
                <span className="text-muted small">
                  Equity: {formatCurrency(accountData.equity)}
                </span>
                <span className="text-muted small">
                  Balance: {formatCurrency(accountData.balance)}
                </span>
              </div>
            </div>
          </CCol>
        </CRow>

        {/* Key Metrics Cards */}
        <CRow className="mb-4 g-3">
          <CCol md={3}>
            <div className="border rounded p-2">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <small className="text-muted">Margin Level</small>
                <CIcon icon={cilSpeedometer} className={`text-${marginStatus.color}`} size="sm" />
              </div>
              <div className={`fw-bold fs-6 text-${marginStatus.color}`}>
                {accountData.marginLevel.toFixed(1)}%
              </div>
              <small className="text-muted">{marginStatus.text}</small>
            </div>
          </CCol>
          <CCol md={3}>
            <div className="border rounded p-2">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <small className="text-muted">Avg Margin/Position</small>
                <CIcon icon={cilBarChart} className="text-info" size="sm" />
              </div>
              <div className="fw-bold fs-6">{formatCurrency(avgMarginPerPosition)}</div>
              <small className="text-muted">per open position</small>
            </div>
          </CCol>
          <CCol md={3}>
            <div className="border rounded p-2">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <small className="text-muted">Highest Margin</small>
                <CIcon icon={cilArrowTop} className="text-danger" size="sm" />
              </div>
              <div className="fw-bold fs-6 text-danger">{formatCurrency(highestMargin)}</div>
              <small className="text-muted">BTC/USD</small>
            </div>
          </CCol>
          <CCol md={3}>
            <div className="border rounded p-2">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <small className="text-muted">Lowest Margin</small>
                <CIcon icon={cilArrowBottom} className="text-success" size="sm" />
              </div>
              <div className="fw-bold fs-6 text-success">{formatCurrency(lowestMargin)}</div>
              <small className="text-muted">GBP/USD</small>
            </div>
          </CCol>
        </CRow>

        {/* Margin Level Progress Bar */}
        <div className="mb-4">
          <div className="d-flex justify-content-between mb-1">
            <span className="text-muted small">Margin Level</span>
            <span className="fw-semibold small">{accountData.marginLevel.toFixed(1)}%</span>
          </div>
          <CProgress height={8}>
            <CProgressBar
              value={Math.min(accountData.marginLevel, 100)}
              color={accountData.marginLevel > 300 ? 'success' : accountData.marginLevel > 150 ? 'warning' : 'danger'}
            />
            <CProgressBar
              value={accountData.marginLevel > 100 ? Math.min(accountData.marginLevel - 100, 100) : 0}
              color="info"
            />
          </CProgress>
          <div className="d-flex justify-content-between mt-1 small text-muted">
            <span>Stop Out: {accountData.stopOutLevel}%</span>
            <span>Margin Call: {accountData.marginCallLevel}%</span>
            <span>Safe: 300%+</span>
          </div>
        </div>

        {/* Filters */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="mb-0">
            <CIcon icon={cilFilter} className="me-2" />
            Margin Breakdown by Position
          </h6>
          <div className="d-flex gap-2">
            <CInputGroup size="sm" style={{ width: '200px' }}>
              <CInputGroupText>
                <CIcon icon={cilSearch} />
              </CInputGroupText>
              <CFormInput
                placeholder="Search positions..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
              {searchQuery && (
                <CButton
                  color="secondary"
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchQuery('')}
                >
                  Clear
                </CButton>
              )}
            </CInputGroup>
            <CFormSelect
              size="sm"
              style={{ width: '120px' }}
              value={filterSymbol}
              onChange={(e) => {
                setFilterSymbol(e.target.value);
                setCurrentPage(1);
              }}
            >
              {symbols.map(sym => (
                <option key={sym} value={sym}>
                  {sym === 'all' ? 'All Symbols' : sym}
                </option>
              ))}
            </CFormSelect>
            <CFormSelect
              size="sm"
              style={{ width: '100px' }}
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setCurrentPage(1);
              }}
            >
              {types.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type}
                </option>
              ))}
            </CFormSelect>
            <CButton
              size="sm"
              color="secondary"
              variant="outline"
              onClick={() => {
                setLoading(true);
                setTimeout(() => {
                  setMarginData(mockMarginData);
                  setLastUpdate(new Date());
                  setLoading(false);
                }, 500);
              }}
            >
              <CIcon icon={cilReload} className="me-1" size="sm" />
              Refresh
            </CButton>
          </div>
        </div>

        {/* Search Results Summary */}
        {searchQuery && (
          <div className="mb-2 small">
            <span className="text-muted">
              Search results for "{searchQuery}": {filteredData.length} positions found
            </span>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-5">
            <CSpinner color="primary" />
            <p className="text-muted mt-3">Loading margin data...</p>
          </div>
        ) : (
          <>
            {/* Margin Table */}
            <CTable hover responsive className="mb-3 border">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell className="small">Symbol</CTableHeaderCell>
                  <CTableHeaderCell className="small">Type</CTableHeaderCell>
                  <CTableHeaderCell className="small text-end">Lots</CTableHeaderCell>
                  <CTableHeaderCell className="small text-end">Entry</CTableHeaderCell>
                  <CTableHeaderCell className="small text-end">Current</CTableHeaderCell>
                  <CTableHeaderCell className="small text-end">Margin Used</CTableHeaderCell>
                  <CTableHeaderCell className="small text-end">Margin %</CTableHeaderCell>
                  <CTableHeaderCell className="small">Leverage</CTableHeaderCell>
                  <CTableHeaderCell className="small text-end">P&L</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {currentItems.length > 0 ? (
                  currentItems.map(item => (
                    <CTableRow key={item.id}>
                      <CTableDataCell className="fw-semibold small">{item.symbol}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={item.type === 'BUY' ? 'success' : 'danger'} className="small">
                          <CIcon
                            icon={item.type === 'BUY' ? cilArrowTop : cilArrowBottom}
                            className="me-1"
                            size="sm"
                          />
                          {item.type}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell className="text-end small">{item.lots.toFixed(2)}</CTableDataCell>
                      <CTableDataCell className="text-end small">{formatPrice(item.entryPrice, getSymbolDigits(item.symbol))}</CTableDataCell>
                      <CTableDataCell className="text-end small">{formatPrice(item.currentPrice, getSymbolDigits(item.symbol))}</CTableDataCell>
                      <CTableDataCell className="text-end fw-semibold small text-warning">{formatCurrency(item.marginUsed)}</CTableDataCell>
                      <CTableDataCell className="text-end small">
                        <div className="d-flex align-items-center justify-content-end gap-2">
                          <span>{item.marginPercent.toFixed(1)}%</span>
                          <div style={{ width: '40px' }}>
                            <CProgress height={4} value={item.marginPercent} color="warning" />
                          </div>
                        </div>
                      </CTableDataCell>
                      <CTableDataCell className="small">{item.leverage}</CTableDataCell>
                      <CTableDataCell className={`text-end fw-semibold small ${item.pnl >= 0 ? 'text-success' : 'text-danger'}`}>
                        {item.pnl >= 0 ? '+' : ''}{formatCurrency(item.pnl)}
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan={9} className="text-center py-4 text-muted">
                      <CIcon icon={cilBan} size="lg" className="mb-2" />
                      <p>No margin data found matching your filters</p>
                      {searchQuery && (
                        <CButton
                          size="sm"
                          color="secondary"
                          variant="outline"
                          onClick={() => setSearchQuery('')}
                        >
                          Clear Search
                        </CButton>
                      )}
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>

            {/* Pagination */}
            {filteredData.length > itemsPerPage && (
              <div className="d-flex justify-content-between align-items-center mb-4">
                <small className="text-muted">
                  Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} positions
                </small>
                <CPagination className="mb-0" size="sm" aria-label="Page navigation">
                  <CPaginationItem
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  >
                    Previous
                  </CPaginationItem>
                  {[...Array(totalPages)].map((_, i) => (
                    <CPaginationItem
                      key={i + 1}
                      active={currentPage === i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </CPaginationItem>
                  ))}
                  <CPaginationItem
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  >
                    Next
                  </CPaginationItem>
                </CPagination>
              </div>
            )}

            {/* Margin History */}
            <div className="mt-4">
              <h6 className="mb-3">
                <CIcon icon={cilHistory} className="me-2" />
                Margin History
              </h6>
              <CTable hover responsive size="sm" className="mb-0 border">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell className="small">Date</CTableHeaderCell>
                    <CTableHeaderCell className="small">Event</CTableHeaderCell>
                    <CTableHeaderCell className="small">Symbol</CTableHeaderCell>
                    <CTableHeaderCell className="small text-end">Margin Change</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {marginHistory.slice(0, 5).map(item => (
                    <CTableRow key={item.id}>
                      <CTableDataCell className="small">
                        <CIcon icon={cilClock} size="sm" className="me-1 text-muted" />
                        {formatDate(item.date)}
                      </CTableDataCell>
                      <CTableDataCell className="small">{item.event}</CTableDataCell>
                      <CTableDataCell className="fw-semibold small">{item.symbol}</CTableDataCell>
                      <CTableDataCell className={`text-end fw-semibold small ${item.type === 'increase' ? 'text-danger' : 'text-success'}`}>
                        {item.type === 'increase' ? '+' : '-'}{formatCurrency(Math.abs(item.margin))}
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </div>
          </>
        )}
      </CCardBody>

      {/* Footer */}
      <CCardFooter className="d-flex justify-content-between align-items-center small text-muted">
        <div className="d-flex align-items-center">
          <CIcon icon={cilInfo} className="me-2" />
          Margin is locked when positions are open and released when positions are closed.
        </div>
        <div className="d-flex gap-3">
          <span>Margin Call: <span className="fw-semibold text-warning">{accountData.marginCallLevel}%</span></span>
          <span>Stop Out: <span className="fw-semibold text-danger">{accountData.stopOutLevel}%</span></span>
          <span>
            Used/Total: <span className="fw-semibold text-warning">{formatCurrency(totalUsedMargin)}</span> / <span className="fw-semibold text-success">{formatCurrency(accountData.equity)}</span>
          </span>
        </div>
      </CCardFooter>
    </CCard>
  );
};

export default LockedMargin;