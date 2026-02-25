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
  cilCart,
  cilCheck,
  cilInfo,
  cilWarning,
  cilHistory,
  cilReload,
  cilCalculator,
  cilWallet,
  cilZoom,
  cilX,
  cilArrowTop,
  cilArrowBottom,
  cilTag,
  cilPlus,
  cilMinus,
  cilBan,
  cilFilter,
  cilSearch,
} from '@coreui/icons';
import currency from 'currency.js';

const BuyPositions = () => {
  // State
  const [selectedInstrument, setSelectedInstrument] = useState(null);
  const [orderType, setOrderType] = useState('market');
  const [limitPrice, setLimitPrice] = useState('');
  const [stopPrice, setStopPrice] = useState('');
  const [volume, setVolume] = useState(0.1);
  const [leverage, setLeverage] = useState('1:100');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [filterSymbol, setFilterSymbol] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [placingOrder, setPlacingOrder] = useState(false);

  // Mock account data
  const accountData = {
    balance: 25840.75,
    equity: 26350.30,
    margin: 4250.15,
    freeMargin: 22100.15,
    marginLevel: 325.8,
    currency: 'USD'
  };

  // Mock available instruments data
  const availableInstruments = [
    {
      id: 1,
      symbol: 'EUR/USD',
      name: 'Euro / US Dollar',
      category: 'Major',
      bid: 1.0850,
      ask: 1.0852,
      spread: 1.2,
      change: 0.0012,
      changePercent: 0.11,
      high: 1.0875,
      low: 1.0825,
      volume: 12453,
      digit: 4,
      pipSize: 0.0001,
      pointValue: 10,
      contractSize: 100000,
      minLot: 0.01,
      maxLot: 100,
      swapLong: -2.5,
      swapShort: 1.2,
      swapLongPoints: -0.25,
      swapShortPoints: 0.12,
      marginRate: 0.01,
      tradingHours: '24h',
      session: 'London/New York',
      volatility: 'Medium',
      description: 'Most traded currency pair, represents Eurozone vs US economy',
    },
    {
      id: 2,
      symbol: 'GBP/USD',
      name: 'British Pound / US Dollar',
      category: 'Major',
      bid: 1.2620,
      ask: 1.2623,
      spread: 1.5,
      change: -0.0008,
      changePercent: -0.06,
      high: 1.2645,
      low: 1.2605,
      volume: 8932,
      digit: 4,
      pipSize: 0.0001,
      pointValue: 10,
      contractSize: 100000,
      minLot: 0.01,
      maxLot: 100,
      swapLong: -1.8,
      swapShort: 0.9,
      swapLongPoints: -0.18,
      swapShortPoints: 0.09,
      marginRate: 0.01,
      tradingHours: '24h',
      session: 'London/New York',
      volatility: 'High',
      description: 'Cable - sensitive to UK economic data and Brexit developments',
    },
    {
      id: 3,
      symbol: 'USD/JPY',
      name: 'US Dollar / Japanese Yen',
      category: 'Major',
      bid: 148.25,
      ask: 148.28,
      spread: 1.8,
      change: 0.35,
      changePercent: 0.24,
      high: 148.45,
      low: 148.15,
      volume: 15678,
      digit: 3,
      pipSize: 0.001,
      pointValue: 9.5,
      contractSize: 100000,
      minLot: 0.01,
      maxLot: 100,
      swapLong: 0.5,
      swapShort: -2.1,
      swapLongPoints: 0.05,
      swapShortPoints: -0.21,
      marginRate: 0.01,
      tradingHours: '24h',
      session: 'Tokyo/London',
      volatility: 'Medium',
      description: 'Influenced by BoJ policy and risk sentiment in Asian markets',
    },
    {
      id: 4,
      symbol: 'BTC/USD',
      name: 'Bitcoin / US Dollar',
      category: 'Cryptocurrency',
      bid: 43150,
      ask: 43200,
      spread: 5.0,
      change: 850,
      changePercent: 2.01,
      high: 43500,
      low: 42800,
      volume: 2341,
      digit: 1,
      pipSize: 1,
      pointValue: 1,
      contractSize: 1,
      minLot: 0.001,
      maxLot: 10,
      swapLong: -10,
      swapShort: -5,
      swapLongPoints: -1.0,
      swapShortPoints: -0.5,
      marginRate: 0.05,
      tradingHours: '24/7',
      session: 'Global',
      volatility: 'Extreme',
      description: 'Leading cryptocurrency, highly volatile with 24/7 trading',
    },
    {
      id: 5,
      symbol: 'AUD/USD',
      name: 'Australian Dollar / US Dollar',
      category: 'Major',
      bid: 0.6580,
      ask: 0.6583,
      spread: 1.3,
      change: -0.0005,
      changePercent: -0.08,
      high: 0.6595,
      low: 0.6575,
      volume: 5678,
      digit: 4,
      pipSize: 0.0001,
      pointValue: 10,
      contractSize: 100000,
      minLot: 0.01,
      maxLot: 100,
      swapLong: -1.2,
      swapShort: 0.8,
      swapLongPoints: -0.12,
      swapShortPoints: 0.08,
      marginRate: 0.01,
      tradingHours: '24h',
      session: 'Sydney/Tokyo',
      volatility: 'Medium',
      description: 'Commodity currency, sensitive to gold prices and Chinese data',
    },
    {
      id: 6,
      symbol: 'USD/CAD',
      name: 'US Dollar / Canadian Dollar',
      category: 'Major',
      bid: 1.3480,
      ask: 1.3483,
      spread: 1.4,
      change: 0.0021,
      changePercent: 0.16,
      high: 1.3490,
      low: 1.3470,
      volume: 6234,
      digit: 4,
      pipSize: 0.0001,
      pointValue: 10,
      contractSize: 100000,
      minLot: 0.01,
      maxLot: 100,
      swapLong: -1.5,
      swapShort: 1.1,
      swapLongPoints: -0.15,
      swapShortPoints: 0.11,
      marginRate: 0.01,
      tradingHours: '24h',
      session: 'New York',
      volatility: 'Medium',
      description: 'Oil-linked currency pair, sensitive to crude oil prices',
    },
  ];

  // Filter instruments
  const filteredInstruments = availableInstruments.filter(instrument => {
    const matchesSymbol = filterSymbol === 'all' || instrument.symbol === filterSymbol;
    const matchesCategory = filterCategory === 'all' || instrument.category === filterCategory;
    const matchesSearch = searchQuery === '' ||
      instrument.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      instrument.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSymbol && matchesCategory && matchesSearch;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInstruments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredInstruments.length / itemsPerPage);

  // Format functions
  const formatCurrency = (value) => currency(value, { precision: 2, symbol: '$' }).format();
  const formatPrice = (price, digits = 4) => {
    if (!price) return '0.0000';
    return typeof price === 'number' ? price.toFixed(digits) : price;
  };
  const formatLargeNumber = (num) => num >= 1000000 ? (num / 1000000).toFixed(1) + 'M' : num >= 1000 ? (num / 1000).toFixed(1) + 'K' : num.toString();
  const formatPercentage = (value) => (value * 100).toFixed(1) + '%';

  // Handle instrument selection
  const handleSelectInstrument = (instrument) => {
    setSelectedInstrument(instrument);
    setOrderError('');
    setVolume(instrument.minLot);
    setStopLoss('');
    setTakeProfit('');
    setLimitPrice('');
    setStopPrice('');
  };

  // Calculate margin required
  const calculateMargin = () => {
    if (!selectedInstrument) return 0;
    const leverageValue = parseInt(leverage.split(':')[1]) || 100;
    const midPrice = (selectedInstrument.bid + selectedInstrument.ask) / 2;
    const contractValue = volume * selectedInstrument.contractSize * midPrice;
    return contractValue / leverageValue;
  };

  // Calculate pip value
  const calculatePipValue = () => {
    if (!selectedInstrument) return 0;
    return volume * selectedInstrument.contractSize * selectedInstrument.pipSize;
  };

  // Calculate contract value
  const calculateContractValue = () => {
    if (!selectedInstrument) return 0;
    const midPrice = (selectedInstrument.bid + selectedInstrument.ask) / 2;
    return volume * selectedInstrument.contractSize * midPrice;
  };

  // Calculate risk/reward
  const calculateRiskReward = () => {
    if (!selectedInstrument || !stopLoss || !takeProfit) return null;

    const entryPrice = selectedInstrument.ask;
    const slPrice = parseFloat(stopLoss);
    const tpPrice = parseFloat(takeProfit);

    const risk = Math.abs(entryPrice - slPrice) * volume * selectedInstrument.contractSize;
    const reward = Math.abs(tpPrice - entryPrice) * volume * selectedInstrument.contractSize;
    const ratio = reward / risk;

    return { risk, reward, ratio: ratio.toFixed(2) };
  };

  // Calculate potential profit at different pip levels
  const calculatePipProfit = (pips) => {
    if (!selectedInstrument) return 0;
    return pips * volume * selectedInstrument.pointValue;
  };

  // Handle order confirmation
  const handleOrderConfirm = () => {
    if (!selectedInstrument) {
      setOrderError('No instrument selected');
      return;
    }

    if (orderType === 'limit' && !limitPrice) {
      setOrderError('Please enter limit price');
      return;
    }

    if (orderType === 'stop' && !stopPrice) {
      setOrderError('Please enter stop price');
      return;
    }

    if (volume < selectedInstrument.minLot || volume > selectedInstrument.maxLot) {
      setOrderError(`Volume must be between ${selectedInstrument.minLot} and ${selectedInstrument.maxLot} lots`);
      return;
    }

    if (stopLoss && takeProfit) {
      const sl = parseFloat(stopLoss);
      const tp = parseFloat(takeProfit);
      const entry = selectedInstrument.ask;

      if (sl >= entry) {
        setOrderError('Stop loss must be below entry price for buy positions');
        return;
      }

      if (tp <= entry) {
        setOrderError('Take profit must be above entry price for buy positions');
        return;
      }
    }

    setConfirmModalVisible(true);
  };

  // Execute order
  const handleExecuteOrder = () => {
    setPlacingOrder(true);

    setTimeout(() => {
      setConfirmModalVisible(false);
      setOrderSuccess(true);
      setOrderError('');
      setPlacingOrder(false);

      setTimeout(() => {
        setOrderSuccess(false);
        setSelectedInstrument(null);
      }, 3000);
    }, 1500);
  };

  // Cancel selection
  const handleCancelSelection = () => {
    setSelectedInstrument(null);
    setOrderError('');
    setVolume(0.1);
    setStopLoss('');
    setTakeProfit('');
    setLimitPrice('');
    setStopPrice('');
  };

  // Get unique symbols and categories for filter
  const symbols = ['all', ...new Set(availableInstruments.map(i => i.symbol))];
  const categories = ['all', ...new Set(availableInstruments.map(i => i.category))];

  const riskReward = calculateRiskReward();
  const marginRequired = calculateMargin();
  const pipValue = calculatePipValue();
  const contractValue = calculateContractValue();

  return (
    <CCard className="mb-4">
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <div>
          <h4 className="mb-0">
            <CIcon icon={cilArrowTop} className="me-2 text-success" />
            Buy / Long Positions
          </h4>
          <small className="text-muted">
            Open new long positions ({availableInstruments.length} instruments available)
          </small>
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
              <span className="fw-bold fs-5 text-success">+$1,245.50</span>
            </div>
          </CCol>
        </CRow>

        {/* Success Alert */}
        {orderSuccess && (
          <CAlert color="success" className="mb-3" dismissible>
            <CIcon icon={cilCheck} className="me-2" />
            Order placed successfully! Buy {selectedInstrument?.symbol} at market price
          </CAlert>
        )}

        {/* Error Alert */}
        {orderError && (
          <CAlert color="danger" className="mb-3" dismissible>
            <CIcon icon={cilWarning} className="me-2" />
            {orderError}
          </CAlert>
        )}

        {/* Filters - Matching TradeHistory style */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">
            <CIcon icon={cilFilter} className="me-2" />
            Available Instruments ({filteredInstruments.length})
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
              style={{ width: '120px' }}
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </CFormSelect>
          </div>
        </div>

        {/* Available Instruments Table - Matching TradeHistory styling */}
        <CTable hover responsive className="mb-3 border">
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell style={{ width: '80px' }}>Action</CTableHeaderCell>
              <CTableHeaderCell>Symbol</CTableHeaderCell>
              <CTableHeaderCell>Name</CTableHeaderCell>
              <CTableHeaderCell>Category</CTableHeaderCell>
              <CTableHeaderCell className="text-end">Bid</CTableHeaderCell>
              <CTableHeaderCell className="text-end">Ask</CTableHeaderCell>
              <CTableHeaderCell className="text-end">Spread</CTableHeaderCell>
              <CTableHeaderCell className="text-end">Change</CTableHeaderCell>
              <CTableHeaderCell className="text-end">High</CTableHeaderCell>
              <CTableHeaderCell className="text-end">Low</CTableHeaderCell>
              <CTableHeaderCell className="text-end">Volume</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {currentItems.length > 0 ? (
              currentItems.map(instrument => (
                <CTableRow
                  key={instrument.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleSelectInstrument(instrument)}
                >
                  <CTableDataCell>
                    <CButton
                      size="sm"
                      color={selectedInstrument?.id === instrument.id ? 'success' : 'primary'}
                      className="p-1 px-3"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectInstrument(instrument);
                      }}
                    >
                      {selectedInstrument?.id === instrument.id ? 'Selected' : 'Select'}
                    </CButton>
                  </CTableDataCell>
                  <CTableDataCell className="fw-semibold">{instrument.symbol}</CTableDataCell>
                  <CTableDataCell className="small text-muted">{instrument.name}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={instrument.category === 'Major' ? 'primary' : instrument.category === 'Cryptocurrency' ? 'warning' : 'secondary'}>
                      {instrument.category}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell className="text-end">{formatPrice(instrument.bid, instrument.digit)}</CTableDataCell>
                  <CTableDataCell className="text-end fw-medium">{formatPrice(instrument.ask, instrument.digit)}</CTableDataCell>
                  <CTableDataCell className="text-end text-warning">{instrument.spread}</CTableDataCell>
                  <CTableDataCell className={`text-end ${instrument.change >= 0 ? 'text-success' : 'text-danger'}`}>
                    {instrument.change >= 0 ? '+' : ''}{instrument.change.toFixed(instrument.digit === 1 ? 0 : 4)}
                  </CTableDataCell>
                  <CTableDataCell className="text-end text-success">{formatPrice(instrument.high, instrument.digit)}</CTableDataCell>
                  <CTableDataCell className="text-end text-danger">{formatPrice(instrument.low, instrument.digit)}</CTableDataCell>
                  <CTableDataCell className="text-end text-info">{formatLargeNumber(instrument.volume)}</CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan={11} className="text-center py-4 text-muted">
                  <CIcon icon={cilBan} size="lg" className="mb-2" />
                  <p>No instruments found matching your filters</p>
                </CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>

        {/* Pagination - Matching TradeHistory */}
        {filteredInstruments.length > itemsPerPage && (
          <div className="d-flex justify-content-between align-items-center mb-4">
            <small className="text-muted">
              Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredInstruments.length)} of {filteredInstruments.length} instruments
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

        {/* Selected Instrument Details */}
        {selectedInstrument ? (
          <div className="mt-4 pt-3 border-top">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">
                <CIcon icon={cilCalculator} className="me-2" />
                Buy Order - {selectedInstrument.symbol}
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

            {/* Instrument Description */}
            <div className="mb-3 p-2 border rounded small text-muted">
              <CIcon icon={cilInfo} className="me-1" />
              {selectedInstrument.description}
            </div>

            {/* Position Summary Cards */}
            <CRow className="mb-4 g-3">
              <CCol md={3}>
                <div className="border rounded p-2">
                  <small className="text-muted">Instrument Details</small>
                  <p className="mb-0 fw-semibold">
                    BUY {selectedInstrument.symbol} - {selectedInstrument.category}
                  </p>
                </div>
              </CCol>
              <CCol md={3}>
                <div className="border rounded p-2">
                  <small className="text-muted">Bid / Ask</small>
                  <p className="mb-0 fw-semibold">
                    <span className="text-primary">{formatPrice(selectedInstrument.bid, selectedInstrument.digit)}</span>
                    {' → '}
                    <span className="text-danger">{formatPrice(selectedInstrument.ask, selectedInstrument.digit)}</span>
                  </p>
                </div>
              </CCol>
              <CCol md={3}>
                <div className="border rounded p-2">
                  <small className="text-muted">24h Change</small>
                  <p className={`mb-0 fw-semibold ${selectedInstrument.change >= 0 ? 'text-success' : 'text-danger'}`}>
                    {selectedInstrument.change >= 0 ? '+' : ''}{selectedInstrument.changePercent.toFixed(2)}%
                  </p>
                </div>
              </CCol>
              <CCol md={3}>
                <div className="border rounded p-2">
                  <small className="text-muted">24h Range</small>
                  <p className="mb-0 fw-semibold">
                    <span className="text-success">{formatPrice(selectedInstrument.high, selectedInstrument.digit)}</span>
                    {' - '}
                    <span className="text-danger">{formatPrice(selectedInstrument.low, selectedInstrument.digit)}</span>
                  </p>
                </div>
              </CCol>
            </CRow>

            {/* Contract Specifications */}
            <CRow className="mb-4 g-3">
              <CCol md={2}>
                <div className="border rounded p-2">
                  <small className="text-muted">Contract Size</small>
                  <p className="mb-0 fw-semibold">{formatLargeNumber(selectedInstrument.contractSize)}</p>
                </div>
              </CCol>
              <CCol md={2}>
                <div className="border rounded p-2">
                  <small className="text-muted">Min Lot</small>
                  <p className="mb-0 fw-semibold">{selectedInstrument.minLot}</p>
                </div>
              </CCol>
              <CCol md={2}>
                <div className="border rounded p-2">
                  <small className="text-muted">Max Lot</small>
                  <p className="mb-0 fw-semibold">{selectedInstrument.maxLot}</p>
                </div>
              </CCol>
              <CCol md={2}>
                <div className="border rounded p-2">
                  <small className="text-muted">Pip Value (1 lot)</small>
                  <p className="mb-0 fw-semibold text-info">{formatCurrency(selectedInstrument.pointValue)}</p>
                </div>
              </CCol>
              <CCol md={2}>
                <div className="border rounded p-2">
                  <small className="text-muted">Margin Rate</small>
                  <p className="mb-0 fw-semibold">{formatPercentage(selectedInstrument.marginRate)}</p>
                </div>
              </CCol>
              <CCol md={2}>
                <div className="border rounded p-2">
                  <small className="text-muted">Session</small>
                  <p className="mb-0 fw-semibold small">{selectedInstrument.session}</p>
                </div>
              </CCol>
            </CRow>

            {/* Swap Rates */}
            <CRow className="mb-4 g-3">
              <CCol md={3}>
                <div className="border rounded p-2">
                  <small className="text-muted">Swap Long (Points)</small>
                  <p className="mb-0 fw-semibold text-danger">{selectedInstrument.swapLongPoints}</p>
                </div>
              </CCol>
              <CCol md={3}>
                <div className="border rounded p-2">
                  <small className="text-muted">Swap Long (USD)</small>
                  <p className="mb-0 fw-semibold text-danger">{formatCurrency(selectedInstrument.swapLong)}</p>
                </div>
              </CCol>
              <CCol md={3}>
                <div className="border rounded p-2">
                  <small className="text-muted">Swap Short (Points)</small>
                  <p className="mb-0 fw-semibold text-success">{selectedInstrument.swapShortPoints}</p>
                </div>
              </CCol>
              <CCol md={3}>
                <div className="border rounded p-2">
                  <small className="text-muted">Swap Short (USD)</small>
                  <p className="mb-0 fw-semibold text-success">{formatCurrency(selectedInstrument.swapShort)}</p>
                </div>
              </CCol>
            </CRow>

            {/* Order Parameters */}
            <div className="border rounded p-3 mb-4">
              <h6 className="fw-semibold mb-3">
                <CIcon icon={cilTag} className="me-2" />
                Order Settings
              </h6>

              <CRow className="mb-3">
                <CCol md={4}>
                  <label className="form-label">Order Type</label>
                  <CFormSelect
                    value={orderType}
                    onChange={(e) => setOrderType(e.target.value)}
                  >
                    <option value="market">Market Order - Instant</option>
                    <option value="limit">Limit Order - Pending</option>
                    <option value="stop">Stop Order - Pending</option>
                  </CFormSelect>
                  <small className="text-muted">
                    BUY orders execute at Ask price
                  </small>
                </CCol>

                {orderType === 'limit' && (
                  <CCol md={4}>
                    <label className="form-label">Limit Price</label>
                    <CInputGroup>
                      <CFormInput
                        type="number"
                        value={limitPrice}
                        onChange={(e) => setLimitPrice(e.target.value)}
                        placeholder="Enter price"
                        step={selectedInstrument.digit === 1 ? '1' : selectedInstrument.digit === 3 ? '0.001' : '0.0001'}
                      />
                      <CInputGroupText>{selectedInstrument.symbol}</CInputGroupText>
                    </CInputGroup>
                    <small className="text-success">
                      Must be below {formatPrice(selectedInstrument.ask, selectedInstrument.digit)} for better entry
                    </small>
                  </CCol>
                )}

                {orderType === 'stop' && (
                  <CCol md={4}>
                    <label className="form-label">Stop Price</label>
                    <CInputGroup>
                      <CFormInput
                        type="number"
                        value={stopPrice}
                        onChange={(e) => setStopPrice(e.target.value)}
                        placeholder="Enter price"
                        step={selectedInstrument.digit === 1 ? '1' : selectedInstrument.digit === 3 ? '0.001' : '0.0001'}
                      />
                      <CInputGroupText>{selectedInstrument.symbol}</CInputGroupText>
                    </CInputGroup>
                    <small className="text-warning">
                      Must be above {formatPrice(selectedInstrument.ask, selectedInstrument.digit)} for entry
                    </small>
                  </CCol>
                )}

                <CCol md={4}>
                  <label className="form-label">Leverage</label>
                  <CFormSelect
                    value={leverage}
                    onChange={(e) => setLeverage(e.target.value)}
                  >
                    <option value="1:1">1:1</option>
                    <option value="1:10">1:10</option>
                    <option value="1:50">1:50</option>
                    <option value="1:100">1:100</option>
                    <option value="1:200">1:200</option>
                    <option value="1:500">1:500</option>
                  </CFormSelect>
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={4}>
                  <label className="form-label">Volume (Lots)</label>
                  <CInputGroup>
                    <CButton
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newVal = Math.max(selectedInstrument.minLot, parseFloat(volume || 0) - 0.01);
                        setVolume(parseFloat(newVal.toFixed(2)));
                      }}
                    >
                      <CIcon icon={cilMinus} />
                    </CButton>
                    <CFormInput
                      type="number"
                      value={volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value) || 0)}
                      min={selectedInstrument.minLot}
                      max={selectedInstrument.maxLot}
                      step="0.01"
                      className="text-center"
                    />
                    <CButton
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newVal = Math.min(selectedInstrument.maxLot, parseFloat(volume || 0) + 0.01);
                        setVolume(parseFloat(newVal.toFixed(2)));
                      }}
                    >
                      <CIcon icon={cilPlus} />
                    </CButton>
                    <CInputGroupText>Lots</CInputGroupText>
                  </CInputGroup>
                  <small className="text-muted">Min: {selectedInstrument.minLot} / Max: {selectedInstrument.maxLot}</small>
                </CCol>

                <CCol md={4}>
                  <label className="form-label">Stop Loss</label>
                  <CInputGroup>
                    <CFormInput
                      type="number"
                      value={stopLoss}
                      onChange={(e) => setStopLoss(e.target.value)}
                      placeholder="Price"
                      step={selectedInstrument.digit === 1 ? '1' : selectedInstrument.digit === 3 ? '0.001' : '0.0001'}
                    />
                    <CInputGroupText>SL</CInputGroupText>
                  </CInputGroup>
                  <small className="text-danger">Must be below entry</small>
                </CCol>

                <CCol md={4}>
                  <label className="form-label">Take Profit</label>
                  <CInputGroup>
                    <CFormInput
                      type="number"
                      value={takeProfit}
                      onChange={(e) => setTakeProfit(e.target.value)}
                      placeholder="Price"
                      step={selectedInstrument.digit === 1 ? '1' : selectedInstrument.digit === 3 ? '0.001' : '0.0001'}
                    />
                    <CInputGroupText>TP</CInputGroupText>
                  </CInputGroup>
                  <small className="text-success">Must be above entry</small>
                </CCol>
              </CRow>

              {/* Financial Impact */}
              <CRow className="mb-3">
                <CCol md={6}>
                  <div className="border rounded p-2">
                    <small className="text-muted">Margin Required</small>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold text-warning fs-5">{formatCurrency(marginRequired)}</span>
                      <small className="text-muted">of {formatCurrency(accountData.freeMargin)} free</small>
                    </div>
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="border rounded p-2">
                    <small className="text-muted">Contract Value</small>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold fs-5">{formatCurrency(contractValue)}</span>
                      <small className="text-muted">Position size</small>
                    </div>
                  </div>
                </CCol>
              </CRow>

              {/* Pip Value Calculator */}
              <CRow className="mb-3">
                <CCol md={12}>
                  <div className="border rounded p-2">
                    <small className="text-muted d-block mb-2">Pip Value Calculator</small>
                    <CRow>
                      <CCol md={3}>
                        <span className="text-muted">Per Pip:</span>
                        <span className="fw-bold ms-2 text-info">{formatCurrency(pipValue)}</span>
                      </CCol>
                      <CCol md={3}>
                        <span className="text-muted">10 Pips:</span>
                        <span className="fw-bold ms-2 text-info">{formatCurrency(calculatePipProfit(10))}</span>
                      </CCol>
                      <CCol md={3}>
                        <span className="text-muted">25 Pips:</span>
                        <span className="fw-bold ms-2 text-info">{formatCurrency(calculatePipProfit(25))}</span>
                      </CCol>
                      <CCol md={3}>
                        <span className="text-muted">50 Pips:</span>
                        <span className="fw-bold ms-2 text-info">{formatCurrency(calculatePipProfit(50))}</span>
                      </CCol>
                    </CRow>
                  </div>
                </CCol>
              </CRow>

              {/* Risk/Reward Preview */}
              {riskReward && (
                <div className="bg-light p-3 rounded">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-semibold">Risk / Reward:</span>
                    <div>
                      <span className="text-danger">Risk: {formatCurrency(riskReward.risk)}</span>
                      <span className="mx-2">|</span>
                      <span className="text-success">Reward: {formatCurrency(riskReward.reward)}</span>
                      <CBadge color="info" className="ms-2">1:{riskReward.ratio}</CBadge>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="d-flex gap-2">
              <CButton
                color="success"
                size="lg"
                className="flex-fill py-3"
                onClick={handleOrderConfirm}
                disabled={placingOrder}
              >
                {placingOrder ? (
                  <CSpinner size="sm" className="me-2" />
                ) : (
                  <CIcon icon={cilCart} className="me-2" size="lg" />
                )}
                Buy {selectedInstrument.symbol}
                <small className="d-block small opacity-75">Margin: {formatCurrency(marginRequired)}</small>
              </CButton>
              <CButton
                color="secondary"
                variant="outline"
                size="lg"
                className="flex-fill py-3"
                onClick={handleCancelSelection}
                disabled={placingOrder}
              >
                Cancel
              </CButton>
            </div>

            {/* Risk Warning */}
            <div className="mt-3 small text-muted">
              <CIcon icon={cilInfo} className="me-1" />
              Opening this position will require {formatCurrency(marginRequired)} margin.
              {marginRequired > accountData.freeMargin && (
                <span className="text-danger ms-2">
                  ⚠️ Insufficient free margin!
                </span>
              )}
            </div>
          </div>
        ) : (
          /* No Selection Message */
          <div className="text-center py-5 border rounded">
            <CIcon icon={cilZoom} size="3xl" className="mb-3 text-muted" />
            <h6 className="mb-2">Select an Instrument to Buy</h6>
            <p className="text-muted small mb-0">
              Click the "Select" button on any instrument from the table above to place a buy order
            </p>
          </div>
        )}
      </CCardBody>

      {/* Footer */}
      <CCardFooter className="d-flex justify-content-between align-items-center small text-muted">
        <div className="d-flex align-items-center">
          <CIcon icon={cilInfo} className="me-2" />
          Long positions profit when price increases. Buy at Ask price.
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
          <CModalTitle>Confirm Buy Order - {selectedInstrument?.symbol}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedInstrument && (
            <div>
              <p className="mb-3 text-muted">Please review your order details:</p>

              <div className="border rounded p-3 mb-3">
                <CRow className="mb-3">
                  <CCol sm={6}>
                    <div className="mb-2">
                      <span className="text-muted">Instrument:</span>
                      <span className="fw-semibold ms-2">{selectedInstrument.symbol}</span>
                    </div>
                    <div className="mb-2">
                      <span className="text-muted">Order Type:</span>
                      <span className="fw-semibold ms-2">
                        {orderType === 'market' ? 'Market' : orderType === 'limit' ? 'Limit' : 'Stop'}
                      </span>
                    </div>
                    <div className="mb-2">
                      <span className="text-muted">Volume:</span>
                      <span className="fw-semibold ms-2">{volume} lots</span>
                    </div>
                  </CCol>
                  <CCol sm={6}>
                    <div className="mb-2">
                      <span className="text-muted">Entry Price (Ask):</span>
                      <span className="fw-semibold ms-2">
                        {orderType === 'market'
                          ? formatPrice(selectedInstrument.ask, selectedInstrument.digit)
                          : orderType === 'limit'
                            ? formatPrice(parseFloat(limitPrice) || 0, selectedInstrument.digit)
                            : formatPrice(parseFloat(stopPrice) || 0, selectedInstrument.digit)
                        }
                      </span>
                    </div>
                    <div className="mb-2">
                      <span className="text-muted">Leverage:</span>
                      <span className="fw-semibold ms-2">{leverage}</span>
                    </div>
                    <div className="mb-2">
                      <span className="text-muted">Margin Required:</span>
                      <span className="fw-semibold ms-2 text-warning">{formatCurrency(marginRequired)}</span>
                    </div>
                  </CCol>
                </CRow>
              </div>

              <div className="border rounded p-3">
                <CRow>
                  <CCol sm={6}>
                    <span className="text-muted">Contract Value:</span>
                    <span className="fw-semibold ms-2">{formatCurrency(contractValue)}</span>
                  </CCol>
                  <CCol sm={6}>
                    <span className="text-muted">Value per Pip:</span>
                    <span className="fw-semibold ms-2 text-info">{formatCurrency(pipValue)}</span>
                  </CCol>
                </CRow>
              </div>

              {/* Warning for large positions */}
              {marginRequired > accountData.freeMargin * 0.5 && (
                <CAlert color="warning" className="mb-0 mt-3">
                  <CIcon icon={cilWarning} className="me-2" />
                  This position will use {((marginRequired / accountData.freeMargin) * 100).toFixed(1)}% of your free margin.
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
            disabled={placingOrder}
          >
            Cancel
          </CButton>
          <CButton
            color="success"
            onClick={handleExecuteOrder}
            disabled={placingOrder}
          >
            {placingOrder ? (
              <>
                <CSpinner size="sm" className="me-2" />
                Placing Order...
              </>
            ) : (
              <>
                <CIcon icon={cilCheck} className="me-2" />
                Confirm Buy
              </>
            )}
          </CButton>
        </CModalFooter>
      </CModal>
    </CCard>
  );
};

export default BuyPositions;