import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CCardHeader,
  CRow,
  CButton,
  CFormSelect,
  CInputGroup,
  CFormInput,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CInputGroupText,
  CSpinner,
  CAlert,
  CCardFooter,
  CProgress,
  CProgressBar,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilArrowTop,
  cilArrowBottom,
  cilChart,
  cilGraph,
  cilList,
  cilTransfer,
  cilFullscreen,
  cilZoom,
  cilMove,
  cilOptions,
  cilSpeedometer,
  cilWallet,
  cilDollar,
  cilArrowRight,
  cilReload,
  cilBell,
  cilUser,
  cilCart,
  cilCalculator,
  cilWarning,
  cilInfo,
  cilCheck,
  cilHistory,
  cilClock,
  cilMediaPlay,
  cilMediaStop,
  cilX,
  cilBank,
  cilLineSpacing,
  cilChartLine,
} from '@coreui/icons'
import { CChartLine } from '@coreui/react-chartjs'
import { getStyle } from '@coreui/utils'
import currency from 'currency.js'

const Dashboard = () => {
  const chartRef = useRef(null)

  // ========== ACCOUNT STATE ==========
  const [balance, setBalance] = useState(10000.00)
  const [positions, setPositions] = useState([])
  const [usedMarginTotal, setUsedMarginTotal] = useState(0)
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')

  // ========== ORDER FORM STATE ==========
  const [orderAmount, setOrderAmount] = useState(100)
  const [leverage, setLeverage] = useState(10)
  const [stopLoss, setStopLoss] = useState('')
  const [takeProfit, setTakeProfit] = useState('')

  // ========== ORDER BOOK STATE ==========
  const [asks, setAsks] = useState([])
  const [bids, setBids] = useState([])

  // ========== PRICE STATE ==========
  const [lastFast, setLastFast] = useState(104.82) // MARK price
  const [lastSlow, setLastSlow] = useState(107.34) // INDEX price

  // Currency conversion state
  const [converter, setConverter] = useState({
    fromCurrency: 'USD',
    toCurrency: 'EUR',
    fromAmount: 1000,
    toAmount: 0
  })

  // Exchange rates state
  const [exchangeRates, setExchangeRates] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  // Chart interaction states
  const [timeframe, setTimeframe] = useState('1m')
  const [selectedPair, setSelectedPair] = useState('BTC/USDT')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const chartContainerRef = useRef(null)
  const intervalRef = useRef(null)

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

  // ========== CALCULATED METRICS ==========
  const totalPnl = positions.reduce((acc, p) => acc + calculatePnl(p), 0)
  const equity = balance + totalPnl
  const freeMargin = equity - usedMarginTotal
  const marginLevel = usedMarginTotal > 0 ? (equity / usedMarginTotal * 100) : 0

  // Format functions (matching ClosePosition)
  const formatCurrency = (value) => currency(value, { precision: 2, symbol: '$' }).format()
  const formatPrice = (price, digits = 2) => {
    if (!price) return '0.00';
    return typeof price === 'number' ? price.toFixed(digits) : price;
  }

  // Risk level based on margin (matching ClosePosition badge style)
  const getRiskLevel = () => {
    if (marginLevel > 300) return { text: 'SAFE', color: 'success' }
    if (marginLevel > 150) return { text: 'WARNING', color: 'warning' }
    if (marginLevel > 120) return { text: 'HIGH RISK', color: 'danger' }
    if (marginLevel <= 100 && usedMarginTotal > 0) return { text: 'LIQUIDATION', color: 'danger' }
    return { text: 'SAFE', color: 'success' }
  }

  const riskLevel = getRiskLevel()

  // Generate initial price data
  const generatePriceData = useCallback((length = 80) => {
    const labels = []
    const btcData = []
    const ethData = []

    let btcPrice = 104.82
    let ethPrice = 3200.50
    let btcDir = 1
    let ethDir = -1

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

      btcData.push(Number(btcPrice.toFixed(2)))
      ethData.push(Number(ethPrice.toFixed(2)))
    }

    return { labels, btcData, ethData }
  }, [])

  // Live chart data
  const [chartData, setChartData] = useState(() => {
    const { labels, btcData, ethData } = generatePriceData(80)
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
        }
      ]
    }
  })

  // Fetch exchange rates
  useEffect(() => {
    const fetchExchangeRates = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD')
        const data = await response.json()
        setExchangeRates(data.rates)
      } catch (error) {
        console.error('Error fetching rates:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchExchangeRates()
  }, [])

  // Handle currency conversion
  useEffect(() => {
    if (Object.keys(exchangeRates).length > 0) {
      const { fromCurrency, toCurrency, fromAmount } = converter
      let rate = 1

      if (fromCurrency === 'USD') {
        rate = exchangeRates[toCurrency] || 1
      } else if (toCurrency === 'USD') {
        rate = 1 / (exchangeRates[fromCurrency] || 1)
      } else {
        rate = (exchangeRates[toCurrency] || 1) / (exchangeRates[fromCurrency] || 1)
      }

      const result = currency(fromAmount).multiply(rate).value
      setConverter(prev => ({ ...prev, toAmount: result }))
    }
  }, [converter.fromCurrency, converter.toCurrency, converter.fromAmount, exchangeRates])

  // Update order book based on current price
  const updateOrderBook = useCallback((mark) => {
    const newAsks = []
    const newBids = []

    for (let i = 1; i <= 8; i++) {
      // Asks (sells) - higher prices
      const askP = mark + i * 0.42
      const askA = Math.random() * 0.5 + 0.15
      const askT = askP * askA
      newAsks.push({ price: askP.toFixed(2), amount: askA.toFixed(3), total: askT.toFixed(2) })
    }

    for (let i = 1; i <= 8; i++) {
      // Bids (buys) - lower prices
      const bidP = mark - i * 0.41
      const bidA = Math.random() * 0.6 + 0.12
      const bidT = bidP * bidA
      newBids.push({ price: bidP.toFixed(2), amount: bidA.toFixed(3), total: bidT.toFixed(2) })
    }

    setAsks(newAsks)
    setBids(newBids)
  }, [])

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    // Reduce these values for faster updates
    let updateTime = 1000; // Default 1 second (was 5000)

    if (timeframe === '1m') updateTime = 1000;      // 1 second (was 5000)
    else if (timeframe === '5m') updateTime = 2000;  // 2 seconds (was 10000)
    else if (timeframe === '15m') updateTime = 3000; // 3 seconds (was 20000)
    else if (timeframe === '1h') updateTime = 5000;  // 5 seconds (was 30000)
    else if (timeframe === '4h') updateTime = 10000; // 10 seconds (was 60000)

    intervalRef.current = setInterval(() => {
      setChartData(prev => {
        const newLabels = [...prev.labels.slice(1), prev.labels[prev.labels.length - 1] + 1]

        const btcData = [...prev.datasets[0].data.slice(1)]

        if (Math.random() > 0.9) btcRef.current.direction *= -1

        const btcMovement = btcRef.current.direction * (0.05 + Math.random() * 0.15)
        let newBtc = btcData[btcData.length - 1] + btcMovement

        if (newBtc > 115) newBtc = 115 - Math.random() * 0.5
        if (newBtc < 95) newBtc = 95 + Math.random() * 0.5
        btcData.push(Number(newBtc.toFixed(2)))

        const ethData = [...prev.datasets[1].data.slice(1)]

        if (Math.random() > 0.9) ethRef.current.direction *= -1

        const ethMovement = ethRef.current.direction * (0.5 + Math.random() * 2)
        let newEth = ethData[ethData.length - 1] + ethMovement

        if (newEth > 3400) newEth = 3400 - Math.random() * 5
        if (newEth < 3000) newEth = 3000 + Math.random() * 5
        ethData.push(Number(newEth.toFixed(2)))

        setLastFast(newBtc)
        setLastSlow(newEth)
        updateOrderBook(newBtc)

        return {
          labels: newLabels,
          datasets: [
            { ...prev.datasets[0], data: btcData },
            { ...prev.datasets[1], data: ethData }
          ]
        }
      })
    }, updateTime)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [timeframe, updateOrderBook])

  // Calculate PnL for a position
  function calculatePnl(p) {
    let diff = lastFast - p.entry
    if (p.type === 'SELL') diff = -diff
    return parseFloat((diff * p.size / p.entry).toFixed(2))
  }

  // Show alert helper (matching ClosePosition)
  const showAlert = (message, isSuccess = true) => {
    setAlertMessage(message)
    setShowSuccessAlert(true)
    setTimeout(() => setShowSuccessAlert(false), 3000)
  }

  // Place order
  const placeOrder = (type) => {
    const required = orderAmount / leverage
    if (balance < required) {
      showAlert('Insufficient balance for this order', false)
      return
    }

    setBalance(prev => prev - required)
    setUsedMarginTotal(prev => prev + required)

    const newPosition = {
      id: Date.now(),
      type: type,
      entry: lastFast,
      size: orderAmount,
      leverage: leverage,
      sl: stopLoss ? parseFloat(stopLoss) : null,
      tp: takeProfit ? parseFloat(takeProfit) : null
    }

    setPositions(prev => [...prev, newPosition])
    showAlert(`${type} order placed successfully! Position opened at ${formatPrice(lastFast)}`)
  }

  // Close position
  const closePosition = (id) => {
    const pos = positions.find(p => p.id === id)
    const pnl = calculatePnl(pos)
    const releasedMargin = pos.size / pos.leverage

    setBalance(prev => prev + releasedMargin + pnl)
    setUsedMarginTotal(prev => prev - releasedMargin)
    setPositions(prev => prev.filter(p => p.id !== id))

    showAlert(`Position closed! PnL: ${pnl >= 0 ? '+' : ''}${formatCurrency(pnl)}`)
  }

  const handleSwap = () => {
    setConverter(prev => ({
      fromCurrency: prev.toCurrency,
      toCurrency: prev.fromCurrency,
      fromAmount: prev.toAmount,
      toAmount: prev.fromAmount
    }))
  }

  const handleTimeframeChange = (tf) => {
    setTimeframe(tf)
    const { labels, btcData, ethData } = generatePriceData(
      tf === '1m' ? 80 : tf === '5m' ? 70 : tf === '15m' ? 60 : 50
    )
    setChartData(prev => ({
      labels,
      datasets: [
        { ...prev.datasets[0], data: btcData },
        { ...prev.datasets[1], data: ethData }
      ]
    }))
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      chartContainerRef.current.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const currencies = exchangeRates ? ['USD', ...Object.keys(exchangeRates).slice(0, 20)] : ['USD', 'EUR', 'GBP', 'JPY']

  // Calculate spread
  const spread = (lastSlow - lastFast).toFixed(2)
  const spreadPercent = ((lastSlow - lastFast) / lastFast * 100).toFixed(2)

  // Required margin for current order
  const requiredMargin = orderAmount / leverage

  // Margin level progress color
  const getMarginLevelColor = () => {
    if (marginLevel > 300) return 'success'
    if (marginLevel > 150) return 'warning'
    return 'danger'
  }

  return (
    <div className="c-app" style={{ padding: '20px' }}>
      {/* Success Alert - matching ClosePosition exactly */}
      {showSuccessAlert && (
        <CAlert color={alertMessage.includes('Insufficient') ? 'danger' : 'success'} className="mb-3">
          <CIcon icon={alertMessage.includes('Insufficient') ? cilWarning : cilCheck} className="me-2" />
          {alertMessage}
        </CAlert>
      )}

      {/* Header - matching ClosePosition styling */}
      <CCard className="mb-4">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <div>
            <h4 className="mb-0">Trading Dashboard</h4>
            <small className="text-muted">Real-time trading platform with live data</small>
          </div>
          <div className="d-flex gap-2 align-items-center">
            <CBadge color="info" className="me-2">Live Trading</CBadge>
            <CButton size="sm" color="secondary" variant="outline">
              <CIcon icon={cilReload} className="me-1" size="sm" />
              Refresh
            </CButton>
          </div>
        </CCardHeader>
      </CCard>

      {/* Account Summary Cards - matching ClosePosition border style */}
      <CRow className="mb-4">
        <CCol md={3}>
          <CCard className="border-start border-4 border-success">
            <CCardBody>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-muted">Balance</small>
                  <h4 className="mb-0 fw-bold">{formatCurrency(balance)}</h4>
                </div>
                <CIcon icon={cilBank} size="xl" className="text-muted" />
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={3}>
          <CCard className="border-start border-4 border-info">
            <CCardBody>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-muted">Equity</small>
                  <h4 className="mb-0 fw-bold">{formatCurrency(equity)}</h4>
                </div>
                <CIcon icon={cilWallet} size="xl" className="text-muted" />
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={3}>
          <CCard className="border-start border-4 border-warning">
            <CCardBody>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-muted">Free Margin</small>
                  <h4 className="mb-0 fw-bold">{formatCurrency(freeMargin)}</h4>
                </div>
                <CIcon icon={cilDollar} size="xl" className="text-muted" />
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={3}>
          <CCard className={`border-start border-4 border-${getMarginLevelColor()}`}>
            <CCardBody>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-muted">Margin Level</small>
                  <h4 className="mb-0 fw-bold">{marginLevel.toFixed(0)}%</h4>
                  <CBadge color={riskLevel.color} className="mt-1">{riskLevel.text}</CBadge>
                </div>
                <CIcon icon={cilSpeedometer} size="xl" className="text-muted" />
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Main 2-Column Grid */}
      <CRow>
        {/* LEFT COLUMN: Chart and Order Book */}
        <CCol lg={8}>
          <CCard className="mb-4">
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-0">
                  <CIcon icon={cilChartLine} className="me-2" />
                  Price Chart - {selectedPair}
                </h5>
              </div>
              <div className="d-flex gap-2">
                <div className="btn-group" role="group">
                  {['1m', '5m', '15m', '1h', '4h'].map(tf => (
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
                <CButton size="sm" color="light" variant="outline" onClick={toggleFullscreen}>
                  <CIcon icon={cilFullscreen} size="sm" />
                </CButton>
              </div>
            </CCardHeader>
            <CCardBody ref={chartContainerRef} style={{ height: '400px' }}>
              <CChartLine
                ref={chartRef}
                data={chartData}
                style={{ height: '100%', width: '100%' }}
                options={{
                  maintainAspectRatio: false,
                  responsive: true,
                  animation: { duration: 0 },
                  plugins: {
                    legend: { display: true, position: 'top' },
                    tooltip: { mode: 'index', intersect: false }
                  },
                  scales: {
                    x: { grid: { color: '#e9ecef' } },
                    y: { grid: { color: '#e9ecef' }, position: 'left' },
                    y1: { position: 'right', grid: { drawOnChartArea: false } }
                  }
                }}
              />
            </CCardBody>
            <CCardFooter className="d-flex justify-content-between align-items-center">
              <div className="d-flex gap-4">
                <div>
                  <span className="text-muted me-2">MARK:</span>
                  <span className="fw-semibold text-info">{formatPrice(lastFast)}</span>
                </div>
                <div>
                  <span className="text-muted me-2">INDEX:</span>
                  <span className="fw-semibold text-success">{formatPrice(lastSlow)}</span>
                </div>
                <div>
                  <span className="text-muted me-2">Spread:</span>
                  <span className="fw-semibold text-warning">${spread} ({spreadPercent}%)</span>
                </div>
              </div>
              <small className="text-muted">
                <CIcon icon={cilClock} className="me-1" size="sm" />
                Updates every {timeframe === '1m' ? '1s' :
                  timeframe === '5m' ? '2s' :
                    timeframe === '15m' ? '3s' :
                      timeframe === '1h' ? '5s' : '10s'}
              </small>
            </CCardFooter>
          </CCard>

          {/* Order Book - matching ClosePosition table style */}
          <CRow>
            <CCol md={6}>
              <CCard className="mb-4">
                <CCardHeader>
                  <h5 className="mb-0">
                    <CIcon icon={cilArrowBottom} className="me-2 text-danger" />
                    Sell Orders (Asks)
                  </h5>
                </CCardHeader>
                <CCardBody className="p-0">
                  <CTable hover responsive size="sm" className="mb-0 border">
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>Price (USDT)</CTableHeaderCell>
                        <CTableHeaderCell className="text-end">Amount</CTableHeaderCell>
                        <CTableHeaderCell className="text-end">Total</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {asks.map((ask, i) => (
                        <CTableRow key={`ask-${i}`}>
                          <CTableDataCell className="text-danger fw-medium">{ask.price}</CTableDataCell>
                          <CTableDataCell className="text-end">{ask.amount}</CTableDataCell>
                          <CTableDataCell className="text-end">{ask.total}</CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol md={6}>
              <CCard className="mb-4">
                <CCardHeader>
                  <h5 className="mb-0">
                    <CIcon icon={cilArrowTop} className="me-2 text-success" />
                    Buy Orders (Bids)
                  </h5>
                </CCardHeader>
                <CCardBody className="p-0">
                  <CTable hover responsive size="sm" className="mb-0 border">
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>Price (USDT)</CTableHeaderCell>
                        <CTableHeaderCell className="text-end">Amount</CTableHeaderCell>
                        <CTableHeaderCell className="text-end">Total</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {bids.map((bid, i) => (
                        <CTableRow key={`bid-${i}`}>
                          <CTableDataCell className="text-success fw-medium">{bid.price}</CTableDataCell>
                          <CTableDataCell className="text-end">{bid.amount}</CTableDataCell>
                          <CTableDataCell className="text-end">{bid.total}</CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CCol>

        {/* RIGHT COLUMN: Trading Panel */}
        <CCol lg={4}>
          <CCard className="mb-4">
            <CCardHeader>
              <h5 className="mb-0">
                <CIcon icon={cilCart} className="me-2" />
                Place Order
              </h5>
            </CCardHeader>
            <CCardBody>
              <CRow className="mb-3">
                <CCol md={6}>
                  <label className="form-label">Amount (USDT)</label>
                  <CInputGroup>
                    <CFormInput
                      type="number"
                      value={orderAmount}
                      onChange={(e) => setOrderAmount(parseFloat(e.target.value) || 0)}
                      min="1"
                      step="1"
                    />
                    <CInputGroupText>USDT</CInputGroupText>
                  </CInputGroup>
                </CCol>
                <CCol md={6}>
                  <label className="form-label">Leverage</label>
                  <CFormSelect
                    value={leverage}
                    onChange={(e) => setLeverage(parseFloat(e.target.value))}
                  >
                    <option value="1">1x</option>
                    <option value="5">5x</option>
                    <option value="10">10x</option>
                    <option value="20">20x</option>
                    <option value="50">50x</option>
                    <option value="100">100x</option>
                  </CFormSelect>
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={6}>
                  <label className="form-label">Stop Loss (opt)</label>
                  <CFormInput
                    type="number"
                    value={stopLoss}
                    onChange={(e) => setStopLoss(e.target.value)}
                    placeholder="Price"
                  />
                </CCol>
                <CCol md={6}>
                  <label className="form-label">Take Profit (opt)</label>
                  <CFormInput
                    type="number"
                    value={takeProfit}
                    onChange={(e) => setTakeProfit(e.target.value)}
                    placeholder="Price"
                  />
                </CCol>
              </CRow>

              {/* Metrics section with card background */}
              <div className="p-3 rounded mb-3" style={{ backgroundColor: 'var(--cui-card-bg)' }}>
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-muted">Required Margin:</span>
                  <span className="fw-semibold">{formatCurrency(requiredMargin)}</span>
                </div>
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-muted">Max Position Size:</span>
                  <span className="fw-semibold">{formatCurrency(balance * leverage)}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Available Balance:</span>
                  <span className="fw-semibold text-success">{formatCurrency(balance)}</span>
                </div>
              </div>

              {/* Action buttons with white text */}
              <div className="d-flex gap-2">
                <CButton
                  color="success"
                  className="flex-fill py-3 text-white"
                  onClick={() => placeOrder('BUY')}
                >
                  <CIcon icon={cilArrowTop} className="me-2" />
                  Long / Buy
                </CButton>
                <CButton
                  color="danger"
                  className="flex-fill py-3 text-white"
                  onClick={() => placeOrder('SELL')}
                >
                  <CIcon icon={cilArrowBottom} className="me-2" />
                  Short / Sell
                </CButton>
              </div>
            </CCardBody>
          </CCard>

          {/* Open Positions - matching ClosePosition table style */}
          <CCard className="mb-4">
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <CIcon icon={cilList} className="me-2" />
                Open Positions
              </h5>
              <CBadge color="secondary">{positions.length}</CBadge>
            </CCardHeader>
            <CCardBody className="p-0">
              {positions.length > 0 ? (
                <CTable hover responsive size="sm" className="mb-0 border">
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Type</CTableHeaderCell>
                      <CTableHeaderCell className="text-end">Size</CTableHeaderCell>
                      <CTableHeaderCell className="text-end">Entry</CTableHeaderCell>
                      <CTableHeaderCell className="text-end">P&L</CTableHeaderCell>
                      <CTableHeaderCell></CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {positions.map(pos => {
                      const pnl = calculatePnl(pos)
                      return (
                        <CTableRow key={pos.id}>
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
                          <CTableDataCell className="text-end fw-medium">
                            {formatCurrency(pos.size)}
                          </CTableDataCell>
                          <CTableDataCell className="text-end">
                            {formatPrice(pos.entry)}
                          </CTableDataCell>
                          <CTableDataCell className={`text-end fw-semibold ${pnl >= 0 ? 'text-success' : 'text-danger'}`}>
                            {pnl >= 0 ? '+' : ''}{formatCurrency(pnl)}
                          </CTableDataCell>
                          <CTableDataCell>
                            <CButton
                              size="sm"
                              color="danger"
                              variant="outline"
                              className="py-0 px-2"
                              onClick={() => closePosition(pos.id)}
                            >
                              <CIcon icon={cilX} size="sm" />
                            </CButton>
                          </CTableDataCell>
                        </CTableRow>
                      )
                    })}
                  </CTableBody>
                </CTable>
              ) : (
                <div className="text-center py-4">
                  <CIcon icon={cilInfo} size="3xl" className="mb-3 text-muted" />
                  <p className="text-muted small mb-0">No open positions</p>
                </div>
              )}
            </CCardBody>
          </CCard>

          {/* Currency Converter - matching ClosePosition style */}
          <CCard className="mb-4">
            <CCardHeader>
              <h5 className="mb-0">
                <CIcon icon={cilTransfer} className="me-2" />
                Currency Converter
              </h5>
            </CCardHeader>
            <CCardBody>
              {isLoading ? (
                <div className="text-center py-3">
                  <CSpinner size="sm" />
                </div>
              ) : (
                <>
                  <CRow className="align-items-center mb-2">
                    <CCol md={5}>
                      <CFormSelect
                        value={converter.fromCurrency}
                        onChange={(e) => setConverter(prev => ({ ...prev, fromCurrency: e.target.value }))}
                      >
                        {currencies.map(curr => (
                          <option key={curr} value={curr}>{curr}</option>
                        ))}
                      </CFormSelect>
                    </CCol>
                    <CCol md={2} className="text-center">
                      <CButton color="light" size="sm" onClick={handleSwap}>
                        <CIcon icon={cilTransfer} />
                      </CButton>
                    </CCol>
                    <CCol md={5}>
                      <CFormSelect
                        value={converter.toCurrency}
                        onChange={(e) => setConverter(prev => ({ ...prev, toCurrency: e.target.value }))}
                      >
                        {currencies.map(curr => (
                          <option key={curr} value={curr}>{curr}</option>
                        ))}
                      </CFormSelect>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol md={6}>
                      <CInputGroup>
                        <CFormInput
                          type="number"
                          value={converter.fromAmount}
                          onChange={(e) => setConverter(prev => ({ ...prev, fromAmount: parseFloat(e.target.value) || 0 }))}
                        />
                        <CInputGroupText>{converter.fromCurrency}</CInputGroupText>
                      </CInputGroup>
                    </CCol>
                    <CCol md={6}>
                      <CInputGroup>
                        <CFormInput
                          type="number"
                          value={converter.toAmount.toFixed(2)}
                          readOnly
                        />
                        <CInputGroupText>{converter.toCurrency}</CInputGroupText>
                      </CInputGroup>
                    </CCol>
                  </CRow>
                </>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Footer - matching ClosePosition footer style */}
      <CCard className="mt-4">
        <CCardFooter className="d-flex justify-content-between align-items-center small text-muted">
          <div className="d-flex align-items-center">
            <CIcon icon={cilInfo} className="me-2" />
            Trading involves substantial risk. Always use stop-loss orders to manage risk.
          </div>
          <div className="d-flex gap-4">
            <span>Platform: <span className="fw-semibold text-success">ONLINE</span></span>
            <span>WebSocket: <span className="fw-semibold text-success">ACTIVE</span></span>
            <span>Latency: <span className="fw-semibold">45ms</span></span>
          </div>
        </CCardFooter>
      </CCard>

      {/* Risk Level Progress Bar */}
      {usedMarginTotal > 0 && (
        <CCard className="mt-3">
          <CCardBody>
            <div className="d-flex justify-content-between mb-1">
              <span className="text-muted">Margin Level</span>
              <span className={`fw-semibold text-${getMarginLevelColor()}`}>{marginLevel.toFixed(0)}%</span>
            </div>
            <CProgress height={8} color={getMarginLevelColor()} value={Math.min(marginLevel, 400)} max={400}>
              <CProgressBar />
            </CProgress>
            <div className="d-flex justify-content-between mt-1 small text-muted">
              <span>Liquidation (100%)</span>
              <span>Safe (300%+)</span>
            </div>
          </CCardBody>
        </CCard>
      )}
    </div>
  )
}

export default Dashboard