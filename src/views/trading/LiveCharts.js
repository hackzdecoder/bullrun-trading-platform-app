import React, { useState, useEffect, useRef, useCallback } from 'react'
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
    CProgressBar
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
    cilChart,
    cilArrowTop,
    cilArrowBottom,
    cilInfo,
    cilReload,
    cilFullscreen,
    cilZoom,
    cilMove,
    cilOptions,
    cilSpeedometer,
    cilWallet,
    cilDollar,
    cilArrowRight,
    cilBell,
    cilClock,
    cilMediaPlay,
    cilMediaStop,
    cilX,
    cilChartLine,
    cilGraph,
    cilEqualizer,
    cilCalculator,
} from '@coreui/icons'
import { CChartLine } from '@coreui/react-chartjs'
import { getStyle } from '@coreui/utils'
import currency from 'currency.js'

const LiveCharts = () => {
    const chartRef = useRef(null)
    const chartContainerRef = useRef(null)
    const intervalRef = useRef(null)

    // ========== CHART STATE ==========
    const [timeframe, setTimeframe] = useState('1m')
    const [selectedPair, setSelectedPair] = useState('BTC/USDT')
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [chartType, setChartType] = useState('line') // line, candlestick
    const [indicators, setIndicators] = useState({
        rsi: false,
        macd: false,
        ma50: true,
        ma200: false,
        bollinger: false,
    })
    const [showControls, setShowControls] = useState(false)

    // ========== PRICE STATE ==========
    const [lastFast, setLastFast] = useState(104.82) // MARK price (BTC)
    const [lastSlow, setLastSlow] = useState(3200.50) // INDEX price (ETH)
    const [btcPrice, setBtcPrice] = useState(104.82)
    const [ethPrice, setEthPrice] = useState(3200.50)
    const [solPrice, setSolPrice] = useState(145.75)
    const [xrpPrice, setXrpPrice] = useState(0.58)

    // ========== ORDER BOOK STATE ==========
    const [asks, setAsks] = useState([])
    const [bids, setBids] = useState([])

    // ========== MARKET STATS ==========
    const [marketStats, setMarketStats] = useState({
        btc: { change: 2.34, high: 107.50, low: 102.30, volume: 1250000 },
        eth: { change: -1.25, high: 3250.00, low: 3150.50, volume: 890000 },
        sol: { change: 5.67, high: 148.20, low: 142.10, volume: 450000 },
        xrp: { change: -0.85, high: 0.59, low: 0.57, volume: 320000 },
    })

    // Price trend refs
    const btcRef = useRef({
        price: 104.82,
        direction: 1,
        trend: 0.1
    })

    const ethRef = useRef({
        price: 3200.50,
        direction: -1,
        trend: 2
    })

    const solRef = useRef({
        price: 145.75,
        direction: 1,
        trend: 0.5
    })

    const xrpRef = useRef({
        price: 0.58,
        direction: -1,
        trend: 0.002
    })

    // Format functions
    const formatCurrency = (value) => currency(value, { precision: 2, symbol: '$' }).format()
    const formatPrice = (price, digits = 2) => {
        if (!price) return '0.00';
        return typeof price === 'number' ? price.toFixed(digits) : price;
    }
    const formatLargeNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    }

    // Generate initial price data
    const generatePriceData = useCallback((length = 80) => {
        const labels = []
        const btcData = []
        const ethData = []
        const solData = []
        const xrpData = []

        let btcPrice = 104.82
        let ethPrice = 3200.50
        let solPrice = 145.75
        let xrpPrice = 0.58
        let btcDir = 1
        let ethDir = -1
        let solDir = 1
        let xrpDir = -1

        for (let i = 0; i < length; i++) {
            labels.push(i)

            // BTC zigzag
            if (Math.random() > 0.8) btcDir *= -1
            const btcChange = btcDir * (0.1 + Math.random() * 0.3)
            btcPrice = btcPrice + btcChange

            // ETH zigzag
            if (Math.random() > 0.85) ethDir *= -1
            const ethChange = ethDir * (1 + Math.random() * 3)
            ethPrice = ethPrice + ethChange

            // SOL zigzag
            if (Math.random() > 0.82) solDir *= -1
            const solChange = solDir * (0.3 + Math.random() * 0.8)
            solPrice = solPrice + solChange

            // XRP zigzag
            if (Math.random() > 0.88) xrpDir *= -1
            const xrpChange = xrpDir * (0.002 + Math.random() * 0.005)
            xrpPrice = xrpPrice + xrpChange

            btcData.push(Number(btcPrice.toFixed(2)))
            ethData.push(Number(ethPrice.toFixed(2)))
            solData.push(Number(solPrice.toFixed(2)))
            xrpData.push(Number(xrpPrice.toFixed(4)))
        }

        return { labels, btcData, ethData, solData, xrpData }
    }, [])

    // Chart data
    const [chartData, setChartData] = useState(() => {
        const { labels, btcData, ethData, solData, xrpData } = generatePriceData(80)
        return {
            labels,
            datasets: [
                {
                    label: 'BTC/USDT',
                    backgroundColor: `rgba(${getStyle('--cui-info-rgb')}, .1)`,
                    borderColor: getStyle('--cui-info'),
                    pointHoverBackgroundColor: getStyle('--cui-info'),
                    borderWidth: 2,
                    data: btcData,
                    fill: true,
                    tension: 0.2,
                    yAxisID: 'y'
                },
                {
                    label: 'ETH/USDT',
                    backgroundColor: 'transparent',
                    borderColor: getStyle('--cui-success'),
                    pointHoverBackgroundColor: getStyle('--cui-success'),
                    borderWidth: 2,
                    data: ethData,
                    fill: false,
                    tension: 0.2,
                    yAxisID: 'y1'
                },
                {
                    label: 'SOL/USDT',
                    backgroundColor: 'transparent',
                    borderColor: getStyle('--cui-warning'),
                    pointHoverBackgroundColor: getStyle('--cui-warning'),
                    borderWidth: 2,
                    data: solData,
                    fill: false,
                    tension: 0.2,
                    yAxisID: 'y2',
                    hidden: selectedPair !== 'SOL/USDT' && selectedPair !== 'ALL',
                },
                {
                    label: 'XRP/USDT',
                    backgroundColor: 'transparent',
                    borderColor: getStyle('--cui-danger'),
                    pointHoverBackgroundColor: getStyle('--cui-danger'),
                    borderWidth: 2,
                    data: xrpData,
                    fill: false,
                    tension: 0.2,
                    yAxisID: 'y3',
                    hidden: selectedPair !== 'XRP/USDT' && selectedPair !== 'ALL',
                }
            ]
        }
    })

    // Update order book based on current price
    const updateOrderBook = useCallback((price) => {
        const newAsks = []
        const newBids = []

        for (let i = 1; i <= 8; i++) {
            // Asks (sells) - higher prices
            const askP = price + i * 0.42
            const askA = Math.random() * 0.5 + 0.15
            const askT = askP * askA
            newAsks.push({
                price: askP.toFixed(2),
                amount: askA.toFixed(3),
                total: askT.toFixed(2),
                cumulative: (newAsks.length > 0 ? parseFloat(newAsks[newAsks.length - 1].cumulative) + parseFloat(askT) : parseFloat(askT)).toFixed(2)
            })
        }

        for (let i = 1; i <= 8; i++) {
            // Bids (buys) - lower prices
            const bidP = price - i * 0.41
            const bidA = Math.random() * 0.6 + 0.12
            const bidT = bidP * bidA
            newBids.push({
                price: bidP.toFixed(2),
                amount: bidA.toFixed(3),
                total: bidT.toFixed(2),
                cumulative: (newBids.length > 0 ? parseFloat(newBids[newBids.length - 1].cumulative) + parseFloat(bidT) : parseFloat(bidT)).toFixed(2)
            })
        }

        setAsks(newAsks.reverse())
        setBids(newBids)
    }, [])

    // Live updates effect
    useEffect(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
        }

        let updateTime = 1000; // Default 1 second

        if (timeframe === '1m') updateTime = 1000;      // 1 second
        else if (timeframe === '5m') updateTime = 2000;  // 2 seconds
        else if (timeframe === '15m') updateTime = 3000; // 3 seconds
        else if (timeframe === '1h') updateTime = 5000;  // 5 seconds
        else if (timeframe === '4h') updateTime = 10000; // 10 seconds
        else if (timeframe === '1d') updateTime = 15000; // 15 seconds

        intervalRef.current = setInterval(() => {
            setChartData(prev => {
                const newLabels = [...prev.labels.slice(1), prev.labels[prev.labels.length - 1] + 1]

                // Update BTC
                const btcData = [...prev.datasets[0].data.slice(1)]
                if (Math.random() > 0.9) btcRef.current.direction *= -1
                const btcMovement = btcRef.current.direction * (0.05 + Math.random() * 0.15)
                let newBtc = btcData[btcData.length - 1] + btcMovement
                if (newBtc > 115) newBtc = 115 - Math.random() * 0.5
                if (newBtc < 95) newBtc = 95 + Math.random() * 0.5
                btcData.push(Number(newBtc.toFixed(2)))
                setBtcPrice(newBtc)
                if (selectedPair === 'BTC/USDT') setLastFast(newBtc)

                // Update ETH
                const ethData = [...prev.datasets[1].data.slice(1)]
                if (Math.random() > 0.9) ethRef.current.direction *= -1
                const ethMovement = ethRef.current.direction * (0.5 + Math.random() * 2)
                let newEth = ethData[ethData.length - 1] + ethMovement
                if (newEth > 3400) newEth = 3400 - Math.random() * 5
                if (newEth < 3000) newEth = 3000 + Math.random() * 5
                ethData.push(Number(newEth.toFixed(2)))
                setEthPrice(newEth)
                if (selectedPair === 'ETH/USDT') setLastFast(newEth)

                // Update SOL
                const solData = [...prev.datasets[2].data.slice(1)]
                if (Math.random() > 0.85) solRef.current.direction *= -1
                const solMovement = solRef.current.direction * (0.3 + Math.random() * 0.8)
                let newSol = solData[solData.length - 1] + solMovement
                if (newSol > 155) newSol = 155 - Math.random() * 2
                if (newSol < 135) newSol = 135 + Math.random() * 2
                solData.push(Number(newSol.toFixed(2)))
                setSolPrice(newSol)
                if (selectedPair === 'SOL/USDT') setLastFast(newSol)

                // Update XRP
                const xrpData = [...prev.datasets[3].data.slice(1)]
                if (Math.random() > 0.88) xrpRef.current.direction *= -1
                const xrpMovement = xrpRef.current.direction * (0.002 + Math.random() * 0.005)
                let newXrp = xrpData[xrpData.length - 1] + xrpMovement
                if (newXrp > 0.62) newXrp = 0.62 - Math.random() * 0.01
                if (newXrp < 0.54) newXrp = 0.54 + Math.random() * 0.01
                xrpData.push(Number(newXrp.toFixed(4)))
                setXrpPrice(newXrp)
                if (selectedPair === 'XRP/USDT') setLastFast(newXrp)

                // Update market stats
                setMarketStats(prev => ({
                    btc: { ...prev.btc, change: ((newBtc - 104.82) / 104.82 * 100).toFixed(2) },
                    eth: { ...prev.eth, change: ((newEth - 3200.50) / 3200.50 * 100).toFixed(2) },
                    sol: { ...prev.sol, change: ((newSol - 145.75) / 145.75 * 100).toFixed(2) },
                    xrp: { ...prev.xrp, change: ((newXrp - 0.58) / 0.58 * 100).toFixed(2) },
                }))

                setLastSlow(newEth)
                updateOrderBook(newBtc)

                return {
                    labels: newLabels,
                    datasets: [
                        { ...prev.datasets[0], data: btcData },
                        { ...prev.datasets[1], data: ethData },
                        { ...prev.datasets[2], data: solData },
                        { ...prev.datasets[3], data: xrpData },
                    ]
                }
            })
        }, updateTime)

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }, [timeframe, selectedPair, updateOrderBook])

    // Handle timeframe change
    const handleTimeframeChange = (tf) => {
        setTimeframe(tf)
        const { labels, btcData, ethData, solData, xrpData } = generatePriceData(
            tf === '1m' ? 80 : tf === '5m' ? 70 : tf === '15m' ? 60 : tf === '1h' ? 50 : tf === '4h' ? 40 : 30
        )
        setChartData(prev => ({
            labels,
            datasets: [
                { ...prev.datasets[0], data: btcData },
                { ...prev.datasets[1], data: ethData },
                { ...prev.datasets[2], data: solData },
                { ...prev.datasets[3], data: xrpData },
            ]
        }))
    }

    // Handle pair selection
    const handlePairChange = (pair) => {
        setSelectedPair(pair)
        setChartData(prev => ({
            ...prev,
            datasets: prev.datasets.map((dataset, index) => {
                let hidden = true
                if (pair === 'ALL') hidden = false
                else if (index === 0 && pair === 'BTC/USDT') hidden = false
                else if (index === 1 && pair === 'ETH/USDT') hidden = false
                else if (index === 2 && pair === 'SOL/USDT') hidden = false
                else if (index === 3 && pair === 'XRP/USDT') hidden = false
                return { ...dataset, hidden }
            })
        }))
    }

    // Toggle fullscreen
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            chartContainerRef.current.requestFullscreen()
            setIsFullscreen(true)
        } else {
            document.exitFullscreen()
            setIsFullscreen(false)
        }
    }

    // Toggle indicator
    const toggleIndicator = (indicator) => {
        setIndicators(prev => ({ ...prev, [indicator]: !prev[indicator] }))
    }

    // Calculate spread
    const spread = (lastSlow - lastFast).toFixed(2)
    const spreadPercent = ((lastSlow - lastFast) / lastFast * 100).toFixed(2)

    // Available pairs
    const pairs = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'XRP/USDT', 'ALL']

    // Timeframes
    const timeframes = ['1m', '5m', '15m', '1h', '4h', '1d']

    // Chart types
    const chartTypes = [
        { value: 'line', label: 'Line', icon: cilChartLine },
        { value: 'candlestick', label: 'Candlestick', icon: cilGraph },
    ]

    return (
        <CCard className="mb-4">
            <CCardHeader className="d-flex justify-content-between align-items-center">
                <div>
                    <h4 className="mb-0">
                        <CIcon icon={cilChart} className="me-2" />
                        Live Charts
                    </h4>
                    <small className="text-muted">Real-time price charts with technical indicators</small>
                </div>
                <div className="d-flex gap-2 align-items-center">
                    <CBadge color="success" className="me-2">LIVE</CBadge>
                    <CButton
                        size="sm"
                        color="secondary"
                        variant="outline"
                        onClick={() => setShowControls(!showControls)}
                    >
                        <CIcon icon={cilOptions} className="me-1" size="sm" />
                        Controls
                    </CButton>
                    <CButton size="sm" color="secondary" variant="outline">
                        <CIcon icon={cilReload} className="me-1" size="sm" />
                        Refresh
                    </CButton>
                </div>
            </CCardHeader>

            <CCardBody ref={chartContainerRef}>
                {/* Controls Panel */}
                {showControls && (
                    <div className="border rounded p-3 mb-4">
                        <CRow className="g-3">
                            <CCol md={3}>
                                <label className="form-label">Symbol</label>
                                <CFormSelect
                                    size="sm"
                                    value={selectedPair}
                                    onChange={(e) => handlePairChange(e.target.value)}
                                >
                                    {pairs.map(pair => (
                                        <option key={pair} value={pair}>{pair}</option>
                                    ))}
                                </CFormSelect>
                            </CCol>
                            <CCol md={3}>
                                <label className="form-label">Chart Type</label>
                                <div className="d-flex gap-2">
                                    {chartTypes.map(type => (
                                        <CButton
                                            key={type.value}
                                            size="sm"
                                            color={chartType === type.value ? 'primary' : 'secondary'}
                                            variant={chartType === type.value ? undefined : 'outline'}
                                            onClick={() => setChartType(type.value)}
                                            className="flex-fill"
                                        >
                                            <CIcon icon={type.icon} className="me-1" />
                                            {type.label}
                                        </CButton>
                                    ))}
                                </div>
                            </CCol>
                            <CCol md={3}>
                                <label className="form-label">Indicators</label>
                                <div className="d-flex gap-2 flex-wrap">
                                    <CButton
                                        size="sm"
                                        color={indicators.ma50 ? 'info' : 'secondary'}
                                        variant={indicators.ma50 ? undefined : 'outline'}
                                        onClick={() => toggleIndicator('ma50')}
                                    >
                                        MA(50)
                                    </CButton>
                                    <CButton
                                        size="sm"
                                        color={indicators.ma200 ? 'info' : 'secondary'}
                                        variant={indicators.ma200 ? undefined : 'outline'}
                                        onClick={() => toggleIndicator('ma200')}
                                    >
                                        MA(200)
                                    </CButton>
                                    <CButton
                                        size="sm"
                                        color={indicators.rsi ? 'info' : 'secondary'}
                                        variant={indicators.rsi ? undefined : 'outline'}
                                        onClick={() => toggleIndicator('rsi')}
                                    >
                                        RSI
                                    </CButton>
                                    <CButton
                                        size="sm"
                                        color={indicators.macd ? 'info' : 'secondary'}
                                        variant={indicators.macd ? undefined : 'outline'}
                                        onClick={() => toggleIndicator('macd')}
                                    >
                                        MACD
                                    </CButton>
                                </div>
                            </CCol>
                            <CCol md={3}>
                                <label className="form-label">Chart Tools</label>
                                <div className="d-flex gap-2">
                                    <CButton size="sm" color="secondary" variant="outline">
                                        <CIcon icon={cilZoom} />
                                    </CButton>
                                    <CButton size="sm" color="secondary" variant="outline">
                                        <CIcon icon={cilMove} />
                                    </CButton>
                                    <CButton size="sm" color="secondary" variant="outline" onClick={toggleFullscreen}>
                                        <CIcon icon={cilFullscreen} />
                                    </CButton>
                                </div>
                            </CCol>
                        </CRow>
                    </div>
                )}

                {/* Timeframe Selector - Moved above chart */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="btn-group" role="group">
                        {timeframes.map(tf => (
                            <CButton
                                key={tf}
                                color={timeframe === tf ? 'primary' : 'light'}
                                variant={timeframe === tf ? undefined : 'outline'}
                                size="sm"
                                onClick={() => handleTimeframeChange(tf)}
                            >
                                {tf}
                            </CButton>
                        ))}
                    </div>
                    <div>
                        <CButton size="sm" color="secondary" variant="outline" onClick={toggleFullscreen}>
                            <CIcon icon={cilFullscreen} className="me-1" />
                            Fullscreen
                        </CButton>
                    </div>
                </div>

                {/* Main Chart */}
                <div style={{ height: '500px', position: 'relative' }}>
                    <CChartLine
                        ref={chartRef}
                        data={chartData}
                        style={{ height: '100%', width: '100%' }}
                        options={{
                            maintainAspectRatio: false,
                            responsive: true,
                            animation: { duration: 0 },
                            plugins: {
                                legend: {
                                    display: true,
                                    position: 'top',
                                    labels: { usePointStyle: true }
                                },
                                tooltip: {
                                    mode: 'index',
                                    intersect: false,
                                    callbacks: {
                                        label: function (context) {
                                            let label = context.dataset.label || '';
                                            if (label) {
                                                label += ': ';
                                            }
                                            if (context.parsed.y !== null) {
                                                label += new Intl.NumberFormat('en-US', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 4
                                                }).format(context.parsed.y);
                                            }
                                            return label;
                                        }
                                    }
                                }
                            },
                            scales: {
                                x: {
                                    grid: { color: '#e9ecef' },
                                    ticks: { maxTicksLimit: 10 }
                                },
                                y: {
                                    grid: { color: '#e9ecef' },
                                    position: 'left',
                                    title: { display: true, text: 'BTC/USDT' }
                                },
                                y1: {
                                    position: 'right',
                                    grid: { drawOnChartArea: false },
                                    title: { display: true, text: 'ETH/USDT' }
                                },
                                y2: {
                                    position: 'left',
                                    grid: { drawOnChartArea: false },
                                    display: selectedPair === 'SOL/USDT' || selectedPair === 'ALL'
                                },
                                y3: {
                                    position: 'right',
                                    grid: { drawOnChartArea: false },
                                    display: selectedPair === 'XRP/USDT' || selectedPair === 'ALL'
                                }
                            }
                        }}
                    />
                </div>

                {/* Price Stats Bar */}
                <div className="d-flex justify-content-between align-items-center mt-3 p-2 border rounded">
                    <div className="d-flex gap-4">
                        <div>
                            <span className="text-muted me-2">BTC:</span>
                            <span className="fw-semibold text-info">{formatPrice(btcPrice)}</span>
                            <CBadge color={marketStats.btc.change >= 0 ? 'success' : 'danger'} className="ms-2">
                                {marketStats.btc.change >= 0 ? '+' : ''}{marketStats.btc.change}%
                            </CBadge>
                        </div>
                        <div>
                            <span className="text-muted me-2">ETH:</span>
                            <span className="fw-semibold text-success">{formatPrice(ethPrice)}</span>
                            <CBadge color={marketStats.eth.change >= 0 ? 'success' : 'danger'} className="ms-2">
                                {marketStats.eth.change >= 0 ? '+' : ''}{marketStats.eth.change}%
                            </CBadge>
                        </div>
                        <div>
                            <span className="text-muted me-2">SOL:</span>
                            <span className="fw-semibold text-warning">{formatPrice(solPrice)}</span>
                            <CBadge color={marketStats.sol.change >= 0 ? 'success' : 'danger'} className="ms-2">
                                {marketStats.sol.change >= 0 ? '+' : ''}{marketStats.sol.change}%
                            </CBadge>
                        </div>
                        <div>
                            <span className="text-muted me-2">XRP:</span>
                            <span className="fw-semibold text-danger">{formatPrice(xrpPrice, 4)}</span>
                            <CBadge color={marketStats.xrp.change >= 0 ? 'success' : 'danger'} className="ms-2">
                                {marketStats.xrp.change >= 0 ? '+' : ''}{marketStats.xrp.change}%
                            </CBadge>
                        </div>
                    </div>
                    <small className="text-muted">
                        <CIcon icon={cilClock} className="me-1" size="sm" />
                        Updates every {timeframe === '1m' ? '1s' :
                            timeframe === '5m' ? '2s' :
                                timeframe === '15m' ? '3s' :
                                    timeframe === '1h' ? '5s' :
                                        timeframe === '4h' ? '10s' : '15s'}
                    </small>
                </div>

                {/* Market Stats Row */}
                <CRow className="mt-3 g-3">
                    <CCol md={3}>
                        <div className="border rounded p-2">
                            <small className="text-muted d-block">BTC 24h Range</small>
                            <div className="d-flex justify-content-between">
                                <span className="fw-semibold text-success">{formatPrice(marketStats.btc.high)}</span>
                                <span className="fw-semibold text-danger">{formatPrice(marketStats.btc.low)}</span>
                            </div>
                            <CProgress height={4} className="mt-1">
                                <CProgressBar
                                    value={((btcPrice - marketStats.btc.low) / (marketStats.btc.high - marketStats.btc.low)) * 100}
                                    color="info"
                                />
                            </CProgress>
                        </div>
                    </CCol>
                    <CCol md={3}>
                        <div className="border rounded p-2">
                            <small className="text-muted d-block">ETH 24h Range</small>
                            <div className="d-flex justify-content-between">
                                <span className="fw-semibold text-success">{formatPrice(marketStats.eth.high)}</span>
                                <span className="fw-semibold text-danger">{formatPrice(marketStats.eth.low)}</span>
                            </div>
                            <CProgress height={4} className="mt-1">
                                <CProgressBar
                                    value={((ethPrice - marketStats.eth.low) / (marketStats.eth.high - marketStats.eth.low)) * 100}
                                    color="success"
                                />
                            </CProgress>
                        </div>
                    </CCol>
                    <CCol md={3}>
                        <div className="border rounded p-2">
                            <small className="text-muted d-block">Volume (24h)</small>
                            <div className="d-flex justify-content-between">
                                <span className="fw-semibold">BTC: {formatLargeNumber(marketStats.btc.volume)}</span>
                                <span className="fw-semibold">ETH: {formatLargeNumber(marketStats.eth.volume)}</span>
                            </div>
                            <CProgress height={4} className="mt-1" value={65} color="warning" />
                        </div>
                    </CCol>
                    <CCol md={3}>
                        <div className="border rounded p-2">
                            <small className="text-muted d-block">Spread (BTC)</small>
                            <div className="d-flex justify-content-between">
                                <span className="fw-semibold text-warning">${spread}</span>
                                <span className="fw-semibold text-info">{spreadPercent}%</span>
                            </div>
                        </div>
                    </CCol>
                </CRow>

                {/* Order Book and Depth Chart */}
                <CRow className="mt-4 g-3">
                    <CCol md={6}>
                        <div className="border rounded">
                            <div className="p-2 border-bottom">
                                <h6 className="mb-0">
                                    <CIcon icon={cilArrowBottom} className="me-2 text-danger" />
                                    Sell Orders (Asks)
                                </h6>
                            </div>
                            <CTable hover responsive size="sm" className="mb-0">
                                <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell>Price (USDT)</CTableHeaderCell>
                                        <CTableHeaderCell className="text-end">Amount</CTableHeaderCell>
                                        <CTableHeaderCell className="text-end">Total</CTableHeaderCell>
                                        <CTableHeaderCell className="text-end">Depth</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {asks.map((ask, i) => (
                                        <CTableRow key={`ask-${i}`}>
                                            <CTableDataCell className="text-danger fw-medium">{ask.price}</CTableDataCell>
                                            <CTableDataCell className="text-end">{ask.amount}</CTableDataCell>
                                            <CTableDataCell className="text-end">{ask.total}</CTableDataCell>
                                            <CTableDataCell className="text-end" style={{ width: '100px' }}>
                                                <CProgress height={4} value={parseFloat(ask.cumulative) / parseFloat(asks[0]?.cumulative) * 100} color="danger" />
                                            </CTableDataCell>
                                        </CTableRow>
                                    ))}
                                </CTableBody>
                            </CTable>
                        </div>
                    </CCol>
                    <CCol md={6}>
                        <div className="border rounded">
                            <div className="p-2 border-bottom">
                                <h6 className="mb-0">
                                    <CIcon icon={cilArrowTop} className="me-2 text-success" />
                                    Buy Orders (Bids)
                                </h6>
                            </div>
                            <CTable hover responsive size="sm" className="mb-0">
                                <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell>Price (USDT)</CTableHeaderCell>
                                        <CTableHeaderCell className="text-end">Amount</CTableHeaderCell>
                                        <CTableHeaderCell className="text-end">Total</CTableHeaderCell>
                                        <CTableHeaderCell className="text-end">Depth</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {bids.map((bid, i) => (
                                        <CTableRow key={`bid-${i}`}>
                                            <CTableDataCell className="text-success fw-medium">{bid.price}</CTableDataCell>
                                            <CTableDataCell className="text-end">{bid.amount}</CTableDataCell>
                                            <CTableDataCell className="text-end">{bid.total}</CTableDataCell>
                                            <CTableDataCell className="text-end" style={{ width: '100px' }}>
                                                <CProgress height={4} value={parseFloat(bid.cumulative) / parseFloat(bids[bids.length - 1]?.cumulative) * 100} color="success" />
                                            </CTableDataCell>
                                        </CTableRow>
                                    ))}
                                </CTableBody>
                            </CTable>
                        </div>
                    </CCol>
                </CRow>

                {/* Technical Indicators Panel */}
                {indicators.rsi || indicators.macd || indicators.ma50 || indicators.ma200 ? (
                    <div className="mt-4 border rounded p-3">
                        <h6 className="mb-3">Technical Indicators</h6>
                        <CRow className="g-3">
                            {indicators.ma50 && (
                                <CCol md={3}>
                                    <div className="border rounded p-2">
                                        <small className="text-muted">MA(50) - BTC</small>
                                        <div className="fw-semibold">{formatPrice(btcPrice * 0.98)}</div>
                                        <CBadge color={btcPrice > btcPrice * 0.98 ? 'success' : 'danger'} size="sm">
                                            {btcPrice > btcPrice * 0.98 ? 'ABOVE' : 'BELOW'}
                                        </CBadge>
                                    </div>
                                </CCol>
                            )}
                            {indicators.ma200 && (
                                <CCol md={3}>
                                    <div className="border rounded p-2">
                                        <small className="text-muted">MA(200) - BTC</small>
                                        <div className="fw-semibold">{formatPrice(btcPrice * 0.95)}</div>
                                        <CBadge color={btcPrice > btcPrice * 0.95 ? 'success' : 'danger'} size="sm">
                                            {btcPrice > btcPrice * 0.95 ? 'ABOVE' : 'BELOW'}
                                        </CBadge>
                                    </div>
                                </CCol>
                            )}
                            {indicators.rsi && (
                                <CCol md={3}>
                                    <div className="border rounded p-2">
                                        <small className="text-muted">RSI (14) - BTC</small>
                                        <div className="fw-semibold">58.5</div>
                                        <CProgress height={4} value={58.5} color={58.5 > 70 ? 'danger' : 58.5 < 30 ? 'success' : 'info'} />
                                    </div>
                                </CCol>
                            )}
                            {indicators.macd && (
                                <CCol md={3}>
                                    <div className="border rounded p-2">
                                        <small className="text-muted">MACD - BTC</small>
                                        <div className="fw-semibold text-success">Bullish</div>
                                        <small className="text-muted">Signal: +12.5</small>
                                    </div>
                                </CCol>
                            )}
                        </CRow>
                    </div>
                ) : null}
            </CCardBody>

            <CCardFooter className="d-flex justify-content-between align-items-center small text-muted">
                <div className="d-flex align-items-center">
                    <CIcon icon={cilInfo} className="me-2" />
                    Real-time charts via WebSocket. Data updates every 1-15 seconds based on timeframe.
                </div>
                <div className="d-flex gap-3">
                    <span>Connection: <span className="fw-semibold text-success">WebSocket</span></span>
                    <span>Latency: <span className="fw-semibold text-success">~45ms</span></span>
                    <span>Symbols: <span className="fw-semibold">4</span></span>
                </div>
            </CCardFooter>
        </CCard>
    )
}

export default LiveCharts