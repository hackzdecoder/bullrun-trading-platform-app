import React, { useState } from 'react';
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
  cilArrowTop,
  cilArrowBottom,
  cilInfo,
  cilWarning,
  cilHistory,
  cilReload,
  cilCalculator,
  cilClock,
  cilChart,
  cilBan,
  cilTag,
  cilPlus,
  cilMinus,
  cilFilter,
  cilSearch,
} from '@coreui/icons';
import currency from 'currency.js';

const ClosePosition = () => {
  // State
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [closeMethod, setCloseMethod] = useState('market');
  const [closePrice, setClosePrice] = useState('');
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [closeSuccess, setCloseSuccess] = useState(false);
  const [closeError, setCloseError] = useState('');
  const [partialClose, setPartialClose] = useState(false);
  const [partialLots, setPartialLots] = useState('');
  const [quickClosePercent, setQuickClosePercent] = useState(25);
  const [filterSymbol, setFilterSymbol] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [closingPosition, setClosingPosition] = useState(false);

  // Mock account data
  const accountData = {
    balance: 25840.75,
    equity: 26350.30,
    margin: 4250.15,
    freeMargin: 22100.15,
    marginLevel: 325.8,
    currency: 'USD'
  };

  // Mock open positions data with more details
  const openPositions = [
    {
      id: 1,
      symbol: 'EUR/USD',
      type: 'BUY',
      lots: 0.5,
      entryPrice: 1.0825,
      currentPrice: 1.0850,
      profit: 125.00,
      profitPips: 25,
      swap: -0.25,
      margin: 541.25,
      duration: '2h 15m',
      stopLoss: 1.0800,
      takeProfit: 1.0880,
      entryTime: '2024-01-15 09:30',
      commission: 1.50,
      breakEven: 1.0825,
      contractSize: 100000,
      spread: 1.2,
      openPrice: 1.0825,
    },
    {
      id: 2,
      symbol: 'GBP/USD',
      type: 'SELL',
      lots: 0.3,
      entryPrice: 1.2650,
      currentPrice: 1.2620,
      profit: 90.00,
      profitPips: 30,
      swap: 0.12,
      margin: 379.50,
      duration: '5h 30m',
      stopLoss: 1.2660,
      takeProfit: 1.2600,
      entryTime: '2024-01-15 11:20',
      commission: 0.90,
      breakEven: 1.2650,
      contractSize: 100000,
      spread: 1.5,
      openPrice: 1.2650,
    },
    {
      id: 3,
      symbol: 'USD/JPY',
      type: 'BUY',
      lots: 1.0,
      entryPrice: 148.25,
      currentPrice: 148.28,
      profit: 30.00,
      profitPips: 3,
      swap: -0.45,
      margin: 1482.80,
      duration: '1d 3h',
      stopLoss: 148.10,
      takeProfit: 148.50,
      entryTime: '2024-01-14 22:15',
      commission: 3.00,
      breakEven: 148.25,
      contractSize: 100000,
      spread: 1.8,
      openPrice: 148.25,
    },
    {
      id: 4,
      symbol: 'BTC/USD',
      type: 'BUY',
      lots: 0.05,
      entryPrice: 42850,
      currentPrice: 43150,
      profit: 150.00,
      profitPips: 300,
      swap: -0.50,
      margin: 2157.50,
      duration: '4h 45m',
      stopLoss: 42500,
      takeProfit: 43500,
      entryTime: '2024-01-15 08:30',
      commission: 2.50,
      breakEven: 42850,
      contractSize: 1,
      spread: 5.0,
      openPrice: 42850,
    },
    {
      id: 5,
      symbol: 'AUD/USD',
      type: 'SELL',
      lots: 0.8,
      entryPrice: 0.6590,
      currentPrice: 0.6580,
      profit: 80.00,
      profitPips: 10,
      swap: 0.08,
      margin: 526.40,
      duration: '1h 20m',
      stopLoss: 0.6600,
      takeProfit: 0.6570,
      entryTime: '2024-01-15 14:45',
      commission: 2.40,
      breakEven: 0.6590,
      contractSize: 100000,
      spread: 1.3,
      openPrice: 0.6590,
    },
  ];

  // Filter positions
  const filteredPositions = openPositions.filter(position => {
    const matchesSymbol = filterSymbol === 'all' || position.symbol === filterSymbol;
    const matchesType = filterType === 'all' || position.type === filterType;
    const matchesSearch = searchQuery === '' ||
      position.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      position.type.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSymbol && matchesType && matchesSearch;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPositions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPositions.length / itemsPerPage);

  // Format functions
  const formatCurrency = (value) => currency(value, { precision: 2, symbol: '$' }).format();
  const formatPrice = (price, digits = 4) => {
    if (!price) return '0.0000';
    return typeof price === 'number' ? price.toFixed(digits) : price;
  };

  // Get symbol digits
  const getSymbolDigits = (symbol) => {
    const digits = {
      'EUR/USD': 4,
      'GBP/USD': 4,
      'USD/JPY': 3,
      'BTC/USD': 1,
      'AUD/USD': 4,
    };
    return digits[symbol] || 4;
  };

  // Calculate estimated P&L
  const calculateEstimatedPnL = () => {
    if (!selectedPosition) return { pnl: 0, pips: 0 };

    const price = closeMethod === 'market'
      ? selectedPosition.currentPrice
      : parseFloat(closePrice) || selectedPosition.currentPrice;

    const lots = partialClose ? parseFloat(partialLots) || selectedPosition.lots : selectedPosition.lots;
    const contractSize = selectedPosition.symbol.includes('BTC') ? 1 : 100000;
    const pipSize = selectedPosition.symbol.includes('JPY') ? 0.001 : selectedPosition.symbol.includes('BTC') ? 1 : 0.0001;

    let pnl = 0;
    let pips = 0;

    if (selectedPosition.type === 'BUY') {
      pnl = (price - selectedPosition.entryPrice) * lots * contractSize;
      pips = (price - selectedPosition.entryPrice) / pipSize;
    } else {
      pnl = (selectedPosition.entryPrice - price) * lots * contractSize;
      pips = (selectedPosition.entryPrice - price) / pipSize;
    }

    return { pnl, pips };
  };

  // Handle position selection
  const handleSelectPosition = (position) => {
    setSelectedPosition(position);
    setClosePrice(position.currentPrice.toString());
    setCloseError('');
    setPartialClose(false);
    setPartialLots(position.lots.toString());
    setQuickClosePercent(25);
  };

  // Handle quick close percentage
  const handleQuickClosePercent = (percent) => {
    setQuickClosePercent(percent);
    const lotsToClose = (selectedPosition.lots * percent) / 100;
    setPartialLots(lotsToClose.toFixed(2));
    setPartialClose(true);
  };

  // Handle close confirmation
  const handleCloseConfirm = () => {
    if (!selectedPosition) {
      setCloseError('No position selected');
      return;
    }

    if (closeMethod === 'limit' && !closePrice) {
      setCloseError('Please enter close price');
      return;
    }

    if (closeMethod === 'limit' && closePrice) {
      const price = parseFloat(closePrice);
      if (selectedPosition.type === 'BUY' && price <= selectedPosition.entryPrice) {
        setCloseError('Limit price must be above entry price for BUY positions');
        return;
      }
      if (selectedPosition.type === 'SELL' && price >= selectedPosition.entryPrice) {
        setCloseError('Limit price must be below entry price for SELL positions');
        return;
      }
    }

    if (partialClose) {
      const lotsToClose = parseFloat(partialLots);
      if (isNaN(lotsToClose) || lotsToClose <= 0 || lotsToClose > selectedPosition.lots) {
        setCloseError(`Please enter valid lots (0.01 - ${selectedPosition.lots})`);
        return;
      }
    }

    setConfirmModalVisible(true);
  };

  // Execute close
  const handleExecuteClose = () => {
    setClosingPosition(true);

    setTimeout(() => {
      setConfirmModalVisible(false);
      setCloseSuccess(true);
      setCloseError('');
      setClosingPosition(false);

      setTimeout(() => {
        setCloseSuccess(false);
        setSelectedPosition(null);
        setPartialClose(false);
        setClosePrice('');
      }, 3000);
    }, 1500);
  };

  // Cancel selection
  const handleCancelSelection = () => {
    setSelectedPosition(null);
    setPartialClose(false);
    setClosePrice('');
    setCloseError('');
  };

  // Calculate totals
  const totalLots = filteredPositions.reduce((sum, p) => sum + p.lots, 0);
  const totalProfit = filteredPositions.reduce((sum, p) => sum + p.profit, 0);
  const totalMargin = filteredPositions.reduce((sum, p) => sum + p.margin, 0);

  // Get unique symbols and types for filter
  const symbols = ['all', ...new Set(openPositions.map(p => p.symbol))];
  const types = ['all', ...new Set(openPositions.map(p => p.type))];

  return (
    <CCard className="mb-4">
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <div>
          <h4 className="mb-0">Close Position</h4>
          <small className="text-muted">Manually close open positions</small>
        </div>
        <div className="d-flex gap-2">
          <CButton
            size="sm"
            color="secondary"
            variant="outline"
            onClick={() => {
              // Refresh logic here
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
              <span className="fw-bold fs-5">{formatCurrency(accountData.balance)}</span>
            </div>
          </CCol>
          <CCol md={2}>
            <div className="border rounded p-2 text-center">
              <small className="text-muted d-block">Equity</small>
              <span className="fw-bold fs-5">{formatCurrency(accountData.equity)}</span>
            </div>
          </CCol>
          <CCol md={2}>
            <div className="border rounded p-2 text-center">
              <small className="text-muted d-block">Used Margin</small>
              <span className="fw-bold fs-5 text-warning">{formatCurrency(accountData.margin)}</span>
            </div>
          </CCol>
          <CCol md={2}>
            <div className="border rounded p-2 text-center">
              <small className="text-muted d-block">Free Margin</small>
              <span className="fw-bold fs-5 text-success">{formatCurrency(accountData.freeMargin)}</span>
            </div>
          </CCol>
          <CCol md={2}>
            <div className="border rounded p-2 text-center">
              <small className="text-muted d-block">Margin Level</small>
              <span className="fw-bold fs-5" style={{ color: accountData.marginLevel > 300 ? '#0ECB81' : accountData.marginLevel > 150 ? '#F0B90B' : '#F6465D' }}>
                {accountData.marginLevel.toFixed(1)}%
              </span>
            </div>
          </CCol>
          <CCol md={2}>
            <div className="border rounded p-2 text-center">
              <small className="text-muted d-block">Open P&L</small>
              <span className="fw-bold fs-5 text-success">{formatCurrency(totalProfit)}</span>
            </div>
          </CCol>
        </CRow>

        {/* Success Alert */}
        {closeSuccess && (
          <CAlert color="success" className="mb-3" dismissible>
            <CIcon icon={cilCheck} className="me-2" />
            Position closed successfully! PnL: +{formatCurrency(125)}
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
            Open Positions ({filteredPositions.length})
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
              style={{ width: '120px' }}
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
              {types.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type}
                </option>
              ))}
            </CFormSelect>
          </div>
        </div>

        {/* Open Positions Table */}
        <CTable hover responsive className="mb-3 border">
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell style={{ width: '80px' }}>Action</CTableHeaderCell>
              <CTableHeaderCell>Symbol</CTableHeaderCell>
              <CTableHeaderCell>Type</CTableHeaderCell>
              <CTableHeaderCell className="text-end">Lots</CTableHeaderCell>
              <CTableHeaderCell className="text-end">Entry</CTableHeaderCell>
              <CTableHeaderCell className="text-end">Current</CTableHeaderCell>
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
                      color={selectedPosition?.id === pos.id ? 'success' : 'primary'}
                      className="p-1 px-3"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectPosition(pos);
                      }}
                    >
                      {selectedPosition?.id === pos.id ? 'Selected' : 'Select'}
                    </CButton>
                  </CTableDataCell>
                  <CTableDataCell className="fw-semibold">{pos.symbol}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={pos.type === 'BUY' ? 'success' : 'danger'}>
                      <CIcon
                        icon={pos.type === 'BUY' ? cilArrowTop : cilArrowBottom}
                        className="me-1"
                        size="sm"
                      />
                      {pos.type}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell className="text-end">{pos.lots.toFixed(2)}</CTableDataCell>
                  <CTableDataCell className="text-end">{formatPrice(pos.entryPrice, getSymbolDigits(pos.symbol))}</CTableDataCell>
                  <CTableDataCell className="text-end fw-medium">{formatPrice(pos.currentPrice, getSymbolDigits(pos.symbol))}</CTableDataCell>
                  <CTableDataCell className={`text-end fw-semibold ${pos.profit >= 0 ? 'text-success' : 'text-danger'}`}>
                    {pos.profit >= 0 ? '+' : ''}{formatCurrency(pos.profit)}
                  </CTableDataCell>
                  <CTableDataCell className={`text-end ${pos.profitPips >= 0 ? 'text-success' : 'text-danger'}`}>
                    {pos.profitPips >= 0 ? '+' : ''}{pos.profitPips}
                  </CTableDataCell>
                  <CTableDataCell className={`text-end ${pos.swap >= 0 ? 'text-success' : 'text-danger'}`}>
                    {formatCurrency(pos.swap)}
                  </CTableDataCell>
                  <CTableDataCell className="text-end text-warning">{formatCurrency(pos.margin)}</CTableDataCell>
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
                  <p>No positions found matching your filters</p>
                </CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>

        {/* Table Summary & Pagination */}
        {filteredPositions.length > 0 && (
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="small">
              <span className="text-muted me-3">Total Lots: <span className="fw-semibold">{totalLots.toFixed(2)}</span></span>
              <span className="text-muted me-3">Total P&L: <span className={totalProfit >= 0 ? 'fw-semibold text-success' : 'fw-semibold text-danger'}>
                {totalProfit >= 0 ? '+' : ''}{formatCurrency(totalProfit)}
              </span></span>
              <span className="text-muted">Total Margin: <span className="fw-semibold text-warning">{formatCurrency(totalMargin)}</span></span>
            </div>
            {filteredPositions.length > itemsPerPage && (
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
            )}
          </div>
        )}

        {/* Selected Position Details */}
        {selectedPosition && (
          <div className="mt-4 pt-3 border-top">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">
                <CIcon icon={cilCalculator} className="me-2" />
                Close Position - {selectedPosition.symbol}
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
                    {selectedPosition.type} {selectedPosition.lots} lots {selectedPosition.symbol}
                  </p>
                </div>
              </CCol>
              <CCol md={3}>
                <div className="border rounded p-2">
                  <small className="text-muted">Entry / Current</small>
                  <p className="mb-0 fw-semibold">
                    {formatPrice(selectedPosition.entryPrice, getSymbolDigits(selectedPosition.symbol))} → {' '}
                    <span className={selectedPosition.type === 'BUY' ? 'text-success' : 'text-danger'}>
                      {formatPrice(selectedPosition.currentPrice, getSymbolDigits(selectedPosition.symbol))}
                    </span>
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
                    <span className="text-danger">SL: {formatPrice(selectedPosition.stopLoss, getSymbolDigits(selectedPosition.symbol))}</span>
                    {' / '}
                    <span className="text-success">TP: {formatPrice(selectedPosition.takeProfit, getSymbolDigits(selectedPosition.symbol))}</span>
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
                    <option value="market">Market Price - Instant</option>
                    <option value="limit">Limit Price - Pending</option>
                  </CFormSelect>
                  <small className="text-muted">
                    {selectedPosition.type === 'BUY' ? 'Close at Bid price' : 'Close at Ask price'}
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
                    <small className={selectedPosition.type === 'BUY' ? 'text-success' : 'text-danger'}>
                      {selectedPosition.type === 'BUY'
                        ? 'Must be above entry for profit'
                        : 'Must be below entry for profit'}
                    </small>
                  </CCol>
                )}

                <CCol md={4}>
                  <label className="form-label">Close Type</label>
                  <div className="d-flex gap-2">
                    <CButton
                      size="sm"
                      color={!partialClose ? 'warning' : 'light'}
                      variant={!partialClose ? undefined : 'outline'}
                      onClick={() => {
                        setPartialClose(false);
                        setPartialLots(selectedPosition.lots.toString());
                      }}
                      className="flex-fill"
                    >
                      Full
                    </CButton>
                    <CButton
                      size="sm"
                      color={partialClose ? 'warning' : 'light'}
                      variant={partialClose ? undefined : 'outline'}
                      onClick={() => setPartialClose(true)}
                      className="flex-fill"
                    >
                      Partial
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
                          color={quickClosePercent === percent ? 'info' : 'light'}
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
                      ? `Market (${formatPrice(selectedPosition.currentPrice, getSymbolDigits(selectedPosition.symbol))})`
                      : `Limit ${formatPrice(parseFloat(closePrice) || 0, getSymbolDigits(selectedPosition.symbol))}`}
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
                {partialClose ? 'Close Partial Position' : 'Close Position'}
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
            <h6 className="mb-2">Select a Position to Close</h6>
            <p className="text-muted small mb-0">
              Click the "Select" button on any position in the table above to manage and close it
            </p>
          </div>
        )}

        {/* Empty State */}
        {filteredPositions.length === 0 && !selectedPosition && (
          <div className="text-center py-5 border rounded">
            <CIcon icon={cilChart} size="3xl" className="mb-3 text-muted" />
            <h6 className="mb-2">No Open Positions</h6>
            <p className="text-muted small mb-0">
              There are no open positions to close at this time
            </p>
          </div>
        )}
      </CCardBody>

      {/* Footer */}
      <CCardFooter className="d-flex justify-content-between align-items-center small text-muted">
        <div className="d-flex align-items-center">
          <CIcon icon={cilInfo} className="me-2" />
          Closing a position will realize P&L and release used margin
        </div>
        <div>
          <span className="me-3">
            Used Margin: <span className="fw-semibold text-warning">{formatCurrency(accountData.margin)}</span>
          </span>
          <span>
            Free Margin: <span className="fw-semibold text-success">{formatCurrency(accountData.freeMargin)}</span>
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
          <CModalTitle>Confirm Position Closure</CModalTitle>
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
                      <CBadge color={selectedPosition.type === 'BUY' ? 'success' : 'danger'} className="ms-2">
                        {selectedPosition.type}
                      </CBadge>
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
                        {closeMethod === 'market' ? 'Market' : 'Limit'}
                      </span>
                    </div>
                    <div className="mb-2">
                      <span className="text-muted">Close Price:</span>
                      <span className="fw-semibold ms-2">
                        {closeMethod === 'market'
                          ? formatPrice(selectedPosition.currentPrice, getSymbolDigits(selectedPosition.symbol))
                          : formatPrice(parseFloat(closePrice) || 0, getSymbolDigits(selectedPosition.symbol))
                        }
                      </span>
                    </div>
                    <div className="mb-2">
                      <span className="text-muted">Entry Price:</span>
                      <span className="fw-semibold ms-2">
                        {formatPrice(selectedPosition.entryPrice, getSymbolDigits(selectedPosition.symbol))}
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

export default ClosePosition;