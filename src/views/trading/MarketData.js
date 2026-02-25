import React, { useState } from 'react';
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
    cilClock,
    cilGraph,
    cilEqualizer,
    cilCalculator,
    cilOptions,
} from '@coreui/icons';
import currency from 'currency.js';

const MarketData = () => {
    // State
    const [filterSymbol, setFilterSymbol] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [viewMode, setViewMode] = useState('prices'); // prices, movers, heatmap

    // Market data
    const marketData = [
        {
            symbol: 'EUR/USD',
            name: 'Euro / US Dollar',
            category: 'forex',
            bid: 1.0850,
            ask: 1.0852,
            change: 0.0012,
            changePercent: 0.11,
            high: 1.0875,
            low: 1.0825,
            volume: 12453,
            spread: 1.2,
            trend: 'bullish',
            volatility: 'Low',
            support: 1.0825,
            resistance: 1.0875,
            rsi: 58.5,
            ma50: 1.0830,
            ma200: 1.0780,
        },
        {
            symbol: 'GBP/USD',
            name: 'British Pound / US Dollar',
            category: 'forex',
            bid: 1.2620,
            ask: 1.2623,
            change: -0.0008,
            changePercent: -0.06,
            high: 1.2645,
            low: 1.2605,
            volume: 8932,
            spread: 1.5,
            trend: 'bearish',
            volatility: 'Medium',
            support: 1.2605,
            resistance: 1.2645,
            rsi: 42.3,
            ma50: 1.2640,
            ma200: 1.2580,
        },
        {
            symbol: 'USD/JPY',
            name: 'US Dollar / Japanese Yen',
            category: 'forex',
            bid: 148.25,
            ask: 148.28,
            change: 0.35,
            changePercent: 0.24,
            high: 148.45,
            low: 148.15,
            volume: 15678,
            spread: 1.8,
            trend: 'neutral',
            volatility: 'High',
            support: 148.15,
            resistance: 148.45,
            rsi: 52.8,
            ma50: 148.20,
            ma200: 147.90,
        },
        {
            symbol: 'BTC/USD',
            name: 'Bitcoin / US Dollar',
            category: 'crypto',
            bid: 43150,
            ask: 43200,
            change: 850,
            changePercent: 2.01,
            high: 43500,
            low: 42800,
            volume: 2341,
            spread: 5.0,
            trend: 'bullish',
            volatility: 'Very High',
            support: 42800,
            resistance: 43500,
            rsi: 65.2,
            ma50: 42500,
            ma200: 41800,
        },
        {
            symbol: 'ETH/USD',
            name: 'Ethereum / US Dollar',
            category: 'crypto',
            bid: 2835,
            ask: 2840,
            change: 45,
            changePercent: 1.61,
            high: 2850,
            low: 2820,
            volume: 1892,
            spread: 2.5,
            trend: 'bullish',
            volatility: 'High',
            support: 2820,
            resistance: 2850,
            rsi: 62.5,
            ma50: 2800,
            ma200: 2750,
        },
        {
            symbol: 'AUD/USD',
            name: 'Australian Dollar / US Dollar',
            category: 'forex',
            bid: 0.6580,
            ask: 0.6583,
            change: -0.0005,
            changePercent: -0.08,
            high: 0.6595,
            low: 0.6575,
            volume: 5678,
            spread: 1.3,
            trend: 'bearish',
            volatility: 'Low',
            support: 0.6575,
            resistance: 0.6595,
            rsi: 45.6,
            ma50: 0.6590,
            ma200: 0.6560,
        },
        {
            symbol: 'USD/CAD',
            name: 'US Dollar / Canadian Dollar',
            category: 'forex',
            bid: 1.3480,
            ask: 1.3483,
            change: 0.0021,
            changePercent: 0.16,
            high: 1.3490,
            low: 1.3470,
            volume: 7234,
            spread: 1.4,
            trend: 'bullish',
            volatility: 'Medium',
            support: 1.3470,
            resistance: 1.3490,
            rsi: 55.8,
            ma50: 1.3475,
            ma200: 1.3450,
        },
        {
            symbol: 'USD/CHF',
            name: 'US Dollar / Swiss Franc',
            category: 'forex',
            bid: 0.8850,
            ask: 0.8853,
            change: -0.0003,
            changePercent: -0.03,
            high: 0.8860,
            low: 0.8845,
            volume: 4567,
            spread: 1.2,
            trend: 'neutral',
            volatility: 'Low',
            support: 0.8845,
            resistance: 0.8860,
            rsi: 49.2,
            ma50: 0.8855,
            ma200: 0.8840,
        },
        {
            symbol: 'NZD/USD',
            name: 'New Zealand Dollar / US Dollar',
            category: 'forex',
            bid: 0.6150,
            ask: 0.6153,
            change: 0.0004,
            changePercent: 0.07,
            high: 0.6160,
            low: 0.6140,
            volume: 3890,
            spread: 1.3,
            trend: 'bullish',
            volatility: 'Low',
            support: 0.6140,
            resistance: 0.6160,
            rsi: 53.4,
            ma50: 0.6145,
            ma200: 0.6120,
        },
        {
            symbol: 'XAU/USD',
            name: 'Gold / US Dollar',
            category: 'commodities',
            bid: 2035.50,
            ask: 2036.20,
            change: 12.50,
            changePercent: 0.62,
            high: 2040.00,
            low: 2025.00,
            volume: 5678,
            spread: 2.5,
            trend: 'bullish',
            volatility: 'Medium',
            support: 2025.00,
            resistance: 2040.00,
            rsi: 58.7,
            ma50: 2020.00,
            ma200: 1980.00,
        },
        {
            symbol: 'XAG/USD',
            name: 'Silver / US Dollar',
            category: 'commodities',
            bid: 23.85,
            ask: 23.90,
            change: 0.35,
            changePercent: 1.49,
            high: 24.00,
            low: 23.50,
            volume: 3456,
            spread: 3.0,
            trend: 'bullish',
            volatility: 'High',
            support: 23.50,
            resistance: 24.00,
            rsi: 62.3,
            ma50: 23.40,
            ma200: 23.00,
        },
        {
            symbol: 'US30',
            name: 'US Dow Jones 30',
            category: 'indices',
            bid: 38450,
            ask: 38455,
            change: 125,
            changePercent: 0.33,
            high: 38500,
            low: 38300,
            volume: 23456,
            spread: 4.0,
            trend: 'bullish',
            volatility: 'Medium',
            support: 38300,
            resistance: 38500,
            rsi: 56.8,
            ma50: 38200,
            ma200: 37800,
        },
        {
            symbol: 'SPX500',
            name: 'S&P 500 Index',
            category: 'indices',
            bid: 4980,
            ask: 4982,
            change: 15,
            changePercent: 0.30,
            high: 4990,
            low: 4960,
            volume: 18923,
            spread: 3.5,
            trend: 'bullish',
            volatility: 'Medium',
            support: 4960,
            resistance: 4990,
            rsi: 55.2,
            ma50: 4950,
            ma200: 4900,
        },
        {
            symbol: 'NAS100',
            name: 'NASDAQ 100 Index',
            category: 'indices',
            bid: 17650,
            ask: 17655,
            change: 85,
            changePercent: 0.48,
            high: 17700,
            low: 17500,
            volume: 15678,
            spread: 4.5,
            trend: 'bullish',
            volatility: 'High',
            support: 17500,
            resistance: 17700,
            rsi: 58.9,
            ma50: 17400,
            ma200: 17000,
        },
    ];

    // Top movers
    const topMovers = [
        { symbol: 'BTC/USD', change: 850, changePercent: 2.01, volume: 2341, direction: 'up' },
        { symbol: 'XAG/USD', change: 0.35, changePercent: 1.49, volume: 3456, direction: 'up' },
        { symbol: 'ETH/USD', change: 45, changePercent: 1.61, volume: 1892, direction: 'up' },
        { symbol: 'XAU/USD', change: 12.50, changePercent: 0.62, volume: 5678, direction: 'up' },
        { symbol: 'NAS100', change: 85, changePercent: 0.48, volume: 15678, direction: 'up' },
        { symbol: 'GBP/USD', change: -0.0008, changePercent: -0.06, volume: 8932, direction: 'down' },
        { symbol: 'AUD/USD', change: -0.0005, changePercent: -0.08, volume: 5678, direction: 'down' },
        { symbol: 'USD/CHF', change: -0.0003, changePercent: -0.03, volume: 4567, direction: 'down' },
    ];

    // Categories
    const categories = [
        { value: 'all', label: 'All Markets' },
        { value: 'forex', label: 'Forex' },
        { value: 'crypto', label: 'Cryptocurrencies' },
        { value: 'commodities', label: 'Commodities' },
        { value: 'indices', label: 'Indices' },
    ];

    // Format functions
    const formatCurrency = (value) => currency(value, { precision: 2, symbol: '$' }).format();
    const formatPrice = (price, symbol) => {
        if (!price) return '0.0000';

        // Determine decimal places based on symbol
        if (symbol.includes('JPY')) return price.toFixed(3);
        if (symbol.includes('BTC') || symbol.includes('ETH') || symbol.includes('US30') || symbol.includes('NAS100') || symbol.includes('XAU')) return price.toFixed(1);
        if (symbol.includes('XAG')) return price.toFixed(2);
        if (symbol.includes('SPX500')) return price.toFixed(0);
        return price.toFixed(4);
    };

    const formatLargeNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    // Filter market data
    const filteredData = marketData.filter(item => {
        // Category filter
        if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;

        // Search filter
        if (filterSymbol && !item.symbol.toLowerCase().includes(filterSymbol.toLowerCase()) &&
            !item.name.toLowerCase().includes(filterSymbol.toLowerCase())) return false;

        return true;
    });

    // Calculate market summary
    const totalMarkets = marketData.length;
    const advancingMarkets = marketData.filter(m => m.change > 0).length;
    const decliningMarkets = marketData.filter(m => m.change < 0).length;
    const totalVolume = marketData.reduce((sum, m) => sum + m.volume, 0);

    return (
        <CCard className="mb-4">
            <CCardHeader className="d-flex justify-content-between align-items-center">
                <div>
                    <h4 className="mb-0">
                        <CIcon icon={cilChart} className="me-2" />
                        Market Data
                    </h4>
                    <small className="text-muted">Real-time market prices and analysis</small>
                </div>
                <CBadge color="info">Live Data</CBadge>
            </CCardHeader>

            <CCardBody>
                {/* Market Summary Cards */}
                <CRow className="mb-4 g-3">
                    <CCol md={3}>
                        <div className="border rounded p-2">
                            <small className="text-muted d-block">Total Markets</small>
                            <span className="fw-bold fs-5">{totalMarkets}</span>
                        </div>
                    </CCol>
                    <CCol md={3}>
                        <div className="border rounded p-2">
                            <small className="text-muted d-block">Advancing</small>
                            <span className="fw-bold fs-5 text-success">{advancingMarkets}</span>
                        </div>
                    </CCol>
                    <CCol md={3}>
                        <div className="border rounded p-2">
                            <small className="text-muted d-block">Declining</small>
                            <span className="fw-bold fs-5 text-danger">{decliningMarkets}</span>
                        </div>
                    </CCol>
                    <CCol md={3}>
                        <div className="border rounded p-2">
                            <small className="text-muted d-block">Total Volume</small>
                            <span className="fw-bold fs-5 text-info">{formatLargeNumber(totalVolume)}</span>
                        </div>
                    </CCol>
                </CRow>

                {/* Controls */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex gap-2">
                        <CButton
                            size="sm"
                            color={viewMode === 'prices' ? 'primary' : 'secondary'}
                            variant={viewMode === 'prices' ? undefined : 'outline'}
                            onClick={() => setViewMode('prices')}
                        >
                            <CIcon icon={cilGraph} className="me-1" />
                            Prices
                        </CButton>
                        <CButton
                            size="sm"
                            color={viewMode === 'movers' ? 'primary' : 'secondary'}
                            variant={viewMode === 'movers' ? undefined : 'outline'}
                            onClick={() => setViewMode('movers')}
                        >
                            <CIcon icon={cilEqualizer} className="me-1" />
                            Top Movers
                        </CButton>
                        <CButton
                            size="sm"
                            color={viewMode === 'heatmap' ? 'primary' : 'secondary'}
                            variant={viewMode === 'heatmap' ? undefined : 'outline'}
                            onClick={() => setViewMode('heatmap')}
                        >
                            <CIcon icon={cilCalculator} className="me-1" />
                            Heatmap
                        </CButton>
                    </div>
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
                        <CButton size="sm" color="secondary" variant="outline">
                            <CIcon icon={cilReload} className="me-1" />
                            Refresh
                        </CButton>
                    </div>
                </div>

                {/* Prices View */}
                {viewMode === 'prices' && (
                    <CTable hover responsive className="mb-0 border">
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell>Symbol</CTableHeaderCell>
                                <CTableHeaderCell>Name</CTableHeaderCell>
                                <CTableHeaderCell className="text-end">Bid</CTableHeaderCell>
                                <CTableHeaderCell className="text-end">Ask</CTableHeaderCell>
                                <CTableHeaderCell className="text-end">Change</CTableHeaderCell>
                                <CTableHeaderCell className="text-end">Change %</CTableHeaderCell>
                                <CTableHeaderCell className="text-end">High</CTableHeaderCell>
                                <CTableHeaderCell className="text-end">Low</CTableHeaderCell>
                                <CTableHeaderCell className="text-end">Volume</CTableHeaderCell>
                                <CTableHeaderCell className="text-end">Spread</CTableHeaderCell>
                                <CTableHeaderCell>Trend</CTableHeaderCell>
                                <CTableHeaderCell>Volatility</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {filteredData.length > 0 ? (
                                filteredData.map((item, index) => (
                                    <CTableRow key={index}>
                                        <CTableDataCell className="fw-semibold">{item.symbol}</CTableDataCell>
                                        <CTableDataCell className="text-muted small">{item.name}</CTableDataCell>
                                        <CTableDataCell className="text-end">{formatPrice(item.bid, item.symbol)}</CTableDataCell>
                                        <CTableDataCell className="text-end">{formatPrice(item.ask, item.symbol)}</CTableDataCell>
                                        <CTableDataCell className={`text-end ${item.change >= 0 ? 'text-success' : 'text-danger'}`}>
                                            {item.change >= 0 ? '+' : ''}{formatPrice(Math.abs(item.change), item.symbol)}
                                        </CTableDataCell>
                                        <CTableDataCell className={`text-end ${item.changePercent >= 0 ? 'text-success' : 'text-danger'}`}>
                                            {item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
                                        </CTableDataCell>
                                        <CTableDataCell className="text-end text-success">{formatPrice(item.high, item.symbol)}</CTableDataCell>
                                        <CTableDataCell className="text-end text-danger">{formatPrice(item.low, item.symbol)}</CTableDataCell>
                                        <CTableDataCell className="text-end text-info">{formatLargeNumber(item.volume)}</CTableDataCell>
                                        <CTableDataCell className="text-end text-warning">{item.spread.toFixed(1)}</CTableDataCell>
                                        <CTableDataCell>
                                            <CBadge
                                                color={item.trend === 'bullish' ? 'success' : item.trend === 'bearish' ? 'danger' : 'warning'}
                                                className="px-2"
                                            >
                                                <CIcon
                                                    icon={item.trend === 'bullish' ? cilArrowTop : item.trend === 'bearish' ? cilArrowBottom : cilOptions}
                                                    className="me-1"
                                                    size="sm"
                                                />
                                                {item.trend.toUpperCase()}
                                            </CBadge>
                                        </CTableDataCell>
                                        <CTableDataCell>
                                            <CBadge
                                                color={item.volatility === 'Low' ? 'success' : item.volatility === 'Medium' ? 'warning' : 'danger'}
                                            >
                                                {item.volatility}
                                            </CBadge>
                                        </CTableDataCell>
                                    </CTableRow>
                                ))
                            ) : (
                                <CTableRow>
                                    <CTableDataCell colSpan={12} className="text-center py-4 text-muted">
                                        No markets found matching your filters
                                    </CTableDataCell>
                                </CTableRow>
                            )}
                        </CTableBody>
                    </CTable>
                )}

                {/* Top Movers View */}
                {viewMode === 'movers' && (
                    <CRow>
                        <CCol md={6}>
                            <div className="mb-3">
                                <h6 className="text-success">
                                    <CIcon icon={cilArrowTop} className="me-1" />
                                    Top Gainers
                                </h6>
                            </div>
                            <CTable hover responsive className="mb-4 border">
                                <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell>Symbol</CTableHeaderCell>
                                        <CTableHeaderCell className="text-end">Change</CTableHeaderCell>
                                        <CTableHeaderCell className="text-end">Change %</CTableHeaderCell>
                                        <CTableHeaderCell className="text-end">Volume</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {topMovers.filter(m => m.direction === 'up').map((mover, index) => (
                                        <CTableRow key={index}>
                                            <CTableDataCell className="fw-semibold">{mover.symbol}</CTableDataCell>
                                            <CTableDataCell className="text-end text-success">
                                                +{formatPrice(Math.abs(mover.change), mover.symbol)}
                                            </CTableDataCell>
                                            <CTableDataCell className="text-end text-success">
                                                +{mover.changePercent.toFixed(2)}%
                                            </CTableDataCell>
                                            <CTableDataCell className="text-end text-info">
                                                {formatLargeNumber(mover.volume)}
                                            </CTableDataCell>
                                        </CTableRow>
                                    ))}
                                </CTableBody>
                            </CTable>
                        </CCol>
                        <CCol md={6}>
                            <div className="mb-3">
                                <h6 className="text-danger">
                                    <CIcon icon={cilArrowBottom} className="me-1" />
                                    Top Losers
                                </h6>
                            </div>
                            <CTable hover responsive className="mb-4 border">
                                <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell>Symbol</CTableHeaderCell>
                                        <CTableHeaderCell className="text-end">Change</CTableHeaderCell>
                                        <CTableHeaderCell className="text-end">Change %</CTableHeaderCell>
                                        <CTableHeaderCell className="text-end">Volume</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {topMovers.filter(m => m.direction === 'down').map((mover, index) => (
                                        <CTableRow key={index}>
                                            <CTableDataCell className="fw-semibold">{mover.symbol}</CTableDataCell>
                                            <CTableDataCell className="text-end text-danger">
                                                {formatPrice(mover.change, mover.symbol)}
                                            </CTableDataCell>
                                            <CTableDataCell className="text-end text-danger">
                                                {mover.changePercent.toFixed(2)}%
                                            </CTableDataCell>
                                            <CTableDataCell className="text-end text-info">
                                                {formatLargeNumber(mover.volume)}
                                            </CTableDataCell>
                                        </CTableRow>
                                    ))}
                                </CTableBody>
                            </CTable>
                        </CCol>
                    </CRow>
                )}

                {/* Heatmap View */}
                {viewMode === 'heatmap' && (
                    <div>
                        <div className="mb-3">
                            <h6>Market Performance Heatmap</h6>
                            <small className="text-muted">Color intensity represents performance strength</small>
                        </div>
                        <CRow className="g-2">
                            {filteredData.map((item, index) => (
                                <CCol md={3} key={index}>
                                    <div
                                        className="border rounded p-2"
                                        style={{
                                            backgroundColor: item.changePercent > 0
                                                ? `rgba(40, 167, 69, ${Math.min(item.changePercent / 3, 0.3)})`
                                                : `rgba(220, 53, 69, ${Math.min(Math.abs(item.changePercent) / 3, 0.3)})`,
                                        }}
                                    >
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="fw-semibold">{item.symbol}</span>
                                            <CBadge color={item.changePercent > 0 ? 'success' : 'danger'}>
                                                {item.changePercent > 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
                                            </CBadge>
                                        </div>
                                        <div className="small text-muted mt-1">
                                            <div className="d-flex justify-content-between">
                                                <span>Bid: {formatPrice(item.bid, item.symbol)}</span>
                                                <span>Ask: {formatPrice(item.ask, item.symbol)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CCol>
                            ))}
                        </CRow>
                    </div>
                )}

                {/* Technical Analysis Section */}
                <div className="mt-4 pt-3 border-top">
                    <h6 className="mb-3">
                        <CIcon icon={cilEqualizer} className="me-2" />
                        Technical Analysis Overview
                    </h6>
                    <CRow className="g-3">
                        {filteredData.slice(0, 6).map((item, index) => (
                            <CCol md={4} key={index}>
                                <div className="border rounded p-2">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span className="fw-semibold">{item.symbol}</span>
                                        <CBadge color={item.trend === 'bullish' ? 'success' : item.trend === 'bearish' ? 'danger' : 'warning'}>
                                            {item.trend.toUpperCase()}
                                        </CBadge>
                                    </div>
                                    <div className="small">
                                        <div className="d-flex justify-content-between mb-1">
                                            <span className="text-muted">RSI (14):</span>
                                            <span className={`fw-semibold ${item.rsi > 70 ? 'text-danger' :
                                                item.rsi < 30 ? 'text-success' : 'text-info'
                                                }`}>{item.rsi.toFixed(1)}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-1">
                                            <span className="text-muted">S/R Levels:</span>
                                            <span className="fw-semibold">
                                                <span className="text-danger">S: {formatPrice(item.support, item.symbol)}</span>
                                                {' | '}
                                                <span className="text-success">R: {formatPrice(item.resistance, item.symbol)}</span>
                                            </span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-1">
                                            <span className="text-muted">MA (50/200):</span>
                                            <span className="fw-semibold">
                                                {formatPrice(item.ma50, item.symbol)} / {formatPrice(item.ma200, item.symbol)}
                                            </span>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <span className="text-muted">Signal:</span>
                                            <CBadge color={item.ma50 > item.ma200 ? 'success' : 'danger'} size="sm">
                                                {item.ma50 > item.ma200 ? 'BULLISH' : 'BEARISH'}
                                            </CBadge>
                                        </div>
                                    </div>
                                </div>
                            </CCol>
                        ))}
                    </CRow>
                </div>

                {/* Market Hours */}
                <div className="mt-4 pt-3 border-top">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="mb-0">
                            <CIcon icon={cilClock} className="me-2" />
                            Market Hours & Status
                        </h6>
                        <CBadge color="success">Open</CBadge>
                    </div>
                    <CRow className="g-3">
                        <CCol md={3}>
                            <div className="border rounded p-2">
                                <div className="small text-muted">Forex</div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="fw-semibold">24/5</span>
                                    <CBadge color="success">Open</CBadge>
                                </div>
                                <div className="small text-muted">Sunday 5pm - Friday 5pm</div>
                            </div>
                        </CCol>
                        <CCol md={3}>
                            <div className="border rounded p-2">
                                <div className="small text-muted">Crypto</div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="fw-semibold">24/7</span>
                                    <CBadge color="success">Open</CBadge>
                                </div>
                                <div className="small text-muted">Always open</div>
                            </div>
                        </CCol>
                        <CCol md={3}>
                            <div className="border rounded p-2">
                                <div className="small text-muted">Commodities</div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="fw-semibold">23h/day</span>
                                    <CBadge color="success">Open</CBadge>
                                </div>
                                <div className="small text-muted">Sunday 6pm - Friday 5pm</div>
                            </div>
                        </CCol>
                        <CCol md={3}>
                            <div className="border rounded p-2">
                                <div className="small text-muted">Indices</div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="fw-semibold">Session based</span>
                                    <CBadge color="success">Open</CBadge>
                                </div>
                                <div className="small text-muted">Check individual markets</div>
                            </div>
                        </CCol>
                    </CRow>
                </div>

                {/* Market News Ticker */}
                <div className="mt-4 pt-3 border-top">
                    <div className="d-flex align-items-center">
                        <CIcon icon={cilInfo} className="me-2 text-info" />
                        <span className="small text-muted me-3">Market News:</span>
                        <span className="small">
                            <span className="text-success">•</span> EUR/USD testing resistance at 1.0875
                        </span>
                        <span className="small mx-3 text-muted">|</span>
                        <span className="small">
                            <span className="text-danger">•</span> Bitcoin volatility increases ahead of halving
                        </span>
                        <span className="small mx-3 text-muted">|</span>
                        <span className="small">
                            <span className="text-warning">•</span> Gold reaches new 2-week high
                        </span>
                    </div>
                </div>
            </CCardBody>

            <CCardFooter className="d-flex justify-content-between align-items-center small text-muted">
                <div className="d-flex align-items-center">
                    <CIcon icon={cilInfo} className="me-2" />
                    Data delayed by 15 minutes. Updated every 5 seconds.
                </div>
                <div>
                    <span className="me-3">Last Update: <span className="fw-semibold">{new Date().toLocaleTimeString()}</span></span>
                    <span>Source: <span className="fw-semibold">Live Market Feed</span></span>
                </div>
            </CCardFooter>
        </CCard>
    );
};

export default MarketData;