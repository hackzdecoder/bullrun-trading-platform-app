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
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CAlert,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilArrowTop,
  cilArrowBottom,
  cilInfo,
  cilHistory,
  cilReload,
  cilClock,
  cilFilter,
  cilSearch,
  cilBan,
  cilBarChart,
  cilBolt,
  cilWallet,
  cilCheck,
  cilWarning,
  cilFlagAlt,  // This is valid
  // cilFlagTriangle removed - doesn't exist
} from '@coreui/icons';
import currency from 'currency.js';

const StopLossTakeProfit = () => {
  // State
  const [loading, setLoading] = useState(true);
  const [positions, setPositions] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [filterSymbol, setFilterSymbol] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [newStopLoss, setNewStopLoss] = useState('');
  const [newTakeProfit, setNewTakeProfit] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [updating, setUpdating] = useState(false);
  const itemsPerPage = 10;

  // Mock account data
  const accountData = {
    balance: 25840.75,
    equity: 26350.30,
    usedMargin: 4250.15,
    freeMargin: 22100.15,
    marginLevel: 325.8,
    currency: 'USD',
    openPositions: 6,
  };

  // Mock positions with SL/TP data
  const mockPositions = [
    {
      id: 1,
      symbol: 'EUR/USD',
      type: 'BUY',
      lots: 0.5,
      entryPrice: 1.0825,
      currentPrice: 1.0850,
      profit: 125.00,
      profitPips: 25,
      stopLoss: 1.0800,
      takeProfit: 1.0880,
      stopLossDistance: 5,
      takeProfitDistance: 3,
      riskReward: '1:2.2',
      duration: '2h 15m',
      swap: -0.25,
      margin: 541.25,
      status: 'active',
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
      stopLoss: 1.2660,
      takeProfit: 1.2600,
      stopLossDistance: 4,
      takeProfitDistance: 5,
      riskReward: '1:1.67',
      duration: '5h 30m',
      swap: 0.12,
      margin: 379.50,
      status: 'active',
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
      stopLoss: 148.10,
      takeProfit: 148.50,
      stopLossDistance: 15,
      takeProfitDistance: 22,
      riskReward: '1:1.67',
      duration: '1d 3h',
      swap: -0.45,
      margin: 1482.80,
      status: 'active',
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
      stopLoss: 42500,
      takeProfit: 43500,
      stopLossDistance: 350,
      takeProfitDistance: 350,
      riskReward: '1:2.5',
      duration: '4h 45m',
      swap: -0.50,
      margin: 2157.50,
      status: 'active',
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
      stopLoss: 0.6600,
      takeProfit: 0.6570,
      stopLossDistance: 10,
      takeProfitDistance: 10,
      riskReward: '1:1.5',
      duration: '1h 20m',
      swap: 0.08,
      margin: 526.40,
      status: 'active',
    },
    {
      id: 6,
      symbol: 'ETH/USD',
      type: 'BUY',
      lots: 0.5,
      entryPrice: 2850,
      currentPrice: 2835,
      profit: -75.00,
      profitPips: -15,
      stopLoss: 2820,
      takeProfit: 2880,
      stopLossDistance: 30,
      takeProfitDistance: 30,
      riskReward: '1:1.2',
      duration: '6h 40m',
      swap: -0.12,
      margin: 1417.50,
      status: 'active',
    },
  ];

  // Mock SL/TP history
  const sltpHistory = [
    { id: 1, date: '2024-01-15 09:30', symbol: 'EUR/USD', type: 'SL', price: 1.0800, status: 'active' },
    { id: 2, date: '2024-01-15 09:30', symbol: 'EUR/USD', type: 'TP', price: 1.0880, status: 'active' },
    { id: 3, date: '2024-01-14 22:15', symbol: 'USD/JPY', type: 'SL', price: 148.10, status: 'active' },
    { id: 4, date: '2024-01-14 22:15', symbol: 'USD/JPY', type: 'TP', price: 148.50, status: 'active' },
    { id: 5, date: '2024-01-13 15:30', symbol: 'GBP/USD', type: 'SL', price: 1.2700, status: 'hit' },
    { id: 6, date: '2024-01-12 11:45', symbol: 'BTC/USD', type: 'TP', price: 44000, status: 'hit' },
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setPositions(mockPositions);
      setLastUpdate(new Date());
      setLoading(false);
    }, 800);
  }, []);

  // Filter positions
  const filteredPositions = positions.filter(pos => {
    const matchesSymbol = filterSymbol === 'all' || pos.symbol === filterSymbol;
    const matchesType = filterType === 'all' || pos.type === filterType;
    const matchesSearch = searchQuery === '' ||
      pos.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pos.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pos.riskReward.includes(searchQuery);

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
  const positionsWithSL = filteredPositions.filter(p => p.stopLoss).length;
  const positionsWithTP = filteredPositions.filter(p => p.takeProfit).length;
  const avgRiskReward = filteredPositions.reduce((sum, p) => {
    const ratio = parseFloat(p.riskReward.split(':')[1]) || 0;
    return sum + ratio;
  }, 0) / filteredPositions.length;

  // Handle edit click
  const handleEdit = (position) => {
    setSelectedPosition(position);
    setNewStopLoss(position.stopLoss.toString());
    setNewTakeProfit(position.takeProfit.toString());
    setEditModalVisible(true);
    setUpdateError('');
  };

  // Handle update
  const handleUpdate = () => {
    setUpdating(true);

    setTimeout(() => {
      const sl = parseFloat(newStopLoss);
      const tp = parseFloat(newTakeProfit);

      // Validation
      if (selectedPosition.type === 'BUY') {
        if (sl >= selectedPosition.entryPrice) {
          setUpdateError('Stop loss must be below entry price for BUY positions');
          setUpdating(false);
          return;
        }
        if (tp <= selectedPosition.entryPrice) {
          setUpdateError('Take profit must be above entry price for BUY positions');
          setUpdating(false);
          return;
        }
      } else {
        if (sl <= selectedPosition.entryPrice) {
          setUpdateError('Stop loss must be above entry price for SELL positions');
          setUpdating(false);
          return;
        }
        if (tp >= selectedPosition.entryPrice) {
          setUpdateError('Take profit must be below entry price for SELL positions');
          setUpdating(false);
          return;
        }
      }

      setEditModalVisible(false);
      setUpdateSuccess(true);
      setUpdating(false);

      setTimeout(() => {
        setUpdateSuccess(false);
        setSelectedPosition(null);
      }, 3000);
    }, 1000);
  };

  // Get unique symbols and types
  const symbols = ['all', ...new Set(positions.map(p => p.symbol))];
  const types = ['all', ...new Set(positions.map(p => p.type))];

  return (
    <CCard className="mb-4">
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <div>
          <h4 className="mb-0">
            <CIcon icon={cilFlagAlt} className="me-2 text-info" />
            Stop Loss / Take Profit
          </h4>
          <small className="text-muted">Manage SL/TP levels for open positions</small>
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
        {/* Success Alert */}
        {updateSuccess && (
          <CAlert color="success" className="mb-3" dismissible>
            <CIcon icon={cilCheck} className="me-2" />
            SL/TP levels updated successfully!
          </CAlert>
        )}

        {/* Live Status Bar */}
        <div className="border rounded p-2 mb-4 small">
          <CRow className="align-items-center">
            <CCol md="auto">
              <CIcon icon={cilBolt} className="me-2 text-info" />
              <strong>SL/TP Status: <span className="text-success">ACTIVE</span></strong>
            </CCol>
            <CCol md="auto" className="text-muted">
              Open Positions: <span className="fw-semibold">{positions.length}</span>
            </CCol>
            <CCol md="auto" className="text-muted">
              With SL: <span className="fw-semibold text-danger">{positionsWithSL}</span>
            </CCol>
            <CCol md="auto" className="text-muted">
              With TP: <span className="fw-semibold text-success">{positionsWithTP}</span>
            </CCol>
            <CCol md="auto" className="text-muted">
              Avg R/R: <span className="fw-semibold text-info">1:{avgRiskReward.toFixed(2)}</span>
            </CCol>
          </CRow>
        </div>

        {/* Summary Cards */}
        <CRow className="mb-4 g-3">
          <CCol md={3}>
            <div className="border rounded p-2">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <small className="text-muted">Positions with SL</small>
                <CIcon icon={cilFlagAlt} className="text-danger" size="sm" />
              </div>
              <div className="fw-bold fs-6 text-danger">{positionsWithSL}/{positions.length}</div>
              <small className="text-muted">{((positionsWithSL / positions.length) * 100).toFixed(0)}% of positions</small>
            </div>
          </CCol>
          <CCol md={3}>
            <div className="border rounded p-2">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <small className="text-muted">Positions with TP</small>
                <CIcon icon={cilFlagAlt} className="text-success" size="sm" />
              </div>
              <div className="fw-bold fs-6 text-success">{positionsWithTP}/{positions.length}</div>
              <small className="text-muted">{((positionsWithTP / positions.length) * 100).toFixed(0)}% of positions</small>
            </div>
          </CCol>
          <CCol md={3}>
            <div className="border rounded p-2">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <small className="text-muted">Avg Risk/Reward</small>
                <CIcon icon={cilBarChart} className="text-warning" size="sm" />
              </div>
              <div className="fw-bold fs-6">1:{avgRiskReward.toFixed(2)}</div>
              <small className="text-muted">across all positions</small>
            </div>
          </CCol>
          <CCol md={3}>
            <div className="border rounded p-2">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <small className="text-muted">Protected Capital</small>
                <CIcon icon={cilWallet} className="text-info" size="sm" />
              </div>
              <div className="fw-bold fs-6 text-info">{formatCurrency(accountData.usedMargin)}</div>
              <small className="text-muted">total margin at risk</small>
            </div>
          </CCol>
        </CRow>

        {/* Filters */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="mb-0">
            <CIcon icon={cilFilter} className="me-2" />
            Open Positions
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
                  setPositions(mockPositions);
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
              Search results for "{searchQuery}": {filteredPositions.length} positions found
            </span>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-5">
            <CSpinner color="primary" />
            <p className="text-muted mt-3">Loading positions...</p>
          </div>
        ) : (
          <>
            {/* Positions Table */}
            <CTable hover responsive className="mb-3 border">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell className="small">Symbol</CTableHeaderCell>
                  <CTableHeaderCell className="small">Type</CTableHeaderCell>
                  <CTableHeaderCell className="small text-end">Lots</CTableHeaderCell>
                  <CTableHeaderCell className="small text-end">Entry</CTableHeaderCell>
                  <CTableHeaderCell className="small text-end">Current</CTableHeaderCell>
                  <CTableHeaderCell className="small text-end">Stop Loss</CTableHeaderCell>
                  <CTableHeaderCell className="small text-end">Take Profit</CTableHeaderCell>
                  <CTableHeaderCell className="small text-end">Distance (pips)</CTableHeaderCell>
                  <CTableHeaderCell className="small">R/R</CTableHeaderCell>
                  <CTableHeaderCell className="small text-center">Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {currentItems.length > 0 ? (
                  currentItems.map(pos => (
                    <CTableRow key={pos.id}>
                      <CTableDataCell className="fw-semibold small">{pos.symbol}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={pos.type === 'BUY' ? 'success' : 'danger'} className="small">
                          <CIcon
                            icon={pos.type === 'BUY' ? cilArrowTop : cilArrowBottom}
                            className="me-1"
                            size="sm"
                          />
                          {pos.type}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell className="text-end small">{pos.lots.toFixed(2)}</CTableDataCell>
                      <CTableDataCell className="text-end small">{formatPrice(pos.entryPrice, getSymbolDigits(pos.symbol))}</CTableDataCell>
                      <CTableDataCell className="text-end small">{formatPrice(pos.currentPrice, getSymbolDigits(pos.symbol))}</CTableDataCell>
                      <CTableDataCell className="text-end fw-semibold small text-danger">{formatPrice(pos.stopLoss, getSymbolDigits(pos.symbol))}</CTableDataCell>
                      <CTableDataCell className="text-end fw-semibold small text-success">{formatPrice(pos.takeProfit, getSymbolDigits(pos.symbol))}</CTableDataCell>
                      <CTableDataCell className="text-end small">
                        <span className="text-danger">{pos.stopLossDistance}p</span>
                        <span className="text-muted mx-1">/</span>
                        <span className="text-success">{pos.takeProfitDistance}p</span>
                      </CTableDataCell>
                      <CTableDataCell className="small">{pos.riskReward}</CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CButton
                          size="sm"
                          color="info"
                          variant="ghost"
                          onClick={() => handleEdit(pos)}
                        >
                          Edit
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan={10} className="text-center py-4 text-muted">
                      <CIcon icon={cilBan} size="lg" className="mb-2" />
                      <p>No positions found matching your filters</p>
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
            {filteredPositions.length > itemsPerPage && (
              <div className="d-flex justify-content-between align-items-center mb-4">
                <small className="text-muted">
                  Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredPositions.length)} of {filteredPositions.length} positions
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

            {/* SL/TP History */}
            <div className="mt-4">
              <h6 className="mb-3">
                <CIcon icon={cilHistory} className="me-2" />
                Recent SL/TP Activity
              </h6>
              <CTable hover responsive size="sm" className="mb-0 border">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell className="small">Date</CTableHeaderCell>
                    <CTableHeaderCell className="small">Symbol</CTableHeaderCell>
                    <CTableHeaderCell className="small">Type</CTableHeaderCell>
                    <CTableHeaderCell className="small text-end">Price</CTableHeaderCell>
                    <CTableHeaderCell className="small">Status</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {sltpHistory.map(item => (
                    <CTableRow key={item.id}>
                      <CTableDataCell className="small">
                        <CIcon icon={cilClock} size="sm" className="me-1 text-muted" />
                        {formatDate(item.date)}
                      </CTableDataCell>
                      <CTableDataCell className="fw-semibold small">{item.symbol}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={item.type === 'SL' ? 'danger' : 'success'} className="small">
                          {item.type}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell className="text-end small">{formatPrice(item.price, getSymbolDigits(item.symbol))}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={item.status === 'active' ? 'info' : 'secondary'} className="small">
                          {item.status}
                        </CBadge>
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
          Stop Loss protects against losses. Take Profit secures gains when price reaches target.
        </div>
        <div className="d-flex gap-3">
          <span>SL: <span className="fw-semibold text-danger">Below entry for BUY, above for SELL</span></span>
          <span>TP: <span className="fw-semibold text-success">Above entry for BUY, below for SELL</span></span>
        </div>
      </CCardFooter>

      {/* Edit SL/TP Modal */}
      <CModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        alignment="center"
        size="lg"
      >
        <CModalHeader>
          <CModalTitle>Edit SL/TP - {selectedPosition?.symbol}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedPosition && (
            <div>
              {updateError && (
                <CAlert color="danger" className="mb-3">
                  <CIcon icon={cilWarning} className="me-2" />
                  {updateError}
                </CAlert>
              )}

              <CRow className="mb-3">
                <CCol sm={6}>
                  <div className="border rounded p-2 mb-2">
                    <small className="text-muted d-block">Position Details</small>
                    <div className="d-flex justify-content-between mt-1">
                      <span>Type:</span>
                      <CBadge color={selectedPosition.type === 'BUY' ? 'success' : 'danger'}>
                        {selectedPosition.type}
                      </CBadge>
                    </div>
                    <div className="d-flex justify-content-between mt-1">
                      <span>Entry Price:</span>
                      <span className="fw-semibold">{formatPrice(selectedPosition.entryPrice, getSymbolDigits(selectedPosition.symbol))}</span>
                    </div>
                    <div className="d-flex justify-content-between mt-1">
                      <span>Current Price:</span>
                      <span className="fw-semibold">{formatPrice(selectedPosition.currentPrice, getSymbolDigits(selectedPosition.symbol))}</span>
                    </div>
                    <div className="d-flex justify-content-between mt-1">
                      <span>Lots:</span>
                      <span className="fw-semibold">{selectedPosition.lots.toFixed(2)}</span>
                    </div>
                  </div>
                </CCol>
                <CCol sm={6}>
                  <div className="border rounded p-2 mb-2">
                    <small className="text-muted d-block">Current Levels</small>
                    <div className="d-flex justify-content-between mt-1">
                      <span>Stop Loss:</span>
                      <span className="fw-semibold text-danger">{formatPrice(selectedPosition.stopLoss, getSymbolDigits(selectedPosition.symbol))}</span>
                    </div>
                    <div className="d-flex justify-content-between mt-1">
                      <span>Take Profit:</span>
                      <span className="fw-semibold text-success">{formatPrice(selectedPosition.takeProfit, getSymbolDigits(selectedPosition.symbol))}</span>
                    </div>
                    <div className="d-flex justify-content-between mt-1">
                      <span>Risk/Reward:</span>
                      <span className="fw-semibold">{selectedPosition.riskReward}</span>
                    </div>
                  </div>
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={6}>
                  <label className="form-label fw-semibold">New Stop Loss</label>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilFlagAlt} className="text-danger" />
                    </CInputGroupText>
                    <CFormInput
                      type="number"
                      value={newStopLoss}
                      onChange={(e) => setNewStopLoss(e.target.value)}
                      step={getSymbolDigits(selectedPosition.symbol) === 1 ? '1' : '0.0001'}
                    />
                  </CInputGroup>
                  <small className="text-danger">
                    {selectedPosition.type === 'BUY' ? 'Must be below entry' : 'Must be above entry'}
                  </small>
                </CCol>
                <CCol md={6}>
                  <label className="form-label fw-semibold">New Take Profit</label>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilFlagAlt} className="text-success" />
                    </CInputGroupText>
                    <CFormInput
                      type="number"
                      value={newTakeProfit}
                      onChange={(e) => setNewTakeProfit(e.target.value)}
                      step={getSymbolDigits(selectedPosition.symbol) === 1 ? '1' : '0.0001'}
                    />
                  </CInputGroup>
                  <small className="text-success">
                    {selectedPosition.type === 'BUY' ? 'Must be above entry' : 'Must be below entry'}
                  </small>
                </CCol>
              </CRow>

              {newStopLoss && newTakeProfit && (
                <div className="border rounded p-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-semibold">New Risk/Reward:</span>
                    <span className="fw-bold">
                      {selectedPosition.type === 'BUY' ? (
                        <>1:{((parseFloat(newTakeProfit) - selectedPosition.entryPrice) / (selectedPosition.entryPrice - parseFloat(newStopLoss))).toFixed(2)}</>
                      ) : (
                        <>1:{((selectedPosition.entryPrice - parseFloat(newTakeProfit)) / (parseFloat(newStopLoss) - selectedPosition.entryPrice)).toFixed(2)}</>
                      )}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            variant="outline"
            onClick={() => setEditModalVisible(false)}
            disabled={updating}
          >
            Cancel
          </CButton>
          <CButton
            color="primary"
            onClick={handleUpdate}
            disabled={updating}
          >
            {updating ? (
              <>
                <CSpinner size="sm" className="me-2" />
                Updating...
              </>
            ) : (
              <>
                <CIcon icon={cilCheck} className="me-2" />
                Update Levels
              </>
            )}
          </CButton>
        </CModalFooter>
      </CModal>
    </CCard>
  );
};

export default StopLossTakeProfit;