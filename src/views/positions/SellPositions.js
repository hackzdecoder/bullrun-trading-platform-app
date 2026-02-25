import React, { useState, useEffect } from 'react';
import {
  CCard,
  CCardHeader,
  CCardBody,
  CCardFooter,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CRow,
  CCol,
  CFormSelect,
  CInputGroup,
  CFormInput,
  CInputGroupText,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CAlert,
  CSpinner,
  CPagination,
  CPaginationItem,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilX,
  cilCheck,
  cilArrowBottom,
  cilInfo,
  cilWarning,
  cilHistory,
  cilReload,
  cilCalculator,
  cilClock,
  cilBan,
  cilTag,
  cilPlus,
  cilMinus,
  cilFilter,
  cilSearch,
} from '@coreui/icons';
import currency from 'currency.js';

const SellPositions = () => {
  // State for positions
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [filterSymbol, setFilterSymbol] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Close position states
  const [closeMethod, setCloseMethod] = useState('market');
  const [closePrice, setClosePrice] = useState('');
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [closeSuccess, setCloseSuccess] = useState(false);
  const [closeError, setCloseError] = useState('');
  const [partialClose, setPartialClose] = useState(false);
  const [partialLots, setPartialLots] = useState('');
  const [quickClosePercent, setQuickClosePercent] = useState(25);
  const [closingPosition, setClosingPosition] = useState(false);

  // Account metrics
  const [accountMetrics, setAccountMetrics] = useState({
    balance: 25000.00,
    equity: 25750.50,
    usedMargin: 8450.75,
    freeMargin: 17299.75,
    marginLevel: 304.5
  });

  // Mock Sell/Short positions data
  const mockSellPositions = [
    {
      id: 1,
      symbol: 'EUR/USD',
      type: 'SELL',
      lots: 0.5,
      entryPrice: 1.0925,
      currentPrice: 1.0890,
      profit: 175.00,
      profitPips: 35,
      swap: 0.15,
      margin: 546.25,
      duration: '3h 45m',
      stopLoss: 1.0950,
      takeProfit: 1.0860,
      entryTime: '2024-01-16 08:30',
      commission: 1.50,
      contractSize: 100000,
      spread: 1.2,
      openPrice: 1.0925,
      marginLevel: 356,
      status: 'OPEN',
    },
    {
      id: 2,
      symbol: 'GBP/USD',
      type: 'SELL',
      lots: 0.8,
      entryPrice: 1.2680,
      currentPrice: 1.2645,
      profit: 280.00,
      profitPips: 35,
      swap: 0.25,
      margin: 1014.40,
      duration: '5h 20m',
      stopLoss: 1.2700,
      takeProfit: 1.2620,
      entryTime: '2024-01-16 09:15',
      commission: 2.40,
      contractSize: 100000,
      spread: 1.5,
      openPrice: 1.2680,
      marginLevel: 382,
      status: 'OPEN',
    },
    {
      id: 3,
      symbol: 'USD/JPY',
      type: 'SELL',
      lots: 1.2,
      entryPrice: 148.45,
      currentPrice: 148.38,
      profit: 84.00,
      profitPips: 7,
      swap: -0.35,
      margin: 1781.40,
      duration: '2h 10m',
      stopLoss: 148.60,
      takeProfit: 148.25,
      entryTime: '2024-01-16 11:45',
      commission: 3.60,
      contractSize: 100000,
      spread: 1.8,
      openPrice: 148.45,
      marginLevel: 298,
      status: 'OPEN',
    },
    {
      id: 4,
      symbol: 'BTC/USD',
      type: 'SELL',
      lots: 0.03,
      entryPrice: 43250,
      currentPrice: 42980,
      profit: 81.00,
      profitPips: 270,
      swap: -0.30,
      margin: 1297.50,
      duration: '1h 30m',
      stopLoss: 43500,
      takeProfit: 42800,
      entryTime: '2024-01-16 13:20',
      commission: 1.50,
      contractSize: 1,
      spread: 5.0,
      openPrice: 43250,
      marginLevel: 415,
      status: 'OPEN',
    },
    {
      id: 5,
      symbol: 'AUD/USD',
      type: 'SELL',
      lots: 1.0,
      entryPrice: 0.6620,
      currentPrice: 0.6610,
      profit: 100.00,
      profitPips: 10,
      swap: 0.18,
      margin: 661.00,
      duration: '4h 15m',
      stopLoss: 0.6635,
      takeProfit: 0.6600,
      entryTime: '2024-01-16 10:30',
      commission: 3.00,
      contractSize: 100000,
      spread: 1.3,
      openPrice: 0.6620,
      marginLevel: 345,
      status: 'OPEN',
    },
    {
      id: 6,
      symbol: 'ETH/USD',
      type: 'SELL',
      lots: 0.5,
      entryPrice: 2850,
      currentPrice: 2835,
      profit: 75.00,
      profitPips: 15,
      swap: -0.12,
      margin: 1417.50,
      duration: '6h 40m',
      stopLoss: 2870,
      takeProfit: 2820,
      entryTime: '2024-01-16 07:50',
      commission: 2.50,
      contractSize: 1,
      spread: 2.5,
      openPrice: 2850,
      marginLevel: 312,
      status: 'OPEN',
    }
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setPositions(mockSellPositions);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter positions
  const filteredPositions = positions.filter(position => {
    const matchesSymbol = filterSymbol === 'all' || position.symbol === filterSymbol;
    const matchesType = filterType === 'all' || position.type === filterType;
    const matchesSearch = searchQuery === '' ||
      position.symbol.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSymbol && matchesType && matchesSearch;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPositions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPositions.length / itemsPerPage);

  const formatCurrency = (value) => currency(value, { precision: 2, symbol: '$' }).format();

  const formatPrice = (price, symbol = 'EUR/USD') => {
    if (!price) return '0.0000';
    const digits = getSymbolDigits(symbol);
    return typeof price === 'number' ? price.toFixed(digits) : price;
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

  const calculateEstimatedPnL = () => {
    if (!selectedPosition) return { pnl: 0, pips: 0 };

    const closePriceValue = closeMethod === 'market'
      ? selectedPosition.currentPrice
      : parseFloat(closePrice) || selectedPosition.currentPrice;

    const lots = partialClose ? parseFloat(partialLots) || selectedPosition.lots : selectedPosition.lots;
    const contractSize = selectedPosition.symbol.includes('BTC') || selectedPosition.symbol.includes('ETH') ? 1 : 100000;
    const pipSize = selectedPosition.symbol.includes('JPY') ? 0.001 :
      selectedPosition.symbol.includes('BTC') || selectedPosition.symbol.includes('ETH') ? 1 : 0.0001;

    const pnl = (selectedPosition.entryPrice - closePriceValue) * lots * contractSize;
    const pips = (selectedPosition.entryPrice - closePriceValue) / pipSize;

    return { pnl, pips };
  };

  const handleSelectPosition = (position) => {
    setSelectedPosition(position);
    setClosePrice(position.currentPrice.toString());
    setCloseError('');
    setPartialClose(false);
    setPartialLots(position.lots.toString());
    setQuickClosePercent(25);
  };

  const handleQuickClosePercent = (percent) => {
    setQuickClosePercent(percent);
    const lotsToClose = (selectedPosition.lots * percent) / 100;
    setPartialLots(lotsToClose.toFixed(2));
    setPartialClose(true);
  };

  const validateClose = () => {
    if (!selectedPosition) {
      setCloseError('No position selected');
      return false;
    }

    if (closeMethod === 'limit' && !closePrice) {
      setCloseError('Please enter close price');
      return false;
    }

    if (closeMethod === 'limit' && closePrice) {
      const price = parseFloat(closePrice);
      if (price >= selectedPosition.entryPrice) {
        setCloseError('Limit price must be below entry price for SELL positions');
        return false;
      }
    }

    if (partialClose) {
      const lotsToClose = parseFloat(partialLots);
      if (isNaN(lotsToClose) || lotsToClose <= 0 || lotsToClose > selectedPosition.lots) {
        setCloseError(`Please enter valid lots (0.01 - ${selectedPosition.lots})`);
        return false;
      }
    }

    return true;
  };

  const handleCloseConfirm = () => {
    if (!validateClose()) return;
    setConfirmModalVisible(true);
  };

  const handleExecuteClose = () => {
    setClosingPosition(true);

    setTimeout(() => {
      const { pnl } = calculateEstimatedPnL();
      const lotsClosed = partialClose ? parseFloat(partialLots) : selectedPosition.lots;

      if (partialClose && lotsClosed < selectedPosition.lots) {
        setPositions(prev => prev.map(p =>
          p.id === selectedPosition.id
            ? {
              ...p,
              lots: p.lots - lotsClosed,
              margin: (p.margin / p.lots) * (p.lots - lotsClosed),
            }
            : p
        ));
      } else {
        setPositions(prev => prev.filter(p => p.id !== selectedPosition.id));
      }

      setAccountMetrics(prev => ({
        balance: prev.balance + pnl,
        equity: prev.equity - (selectedPosition.profit - pnl),
        usedMargin: prev.usedMargin - (partialClose ? (selectedPosition.margin / selectedPosition.lots) * lotsClosed : selectedPosition.margin),
        freeMargin: prev.freeMargin + (partialClose ? (selectedPosition.margin / selectedPosition.lots) * lotsClosed : selectedPosition.margin) + pnl,
        marginLevel: calculateNewMarginLevel(prev, pnl, selectedPosition, partialClose, lotsClosed)
      }));

      setConfirmModalVisible(false);
      setCloseSuccess(true);
      setClosingPosition(false);

      setTimeout(() => {
        setCloseSuccess(false);
        setSelectedPosition(null);
        setPartialClose(false);
        setClosePrice('');
      }, 3000);
    }, 1500);
  };

  const calculateNewMarginLevel = (prevMetrics, pnl, position, isPartial, lotsClosed) => {
    const newBalance = prevMetrics.balance + pnl;
    const newUsedMargin = prevMetrics.usedMargin - (isPartial ? (position.margin / position.lots) * lotsClosed : position.margin);
    const newEquity = newBalance;
    return (newEquity / newUsedMargin) * 100;
  };

  const handleCancelSelection = () => {
    setSelectedPosition(null);
    setPartialClose(false);
    setClosePrice('');
    setCloseError('');
  };

  const totalLots = filteredPositions.reduce((sum, p) => sum + p.lots, 0);
  const totalProfit = filteredPositions.reduce((sum, p) => sum + p.profit, 0);
  const totalMargin = filteredPositions.reduce((sum, p) => sum + p.margin, 0);

  const symbols = ['all', ...new Set(positions.map(p => p.symbol))];

  return (
    <CCard className="mb-4">
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <div>
          <h4 className="mb-0">
            <CIcon icon={cilArrowBottom} className="me-2 text-danger" />
            Sell / Short Positions
          </h4>
          <small className="text-muted">
            Manage and close your open short positions ({positions.length} open)
          </small>
        </div>
        <div className="d-flex gap-2">
          <CButton
            size="sm"
            color="secondary"
            variant="outline"
            onClick={() => {
              setLoading(true);
              setTimeout(() => {
                setPositions(mockSellPositions);
                setLoading(false);
              }, 500);
            }}
          >
            <CIcon icon={cilReload} className="me-1" size="sm" />
            Refresh
          </CButton>
        </div>
      </CCardHeader>

      <CCardBody>
        {/* Account Metrics Bar */}
        <CRow className="mb-4 g-3">
          <CCol md={2}>
            <div className="border rounded p-2 text-center">
              <small className="text-muted d-block">Balance</small>
              <span className="fw-bold fs-5">{formatCurrency(accountMetrics.balance)}</span>
            </div>
          </CCol>
          <CCol md={2}>
            <div className="border rounded p-2 text-center">
              <small className="text-muted d-block">Equity</small>
              <span className="fw-bold fs-5">{formatCurrency(accountMetrics.equity)}</span>
            </div>
          </CCol>
          <CCol md={2}>
            <div className="border rounded p-2 text-center">
              <small className="text-muted d-block">Used Margin</small>
              <span className="fw-bold fs-5 text-warning">{formatCurrency(accountMetrics.usedMargin)}</span>
            </div>
          </CCol>
          <CCol md={2}>
            <div className="border rounded p-2 text-center">
              <small className="text-muted d-block">Free Margin</small>
              <span className="fw-bold fs-5 text-success">{formatCurrency(accountMetrics.freeMargin)}</span>
            </div>
          </CCol>
          <CCol md={2}>
            <div className="border rounded p-2 text-center">
              <small className="text-muted d-block">Margin Level</small>
              <span className="fw-bold fs-5">{accountMetrics.marginLevel.toFixed(1)}%</span>
            </div>
          </CCol>
          <CCol md={2}>
            <div className="border rounded p-2 text-center">
              <small className="text-muted d-block">Open P&L</small>
              <span className="fw-bold fs-5 text-success">+$1,245.50</span>
            </div>
          </CCol>
        </CRow>

        {/* Success Alert */}
        {closeSuccess && (
          <CAlert color="success" className="mb-3" dismissible>
            <CIcon icon={cilCheck} className="me-2" />
            Position closed successfully! Check your updated balance and margin.
          </CAlert>
        )}

        {/* Error Alert */}
        {closeError && (
          <CAlert color="danger" className="mb-3" dismissible>
            <CIcon icon={cilWarning} className="me-2" />
            {closeError}
          </CAlert>
        )}

        {/* Filters */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">
            <CIcon icon={cilFilter} className="me-2" />
            Open Short Positions ({filteredPositions.length})
          </h5>
          <div className="d-flex gap-2">
            <CInputGroup size="sm" style={{ width: '200px' }}>
              <CInputGroupText>
                <CIcon icon={cilSearch} />
              </CInputGroupText>
              <CFormInput
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </CInputGroup>
            <CFormSelect
              size="sm"
              style={{ width: '140px' }}
              value={filterSymbol}
              onChange={(e) => setFilterSymbol(e.target.value)}
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
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="SELL">SELL</option>
            </CFormSelect>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-5">
            <CSpinner color="primary" />
            <p className="text-muted mt-3">Loading your sell positions...</p>
          </div>
        ) : (
          <>
            {/* Open Positions Table */}
            <CTable hover responsive className="mb-3 border">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell style={{ width: '80px' }}>Action</CTableHeaderCell>
                  <CTableHeaderCell>Symbol</CTableHeaderCell>
                  <CTableHeaderCell>Type</CTableHeaderCell>
                  <CTableHeaderCell className="text-end">Lots</CTableHeaderCell>
                  <CTableHeaderCell className="text-end">Entry</CTableHeaderCell>
                  <CTableHeaderCell className="text-end">Current (Bid)</CTableHeaderCell>
                  <CTableHeaderCell className="text-end">P&L</CTableHeaderCell>
                  <CTableHeaderCell className="text-end">Pips</CTableHeaderCell>
                  <CTableHeaderCell className="text-end">Swap</CTableHeaderCell>
                  <CTableHeaderCell className="text-end">Margin</CTableHeaderCell>
                  <CTableHeaderCell className="text-end">Duration</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {currentItems.length > 0 ? (
                  currentItems.map(pos => (
                    <CTableRow
                      key={pos.id}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleSelectPosition(pos)}
                    >
                      <CTableDataCell>
                        <CButton
                          size="sm"
                          color={selectedPosition?.id === pos.id ? 'danger' : 'primary'}
                          className="p-1 px-3"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectPosition(pos);
                          }}
                        >
                          {selectedPosition?.id === pos.id ? 'Selected' : 'Close'}
                        </CButton>
                      </CTableDataCell>
                      <CTableDataCell className="fw-semibold">{pos.symbol}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color="danger">
                          <CIcon icon={cilArrowBottom} className="me-1" size="sm" />
                          SELL
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell className="text-end">{pos.lots.toFixed(2)}</CTableDataCell>
                      <CTableDataCell className="text-end">
                        {formatPrice(pos.entryPrice, pos.symbol)}
                      </CTableDataCell>
                      <CTableDataCell className="text-end fw-medium">
                        {formatPrice(pos.currentPrice, pos.symbol)}
                      </CTableDataCell>
                      <CTableDataCell className={`text-end fw-semibold ${pos.profit >= 0 ? 'text-success' : 'text-danger'}`}>
                        {pos.profit >= 0 ? '+' : ''}{formatCurrency(pos.profit)}
                      </CTableDataCell>
                      <CTableDataCell className={`text-end ${pos.profitPips >= 0 ? 'text-success' : 'text-danger'}`}>
                        {pos.profitPips >= 0 ? '+' : ''}{pos.profitPips}
                      </CTableDataCell>
                      <CTableDataCell className={`text-end ${pos.swap >= 0 ? 'text-success' : 'text-danger'}`}>
                        {formatCurrency(pos.swap)}
                      </CTableDataCell>
                      <CTableDataCell className="text-end text-warning">
                        {formatCurrency(pos.margin)}
                      </CTableDataCell>
                      <CTableDataCell className="text-end">
                        <CIcon icon={cilClock} size="sm" className="me-1" />
                        {pos.duration}
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan={11} className="text-center py-4 text-muted">
                      <CIcon icon={cilBan} size="lg" className="mb-2" />
                      <p>No open short positions found matching your filters</p>
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>

            {/* Pagination */}
            {filteredPositions.length > itemsPerPage && (
              <div className="d-flex justify-content-between align-items-center mb-4">
                <small className="text-muted">
                  Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredPositions.length)} of {filteredPositions.length} positions
                </small>
                <CPagination className="mb-0" aria-label="Page navigation">
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

            {/* Selected Position Details */}
            {selectedPosition && (
              <div className="mt-4 pt-3 border-top">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">
                    <CIcon icon={cilCalculator} className="me-2" />
                    Close Short Position - {selectedPosition.symbol}
                  </h5>
                  <CButton
                    size="sm"
                    color="light"
                    variant="outline"
                    onClick={handleCancelSelection}
                  >
                    <CIcon icon={cilX} className="me-1" size="sm" />
                    Cancel
                  </CButton>
                </div>

                {/* Position Summary Cards */}
                <CRow className="mb-4 g-3">
                  <CCol md={3}>
                    <div className="border rounded p-2">
                      <small className="text-muted">Position Details</small>
                      <p className="mb-0 fw-semibold">
                        SELL {selectedPosition.lots} lots {selectedPosition.symbol}
                      </p>
                    </div>
                  </CCol>
                  <CCol md={3}>
                    <div className="border rounded p-2">
                      <small className="text-muted">Entry / Current</small>
                      <p className="mb-0 fw-semibold">
                        {formatPrice(selectedPosition.entryPrice, selectedPosition.symbol)} → {' '}
                        <span className="text-danger">{formatPrice(selectedPosition.currentPrice, selectedPosition.symbol)}</span>
                      </p>
                    </div>
                  </CCol>
                  <CCol md={3}>
                    <div className="border rounded p-2">
                      <small className="text-muted">Current P&L</small>
                      <p className={`mb-0 fw-semibold ${selectedPosition.profit >= 0 ? 'text-success' : 'text-danger'}`}>
                        {selectedPosition.profit >= 0 ? '+' : ''}{formatCurrency(selectedPosition.profit)}
                        <small className="text-muted ms-2">({selectedPosition.profitPips >= 0 ? '+' : ''}{selectedPosition.profitPips} pips)</small>
                      </p>
                    </div>
                  </CCol>
                  <CCol md={3}>
                    <div className="border rounded p-2">
                      <small className="text-muted">Stop Loss / Take Profit</small>
                      <p className="mb-0 fw-semibold">
                        <span className="text-danger">SL: {formatPrice(selectedPosition.stopLoss, selectedPosition.symbol)}</span>
                        {' / '}
                        <span className="text-success">TP: {formatPrice(selectedPosition.takeProfit, selectedPosition.symbol)}</span>
                      </p>
                    </div>
                  </CCol>
                </CRow>

                {/* Close Settings */}
                <div className="border rounded p-3 mb-4">
                  <h6 className="fw-semibold mb-3">
                    <CIcon icon={cilTag} className="me-2" />
                    Close Settings
                  </h6>

                  <CRow className="mb-3">
                    <CCol md={4}>
                      <label className="form-label">Close Method</label>
                      <CFormSelect
                        value={closeMethod}
                        onChange={(e) => setCloseMethod(e.target.value)}
                      >
                        <option value="market">Market Price (Bid) - Instant</option>
                        <option value="limit">Limit Price - Pending</option>
                      </CFormSelect>
                      <small className="text-muted">
                        SELL positions close at Bid price
                      </small>
                    </CCol>

                    {closeMethod === 'limit' && (
                      <CCol md={4}>
                        <label className="form-label">Limit Price</label>
                        <CInputGroup>
                          <CFormInput
                            type="number"
                            value={closePrice}
                            onChange={(e) => setClosePrice(e.target.value)}
                            placeholder="Enter price"
                            step={selectedPosition.symbol.includes('JPY') ? '0.001' : '0.0001'}
                          />
                          <CInputGroupText>{selectedPosition.symbol}</CInputGroupText>
                        </CInputGroup>
                        <small className="text-danger">
                          Must be below {formatPrice(selectedPosition.entryPrice, selectedPosition.symbol)} for profit
                        </small>
                      </CCol>
                    )}

                    <CCol md={4}>
                      <label className="form-label">Close Type</label>
                      <div className="d-flex gap-2">
                        <CButton
                          size="sm"
                          color={!partialClose ? 'danger' : 'light'}
                          variant={!partialClose ? undefined : 'outline'}
                          onClick={() => {
                            setPartialClose(false);
                            setPartialLots(selectedPosition.lots.toString());
                          }}
                          className="flex-fill"
                        >
                          Full Position
                        </CButton>
                        <CButton
                          size="sm"
                          color={partialClose ? 'danger' : 'light'}
                          variant={partialClose ? undefined : 'outline'}
                          onClick={() => setPartialClose(true)}
                          className="flex-fill"
                        >
                          Partial Close
                        </CButton>
                      </div>
                    </CCol>
                  </CRow>

                  {/* Partial Close Controls */}
                  {partialClose && (
                    <CRow className="mb-3">
                      <CCol md={4}>
                        <label className="form-label">Lots to Close</label>
                        <CInputGroup>
                          <CButton
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newVal = Math.max(0.01, parseFloat(partialLots || 0) - 0.01);
                              setPartialLots(newVal.toFixed(2));
                            }}
                          >
                            <CIcon icon={cilMinus} />
                          </CButton>
                          <CFormInput
                            type="number"
                            value={partialLots}
                            onChange={(e) => setPartialLots(e.target.value)}
                            min="0.01"
                            max={selectedPosition.lots}
                            step="0.01"
                            className="text-center"
                          />
                          <CButton
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newVal = Math.min(selectedPosition.lots, parseFloat(partialLots || 0) + 0.01);
                              setPartialLots(newVal.toFixed(2));
                            }}
                          >
                            <CIcon icon={cilPlus} />
                          </CButton>
                          <CInputGroupText>of {selectedPosition.lots.toFixed(2)}</CInputGroupText>
                        </CInputGroup>
                      </CCol>
                      <CCol md={8}>
                        <label className="form-label">Quick Close %</label>
                        <div className="d-flex gap-2">
                          {[25, 50, 75, 100].map(percent => (
                            <CButton
                              key={percent}
                              size="sm"
                              color={quickClosePercent === percent ? 'danger' : 'light'}
                              variant={quickClosePercent === percent ? undefined : 'outline'}
                              onClick={() => handleQuickClosePercent(percent)}
                              className="flex-fill"
                            >
                              {percent}%
                            </CButton>
                          ))}
                        </div>
                      </CCol>
                    </CRow>
                  )}

                  {/* Estimated P&L Preview */}
                  <div className="bg-light p-3 rounded">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-semibold">Estimated Result:</span>
                      <span className="fw-bold fs-5" style={{
                        color: calculateEstimatedPnL().pnl >= 0 ? '#28a745' : '#dc3545'
                      }}>
                        {calculateEstimatedPnL().pnl >= 0 ? '+' : ''}
                        {formatCurrency(calculateEstimatedPnL().pnl)}
                        <span className="small ms-2 text-muted">
                          ({calculateEstimatedPnL().pips >= 0 ? '+' : ''}
                          {calculateEstimatedPnL().pips.toFixed(1)} pips)
                        </span>
                      </span>
                    </div>
                    <div className="d-flex justify-content-between mt-2 small">
                      <span className="text-muted">
                        Closing at: {closeMethod === 'market'
                          ? `Market Bid (${formatPrice(selectedPosition.currentPrice, selectedPosition.symbol)})`
                          : `Limit ${formatPrice(parseFloat(closePrice) || 0, selectedPosition.symbol)}`}
                      </span>
                      <span className="text-muted">
                        Lots: {partialClose ? parseFloat(partialLots).toFixed(2) : selectedPosition.lots.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="d-flex gap-2">
                  <CButton
                    color="danger"
                    size="lg"
                    className="flex-fill py-3"
                    onClick={handleCloseConfirm}
                    disabled={closingPosition}
                  >
                    {closingPosition ? (
                      <CSpinner size="sm" className="me-2" />
                    ) : (
                      <CIcon icon={cilX} className="me-2" size="lg" />
                    )}
                    {partialClose ? 'Close Partial Short Position' : 'Close Short Position'}
                  </CButton>
                  <CButton
                    color="secondary"
                    variant="outline"
                    size="lg"
                    className="flex-fill py-3"
                    onClick={handleCancelSelection}
                    disabled={closingPosition}
                  >
                    Cancel
                  </CButton>
                </div>

                {/* Risk Warning */}
                <div className="mt-3 small text-muted">
                  <CIcon icon={cilInfo} className="me-1" />
                  Closing this position will realize P&L and release {formatCurrency(partialClose ? (selectedPosition.margin / selectedPosition.lots) * parseFloat(partialLots) : selectedPosition.margin)} margin.
                  {calculateEstimatedPnL().pnl < 0 && (
                    <span className="text-danger ms-2">
                      ⚠️ This will realize a loss of {formatCurrency(Math.abs(calculateEstimatedPnL().pnl))}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* No Selection State */}
            {!selectedPosition && filteredPositions.length > 0 && (
              <div className="text-center py-5 border rounded">
                <CIcon icon={cilInfo} size="3xl" className="mb-3 text-muted" />
                <h6 className="mb-2">Select a Short Position to Close</h6>
                <p className="text-muted small mb-0">
                  Click the "Close" button on any position in the table above to manage and close it
                </p>
              </div>
            )}
          </>
        )}
      </CCardBody>

      {/* Footer with Account Summary */}
      <CCardFooter className="d-flex justify-content-between align-items-center small text-muted">
        <div className="d-flex align-items-center">
          <CIcon icon={cilInfo} className="me-2" />
          Short positions profit when price decreases. Close at Bid price.
        </div>
        <div>
          <span className="me-3">
            Used Margin: <span className="fw-semibold text-warning">{formatCurrency(accountMetrics.usedMargin)}</span>
          </span>
          <span>
            Free Margin: <span className="fw-semibold text-success">{formatCurrency(accountMetrics.freeMargin)}</span>
          </span>
        </div>
      </CCardFooter>

      {/* Confirmation Modal */}
      <CModal
        visible={confirmModalVisible}
        onClose={() => setConfirmModalVisible(false)}
        alignment="center"
        size="lg"
      >
        <CModalHeader>
          <CModalTitle>Confirm Close Short Position</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedPosition && (
            <div>
              <p className="mb-3 text-muted">Please review the details below:</p>

              <div className="border rounded p-3 mb-3">
                <CRow className="mb-3">
                  <CCol sm={6}>
                    <div className="mb-2">
                      <span className="text-muted">Symbol:</span>
                      <span className="fw-semibold ms-2">{selectedPosition.symbol}</span>
                    </div>
                    <div className="mb-2">
                      <span className="text-muted">Type:</span>
                      <CBadge color="danger" className="ms-2">SELL</CBadge>
                    </div>
                    <div className="mb-2">
                      <span className="text-muted">Lots to Close:</span>
                      <span className="fw-semibold ms-2">
                        {partialClose ? parseFloat(partialLots).toFixed(2) : selectedPosition.lots.toFixed(2)}
                      </span>
                      {partialClose && (
                        <small className="text-muted ms-1">of {selectedPosition.lots.toFixed(2)}</small>
                      )}
                    </div>
                  </CCol>
                  <CCol sm={6}>
                    <div className="mb-2">
                      <span className="text-muted">Close Method:</span>
                      <span className="fw-semibold ms-2">
                        {closeMethod === 'market' ? 'Market (Bid)' : 'Limit'}
                      </span>
                    </div>
                    <div className="mb-2">
                      <span className="text-muted">Close Price:</span>
                      <span className="fw-semibold ms-2">
                        {closeMethod === 'market'
                          ? formatPrice(selectedPosition.currentPrice, selectedPosition.symbol)
                          : formatPrice(parseFloat(closePrice) || 0, selectedPosition.symbol)
                        }
                      </span>
                    </div>
                    <div className="mb-2">
                      <span className="text-muted">Entry Price:</span>
                      <span className="fw-semibold ms-2">
                        {formatPrice(selectedPosition.entryPrice, selectedPosition.symbol)}
                      </span>
                    </div>
                  </CCol>
                </CRow>

                <div className="border-top pt-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-semibold">Estimated P&L:</span>
                    <span className={`fw-bold fs-4 ${calculateEstimatedPnL().pnl >= 0 ? 'text-success' : 'text-danger'}`}>
                      {calculateEstimatedPnL().pnl >= 0 ? '+' : ''}
                      {formatCurrency(calculateEstimatedPnL().pnl)}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <span className="text-muted">Pips:</span>
                    <span className={`fw-semibold ${calculateEstimatedPnL().pips >= 0 ? 'text-success' : 'text-danger'}`}>
                      {calculateEstimatedPnL().pips >= 0 ? '+' : ''}
                      {calculateEstimatedPnL().pips.toFixed(1)}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <span className="text-muted">Margin to Release:</span>
                    <span className="fw-semibold text-success">
                      +{formatCurrency(partialClose ? (selectedPosition.margin / selectedPosition.lots) * parseFloat(partialLots) : selectedPosition.margin)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Warning for loss-making trades */}
              {calculateEstimatedPnL().pnl < 0 && (
                <CAlert color="warning" className="mb-0">
                  <CIcon icon={cilWarning} className="me-2" />
                  You are about to close a position at a loss of {formatCurrency(Math.abs(calculateEstimatedPnL().pnl))}.
                  This will be deducted from your balance.
                </CAlert>
              )}
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            variant="outline"
            onClick={() => setConfirmModalVisible(false)}
            disabled={closingPosition}
          >
            Cancel
          </CButton>
          <CButton
            color="danger"
            onClick={handleExecuteClose}
            disabled={closingPosition}
          >
            {closingPosition ? (
              <>
                <CSpinner size="sm" className="me-2" />
                Closing...
              </>
            ) : (
              <>
                <CIcon icon={cilCheck} className="me-2" />
                Confirm Close
              </>
            )}
          </CButton>
        </CModalFooter>
      </CModal>
    </CCard>
  );
};

export default SellPositions;