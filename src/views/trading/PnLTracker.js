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
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilChart,
  cilArrowTop,
  cilArrowBottom,
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
  cilEqualizer,
  cilSpeedometer,
  cilWallet,
  cilDollar,
  cilGraph,
  cilLineSpacing,
} from '@coreui/icons';
import currency from 'currency.js';

const PnLTracker = () => {
  // State
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('today');
  const [pnlData, setPnlData] = useState([]);
  const [filterSymbol, setFilterSymbol] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const itemsPerPage = 10;

  // Mock PnL data for different timeframes
  const mockPnLData = {
    today: [
      { id: 1, time: '09:30', symbol: 'EUR/USD', type: 'BUY', lots: 0.5, entry: 1.0825, exit: 1.0850, pnl: 125.00, pips: 25 },
      { id: 2, time: '10:15', symbol: 'GBP/USD', type: 'SELL', lots: 0.3, entry: 1.2650, exit: 1.2620, pnl: 90.00, pips: 30 },
      { id: 3, time: '11:45', symbol: 'BTC/USD', type: 'BUY', lots: 0.05, entry: 42850, exit: 43150, pnl: 150.00, pips: 300 },
      { id: 4, time: '13:20', symbol: 'AUD/USD', type: 'SELL', lots: 0.8, entry: 0.6590, exit: 0.6580, pnl: 80.00, pips: 10 },
      { id: 5, time: '14:50', symbol: 'USD/JPY', type: 'BUY', lots: 1.0, entry: 148.25, exit: 148.28, pnl: 30.00, pips: 3 },
      { id: 6, time: '15:30', symbol: 'ETH/USD', type: 'SELL', lots: 0.5, entry: 2850, exit: 2840, pnl: 50.00, pips: 10 },
    ],
    week: [
      { id: 1, time: 'Mon 09:30', symbol: 'EUR/USD', type: 'BUY', lots: 0.5, entry: 1.0825, exit: 1.0850, pnl: 125.00, pips: 25 },
      { id: 2, time: 'Mon 14:20', symbol: 'GBP/USD', type: 'SELL', lots: 0.3, entry: 1.2650, exit: 1.2620, pnl: 90.00, pips: 30 },
      { id: 3, time: 'Tue 10:15', symbol: 'BTC/USD', type: 'BUY', lots: 0.05, entry: 42850, exit: 43150, pnl: 150.00, pips: 300 },
      { id: 4, time: 'Wed 09:45', symbol: 'AUD/USD', type: 'SELL', lots: 0.8, entry: 0.6590, exit: 0.6580, pnl: 80.00, pips: 10 },
      { id: 5, time: 'Thu 11:30', symbol: 'USD/JPY', type: 'BUY', lots: 1.0, entry: 148.25, exit: 148.28, pnl: 30.00, pips: 3 },
      { id: 6, time: 'Fri 15:30', symbol: 'ETH/USD', type: 'SELL', lots: 0.5, entry: 2850, exit: 2840, pnl: 50.00, pips: 10 },
      { id: 7, time: 'Fri 16:45', symbol: 'EUR/USD', type: 'BUY', lots: 0.2, entry: 1.0860, exit: 1.0845, pnl: -30.00, pips: -15 },
    ],
    month: [
      { id: 1, time: '2024-01-02', symbol: 'EUR/USD', type: 'BUY', lots: 0.5, entry: 1.0825, exit: 1.0850, pnl: 125.00, pips: 25 },
      { id: 2, time: '2024-01-03', symbol: 'GBP/USD', type: 'SELL', lots: 0.3, entry: 1.2650, exit: 1.2620, pnl: 90.00, pips: 30 },
      { id: 3, time: '2024-01-05', symbol: 'BTC/USD', type: 'BUY', lots: 0.05, entry: 42850, exit: 43150, pnl: 150.00, pips: 300 },
      { id: 4, time: '2024-01-08', symbol: 'AUD/USD', type: 'SELL', lots: 0.8, entry: 0.6590, exit: 0.6580, pnl: 80.00, pips: 10 },
      { id: 5, time: '2024-01-10', symbol: 'USD/JPY', type: 'BUY', lots: 1.0, entry: 148.25, exit: 148.28, pnl: 30.00, pips: 3 },
      { id: 6, time: '2024-01-12', symbol: 'ETH/USD', type: 'SELL', lots: 0.5, entry: 2850, exit: 2840, pnl: 50.00, pips: 10 },
      { id: 7, time: '2024-01-15', symbol: 'EUR/USD', type: 'BUY', lots: 0.2, entry: 1.0860, exit: 1.0845, pnl: -30.00, pips: -15 },
      { id: 8, time: '2024-01-18', symbol: 'GBP/USD', type: 'SELL', lots: 0.4, entry: 1.2700, exit: 1.2650, pnl: 200.00, pips: 50 },
      { id: 9, time: '2024-01-22', symbol: 'BTC/USD', type: 'SELL', lots: 0.02, entry: 43500, exit: 43800, pnl: -60.00, pips: -300 },
      { id: 10, time: '2024-01-25', symbol: 'USD/JPY', type: 'BUY', lots: 0.7, entry: 147.80, exit: 148.20, pnl: 280.00, pips: 40 },
    ],
  };

  // Format functions
  const formatCurrency = (value) => currency(value, { precision: 2, symbol: '$' }).format();
  const formatNumber = (value, decimals = 2) => Number(value).toFixed(decimals);

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

  const formatPrice = (price, symbol) => {
    if (!price) return '0.0000';
    const digits = getSymbolDigits(symbol);
    return typeof price === 'number' ? price.toFixed(digits) : price;
  };

  // Load data on mount and timeframe change
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setPnlData(mockPnLData[timeframe] || mockPnLData.today);
      setCurrentPage(1);
      setLastUpdate(new Date());
      setLoading(false);
    }, 800);
  }, [timeframe]);

  // Filter trades
  const filteredTrades = pnlData.filter(trade => {
    const matchesSymbol = filterSymbol === 'all' || trade.symbol === filterSymbol;
    const matchesType = filterType === 'all' || trade.type === filterType;

    const matchesSearch = searchQuery === '' ||
      trade.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trade.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trade.time.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trade.pips.toString().includes(searchQuery) ||
      trade.lots.toString().includes(searchQuery) ||
      formatPrice(trade.entry, trade.symbol).includes(searchQuery) ||
      formatPrice(trade.exit, trade.symbol).includes(searchQuery) ||
      formatCurrency(trade.pnl).includes(searchQuery);

    return matchesSymbol && matchesType && matchesSearch;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTrades.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTrades.length / itemsPerPage);

  // Get unique symbols and types for filter
  const symbols = ['all', ...new Set(pnlData.map(t => t.symbol))];
  const types = ['all', ...new Set(pnlData.map(t => t.type))];

  // Calculate metrics from filtered data
  const totalPnL = filteredTrades.reduce((sum, trade) => sum + trade.pnl, 0);
  const winningTrades = filteredTrades.filter(t => t.pnl > 0).length;
  const losingTrades = filteredTrades.filter(t => t.pnl < 0).length;
  const winRate = filteredTrades.length > 0 ? (winningTrades / filteredTrades.length * 100) : 0;
  const averageWin = winningTrades > 0 ? filteredTrades.filter(t => t.pnl > 0).reduce((sum, t) => sum + t.pnl, 0) / winningTrades : 0;
  const averageLoss = losingTrades > 0 ? filteredTrades.filter(t => t.pnl < 0).reduce((sum, t) => sum + t.pnl, 0) / losingTrades : 0;
  const profitFactor = losingTrades > 0 ?
    (filteredTrades.filter(t => t.pnl > 0).reduce((sum, t) => sum + t.pnl, 0) /
      Math.abs(filteredTrades.filter(t => t.pnl < 0).reduce((sum, t) => sum + t.pnl, 0))) :
    filteredTrades.filter(t => t.pnl > 0).reduce((sum, t) => sum + t.pnl, 0) > 0 ? Infinity : 0;

  // Additional metrics
  const bestTrade = filteredTrades.length > 0 ? Math.max(...filteredTrades.map(t => t.pnl)) : 0;
  const worstTrade = filteredTrades.length > 0 ? Math.min(...filteredTrades.map(t => t.pnl)) : 0;
  const totalPips = filteredTrades.reduce((sum, trade) => sum + trade.pips, 0);
  const avgPipsPerTrade = filteredTrades.length > 0 ? totalPips / filteredTrades.length : 0;
  const totalLots = filteredTrades.reduce((sum, trade) => sum + trade.lots, 0);
  const expectancy = filteredTrades.length > 0 ? totalPnL / filteredTrades.length : 0;

  return (
    <CCard className="mb-4">
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <div>
          <h4 className="mb-0">
            <CIcon icon={cilChart} className="me-2 text-info" />
            P&L Tracker
          </h4>
          <small className="text-muted">Real-time profit/loss monitoring and analysis</small>
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
              <strong>P&L Status: {totalPnL >= 0 ? 'PROFIT' : 'LOSS'}</strong>
            </CCol>
            <CCol md="auto" className="text-muted">
              Timeframe: <span className="fw-semibold">
                {timeframe === 'today' ? 'Today' : timeframe === 'week' ? 'This Week' : 'This Month'}
              </span>
            </CCol>
            <CCol md="auto" className="text-muted">
              Total Trades: <span className="fw-semibold">{filteredTrades.length}</span>
            </CCol>
            <CCol md="auto" className="text-muted">
              Win Rate: <span className="fw-semibold text-success">{winRate.toFixed(1)}%</span>
            </CCol>
          </CRow>
        </div>

        {/* Summary Cards - 2x2 Grid - FIXED: All cards now use same font sizes */}
        <CRow className="mb-4 g-3">
          <CCol md={3}>
            <div className="border rounded p-2">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="small text-muted">Total P&L</span>
                <CIcon icon={cilMoney} className="text-info" size="sm" />
              </div>
              <div className={`fw-bold fs-6 ${totalPnL >= 0 ? 'text-success' : 'text-danger'}`}>
                {totalPnL >= 0 ? '+' : ''}{formatCurrency(totalPnL)}
              </div>
              <small className="text-muted">Net profit/loss</small>
            </div>
          </CCol>
          <CCol md={3}>
            <div className="border rounded p-2">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="small text-muted">Win Rate</span>
                <CIcon icon={cilChartPie} className="text-success" size="sm" />
              </div>
              <div className="fw-bold fs-6">{winRate.toFixed(1)}%</div>
              <small className="text-muted">{winningTrades}W / {losingTrades}L</small>
            </div>
          </CCol>
          <CCol md={3}>
            <div className="border rounded p-2">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="small text-muted">Avg Win/Loss</span>
                <CIcon icon={cilBarChart} className="text-warning" size="sm" />
              </div>
              <div className="fw-bold fs-6">
                <span className="text-success">{formatCurrency(averageWin)}</span>
                <span className="text-muted mx-1">/</span>
                <span className="text-danger">{formatCurrency(Math.abs(averageLoss))}</span>
              </div>
              <small className="text-muted">Ratio: {(averageWin / Math.abs(averageLoss)).toFixed(2)}</small>
            </div>
          </CCol>
          <CCol md={3}>
            <div className="border rounded p-2">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="small text-muted">Total Trades</span>
                <CIcon icon={cilHistory} className="text-primary" size="sm" />
              </div>
              <div className="fw-bold fs-6">{filteredTrades.length}</div>
              <small className="text-muted">PF: {profitFactor === Infinity ? '∞' : profitFactor.toFixed(2)}</small>
            </div>
          </CCol>
        </CRow>

        {/* Win Rate Progress Bar */}
        <div className="mb-4">
          <div className="d-flex justify-content-between mb-1">
            <span className="text-muted small">Win Rate Distribution</span>
            <span className="fw-semibold small">{winRate.toFixed(1)}% Wins / {(100 - winRate).toFixed(1)}% Losses</span>
          </div>
          <CProgress height={8}>
            <CProgressBar value={winRate} color="success" />
            <CProgressBar value={100 - winRate} color="danger" />
          </CProgress>
          <div className="d-flex justify-content-between mt-1 small text-muted">
            <span>Wins: {winningTrades}</span>
            <span>Losses: {losingTrades}</span>
          </div>
        </div>

        {/* Filters */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="mb-0">
            <CIcon icon={cilFilter} className="me-2" />
            Trade History
          </h6>
          <div className="d-flex gap-2">
            <div className="d-flex gap-2">
              <CFormSelect
                size="sm"
                style={{ width: '100px' }}
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
              >
                <option value="today">Today</option>
                <option value="week">Week</option>
                <option value="month">Month</option>
              </CFormSelect>
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
              <CInputGroup size="sm" style={{ width: '200px' }}>
                <CInputGroupText>
                  <CIcon icon={cilSearch} />
                </CInputGroupText>
                <CFormInput
                  placeholder="Search trades..."
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
              <CButton
                size="sm"
                color="secondary"
                variant="outline"
                onClick={() => {
                  setLoading(true);
                  setTimeout(() => {
                    setPnlData(mockPnLData[timeframe]);
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
        </div>

        {/* Search Results Summary */}
        {searchQuery && (
          <div className="mb-2 small">
            <span className="text-muted">
              Search results for "{searchQuery}": {filteredTrades.length} trades found
            </span>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-5">
            <CSpinner color="primary" />
            <p className="text-muted mt-3">Loading P&L data...</p>
          </div>
        ) : (
          <>
            {/* P&L Table */}
            <CTable hover responsive className="mb-3 border">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell className="small">Time</CTableHeaderCell>
                  <CTableHeaderCell className="small">Symbol</CTableHeaderCell>
                  <CTableHeaderCell className="small">Type</CTableHeaderCell>
                  <CTableHeaderCell className="small text-end">Lots</CTableHeaderCell>
                  <CTableHeaderCell className="small text-end">Entry</CTableHeaderCell>
                  <CTableHeaderCell className="small text-end">Exit</CTableHeaderCell>
                  <CTableHeaderCell className="small text-end">Pips</CTableHeaderCell>
                  <CTableHeaderCell className="small text-end">P&L</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {currentItems.length > 0 ? (
                  currentItems.map(trade => (
                    <CTableRow key={trade.id}>
                      <CTableDataCell className="small">
                        <CIcon icon={cilClock} size="sm" className="me-1 text-muted" />
                        {trade.time}
                      </CTableDataCell>
                      <CTableDataCell className="fw-semibold small">{trade.symbol}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={trade.type === 'BUY' ? 'success' : 'danger'} className="small">
                          <CIcon
                            icon={trade.type === 'BUY' ? cilArrowTop : cilArrowBottom}
                            className="me-1"
                            size="sm"
                          />
                          {trade.type}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell className="text-end small">{trade.lots.toFixed(2)}</CTableDataCell>
                      <CTableDataCell className="text-end small">{formatPrice(trade.entry, trade.symbol)}</CTableDataCell>
                      <CTableDataCell className="text-end small">{formatPrice(trade.exit, trade.symbol)}</CTableDataCell>
                      <CTableDataCell className={`text-end small ${trade.pips >= 0 ? 'text-success' : 'text-danger'}`}>
                        {trade.pips >= 0 ? '+' : ''}{trade.pips}
                      </CTableDataCell>
                      <CTableDataCell className={`text-end fw-semibold small ${trade.pnl >= 0 ? 'text-success' : 'text-danger'}`}>
                        {trade.pnl >= 0 ? '+' : ''}{formatCurrency(trade.pnl)}
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan={8} className="text-center py-4 text-muted">
                      <CIcon icon={cilBan} size="lg" className="mb-2" />
                      <p>No trades found matching your search criteria</p>
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
            {filteredTrades.length > itemsPerPage && (
              <div className="d-flex justify-content-between align-items-center mb-4">
                <small className="text-muted">
                  Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredTrades.length)} of {filteredTrades.length} trades
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

            {/* Performance Metrics - 2x2 Grid */}
            <CRow className="mt-4 g-3">
              <CCol md={3}>
                <div className="border rounded p-2">
                  <div className="small text-muted">Best Trade</div>
                  <div className="fw-semibold text-success">+{formatCurrency(bestTrade)}</div>
                </div>
              </CCol>
              <CCol md={3}>
                <div className="border rounded p-2">
                  <div className="small text-muted">Worst Trade</div>
                  <div className="fw-semibold text-danger">{formatCurrency(worstTrade)}</div>
                </div>
              </CCol>
              <CCol md={3}>
                <div className="border rounded p-2">
                  <div className="small text-muted">Total Pips</div>
                  <div className="fw-semibold text-info">{totalPips}</div>
                </div>
              </CCol>
              <CCol md={3}>
                <div className="border rounded p-2">
                  <div className="small text-muted">Avg Pips/Trade</div>
                  <div className="fw-semibold">{avgPipsPerTrade.toFixed(1)}</div>
                </div>
              </CCol>
            </CRow>

            <CRow className="mt-3 g-3">
              <CCol md={3}>
                <div className="border rounded p-2">
                  <div className="small text-muted">Total Lots</div>
                  <div className="fw-semibold text-warning">{totalLots.toFixed(2)}</div>
                </div>
              </CCol>
              <CCol md={3}>
                <div className="border rounded p-2">
                  <div className="small text-muted">Expectancy</div>
                  <div className={`fw-semibold ${expectancy >= 0 ? 'text-success' : 'text-danger'}`}>
                    {expectancy >= 0 ? '+' : ''}{formatCurrency(expectancy)}
                  </div>
                </div>
              </CCol>
              <CCol md={3}>
                <div className="border rounded p-2">
                  <div className="small text-muted">Profit Factor</div>
                  <div className="fw-semibold text-info">
                    {profitFactor === Infinity ? '∞' : profitFactor.toFixed(2)}
                  </div>
                </div>
              </CCol>
              <CCol md={3}>
                <div className="border rounded p-2">
                  <div className="small text-muted">Win/Loss Ratio</div>
                  <div className="fw-semibold">{(averageWin / Math.abs(averageLoss)).toFixed(2)}</div>
                </div>
              </CCol>
            </CRow>
          </>
        )}
      </CCardBody>

      {/* Footer */}
      <CCardFooter className="d-flex justify-content-between align-items-center small text-muted">
        <div className="d-flex align-items-center">
          <CIcon icon={cilInfo} className="me-2" />
          P&L is calculated based on closed positions only. Floating P&L not included.
        </div>
        <div className="d-flex gap-3">
          <span>Connection: <span className="fw-semibold text-success">WebSocket</span></span>
          <span>Data Source: <span className="fw-semibold">Closed Trades</span></span>
          <span>
            Net P&L: <span className={totalPnL >= 0 ? 'fw-semibold text-success' : 'fw-semibold text-danger'}>
              {totalPnL >= 0 ? '+' : ''}{formatCurrency(totalPnL)}
            </span>
          </span>
        </div>
      </CCardFooter>
    </CCard>
  );
};

export default PnLTracker;