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
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CProgress,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilChart,
  cilArrowTop,
  cilArrowBottom,
  cilInfo,
  cilReload,
  cilSearch,
  cilEqualizer,
  cilMediaPlay,
  cilMediaPause,
  cilWarning,
  cilBolt,
  cilSpreadsheet,
} from '@coreui/icons';
import currency from 'currency.js';

const PriceFeed = () => {
  // State
  const [selectedSymbol, setSelectedSymbol] = useState('EUR/USD');
  const [filterSymbol, setFilterSymbol] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [priceHistory, setPriceHistory] = useState([]);

  // Price data
  const priceData = [
    {
      id: 1,
      symbol: 'EUR/USD',
      name: 'Euro / US Dollar',
      category: 'forex',
      bid: 1.0850,
      ask: 1.0852,
      change: 0.0012,
      changePercent: 0.11,
      high: 1.0875,
      low: 1.0825,
      spread: 1.2,
      volume: 12453,
      trend: 'up',
      session: 'London/New York',
      dayRange: '1.0825 - 1.0875',
      weekRange: '1.0800 - 1.0900',
      pipValue: 10.00,
      volatility: 'Low',
      support: 1.0825,
      resistance: 1.0875,
    },
    {
      id: 2,
      symbol: 'GBP/USD',
      name: 'British Pound / US Dollar',
      category: 'forex',
      bid: 1.2620,
      ask: 1.2623,
      change: -0.0008,
      changePercent: -0.06,
      high: 1.2645,
      low: 1.2605,
      spread: 1.5,
      volume: 8932,
      trend: 'down',
      session: 'London/New York',
      dayRange: '1.2605 - 1.2645',
      weekRange: '1.2580 - 1.2700',
      pipValue: 10.00,
      volatility: 'Medium',
      support: 1.2605,
      resistance: 1.2645,
    },
    {
      id: 3,
      symbol: 'USD/JPY',
      name: 'US Dollar / Japanese Yen',
      category: 'forex',
      bid: 148.25,
      ask: 148.28,
      change: 0.35,
      changePercent: 0.24,
      high: 148.45,
      low: 148.15,
      spread: 1.8,
      volume: 15678,
      trend: 'up',
      session: 'Asia/London',
      dayRange: '148.15 - 148.45',
      weekRange: '147.50 - 149.00',
      pipValue: 9.80,
      volatility: 'High',
      support: 148.15,
      resistance: 148.45,
    },
    {
      id: 4,
      symbol: 'BTC/USD',
      name: 'Bitcoin / US Dollar',
      category: 'crypto',
      bid: 43150,
      ask: 43200,
      change: 850,
      changePercent: 2.01,
      high: 43500,
      low: 42800,
      spread: 5.0,
      volume: 2341,
      trend: 'up',
      session: '24/7',
      dayRange: '42800 - 43500',
      weekRange: '42000 - 44500',
      pipValue: 1.00,
      volatility: 'Very High',
      support: 42800,
      resistance: 43500,
    },
    {
      id: 5,
      symbol: 'ETH/USD',
      name: 'Ethereum / US Dollar',
      category: 'crypto',
      bid: 2835,
      ask: 2840,
      change: 45,
      changePercent: 1.61,
      high: 2850,
      low: 2820,
      spread: 2.5,
      volume: 1892,
      trend: 'up',
      session: '24/7',
      dayRange: '2820 - 2850',
      weekRange: '2750 - 2900',
      pipValue: 1.00,
      volatility: 'High',
      support: 2820,
      resistance: 2850,
    },
    {
      id: 6,
      symbol: 'AUD/USD',
      name: 'Australian Dollar / US Dollar',
      category: 'forex',
      bid: 0.6580,
      ask: 0.6583,
      change: -0.0005,
      changePercent: -0.08,
      high: 0.6595,
      low: 0.6575,
      spread: 1.3,
      volume: 5678,
      trend: 'down',
      session: 'Asia/Pacific',
      dayRange: '0.6575 - 0.6595',
      weekRange: '0.6550 - 0.6650',
      pipValue: 10.00,
      volatility: 'Low',
      support: 0.6575,
      resistance: 0.6595,
    },
    {
      id: 7,
      symbol: 'USD/CAD',
      name: 'US Dollar / Canadian Dollar',
      category: 'forex',
      bid: 1.3480,
      ask: 1.3483,
      change: 0.0021,
      changePercent: 0.16,
      high: 1.3490,
      low: 1.3470,
      spread: 1.4,
      volume: 7234,
      trend: 'up',
      session: 'New York/London',
      dayRange: '1.3470 - 1.3490',
      weekRange: '1.3450 - 1.3550',
      pipValue: 10.00,
      volatility: 'Medium',
      support: 1.3470,
      resistance: 1.3490,
    },
    {
      id: 8,
      symbol: 'USD/CHF',
      name: 'US Dollar / Swiss Franc',
      category: 'forex',
      bid: 0.8850,
      ask: 0.8853,
      change: -0.0003,
      changePercent: -0.03,
      high: 0.8860,
      low: 0.8845,
      spread: 1.2,
      volume: 4567,
      trend: 'neutral',
      session: 'Europe/London',
      dayRange: '0.8845 - 0.8860',
      weekRange: '0.8800 - 0.8900',
      pipValue: 10.00,
      volatility: 'Low',
      support: 0.8845,
      resistance: 0.8860,
    },
    {
      id: 9,
      symbol: 'XAU/USD',
      name: 'Gold / US Dollar',
      category: 'commodities',
      bid: 2035.50,
      ask: 2036.20,
      change: 12.50,
      changePercent: 0.62,
      high: 2040.00,
      low: 2025.00,
      spread: 2.5,
      volume: 5678,
      trend: 'up',
      session: 'London/New York',
      dayRange: '2025.00 - 2040.00',
      weekRange: '2000.00 - 2050.00',
      pipValue: 10.00,
      volatility: 'Medium',
      support: 2025.00,
      resistance: 2040.00,
    },
    {
      id: 10,
      symbol: 'XAG/USD',
      name: 'Silver / US Dollar',
      category: 'commodities',
      bid: 23.85,
      ask: 23.90,
      change: 0.35,
      changePercent: 1.49,
      high: 24.00,
      low: 23.50,
      spread: 3.0,
      volume: 3456,
      trend: 'up',
      session: 'London/New York',
      dayRange: '23.50 - 24.00',
      weekRange: '23.00 - 24.50',
      pipValue: 50.00,
      volatility: 'High',
      support: 23.50,
      resistance: 24.00,
    },
    {
      id: 11,
      symbol: 'US30',
      name: 'US Dow Jones 30',
      category: 'indices',
      bid: 38450,
      ask: 38455,
      change: 125,
      changePercent: 0.33,
      high: 38500,
      low: 38300,
      spread: 4.0,
      volume: 23456,
      trend: 'up',
      session: 'US Hours',
      dayRange: '38300 - 38500',
      weekRange: '38000 - 39000',
      pipValue: 1.00,
      volatility: 'Medium',
      support: 38300,
      resistance: 38500,
    },
    {
      id: 12,
      symbol: 'SPX500',
      name: 'S&P 500 Index',
      category: 'indices',
      bid: 4980,
      ask: 4982,
      change: 15,
      changePercent: 0.30,
      high: 4990,
      low: 4960,
      spread: 3.5,
      volume: 18923,
      trend: 'up',
      session: 'US Hours',
      dayRange: '4960 - 4990',
      weekRange: '4900 - 5050',
      pipValue: 1.00,
      volatility: 'Medium',
      support: 4960,
      resistance: 4990,
    },
  ];

  // Categories
  const categories = [
    { value: 'all', label: 'All Markets' },
    { value: 'forex', label: 'Forex' },
    { value: 'crypto', label: 'Crypto' },
    { value: 'commodities', label: 'Commodities' },
    { value: 'indices', label: 'Indices' },
  ];

  // Simulate real-time price updates
  useEffect(() => {
    let interval;
    if (isLive) {
      interval = setInterval(() => {
        setLastUpdate(new Date());
        // In a real app, you would fetch new prices here
        // For demo, we'll just update the timestamp
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isLive]);

  // Format functions
  const formatPrice = (price, symbol) => {
    if (!price) return '0.0000';

    if (symbol.includes('JPY')) return price.toFixed(3);
    if (symbol.includes('BTC') || symbol.includes('ETH') || symbol.includes('US30') || symbol.includes('SPX500') || symbol.includes('XAU')) return price.toFixed(1);
    if (symbol.includes('XAG')) return price.toFixed(2);
    return price.toFixed(4);
  };

  const formatCurrency = (value) => currency(value, { precision: 2, symbol: '$' }).format();
  const formatLargeNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  // Filter price data
  const filteredData = priceData.filter(item => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (filterSymbol && !item.symbol.toLowerCase().includes(filterSymbol.toLowerCase()) &&
      !item.name.toLowerCase().includes(filterSymbol.toLowerCase())) return false;
    return true;
  });

  // Get selected symbol details
  const selectedSymbolData = priceData.find(p => p.symbol === selectedSymbol);

  return (
    <CCard className="mb-4">
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <div>
          <h4 className="mb-0">
            <CIcon icon={cilChart} className="me-2" />
            Price Feed
          </h4>
          <small className="text-muted">Real-time bid/ask prices and market data</small>
        </div>
        <div className="d-flex align-items-center gap-2">
          <CBadge color={isLive ? 'success' : 'secondary'}>
            <CIcon icon={isLive ? cilMediaPlay : cilMediaPause} className="me-1" size="sm" />
            {isLive ? 'LIVE' : 'PAUSED'}
          </CBadge>
          <CButton
            size="sm"
            color={isLive ? 'warning' : 'success'}
            variant="outline"
            onClick={() => setIsLive(!isLive)}
          >
            <CIcon icon={isLive ? cilMediaPause : cilMediaPlay} className="me-1" />
            {isLive ? 'Pause' : 'Resume'}
          </CButton>
        </div>
      </CCardHeader>

      <CCardBody>
        {/* Live Status Bar */}
        <div className="border rounded p-2 mb-4 small">
          <CRow className="align-items-center">
            <CCol md="auto">
              <CIcon icon={cilBolt} className="me-2 text-info" />
              <strong>Live Feed Active</strong>
            </CCol>
            <CCol md="auto" className="text-muted">
              Last Update: {lastUpdate.toLocaleTimeString()}
            </CCol>
            <CCol md="auto" className="text-muted">
              Feed Latency: <span className="text-success">~0.5s</span>
            </CCol>
            <CCol md="auto" className="text-muted">
              Connection: <span className="text-success">WebSocket</span>
            </CCol>
          </CRow>
        </div>

        {/* Controls */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex gap-2">
            <CFormSelect
              size="sm"
              style={{ width: '140px' }}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </CFormSelect>
            <CInputGroup size="sm" style={{ width: '200px' }}>
              <CInputGroupText>
                <CIcon icon={cilSearch} />
              </CInputGroupText>
              <CFormInput
                placeholder="Search symbols..."
                value={filterSymbol}
                onChange={(e) => setFilterSymbol(e.target.value)}
              />
            </CInputGroup>
          </div>
          <CButton size="sm" color="secondary" variant="outline" onClick={() => setLastUpdate(new Date())}>
            <CIcon icon={cilReload} className="me-1" />
            Refresh
          </CButton>
        </div>

        {/* Price Feed Table - With proper hover effect like OrderPanel */}
        <CTable hover responsive className="mb-4 border">
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell className="small">Symbol</CTableHeaderCell>
              <CTableHeaderCell className="small">Name</CTableHeaderCell>
              <CTableHeaderCell className="small text-end">Bid</CTableHeaderCell>
              <CTableHeaderCell className="small text-end">Ask</CTableHeaderCell>
              <CTableHeaderCell className="small text-end">Spread</CTableHeaderCell>
              <CTableHeaderCell className="small text-end">Change</CTableHeaderCell>
              <CTableHeaderCell className="small text-end">Change %</CTableHeaderCell>
              <CTableHeaderCell className="small text-end">High</CTableHeaderCell>
              <CTableHeaderCell className="small text-end">Low</CTableHeaderCell>
              <CTableHeaderCell className="small text-end">Volume</CTableHeaderCell>
              <CTableHeaderCell className="small">Session</CTableHeaderCell>
              <CTableHeaderCell className="small">Trend</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <CTableRow
                  key={item.id}
                  onClick={() => setSelectedSymbol(item.symbol)}
                  style={{ cursor: 'pointer' }}
                >
                  <CTableDataCell className="fw-semibold">{item.symbol}</CTableDataCell>
                  <CTableDataCell className="text-muted small">{item.name}</CTableDataCell>
                  <CTableDataCell className="text-end fw-medium">{formatPrice(item.bid, item.symbol)}</CTableDataCell>
                  <CTableDataCell className="text-end fw-medium">{formatPrice(item.ask, item.symbol)}</CTableDataCell>
                  <CTableDataCell className="text-end text-warning">{item.spread.toFixed(1)}</CTableDataCell>
                  <CTableDataCell className={`text-end ${item.change >= 0 ? 'text-success' : 'text-danger'}`}>
                    {item.change >= 0 ? '+' : ''}{formatPrice(Math.abs(item.change), item.symbol)}
                  </CTableDataCell>
                  <CTableDataCell className={`text-end ${item.changePercent >= 0 ? 'text-success' : 'text-danger'}`}>
                    {item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
                  </CTableDataCell>
                  <CTableDataCell className="text-end text-success">{formatPrice(item.high, item.symbol)}</CTableDataCell>
                  <CTableDataCell className="text-end text-danger">{formatPrice(item.low, item.symbol)}</CTableDataCell>
                  <CTableDataCell className="text-end text-info">{formatLargeNumber(item.volume)}</CTableDataCell>
                  <CTableDataCell className="small">{item.session}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge
                      color={item.trend === 'up' ? 'success' : item.trend === 'down' ? 'danger' : 'warning'}
                      className="px-2"
                    >
                      <CIcon
                        icon={item.trend === 'up' ? cilArrowTop : item.trend === 'down' ? cilArrowBottom : cilEqualizer}
                        className="me-1"
                        size="sm"
                      />
                      {item.trend.toUpperCase()}
                    </CBadge>
                  </CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan={12} className="text-center py-4 text-muted">
                  No symbols found matching your filters
                </CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>

        {/* Selected Symbol Details */}
        {selectedSymbolData && (
          <div className="mt-4 pt-3 border-top">
            <h5 className="mb-3">
              <CIcon icon={cilSpreadsheet} className="me-2" />
              {selectedSymbolData.symbol} - Detailed Price Feed
            </h5>

            <CRow className="g-3">
              {/* Live Price Card */}
              <CCol md={4}>
                <div className="border rounded p-3">
                  <div className="small text-muted mb-2">Live Price</div>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <span className="text-muted small">Bid</span>
                      <div className="fw-bold fs-3">
                        {formatPrice(selectedSymbolData.bid, selectedSymbolData.symbol)}
                      </div>
                    </div>
                    <div className="text-end">
                      <span className="text-muted small">Ask</span>
                      <div className="fw-bold fs-3">
                        {formatPrice(selectedSymbolData.ask, selectedSymbolData.symbol)}
                      </div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between mt-2 pt-2 border-top">
                    <span className="text-muted small">Spread</span>
                    <span className="fw-semibold text-warning">{selectedSymbolData.spread.toFixed(1)} pips</span>
                    <span className="text-muted small">Pip Value</span>
                    <span className="fw-semibold text-info">{formatCurrency(selectedSymbolData.pipValue)}</span>
                  </div>
                </div>
              </CCol>

              {/* Daily Range */}
              <CCol md={4}>
                <div className="border rounded p-3">
                  <div className="small text-muted mb-2">Daily Range</div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted small">Low</span>
                    <span className="fw-semibold text-danger">{formatPrice(selectedSymbolData.low, selectedSymbolData.symbol)}</span>
                    <span className="text-muted small">High</span>
                    <span className="fw-semibold text-success">{formatPrice(selectedSymbolData.high, selectedSymbolData.symbol)}</span>
                  </div>
                  <CProgress
                    height={8}
                    value={((selectedSymbolData.bid - selectedSymbolData.low) / (selectedSymbolData.high - selectedSymbolData.low)) * 100}
                    color="primary"
                  />
                  <div className="d-flex justify-content-between mt-2 small">
                    <span>{formatPrice(selectedSymbolData.low, selectedSymbolData.symbol)}</span>
                    <span className="fw-semibold">{((selectedSymbolData.bid - selectedSymbolData.low) / (selectedSymbolData.high - selectedSymbolData.low) * 100).toFixed(1)}%</span>
                    <span>{formatPrice(selectedSymbolData.high, selectedSymbolData.symbol)}</span>
                  </div>
                </div>
              </CCol>

              {/* Market Info */}
              <CCol md={4}>
                <div className="border rounded p-3">
                  <div className="small text-muted mb-2">Market Information</div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted small">Session</span>
                    <span className="fw-semibold">{selectedSymbolData.session}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted small">Volatility</span>
                    <CBadge color={selectedSymbolData.volatility === 'Low' ? 'success' : selectedSymbolData.volatility === 'Medium' ? 'warning' : 'danger'}>
                      {selectedSymbolData.volatility}
                    </CBadge>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted small">S/R Levels</span>
                    <span>
                      <span className="text-danger">S: {formatPrice(selectedSymbolData.support, selectedSymbolData.symbol)}</span>
                      {' | '}
                      <span className="text-success">R: {formatPrice(selectedSymbolData.resistance, selectedSymbolData.symbol)}</span>
                    </span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted small">Week Range</span>
                    <span className="small">{selectedSymbolData.weekRange}</span>
                  </div>
                </div>
              </CCol>
            </CRow>

            {/* Price Depth Simulation */}
            <CRow className="mt-3 g-3">
              <CCol md={6}>
                <div className="border rounded p-2">
                  <div className="small text-muted mb-2">Buying Depth (Bids)</div>
                  <div className="small">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span>1.0850</span>
                      <span className="text-success">125 lots</span>
                      <div style={{ width: '50%' }}>
                        <CProgress height={4} value={80} color="success" />
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span>1.0848</span>
                      <span className="text-success">89 lots</span>
                      <div style={{ width: '50%' }}>
                        <CProgress height={4} value={60} color="success" />
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span>1.0845</span>
                      <span className="text-success">67 lots</span>
                      <div style={{ width: '50%' }}>
                        <CProgress height={4} value={45} color="success" />
                      </div>
                    </div>
                  </div>
                </div>
              </CCol>
              <CCol md={6}>
                <div className="border rounded p-2">
                  <div className="small text-muted mb-2">Selling Depth (Asks)</div>
                  <div className="small">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span>1.0852</span>
                      <span className="text-danger">112 lots</span>
                      <div style={{ width: '50%' }}>
                        <CProgress height={4} value={75} color="danger" />
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span>1.0855</span>
                      <span className="text-danger">78 lots</span>
                      <div style={{ width: '50%' }}>
                        <CProgress height={4} value={55} color="danger" />
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span>1.0858</span>
                      <span className="text-danger">45 lots</span>
                      <div style={{ width: '50%' }}>
                        <CProgress height={4} value={35} color="danger" />
                      </div>
                    </div>
                  </div>
                </div>
              </CCol>
            </CRow>
          </div>
        )}

        {/* Price Alerts Section */}
        <div className="mt-4 pt-3 border-top">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="mb-0">
              <CIcon icon={cilWarning} className="me-2 text-warning" />
              Price Alerts
            </h6>
            <CButton size="sm" color="primary">+ Add Alert</CButton>
          </div>
          <CRow className="g-2">
            <CCol md={4}>
              <div className="border rounded p-2">
                <div className="d-flex justify-content-between">
                  <span className="fw-semibold">EUR/USD</span>
                  <CBadge color="success">Active</CBadge>
                </div>
                <div className="small text-muted">Above 1.0900</div>
              </div>
            </CCol>
            <CCol md={4}>
              <div className="border rounded p-2">
                <div className="d-flex justify-content-between">
                  <span className="fw-semibold">BTC/USD</span>
                  <CBadge color="success">Active</CBadge>
                </div>
                <div className="small text-muted">Below 42000</div>
              </div>
            </CCol>
            <CCol md={4}>
              <div className="border rounded p-2">
                <div className="d-flex justify-content-between">
                  <span className="fw-semibold">XAU/USD</span>
                  <CBadge color="secondary">Triggered</CBadge>
                </div>
                <div className="small text-muted">Above 2050 (12:34)</div>
              </div>
            </CCol>
          </CRow>
        </div>
      </CCardBody>

      <CCardFooter className="d-flex justify-content-between align-items-center small text-muted">
        <div className="d-flex align-items-center">
          <CIcon icon={cilInfo} className="me-2" />
          Real-time prices via WebSocket. Updated every 5 seconds.
        </div>
        <div>
          <span className="me-3">Connection: <span className="fw-semibold text-success">WebSocket</span></span>
          <span>Latency: <span className="fw-semibold text-success">~0.5s</span></span>
        </div>
      </CCardFooter>
    </CCard>
  );
};

export default PriceFeed;