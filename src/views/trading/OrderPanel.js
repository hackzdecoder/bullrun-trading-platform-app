import React, { useState, useEffect } from 'react'
import {
    CCard,
    CCardHeader,
    CCardBody,
    CButton,
    CFormSelect,
    CFormInput,
    CInputGroup,
    CInputGroupText,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CBadge,
    CRow,
    CCol,
    CProgress,
    CCardFooter,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
    cilCalculator,
    cilArrowTop,
    cilArrowBottom,
    cilChart,
    cilGraph,
    cilSpreadsheet,
    cilInfo,
    cilWarning,
    cilCheckCircle,
    cilSpeedometer,
    cilEqualizer,
    cilBarChart,
    cilWallet,
    cilChartPie,
    cilMediaStop,
    cilOptions,
    cilClock,
    cilPeople,
    cilCart,
    cilBasket,
    cilSearch,
    cilReload,
} from '@coreui/icons'
import currency from 'currency.js'

const OrderPanel = ({ accountData }) => {
    // State
    const [activeTab, setActiveTab] = useState('calculator')
    const [symbol, setSymbol] = useState('EUR/USD')
    const [lots, setLots] = useState(0.1)
    const [leverage, setLeverage] = useState('1:100')
    const [showAllMarkets, setShowAllMarkets] = useState(false)
    const [reportTimeframe, setReportTimeframe] = useState('daily')
    const [filterSymbol, setFilterSymbol] = useState('') // New state for search
    const [lastUpdate, setLastUpdate] = useState(new Date()) // For refresh button

    // Calculations
    const [marginRequired, setMarginRequired] = useState(0)
    const [contractValue, setContractValue] = useState(0)
    const [pipValue, setPipValue] = useState(0)

    // Symbol configurations
    const symbolConfigs = {
        'EUR/USD': {
            digit: 4,
            pipSize: 0.0001,
            contractSize: 100000,
            minLot: 0.01,
            maxLot: 100,
            spread: 1.2,
            swapLong: -2.5,
            swapShort: 1.2,
            bid: 1.0850,
            ask: 1.0852,
            high: 1.0875,
            low: 1.0825,
            volume: 12453,
            trend: 'bullish',
            volatility: 'Low',
        },
        'GBP/USD': {
            digit: 4,
            pipSize: 0.0001,
            contractSize: 100000,
            minLot: 0.01,
            maxLot: 100,
            spread: 1.5,
            swapLong: -1.8,
            swapShort: 0.9,
            bid: 1.2620,
            ask: 1.2623,
            high: 1.2645,
            low: 1.2605,
            volume: 8932,
            trend: 'bearish',
            volatility: 'Medium',
        },
        'USD/JPY': {
            digit: 3,
            pipSize: 0.001,
            contractSize: 100000,
            minLot: 0.01,
            maxLot: 100,
            spread: 1.8,
            swapLong: 0.5,
            swapShort: -2.1,
            bid: 148.25,
            ask: 148.28,
            high: 148.45,
            low: 148.15,
            volume: 15678,
            trend: 'neutral',
            volatility: 'High',
        },
        'BTC/USD': {
            digit: 1,
            pipSize: 1,
            contractSize: 1,
            minLot: 0.001,
            maxLot: 10,
            spread: 5.0,
            swapLong: -10,
            swapShort: -5,
            bid: 43150,
            ask: 43200,
            high: 43500,
            low: 42800,
            volume: 2341,
            trend: 'bullish',
            volatility: 'Very High',
        },
    }

    const currentSymbol = symbolConfigs[symbol]

    // Calculations effect
    useEffect(() => {
        if (!accountData) return

        const leverageValue = parseInt(leverage.split(':')[1]) || 100
        const midPrice = (currentSymbol.bid + currentSymbol.ask) / 2
        const value = lots * currentSymbol.contractSize * midPrice
        setContractValue(value)
        setMarginRequired(value / leverageValue)
        setPipValue(lots * currentSymbol.contractSize * currentSymbol.pipSize)
    }, [lots, leverage, symbol, currentSymbol, accountData])

    // Format functions
    const formatCurrency = (value) => currency(value, { precision: 2, symbol: '$' }).format()
    const formatNumber = (value, decimals = 2) => new Intl.NumberFormat('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value)
    const formatPrice = (price, digit) => price?.toFixed(digit || 4) || '0.0000'
    const formatLargeNumber = (num) => num >= 1000000 ? (num / 1000000).toFixed(1) + 'M' : num >= 1000 ? (num / 1000).toFixed(1) + 'K' : num.toString()
    const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

    // Market data
    const marketPrices = [
        { symbol: 'EUR/USD', bid: 1.0850, ask: 1.0852, change: 0.0012, volume: 12453, dailyHigh: 1.0875, dailyLow: 1.0825 },
        { symbol: 'GBP/USD', bid: 1.2620, ask: 1.2623, change: -0.0008, volume: 8932, dailyHigh: 1.2645, dailyLow: 1.2605 },
        { symbol: 'USD/JPY', bid: 148.25, ask: 148.28, change: 0.35, volume: 15678, dailyHigh: 148.45, dailyLow: 148.15 },
        { symbol: 'BTC/USD', bid: 43150, ask: 43200, change: 850, volume: 2341, dailyHigh: 43500, dailyLow: 42800 },
        { symbol: 'AUD/USD', bid: 0.6580, ask: 0.6583, change: -0.0005, volume: 5678, dailyHigh: 0.6595, dailyLow: 0.6575 },
        { symbol: 'USD/CAD', bid: 1.3480, ask: 1.3483, change: 0.0021, volume: 7234, dailyHigh: 1.3490, dailyLow: 1.3470 },
        { symbol: 'USD/CHF', bid: 0.8850, ask: 0.8853, change: -0.0003, volume: 4567, dailyHigh: 0.8860, dailyLow: 0.8845 },
        { symbol: 'NZD/USD', bid: 0.6150, ask: 0.6153, change: 0.0004, volume: 3890, dailyHigh: 0.6160, dailyLow: 0.6140 },
    ]

    // Filter market prices based on search
    const filteredMarketPrices = marketPrices.filter(item => {
        if (filterSymbol && !item.symbol.toLowerCase().includes(filterSymbol.toLowerCase())) return false;
        return true;
    });

    // Get visible markets (filtered + show/hide)
    const visibleMarkets = showAllMarkets ? filteredMarketPrices : filteredMarketPrices.slice(0, 4);

    // Open positions
    const openPositions = [
        { id: 1, symbol: 'EUR/USD', type: 'BUY', lots: 0.5, openPrice: 1.0825, currentPrice: 1.0850, profit: 125.00, profitPips: 25, swap: -0.25, margin: 541.25, duration: '2h 15m', stopLoss: 1.0800, takeProfit: 1.0880 },
        { id: 2, symbol: 'GBP/USD', type: 'SELL', lots: 0.3, openPrice: 1.2650, currentPrice: 1.2620, profit: 90.00, profitPips: 30, swap: 0.12, margin: 379.50, duration: '5h 30m', stopLoss: 1.2660, takeProfit: 1.2600 },
        { id: 3, symbol: 'USD/JPY', type: 'BUY', lots: 1.0, openPrice: 148.25, currentPrice: 148.28, profit: 30.00, profitPips: 3, swap: -0.45, margin: 1482.80, duration: '1d 3h', stopLoss: 148.10, takeProfit: 148.50 },
        { id: 4, symbol: 'BTC/USD', type: 'BUY', lots: 0.05, openPrice: 42850, currentPrice: 43150, profit: 150.00, profitPips: 300, swap: -0.50, margin: 2157.50, duration: '4h 45m', stopLoss: 42500, takeProfit: 43500 },
        { id: 5, symbol: 'AUD/USD', type: 'SELL', lots: 0.8, openPrice: 0.6590, currentPrice: 0.6580, profit: 80.00, profitPips: 10, swap: 0.08, margin: 526.40, duration: '1h 20m', stopLoss: 0.6600, takeProfit: 0.6570 },
    ]

    // Order history
    const orderHistory = [
        { id: 1, symbol: 'EUR/USD', type: 'BUY', lots: 0.2, openPrice: 1.0785, closePrice: 1.0825, profit: 80.00, profitPips: 40, commission: 0.60, swap: -0.10, closeTime: '2024-01-15 14:25', duration: '4h 55m' },
        { id: 2, symbol: 'GBP/USD', type: 'SELL', lots: 0.5, openPrice: 1.2680, closePrice: 1.2620, profit: 300.00, profitPips: 60, commission: 1.50, swap: 0.25, closeTime: '2024-01-15 10:15', duration: '22h 55m' },
        { id: 3, symbol: 'USD/JPY', type: 'BUY', lots: 0.8, openPrice: 147.50, closePrice: 148.25, profit: 600.00, profitPips: 75, commission: 2.40, swap: -0.35, closeTime: '2024-01-14 09:30', duration: '17h 45m' },
        { id: 4, symbol: 'BTC/USD', type: 'SELL', lots: 0.02, openPrice: 43500, closePrice: 43150, profit: 70.00, profitPips: 350, commission: 0.06, swap: -0.10, closeTime: '2024-01-13 04:30', duration: '6h 20m' },
        { id: 5, symbol: 'EUR/USD', type: 'SELL', lots: 0.3, openPrice: 1.0850, closePrice: 1.0820, profit: 90.00, profitPips: 30, commission: 0.90, swap: 0.15, closeTime: '2024-01-11 16:40', duration: '3h 25m' },
        { id: 6, symbol: 'USD/CAD', type: 'BUY', lots: 0.4, openPrice: 1.3460, closePrice: 1.3480, profit: 80.00, profitPips: 20, commission: 1.20, swap: -0.08, closeTime: '2024-01-10 15:45', duration: '5h 15m' },
        { id: 7, symbol: 'GBP/USD', type: 'BUY', lots: 0.6, openPrice: 1.2590, closePrice: 1.2640, profit: 300.00, profitPips: 50, commission: 1.80, swap: 0.30, closeTime: '2024-01-09 12:30', duration: '3h 45m' },
        { id: 8, symbol: 'USD/JPY', type: 'SELL', lots: 0.7, openPrice: 148.80, closePrice: 148.20, profit: 420.00, profitPips: 60, commission: 2.10, swap: -0.42, closeTime: '2024-01-08 16:20', duration: '5h 10m' },
    ]

    // Daily P&L data
    const dailyPnL = [
        { date: '2024-01-15', trades: 4, profit: 450.00, loss: 120.00, net: 330.00, volume: 2.8 },
        { date: '2024-01-14', trades: 3, profit: 600.00, loss: 0, net: 600.00, volume: 2.3 },
        { date: '2024-01-13', trades: 2, profit: 70.00, loss: 0, net: 70.00, volume: 0.8 },
        { date: '2024-01-12', trades: 5, profit: 580.00, loss: 200.00, net: 380.00, volume: 3.2 },
        { date: '2024-01-11', trades: 3, profit: 90.00, loss: 0, net: 90.00, volume: 1.5 },
        { date: '2024-01-10', trades: 4, profit: 320.00, loss: 80.00, net: 240.00, volume: 2.1 },
        { date: '2024-01-09', trades: 2, profit: 300.00, loss: 0, net: 300.00, volume: 1.2 },
    ]

    // Weekly P&L data
    const weeklyPnL = [
        { week: 'Week 3', trades: 12, profit: 1650.00, loss: 350.00, net: 1300.00, volume: 9.8 },
        { week: 'Week 2', trades: 15, profit: 2100.00, loss: 450.00, net: 1650.00, volume: 12.4 },
        { week: 'Week 1', trades: 10, profit: 1200.00, loss: 280.00, net: 920.00, volume: 8.2 },
    ]

    // Monthly P&L data
    const monthlyPnL = [
        { month: 'January 2024', trades: 37, profit: 4950.00, loss: 1080.00, net: 3870.00, volume: 30.4 },
        { month: 'December 2023', trades: 42, profit: 5200.00, loss: 1350.00, net: 3850.00, volume: 34.2 },
        { month: 'November 2023', trades: 38, profit: 4800.00, loss: 1120.00, net: 3680.00, volume: 31.6 },
    ]

    // Symbol performance data
    const symbolPerformance = [
        { symbol: 'EUR/USD', trades: 12, profit: 620.00, winRate: 75.0, avgProfit: 68.50, avgLoss: -22.30, lots: 5.8 },
        { symbol: 'GBP/USD', trades: 10, profit: 690.00, winRate: 70.0, avgProfit: 98.60, avgLoss: -35.00, lots: 4.9 },
        { symbol: 'USD/JPY', trades: 8, profit: 1020.00, winRate: 62.5, avgProfit: 204.00, avgLoss: -52.50, lots: 5.5 },
        { symbol: 'BTC/USD', trades: 6, profit: 370.00, winRate: 66.7, avgProfit: 92.50, avgLoss: -45.00, lots: 1.2 },
        { symbol: 'USD/CAD', trades: 4, profit: 80.00, winRate: 50.0, avgProfit: 40.00, avgLoss: -20.00, lots: 1.6 },
    ]

    // Time-based performance
    const timePerformance = [
        { hour: '00:00 - 04:00', trades: 5, profit: 320.00, winRate: 60.0 },
        { hour: '04:00 - 08:00', trades: 8, profit: 650.00, winRate: 75.0 },
        { hour: '08:00 - 12:00', trades: 15, profit: 1240.00, winRate: 73.3 },
        { hour: '12:00 - 16:00', trades: 12, profit: 890.00, winRate: 66.7 },
        { hour: '16:00 - 20:00', trades: 9, profit: 540.00, winRate: 55.6 },
        { hour: '20:00 - 00:00', trades: 6, profit: 230.00, winRate: 50.0 },
    ]

    // Calculate totals
    const totalOpenProfit = openPositions.reduce((sum, p) => sum + p.profit, 0)
    const totalUsedMargin = openPositions.reduce((sum, p) => sum + p.margin, 0)
    const totalSwap = openPositions.reduce((sum, p) => sum + p.swap, 0)
    const totalHistoryProfit = orderHistory.reduce((sum, o) => sum + o.profit, 0)
    const totalCommission = orderHistory.reduce((sum, o) => sum + o.commission, 0)
    const totalHistorySwap = orderHistory.reduce((sum, o) => sum + o.swap, 0)
    const totalTrades = orderHistory.length
    const winningTrades = orderHistory.filter(o => o.profit > 0).length
    const losingTrades = orderHistory.filter(o => o.profit < 0).length
    const winRate = (winningTrades / totalTrades * 100).toFixed(1)
    const avgWin = winningTrades > 0 ? orderHistory.filter(o => o.profit > 0).reduce((sum, o) => sum + o.profit, 0) / winningTrades : 0
    const avgLoss = losingTrades > 0 ? orderHistory.filter(o => o.profit < 0).reduce((sum, o) => sum + o.profit, 0) / losingTrades : 0
    const profitFactor = (orderHistory.filter(o => o.profit > 0).reduce((sum, o) => sum + o.profit, 0) / Math.abs(orderHistory.filter(o => o.profit < 0).reduce((sum, o) => sum + o.profit, 0))).toFixed(2)
    const avgTradeDuration = orderHistory.reduce((sum, o) => {
        const hours = o.duration.includes('h') ? parseInt(o.duration) : 0
        const minutes = o.duration.includes('m') ? parseInt(o.duration.split(' ')[1]) / 60 : 0
        return sum + hours + minutes
    }, 0) / orderHistory.length

    // Margin level status
    const getMarginLevelStatus = (level) => {
        if (level > 300) return { text: 'Safe', color: 'success', icon: cilCheckCircle }
        if (level > 150) return { text: 'Warning', color: 'warning', icon: cilWarning }
        return { text: 'High Risk', color: 'danger', icon: cilWarning }
    }

    const marginLevelAfter = ((accountData?.equity || 0) / ((accountData?.margin || 0) + marginRequired) * 100).toFixed(1)
    const marginLevelStatus = getMarginLevelStatus(accountData?.marginLevel)

    return (
        <CCard className="mb-4">
            <CCardHeader className="d-flex justify-content-between align-items-center">
                <div>
                    <h4 className="mb-0">Order Panel</h4>
                    <small className="text-muted">Trade execution and position management</small>
                </div>
                <div className="d-flex align-items-center gap-2">
                    <CBadge color="info">Live Trading</CBadge>
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
                    </CRow>
                </div>

                {/* Tab Navigation with Gray Hover Effect */}
                <div className="d-flex border-bottom mb-4">
                    {['calculator', 'positions', 'history'].map((tab) => (
                        <CButton
                            key={tab}
                            color="link"
                            className={`px-3 py-2 rounded-0 text-decoration-none tab-button ${activeTab === tab ? 'fw-bold border-bottom border-2 border-primary active-tab' : 'text-muted'}`}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                borderBottomColor: activeTab === tab ? '#0d6efd' : 'transparent',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                if (activeTab !== tab) {
                                    e.currentTarget.style.backgroundColor = '#f0f0f0';
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                        >
                            <CIcon icon={tab === 'calculator' ? cilCalculator : tab === 'positions' ? cilGraph : cilSpreadsheet} className="me-2" />
                            {tab === 'calculator' ? 'Calculator' : tab === 'positions' ? `Open (${openPositions.length})` : 'History'}
                        </CButton>
                    ))}
                </div>

                <style jsx>{`
                    .tab-button:hover {
                        background-color: #f0f0f0 !important;
                    }
                    .tab-button.active-tab:hover {
                        background-color: transparent !important;
                    }
                `}</style>

                {/* Tab Content */}
                {activeTab === 'calculator' && (
                    <div>
                        {/* Calculator Controls */}
                        <CRow className="mb-4 g-3">
                            <CCol md={6}>
                                <div className="mb-2">
                                    <span className="small text-muted">INSTRUMENT</span>
                                </div>
                                <CFormSelect
                                    size="sm"
                                    value={symbol}
                                    onChange={(e) => setSymbol(e.target.value)}
                                >
                                    {Object.keys(symbolConfigs).map(sym => <option key={sym} value={sym}>{sym}</option>)}
                                </CFormSelect>
                            </CCol>
                            <CCol md={3}>
                                <div className="mb-2">
                                    <span className="small text-muted">VOLUME (Lots)</span>
                                </div>
                                <CFormSelect
                                    size="sm"
                                    value={lots}
                                    onChange={(e) => setLots(parseFloat(e.target.value))}
                                >
                                    <option value="0.01">0.01</option>
                                    <option value="0.05">0.05</option>
                                    <option value="0.10">0.10</option>
                                    <option value="0.50">0.50</option>
                                    <option value="1.00">1.00</option>
                                    <option value="2.00">2.00</option>
                                    <option value="5.00">5.00</option>
                                </CFormSelect>
                            </CCol>
                            <CCol md={3}>
                                <div className="mb-2">
                                    <span className="small text-muted">LEVERAGE</span>
                                </div>
                                <CFormSelect
                                    size="sm"
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

                        {/* Market Prices with Search and Expand/Collapse */}
                        <div className="mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <span className="small text-muted">MARKET PRICES</span>
                                <div className="d-flex gap-2">
                                    <CInputGroup size="sm" style={{ width: '220px' }}>
                                        <CInputGroupText>
                                            <CIcon icon={cilSearch} />
                                        </CInputGroupText>
                                        <CFormInput
                                            placeholder="Search..."
                                            value={filterSymbol}
                                            onChange={(e) => setFilterSymbol(e.target.value)}
                                        />
                                    </CInputGroup>
                                    <CButton
                                        size="sm"
                                        color="secondary"
                                        variant="outline"
                                        onClick={() => setShowAllMarkets(!showAllMarkets)}
                                    >
                                        <CIcon icon={showAllMarkets ? cilMediaStop : cilOptions} className="me-1" size="sm" />
                                        {showAllMarkets ? 'Show Less' : 'View All'}
                                    </CButton>
                                </div>
                            </div>
                            <CTable hover responsive size="sm" className="mb-0 border">
                                <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell className="small">Symbol</CTableHeaderCell>
                                        <CTableHeaderCell className="small text-end">Bid</CTableHeaderCell>
                                        <CTableHeaderCell className="small text-end">Ask</CTableHeaderCell>
                                        <CTableHeaderCell className="small text-end">Change</CTableHeaderCell>
                                        <CTableHeaderCell className="small text-end">Spread</CTableHeaderCell>
                                        <CTableHeaderCell className="small text-end">Volume</CTableHeaderCell>
                                        <CTableHeaderCell className="small text-end">Daily High</CTableHeaderCell>
                                        <CTableHeaderCell className="small text-end">Daily Low</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {visibleMarkets.length > 0 ? (
                                        visibleMarkets.map(price => (
                                            <CTableRow
                                                key={price.symbol}
                                                onClick={() => setSymbol(price.symbol)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <CTableDataCell className="fw-semibold">{price.symbol}</CTableDataCell>
                                                <CTableDataCell className="text-end">{formatPrice(price.bid, symbolConfigs[price.symbol]?.digit)}</CTableDataCell>
                                                <CTableDataCell className="text-end">{formatPrice(price.ask, symbolConfigs[price.symbol]?.digit)}</CTableDataCell>
                                                <CTableDataCell className={`text-end ${price.change >= 0 ? 'text-success' : 'text-danger'}`}>
                                                    {price.change >= 0 ? '+' : ''}{price.change.toFixed(4)}
                                                </CTableDataCell>
                                                <CTableDataCell className="text-end text-warning">
                                                    {symbolConfigs[price.symbol]?.spread.toFixed(1)}
                                                </CTableDataCell>
                                                <CTableDataCell className="text-end text-info">
                                                    {formatLargeNumber(price.volume)}
                                                </CTableDataCell>
                                                <CTableDataCell className="text-end text-success">
                                                    {formatPrice(price.dailyHigh, symbolConfigs[price.symbol]?.digit)}
                                                </CTableDataCell>
                                                <CTableDataCell className="text-end text-danger">
                                                    {formatPrice(price.dailyLow, symbolConfigs[price.symbol]?.digit)}
                                                </CTableDataCell>
                                            </CTableRow>
                                        ))
                                    ) : (
                                        <CTableRow>
                                            <CTableDataCell colSpan={8} className="text-center py-4 text-muted">
                                                No symbols found matching your search
                                            </CTableDataCell>
                                        </CTableRow>
                                    )}
                                </CTableBody>
                            </CTable>
                        </div>

                        {/* Instrument Details */}
                        <div className="mb-4">
                            <div className="mb-2">
                                <span className="small text-muted">
                                    <CIcon icon={cilInfo} className="me-1" size="sm" />
                                    INSTRUMENT DETAILS - {symbol}
                                </span>
                            </div>
                            <CRow className="g-3">
                                <CCol md={3}>
                                    <div className="border rounded p-2">
                                        <div className="small text-muted">24h High/Low</div>
                                        <div className="d-flex justify-content-between">
                                            <span className="fw-semibold text-success">{formatPrice(currentSymbol.high, currentSymbol.digit)}</span>
                                            <span className="fw-semibold text-danger">{formatPrice(currentSymbol.low, currentSymbol.digit)}</span>
                                        </div>
                                    </div>
                                </CCol>
                                <CCol md={3}>
                                    <div className="border rounded p-2">
                                        <div className="small text-muted">24h Volume</div>
                                        <div className="fw-semibold text-info">{formatNumber(currentSymbol.volume)}</div>
                                    </div>
                                </CCol>
                                <CCol md={3}>
                                    <div className="border rounded p-2">
                                        <div className="small text-muted">Trend</div>
                                        <div className={`fw-semibold ${currentSymbol.trend === 'bullish' ? 'text-success' : currentSymbol.trend === 'bearish' ? 'text-danger' : 'text-warning'}`}>
                                            <CIcon icon={currentSymbol.trend === 'bullish' ? cilArrowTop : currentSymbol.trend === 'bearish' ? cilArrowBottom : cilMediaStop} className="me-1" />
                                            {currentSymbol.trend.toUpperCase()}
                                        </div>
                                    </div>
                                </CCol>
                                <CCol md={3}>
                                    <div className="border rounded p-2">
                                        <div className="small text-muted">Volatility</div>
                                        <div className={`fw-semibold ${currentSymbol.volatility === 'Low' ? 'text-success' : currentSymbol.volatility === 'Medium' ? 'text-warning' : 'text-danger'}`}>
                                            {currentSymbol.volatility}
                                        </div>
                                    </div>
                                </CCol>
                            </CRow>
                        </div>

                        {/* Calculation Tables Row */}
                        <CRow className="g-4 mb-4">
                            <CCol md={6}>
                                <div className="mb-2">
                                    <span className="small text-muted">MARGIN CALCULATION</span>
                                </div>
                                <div className="border rounded p-3">
                                    <CTable borderless size="sm" className="mb-0">
                                        <CTableBody>
                                            <CTableRow><CTableHeaderCell className="ps-0 small text-muted">Contract Size</CTableHeaderCell><CTableDataCell className="text-end fw-semibold small">{formatNumber(currentSymbol.contractSize)}</CTableDataCell></CTableRow>
                                            <CTableRow><CTableHeaderCell className="ps-0 small text-muted">Current Price (Mid)</CTableHeaderCell><CTableDataCell className="text-end fw-semibold small">{formatPrice((currentSymbol.bid + currentSymbol.ask) / 2, currentSymbol.digit)}</CTableDataCell></CTableRow>
                                            <CTableRow><CTableHeaderCell className="ps-0 small text-muted">Contract Value</CTableHeaderCell><CTableDataCell className="text-end fw-semibold small">{formatCurrency(contractValue)}</CTableDataCell></CTableRow>
                                            <CTableRow><CTableHeaderCell className="ps-0 small text-muted">Margin Required</CTableHeaderCell><CTableDataCell className="text-end fw-bold small text-warning">{formatCurrency(marginRequired)}</CTableDataCell></CTableRow>
                                            <CTableRow><CTableHeaderCell className="ps-0 small text-muted">Value per Pip</CTableHeaderCell><CTableDataCell className="text-end fw-semibold small text-info">{formatCurrency(pipValue)}</CTableDataCell></CTableRow>
                                            <CTableRow><CTableHeaderCell className="ps-0 small text-muted">Min / Max Lots</CTableHeaderCell><CTableDataCell className="text-end small">{currentSymbol.minLot} / {currentSymbol.maxLot}</CTableDataCell></CTableRow>
                                        </CTableBody>
                                    </CTable>
                                </div>
                            </CCol>
                            <CCol md={6}>
                                <div className="mb-2">
                                    <span className="small text-muted">ACCOUNT IMPACT</span>
                                </div>
                                <div className="border rounded p-3">
                                    <CTable borderless size="sm" className="mb-0">
                                        <CTableBody>
                                            <CTableRow><CTableHeaderCell className="ps-0 small text-muted">Free Margin</CTableHeaderCell><CTableDataCell className="text-end fw-semibold small text-success">{formatCurrency(accountData?.freeMargin || 0)}</CTableDataCell></CTableRow>
                                            <CTableRow><CTableHeaderCell className="ps-0 small text-muted">Margin After Trade</CTableHeaderCell><CTableDataCell className="text-end fw-semibold small">{(accountData?.freeMargin || 0) - marginRequired >= 0 ? formatCurrency((accountData?.freeMargin || 0) - marginRequired) : <span className="text-danger">{formatCurrency((accountData?.freeMargin || 0) - marginRequired)}</span>}</CTableDataCell></CTableRow>
                                            <CTableRow><CTableHeaderCell className="ps-0 small text-muted">Equity</CTableHeaderCell><CTableDataCell className="text-end fw-semibold small text-info">{formatCurrency(accountData?.equity || 0)}</CTableDataCell></CTableRow>
                                            <CTableRow><CTableHeaderCell className="ps-0 small text-muted">Current Margin Level</CTableHeaderCell><CTableDataCell className="text-end"><CBadge color={marginLevelStatus.color} className="px-2 py-1 small"><CIcon icon={marginLevelStatus.icon} size="sm" className="me-1" />{accountData?.marginLevel?.toFixed(1)}%</CBadge></CTableDataCell></CTableRow>
                                            <CTableRow><CTableHeaderCell className="ps-0 small text-muted">Margin Level After</CTableHeaderCell><CTableDataCell className="text-end"><CBadge color={marginLevelAfter > 300 ? 'success' : marginLevelAfter > 150 ? 'warning' : 'danger'} className="px-2 py-1 small">{marginLevelAfter}%</CBadge></CTableDataCell></CTableRow>
                                        </CTableBody>
                                    </CTable>
                                </div>
                            </CCol>
                        </CRow>

                        {/* Risk Metrics */}
                        <div className="mb-2">
                            <span className="small text-muted">
                                <CIcon icon={cilSpeedometer} className="me-1" size="sm" />
                                RISK METRICS
                            </span>
                        </div>
                        <CRow className="g-3">
                            <CCol md={3}>
                                <div className="border rounded p-2">
                                    <div className="small text-muted">Margin Usage</div>
                                    <div className="d-flex align-items-center">
                                        <div className="flex-grow-1 me-2"><CProgress height={4} value={(marginRequired / (accountData?.freeMargin || 1)) * 100} color={marginRequired > (accountData?.freeMargin || 0) ? 'danger' : marginRequired > (accountData?.freeMargin || 0) * 0.7 ? 'warning' : 'success'} /></div>
                                        <span className="small fw-semibold">{((marginRequired / (accountData?.freeMargin || 1)) * 100).toFixed(0)}%</span>
                                    </div>
                                </div>
                            </CCol>
                            <CCol md={3}>
                                <div className="border rounded p-2">
                                    <div className="small text-muted">Risk Level</div>
                                    <div className={`fw-semibold ${marginRequired > (accountData?.freeMargin || 0) ? 'text-danger' : marginRequired > (accountData?.freeMargin || 0) * 0.5 ? 'text-warning' : 'text-success'}`}>
                                        {marginRequired > (accountData?.freeMargin || 0) ? 'CRITICAL' : marginRequired > (accountData?.freeMargin || 0) * 0.5 ? 'HIGH' : 'LOW'}
                                    </div>
                                </div>
                            </CCol>
                            <CCol md={3}>
                                <div className="border rounded p-2">
                                    <div className="small text-muted">Est. Liquidation</div>
                                    <div className="fw-semibold text-danger">{formatPrice(currentSymbol.bid * 0.95, currentSymbol.digit)}</div>
                                </div>
                            </CCol>
                            <CCol md={3}>
                                <div className="border rounded p-2">
                                    <div className="small text-muted">Max Drawdown</div>
                                    <div className="fw-semibold text-danger">-{formatCurrency(marginRequired * 0.8)}</div>
                                </div>
                            </CCol>
                        </CRow>
                    </div>
                )}

                {activeTab === 'positions' && (
                    <div>
                        {/* Positions Summary */}
                        <CRow className="mb-4 g-3">
                            <CCol md={3}>
                                <div className="border rounded p-2">
                                    <div className="small text-muted">Total P&L</div>
                                    <div className={`fw-bold fs-5 ${totalOpenProfit >= 0 ? 'text-success' : 'text-danger'}`}>{totalOpenProfit >= 0 ? '+' : ''}{formatCurrency(totalOpenProfit)}</div>
                                </div>
                            </CCol>
                            <CCol md={3}>
                                <div className="border rounded p-2">
                                    <div className="small text-muted">Used Margin</div>
                                    <div className="fw-bold fs-5 text-warning">{formatCurrency(totalUsedMargin)}</div>
                                </div>
                            </CCol>
                            <CCol md={3}>
                                <div className="border rounded p-2">
                                    <div className="small text-muted">Total Swap</div>
                                    <div className={`fw-bold fs-5 ${totalSwap >= 0 ? 'text-success' : 'text-danger'}`}>{totalSwap >= 0 ? '+' : ''}{formatCurrency(totalSwap)}</div>
                                </div>
                            </CCol>
                            <CCol md={3}>
                                <div className="border rounded p-2">
                                    <div className="small text-muted">Win Rate</div>
                                    <div className="fw-bold fs-5 text-info">{(openPositions.filter(p => p.profit > 0).length / openPositions.length * 100).toFixed(0)}%</div>
                                </div>
                            </CCol>
                        </CRow>

                        {/* Positions Table */}
                        <CTable hover responsive className="mb-4 border">
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell className="small">Symbol</CTableHeaderCell>
                                    <CTableHeaderCell className="small">Type</CTableHeaderCell>
                                    <CTableHeaderCell className="small text-end">Lots</CTableHeaderCell>
                                    <CTableHeaderCell className="small text-end">Open</CTableHeaderCell>
                                    <CTableHeaderCell className="small text-end">Current</CTableHeaderCell>
                                    <CTableHeaderCell className="small text-end">P&L</CTableHeaderCell>
                                    <CTableHeaderCell className="small text-end">Pips</CTableHeaderCell>
                                    <CTableHeaderCell className="small text-end">Swap</CTableHeaderCell>
                                    <CTableHeaderCell className="small text-end">Margin</CTableHeaderCell>
                                    <CTableHeaderCell className="small text-end">Duration</CTableHeaderCell>
                                    <CTableHeaderCell className="small text-end">SL/TP</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {openPositions.map(pos => (
                                    <CTableRow key={pos.id}>
                                        <CTableDataCell className="fw-semibold">{pos.symbol}</CTableDataCell>
                                        <CTableDataCell>
                                            <CBadge color={pos.type === 'BUY' ? 'success' : 'danger'}>
                                                {pos.type === 'BUY' ? <CIcon icon={cilArrowTop} className="me-1" size="sm" /> : <CIcon icon={cilArrowBottom} className="me-1" size="sm" />}{pos.type}
                                            </CBadge>
                                        </CTableDataCell>
                                        <CTableDataCell className="text-end">{pos.lots.toFixed(2)}</CTableDataCell>
                                        <CTableDataCell className="text-end">{formatPrice(pos.openPrice, symbolConfigs[pos.symbol]?.digit)}</CTableDataCell>
                                        <CTableDataCell className="text-end">{formatPrice(pos.currentPrice, symbolConfigs[pos.symbol]?.digit)}</CTableDataCell>
                                        <CTableDataCell className={`text-end fw-semibold ${pos.profit >= 0 ? 'text-success' : 'text-danger'}`}>{pos.profit >= 0 ? '+' : ''}{formatCurrency(pos.profit)}</CTableDataCell>
                                        <CTableDataCell className={`text-end ${pos.profitPips >= 0 ? 'text-success' : 'text-danger'}`}>{pos.profitPips >= 0 ? '+' : ''}{pos.profitPips}</CTableDataCell>
                                        <CTableDataCell className={`text-end ${pos.swap >= 0 ? 'text-success' : 'text-danger'}`}>{formatCurrency(pos.swap)}</CTableDataCell>
                                        <CTableDataCell className="text-end text-warning">{formatCurrency(pos.margin)}</CTableDataCell>
                                        <CTableDataCell className="text-end text-muted">{pos.duration}</CTableDataCell>
                                        <CTableDataCell className="text-end">
                                            <span className="small text-danger">{formatPrice(pos.stopLoss, symbolConfigs[pos.symbol]?.digit)}</span>
                                            <span className="mx-1 text-muted">/</span>
                                            <span className="small text-success">{formatPrice(pos.takeProfit, symbolConfigs[pos.symbol]?.digit)}</span>
                                        </CTableDataCell>
                                    </CTableRow>
                                ))}
                            </CTableBody>
                        </CTable>

                        {/* Positions Analysis */}
                        <div className="mb-2">
                            <span className="small text-muted">
                                <CIcon icon={cilBarChart} className="me-1" size="sm" />
                                POSITIONS ANALYSIS
                            </span>
                        </div>
                        <CRow className="g-3">
                            <CCol md={3}>
                                <div className="border rounded p-2">
                                    <div className="small text-muted">Best Trade</div>
                                    <div className="fw-semibold text-success">+{formatCurrency(Math.max(...openPositions.map(p => p.profit)))}</div>
                                    <div className="small text-muted">{openPositions.find(p => p.profit === Math.max(...openPositions.map(p => p.profit)))?.symbol}</div>
                                </div>
                            </CCol>
                            <CCol md={3}>
                                <div className="border rounded p-2">
                                    <div className="small text-muted">Worst Trade</div>
                                    <div className="fw-semibold text-danger">{formatCurrency(Math.min(...openPositions.map(p => p.profit)))}</div>
                                    <div className="small text-muted">{openPositions.find(p => p.profit === Math.min(...openPositions.map(p => p.profit)))?.symbol}</div>
                                </div>
                            </CCol>
                            <CCol md={3}>
                                <div className="border rounded p-2">
                                    <div className="small text-muted">Avg Position Size</div>
                                    <div className="fw-semibold">{(openPositions.reduce((sum, p) => sum + p.lots, 0) / openPositions.length).toFixed(2)} lots</div>
                                </div>
                            </CCol>
                            <CCol md={3}>
                                <div className="border rounded p-2">
                                    <div className="small text-muted">Long/Short Ratio</div>
                                    <div className="d-flex align-items-center">
                                        <span className="fw-semibold text-success">{openPositions.filter(p => p.type === 'BUY').length}</span>
                                        <span className="mx-1 text-muted">/</span>
                                        <span className="fw-semibold text-danger">{openPositions.filter(p => p.type === 'SELL').length}</span>
                                    </div>
                                </div>
                            </CCol>
                        </CRow>

                        {/* Account Summary */}
                        <div className="mt-4">
                            <div className="mb-2">
                                <span className="small text-muted">
                                    <CIcon icon={cilWallet} className="me-1" size="sm" />
                                    ACCOUNT SUMMARY
                                </span>
                            </div>
                            <CRow className="g-3">
                                <CCol md={3}>
                                    <div className="border rounded p-2">
                                        <div className="small text-muted">Balance</div>
                                        <div className="fw-semibold">{formatCurrency(accountData?.balance || 0)}</div>
                                    </div>
                                </CCol>
                                <CCol md={3}>
                                    <div className="border rounded p-2">
                                        <div className="small text-muted">Equity</div>
                                        <div className="fw-semibold text-info">{formatCurrency(accountData?.equity || 0)}</div>
                                    </div>
                                </CCol>
                                <CCol md={3}>
                                    <div className="border rounded p-2">
                                        <div className="small text-muted">Free Margin</div>
                                        <div className="fw-semibold text-success">{formatCurrency(accountData?.freeMargin || 0)}</div>
                                    </div>
                                </CCol>
                                <CCol md={3}>
                                    <div className="border rounded p-2">
                                        <div className="small text-muted">Margin Level</div>
                                        <div className="fw-semibold" style={{ color: marginLevelStatus.color === 'success' ? '#28a745' : marginLevelStatus.color === 'warning' ? '#ffc107' : '#dc3545' }}>{accountData?.marginLevel?.toFixed(1)}%</div>
                                    </div>
                                </CCol>
                            </CRow>
                        </div>
                    </div>
                )}

                {activeTab === 'history' && (
                    <div>
                        {/* History Summary */}
                        <CRow className="mb-4 g-3">
                            <CCol md={2}>
                                <div className="border rounded p-2">
                                    <div className="small text-muted">Total Trades</div>
                                    <div className="fw-bold fs-5">{orderHistory.length}</div>
                                </div>
                            </CCol>
                            <CCol md={2}>
                                <div className="border rounded p-2">
                                    <div className="small text-muted">Net Profit</div>
                                    <div className="fw-bold fs-5 text-success">+{formatCurrency(totalHistoryProfit)}</div>
                                </div>
                            </CCol>
                            <CCol md={2}>
                                <div className="border rounded p-2">
                                    <div className="small text-muted">Commission</div>
                                    <div className="fw-bold fs-5 text-danger">-{formatCurrency(totalCommission)}</div>
                                </div>
                            </CCol>
                            <CCol md={2}>
                                <div className="border rounded p-2">
                                    <div className="small text-muted">Total Swap</div>
                                    <div className={`fw-bold fs-5 ${totalHistorySwap >= 0 ? 'text-success' : 'text-danger'}`}>{totalHistorySwap >= 0 ? '+' : ''}{formatCurrency(totalHistorySwap)}</div>
                                </div>
                            </CCol>
                            <CCol md={2}>
                                <div className="border rounded p-2">
                                    <div className="small text-muted">Avg Duration</div>
                                    <div className="fw-bold fs-5 text-info">{avgTradeDuration.toFixed(1)}h</div>
                                </div>
                            </CCol>
                            <CCol md={2}>
                                <div className="border rounded p-2">
                                    <div className="small text-muted">Win Rate</div>
                                    <div className="fw-bold fs-5 text-success">{winRate}%</div>
                                </div>
                            </CCol>
                        </CRow>

                        {/* History Table */}
                        <CTable hover responsive className="mb-4 border">
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell className="small">Symbol</CTableHeaderCell>
                                    <CTableHeaderCell className="small">Type</CTableHeaderCell>
                                    <CTableHeaderCell className="small text-end">Lots</CTableHeaderCell>
                                    <CTableHeaderCell className="small text-end">Open</CTableHeaderCell>
                                    <CTableHeaderCell className="small text-end">Close</CTableHeaderCell>
                                    <CTableHeaderCell className="small text-end">Profit</CTableHeaderCell>
                                    <CTableHeaderCell className="small text-end">Pips</CTableHeaderCell>
                                    <CTableHeaderCell className="small text-end">Commission</CTableHeaderCell>
                                    <CTableHeaderCell className="small text-end">Swap</CTableHeaderCell>
                                    <CTableHeaderCell className="small">Close Time</CTableHeaderCell>
                                    <CTableHeaderCell className="small">Duration</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {orderHistory.map(order => (
                                    <CTableRow key={order.id}>
                                        <CTableDataCell className="fw-semibold">{order.symbol}</CTableDataCell>
                                        <CTableDataCell>
                                            <CBadge color={order.type === 'BUY' ? 'success' : 'danger'}>{order.type}</CBadge>
                                        </CTableDataCell>
                                        <CTableDataCell className="text-end">{order.lots.toFixed(2)}</CTableDataCell>
                                        <CTableDataCell className="text-end">{formatPrice(order.openPrice, symbolConfigs[order.symbol]?.digit)}</CTableDataCell>
                                        <CTableDataCell className="text-end">{formatPrice(order.closePrice, symbolConfigs[order.symbol]?.digit)}</CTableDataCell>
                                        <CTableDataCell className="text-end fw-semibold text-success">+{formatCurrency(order.profit)}</CTableDataCell>
                                        <CTableDataCell className="text-end text-success">+{order.profitPips}</CTableDataCell>
                                        <CTableDataCell className="text-end text-danger">-{formatCurrency(order.commission)}</CTableDataCell>
                                        <CTableDataCell className={`text-end ${order.swap >= 0 ? 'text-success' : 'text-danger'}`}>{order.swap >= 0 ? '+' : ''}{formatCurrency(order.swap)}</CTableDataCell>
                                        <CTableDataCell className="text-muted">{order.closeTime}</CTableDataCell>
                                        <CTableDataCell className="text-muted">{order.duration}</CTableDataCell>
                                    </CTableRow>
                                ))}
                            </CTableBody>
                        </CTable>

                        {/* Trading Analytics */}
                        <div className="mb-2">
                            <span className="small text-muted">
                                <CIcon icon={cilEqualizer} className="me-1" size="sm" />
                                TRADING ANALYTICS
                            </span>
                        </div>
                        <CRow className="g-3">
                            <CCol md={3}>
                                <div className="border rounded p-2">
                                    <div className="small text-muted">Win Rate</div>
                                    <div className="fw-semibold text-success">{winRate}%</div>
                                </div>
                            </CCol>
                            <CCol md={3}>
                                <div className="border rounded p-2">
                                    <div className="small text-muted">Avg Win</div>
                                    <div className="fw-semibold text-success">+{formatCurrency(avgWin)}</div>
                                </div>
                            </CCol>
                            <CCol md={3}>
                                <div className="border rounded p-2">
                                    <div className="small text-muted">Avg Loss</div>
                                    <div className="fw-semibold text-danger">{formatCurrency(avgLoss)}</div>
                                </div>
                            </CCol>
                            <CCol md={3}>
                                <div className="border rounded p-2">
                                    <div className="small text-muted">Profit Factor</div>
                                    <div className="fw-semibold text-info">{profitFactor}</div>
                                </div>
                            </CCol>
                        </CRow>
                    </div>
                )}
            </CCardBody>

            {/* REPORTS SECTION - Below the tab container */}
            <div className="border-top mt-2">
                {/* Reports Header with Timeframe Selector */}
                <div className="d-flex justify-content-between align-items-center p-3">
                    <div className="d-flex align-items-center">
                        <CIcon icon={cilBarChart} className="me-2 text-warning" size="lg" />
                        <span className="fw-bold">TRADING REPORTS & ANALYTICS</span>
                    </div>
                    <div className="d-flex gap-2">
                        <CButton
                            size="sm"
                            color={reportTimeframe === 'daily' ? 'primary' : 'secondary'}
                            variant={reportTimeframe === 'daily' ? undefined : 'outline'}
                            onClick={() => setReportTimeframe('daily')}
                        >
                            Daily
                        </CButton>
                        <CButton
                            size="sm"
                            color={reportTimeframe === 'weekly' ? 'primary' : 'secondary'}
                            variant={reportTimeframe === 'weekly' ? undefined : 'outline'}
                            onClick={() => setReportTimeframe('weekly')}
                        >
                            Weekly
                        </CButton>
                        <CButton
                            size="sm"
                            color={reportTimeframe === 'monthly' ? 'primary' : 'secondary'}
                            variant={reportTimeframe === 'monthly' ? undefined : 'outline'}
                            onClick={() => setReportTimeframe('monthly')}
                        >
                            Monthly
                        </CButton>
                    </div>
                </div>

                {/* Report Tables */}
                <CRow className="g-0">
                    {/* Left Column - P&L Reports */}
                    <CCol md={6} className="border-end">
                        <div className="p-3">
                            <h6 className="small text-muted mb-3">
                                <CIcon icon={cilChartPie} className="me-1" /> PROFIT & LOSS SUMMARY
                            </h6>

                            {/* P&L Table based on timeframe */}
                            {reportTimeframe === 'daily' && (
                                <CTable hover responsive size="sm" className="mb-0 border">
                                    <CTableHead>
                                        <CTableRow>
                                            <CTableHeaderCell className="small">Date</CTableHeaderCell>
                                            <CTableHeaderCell className="small text-end">Trades</CTableHeaderCell>
                                            <CTableHeaderCell className="small text-end">Profit</CTableHeaderCell>
                                            <CTableHeaderCell className="small text-end">Loss</CTableHeaderCell>
                                            <CTableHeaderCell className="small text-end">Net</CTableHeaderCell>
                                            <CTableHeaderCell className="small text-end">Volume</CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        {dailyPnL.map((day, index) => (
                                            <CTableRow key={index}>
                                                <CTableDataCell className="fw-semibold">{formatDate(day.date)}</CTableDataCell>
                                                <CTableDataCell className="text-end">{day.trades}</CTableDataCell>
                                                <CTableDataCell className="text-end text-success">+{formatCurrency(day.profit)}</CTableDataCell>
                                                <CTableDataCell className="text-end text-danger">-{formatCurrency(day.loss)}</CTableDataCell>
                                                <CTableDataCell className={`text-end fw-semibold ${day.net >= 0 ? 'text-success' : 'text-danger'}`}>
                                                    {day.net >= 0 ? '+' : ''}{formatCurrency(day.net)}
                                                </CTableDataCell>
                                                <CTableDataCell className="text-end text-info">{day.volume}</CTableDataCell>
                                            </CTableRow>
                                        ))}
                                    </CTableBody>
                                </CTable>
                            )}

                            {reportTimeframe === 'weekly' && (
                                <CTable hover responsive size="sm" className="mb-0 border">
                                    <CTableHead>
                                        <CTableRow>
                                            <CTableHeaderCell className="small">Week</CTableHeaderCell>
                                            <CTableHeaderCell className="small text-end">Trades</CTableHeaderCell>
                                            <CTableHeaderCell className="small text-end">Profit</CTableHeaderCell>
                                            <CTableHeaderCell className="small text-end">Loss</CTableHeaderCell>
                                            <CTableHeaderCell className="small text-end">Net</CTableHeaderCell>
                                            <CTableHeaderCell className="small text-end">Volume</CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        {weeklyPnL.map((week, index) => (
                                            <CTableRow key={index}>
                                                <CTableDataCell className="fw-semibold">{week.week}</CTableDataCell>
                                                <CTableDataCell className="text-end">{week.trades}</CTableDataCell>
                                                <CTableDataCell className="text-end text-success">+{formatCurrency(week.profit)}</CTableDataCell>
                                                <CTableDataCell className="text-end text-danger">-{formatCurrency(week.loss)}</CTableDataCell>
                                                <CTableDataCell className={`text-end fw-semibold ${week.net >= 0 ? 'text-success' : 'text-danger'}`}>
                                                    {week.net >= 0 ? '+' : ''}{formatCurrency(week.net)}
                                                </CTableDataCell>
                                                <CTableDataCell className="text-end text-info">{week.volume}</CTableDataCell>
                                            </CTableRow>
                                        ))}
                                    </CTableBody>
                                </CTable>
                            )}

                            {reportTimeframe === 'monthly' && (
                                <CTable hover responsive size="sm" className="mb-0 border">
                                    <CTableHead>
                                        <CTableRow>
                                            <CTableHeaderCell className="small">Month</CTableHeaderCell>
                                            <CTableHeaderCell className="small text-end">Trades</CTableHeaderCell>
                                            <CTableHeaderCell className="small text-end">Profit</CTableHeaderCell>
                                            <CTableHeaderCell className="small text-end">Loss</CTableHeaderCell>
                                            <CTableHeaderCell className="small text-end">Net</CTableHeaderCell>
                                            <CTableHeaderCell className="small text-end">Volume</CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        {monthlyPnL.map((month, index) => (
                                            <CTableRow key={index}>
                                                <CTableDataCell className="fw-semibold">{month.month}</CTableDataCell>
                                                <CTableDataCell className="text-end">{month.trades}</CTableDataCell>
                                                <CTableDataCell className="text-end text-success">+{formatCurrency(month.profit)}</CTableDataCell>
                                                <CTableDataCell className="text-end text-danger">-{formatCurrency(month.loss)}</CTableDataCell>
                                                <CTableDataCell className={`text-end fw-semibold ${month.net >= 0 ? 'text-success' : 'text-danger'}`}>
                                                    {month.net >= 0 ? '+' : ''}{formatCurrency(month.net)}
                                                </CTableDataCell>
                                                <CTableDataCell className="text-end text-info">{month.volume}</CTableDataCell>
                                            </CTableRow>
                                        ))}
                                    </CTableBody>
                                </CTable>
                            )}
                        </div>
                    </CCol>

                    {/* Right Column - Symbol Performance */}
                    <CCol md={6}>
                        <div className="p-3">
                            <h6 className="small text-muted mb-3">
                                <CIcon icon={cilBarChart} className="me-1" /> SYMBOL PERFORMANCE
                            </h6>
                            <CTable hover responsive size="sm" className="mb-0 border">
                                <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell className="small">Symbol</CTableHeaderCell>
                                        <CTableHeaderCell className="small text-end">Trades</CTableHeaderCell>
                                        <CTableHeaderCell className="small text-end">Profit</CTableHeaderCell>
                                        <CTableHeaderCell className="small text-end">Win Rate</CTableHeaderCell>
                                        <CTableHeaderCell className="small text-end">Avg Win</CTableHeaderCell>
                                        <CTableHeaderCell className="small text-end">Avg Loss</CTableHeaderCell>
                                        <CTableHeaderCell className="small text-end">Lots</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {symbolPerformance.map((sym, index) => (
                                        <CTableRow key={index}>
                                            <CTableDataCell className="fw-semibold">{sym.symbol}</CTableDataCell>
                                            <CTableDataCell className="text-end">{sym.trades}</CTableDataCell>
                                            <CTableDataCell className={`text-end fw-semibold ${sym.profit >= 0 ? 'text-success' : 'text-danger'}`}>
                                                {sym.profit >= 0 ? '+' : ''}{formatCurrency(sym.profit)}
                                            </CTableDataCell>
                                            <CTableDataCell className="text-end text-info">{sym.winRate}%</CTableDataCell>
                                            <CTableDataCell className="text-end text-success">+{formatCurrency(sym.avgProfit)}</CTableDataCell>
                                            <CTableDataCell className="text-end text-danger">{formatCurrency(sym.avgLoss)}</CTableDataCell>
                                            <CTableDataCell className="text-end">{sym.lots}</CTableDataCell>
                                        </CTableRow>
                                    ))}
                                </CTableBody>
                            </CTable>
                        </div>
                    </CCol>
                </CRow>

                {/* Second Row - Time Performance */}
                <CRow className="g-0 border-top">
                    <CCol md={6} className="border-end">
                        <div className="p-3">
                            <h6 className="small text-muted mb-3">
                                <CIcon icon={cilClock} className="me-1" /> PERFORMANCE BY TIME OF DAY
                            </h6>
                            <CTable hover responsive size="sm" className="mb-0 border">
                                <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell className="small">Time Session</CTableHeaderCell>
                                        <CTableHeaderCell className="small text-end">Trades</CTableHeaderCell>
                                        <CTableHeaderCell className="small text-end">Profit</CTableHeaderCell>
                                        <CTableHeaderCell className="small text-end">Win Rate</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {timePerformance.map((time, index) => (
                                        <CTableRow key={index}>
                                            <CTableDataCell className="fw-semibold">{time.hour}</CTableDataCell>
                                            <CTableDataCell className="text-end">{time.trades}</CTableDataCell>
                                            <CTableDataCell className="text-end text-success">+{formatCurrency(time.profit)}</CTableDataCell>
                                            <CTableDataCell className="text-end text-info">{time.winRate}%</CTableDataCell>
                                        </CTableRow>
                                    ))}
                                </CTableBody>
                            </CTable>
                        </div>
                    </CCol>

                    {/* Trade Statistics Summary */}
                    <CCol md={6}>
                        <div className="p-3">
                            <h6 className="small text-muted mb-3">
                                <CIcon icon={cilBarChart} className="me-1" /> TRADE STATISTICS
                            </h6>
                            <CRow className="g-3">
                                <CCol xs={6}>
                                    <div className="border rounded p-2">
                                        <div className="small text-muted">Total Trades</div>
                                        <div className="fw-bold fs-5">{totalTrades}</div>
                                    </div>
                                </CCol>
                                <CCol xs={6}>
                                    <div className="border rounded p-2">
                                        <div className="small text-muted">Winning Trades</div>
                                        <div className="fw-bold fs-5 text-success">{winningTrades}</div>
                                    </div>
                                </CCol>
                                <CCol xs={6}>
                                    <div className="border rounded p-2">
                                        <div className="small text-muted">Losing Trades</div>
                                        <div className="fw-bold fs-5 text-danger">{losingTrades}</div>
                                    </div>
                                </CCol>
                                <CCol xs={6}>
                                    <div className="border rounded p-2">
                                        <div className="small text-muted">Win Rate</div>
                                        <div className="fw-bold fs-5 text-info">{winRate}%</div>
                                    </div>
                                </CCol>
                                <CCol xs={6}>
                                    <div className="border rounded p-2">
                                        <div className="small text-muted">Avg Win</div>
                                        <div className="fw-bold fs-5 text-success">+{formatCurrency(avgWin)}</div>
                                    </div>
                                </CCol>
                                <CCol xs={6}>
                                    <div className="border rounded p-2">
                                        <div className="small text-muted">Avg Loss</div>
                                        <div className="fw-bold fs-5 text-danger">{formatCurrency(avgLoss)}</div>
                                    </div>
                                </CCol>
                                <CCol xs={6}>
                                    <div className="border rounded p-2">
                                        <div className="small text-muted">Profit Factor</div>
                                        <div className="fw-bold fs-5 text-info">{profitFactor}</div>
                                    </div>
                                </CCol>
                                <CCol xs={6}>
                                    <div className="border rounded p-2">
                                        <div className="small text-muted">Total Volume</div>
                                        <div className="fw-bold fs-5">{orderHistory.reduce((sum, o) => sum + o.lots, 0).toFixed(1)} lots</div>
                                    </div>
                                </CCol>
                            </CRow>
                        </div>
                    </CCol>
                </CRow>
            </div>

            {/* Summary Footer */}
            <CCardFooter className="d-flex justify-content-between align-items-center small text-muted">
                <div className="d-flex align-items-center">
                    <CIcon icon={cilInfo} className="me-2" />
                    All-time performance summary
                </div>
                <div className="d-flex gap-3">
                    <span>Net Profit: <span className="fw-semibold text-success">+{formatCurrency(totalHistoryProfit)}</span></span>
                    <span>Commission: <span className="fw-semibold text-danger">-{formatCurrency(totalCommission)}</span></span>
                    <span>Volume: <span className="fw-semibold">{orderHistory.reduce((sum, o) => sum + o.lots, 0).toFixed(1)} lots</span></span>
                    <span>Best Day: <span className="fw-semibold text-success">+{formatCurrency(Math.max(...dailyPnL.map(d => d.net)))}</span></span>
                </div>
            </CCardFooter>
        </CCard>
    )
}

export default OrderPanel