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
    CProgress,
    CProgressBar,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
    cilHistory,
    cilCheck,
    cilInfo,
    cilWarning,
    cilReload,
    cilZoom,
    cilArrowTop,
    cilArrowBottom,
    cilBan,
    cilFilter,
    cilSearch,
    cilPrint,
    cilBolt,
    cilMoney,
    cilChartPie,
    cilBarChart,
    cilClock,
    cilGraph,
} from '@coreui/icons';
import currency from 'currency.js';

const TradeHistory = () => {
    // State
    const [loading, setLoading] = useState(true);
    const [tradeHistory, setTradeHistory] = useState([]);
    const [selectedTrade, setSelectedTrade] = useState(null);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [filterSymbol, setFilterSymbol] = useState('all');
    const [filterType, setFilterType] = useState('all');
    const [filterDate, setFilterDate] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [exportSuccess, setExportSuccess] = useState(false);
    const [exportError, setExportError] = useState('');
    const [lastUpdate, setLastUpdate] = useState(new Date());

    // Mock account data
    const accountData = {
        balance: 25840.75,
        equity: 26350.30,
        margin: 4250.15,
        freeMargin: 22100.15,
        marginLevel: 325.8,
        currency: 'USD'
    };

    // Mock trade history data
    const mockTradeHistory = [
        {
            id: 1,
            symbol: 'EUR/USD',
            type: 'BUY',
            lots: 0.5,
            entryPrice: 1.0825,
            exitPrice: 1.0850,
            profit: 125.00,
            profitPips: 25,
            swap: -0.25,
            commission: 1.50,
            netProfit: 123.25,
            entryTime: '2024-01-15 09:30:22',
            exitTime: '2024-01-15 14:25:45',
            duration: '4h 55m',
            stopLoss: 1.0800,
            takeProfit: 1.0880,
            margin: 541.25,
            returnPct: 2.31,
            status: 'CLOSED',
            closeMethod: 'market',
        },
        {
            id: 2,
            symbol: 'GBP/USD',
            type: 'SELL',
            lots: 0.3,
            entryPrice: 1.2650,
            exitPrice: 1.2620,
            profit: 90.00,
            profitPips: 30,
            swap: 0.12,
            commission: 0.90,
            netProfit: 89.22,
            entryTime: '2024-01-15 11:20:15',
            exitTime: '2024-01-15 16:45:30',
            duration: '5h 25m',
            stopLoss: 1.2660,
            takeProfit: 1.2600,
            margin: 379.50,
            returnPct: 2.84,
            status: 'CLOSED',
            closeMethod: 'limit',
        },
        {
            id: 3,
            symbol: 'USD/JPY',
            type: 'BUY',
            lots: 1.0,
            entryPrice: 148.25,
            exitPrice: 148.28,
            profit: 30.00,
            profitPips: 3,
            swap: -0.45,
            commission: 3.00,
            netProfit: 26.55,
            entryTime: '2024-01-14 22:15:40',
            exitTime: '2024-01-15 01:30:20',
            duration: '3h 15m',
            stopLoss: 148.10,
            takeProfit: 148.50,
            margin: 1482.80,
            returnPct: 0.20,
            status: 'CLOSED',
            closeMethod: 'market',
        },
        {
            id: 4,
            symbol: 'BTC/USD',
            type: 'BUY',
            lots: 0.05,
            entryPrice: 42850,
            exitPrice: 43150,
            profit: 150.00,
            profitPips: 300,
            swap: -0.50,
            commission: 2.50,
            netProfit: 147.00,
            entryTime: '2024-01-15 08:30:10',
            exitTime: '2024-01-15 13:15:45',
            duration: '4h 45m',
            stopLoss: 42500,
            takeProfit: 43500,
            margin: 2157.50,
            returnPct: 3.50,
            status: 'CLOSED',
            closeMethod: 'stop',
        },
        {
            id: 5,
            symbol: 'AUD/USD',
            type: 'SELL',
            lots: 0.8,
            entryPrice: 0.6590,
            exitPrice: 0.6580,
            profit: 80.00,
            profitPips: 10,
            swap: 0.08,
            commission: 2.40,
            netProfit: 77.68,
            entryTime: '2024-01-15 14:45:30',
            exitTime: '2024-01-15 16:05:15',
            duration: '1h 20m',
            stopLoss: 0.6600,
            takeProfit: 0.6570,
            margin: 526.40,
            returnPct: 1.52,
            status: 'CLOSED',
            closeMethod: 'market',
        },
        {
            id: 6,
            symbol: 'ETH/USD',
            type: 'BUY',
            lots: 0.2,
            entryPrice: 2850,
            exitPrice: 2890,
            profit: 80.00,
            profitPips: 40,
            swap: -0.15,
            commission: 1.00,
            netProfit: 78.85,
            entryTime: '2024-01-14 19:20:10',
            exitTime: '2024-01-15 00:45:30',
            duration: '5h 25m',
            stopLoss: 2830,
            takeProfit: 2900,
            margin: 570.00,
            returnPct: 2.81,
            status: 'CLOSED',
            closeMethod: 'limit',
        },
        {
            id: 7,
            symbol: 'USD/CAD',
            type: 'SELL',
            lots: 0.6,
            entryPrice: 1.3480,
            exitPrice: 1.3465,
            profit: 90.00,
            profitPips: 15,
            swap: -0.10,
            commission: 1.80,
            netProfit: 88.10,
            entryTime: '2024-01-15 10:15:45',
            exitTime: '2024-01-15 15:30:20',
            duration: '5h 15m',
            stopLoss: 1.3495,
            takeProfit: 1.3450,
            margin: 807.90,
            returnPct: 1.67,
            status: 'CLOSED',
            closeMethod: 'market',
        },
        {
            id: 8,
            symbol: 'NZD/USD',
            type: 'BUY',
            lots: 0.4,
            entryPrice: 0.6150,
            exitPrice: 0.6140,
            profit: -40.00,
            profitPips: -10,
            swap: 0.05,
            commission: 1.20,
            netProfit: -41.15,
            entryTime: '2024-01-15 12:30:20',
            exitTime: '2024-01-15 14:45:10',
            duration: '2h 15m',
            stopLoss: 0.6130,
            takeProfit: 0.6170,
            margin: 245.60,
            returnPct: -1.63,
            status: 'CLOSED',
            closeMethod: 'stop',
        },
        {
            id: 9,
            symbol: 'EUR/GBP',
            type: 'BUY',
            lots: 0.7,
            entryPrice: 0.8580,
            exitPrice: 0.8595,
            profit: 105.00,
            profitPips: 15,
            swap: -0.20,
            commission: 2.10,
            netProfit: 102.70,
            entryTime: '2024-01-14 21:45:30',
            exitTime: '2024-01-15 03:30:15',
            duration: '5h 45m',
            stopLoss: 0.8570,
            takeProfit: 0.8610,
            margin: 601.65,
            returnPct: 1.75,
            status: 'CLOSED',
            closeMethod: 'limit',
        },
        {
            id: 10,
            symbol: 'GBP/JPY',
            type: 'SELL',
            lots: 0.5,
            entryPrice: 187.50,
            exitPrice: 186.80,
            profit: 350.00,
            profitPips: 70,
            swap: 0.30,
            commission: 2.50,
            netProfit: 347.80,
            entryTime: '2024-01-15 07:15:40',
            exitTime: '2024-01-15 11:20:25',
            duration: '4h 5m',
            stopLoss: 188.00,
            takeProfit: 186.50,
            margin: 934.00,
            returnPct: 3.75,
            status: 'CLOSED',
            closeMethod: 'market',
        },
        {
            id: 11,
            symbol: 'AUD/CAD',
            type: 'BUY',
            lots: 0.6,
            entryPrice: 0.8870,
            exitPrice: 0.8860,
            profit: -60.00,
            profitPips: -10,
            swap: -0.12,
            commission: 1.80,
            netProfit: -61.92,
            entryTime: '2024-01-15 09:50:15',
            exitTime: '2024-01-15 13:40:30',
            duration: '3h 50m',
            stopLoss: 0.8850,
            takeProfit: 0.8890,
            margin: 531.60,
            returnPct: -1.13,
            status: 'CLOSED',
            closeMethod: 'stop',
        },
        {
            id: 12,
            symbol: 'USD/CHF',
            type: 'SELL',
            lots: 0.4,
            entryPrice: 0.8850,
            exitPrice: 0.8840,
            profit: 40.00,
            profitPips: 10,
            swap: 0.08,
            commission: 1.20,
            netProfit: 38.88,
            entryTime: '2024-01-15 13:20:10',
            exitTime: '2024-01-15 16:55:45',
            duration: '3h 35m',
            stopLoss: 0.8860,
            takeProfit: 0.8830,
            margin: 353.60,
            returnPct: 1.13,
            status: 'CLOSED',
            closeMethod: 'limit',
        },
    ];

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setTradeHistory(mockTradeHistory);
            setLastUpdate(new Date());
            setLoading(false);
        }, 1000);
    }, []);

    // Filter trades
    const filteredTrades = tradeHistory.filter(trade => {
        const matchesSymbol = filterSymbol === 'all' || trade.symbol === filterSymbol;
        const matchesType = filterType === 'all' || trade.type === filterType;

        let matchesDate = true;
        const today = new Date();
        const tradeDate = new Date(trade.exitTime);

        if (filterDate === 'today') {
            matchesDate = tradeDate.toDateString() === today.toDateString();
        } else if (filterDate === 'week') {
            const weekAgo = new Date(today.setDate(today.getDate() - 7));
            matchesDate = tradeDate >= weekAgo;
        } else if (filterDate === 'month') {
            const monthAgo = new Date(today.setMonth(today.getMonth() - 1));
            matchesDate = tradeDate >= monthAgo;
        }

        const matchesSearch = searchQuery === '' ||
            trade.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
            trade.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
            trade.duration.toLowerCase().includes(searchQuery.toLowerCase()) ||
            trade.closeMethod.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesSymbol && matchesType && matchesDate && matchesSearch;
    });

    // Calculate summary stats
    const totalTrades = filteredTrades.length;
    const winningTrades = filteredTrades.filter(t => t.profit > 0).length;
    const losingTrades = filteredTrades.filter(t => t.profit < 0).length;
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades * 100) : 0;
    const totalProfit = filteredTrades.reduce((sum, t) => sum + t.profit, 0);
    const totalCommission = filteredTrades.reduce((sum, t) => sum + t.commission, 0);
    const totalSwap = filteredTrades.reduce((sum, t) => sum + t.swap, 0);
    const netProfit = filteredTrades.reduce((sum, t) => sum + t.netProfit, 0);
    const avgProfit = winningTrades > 0 ? (filteredTrades.filter(t => t.profit > 0).reduce((sum, t) => sum + t.profit, 0) / winningTrades) : 0;
    const avgLoss = losingTrades > 0 ? (filteredTrades.filter(t => t.profit < 0).reduce((sum, t) => sum + t.profit, 0) / losingTrades) : 0;
    const profitFactor = losingTrades > 0 ?
        (filteredTrades.filter(t => t.profit > 0).reduce((sum, t) => sum + t.profit, 0) /
            Math.abs(filteredTrades.filter(t => t.profit < 0).reduce((sum, t) => sum + t.profit, 0))) : 0;

    // Additional metrics
    const bestTrade = filteredTrades.length > 0 ? Math.max(...filteredTrades.map(t => t.profit)) : 0;
    const worstTrade = filteredTrades.length > 0 ? Math.min(...filteredTrades.map(t => t.profit)) : 0;
    const totalPips = filteredTrades.reduce((sum, trade) => sum + trade.profitPips, 0);
    const avgPipsPerTrade = filteredTrades.length > 0 ? totalPips / filteredTrades.length : 0;
    const totalLots = filteredTrades.reduce((sum, trade) => sum + trade.lots, 0);
    const expectancy = filteredTrades.length > 0 ? netProfit / filteredTrades.length : 0;

    // Format functions
    const formatCurrency = (value) => currency(value, { precision: 2, symbol: '$' }).format();
    const formatPrice = (price, symbol = 'EUR/USD') => {
        if (!price) return '0.0000';
        const digits = getSymbolDigits(symbol);
        return typeof price === 'number' ? price.toFixed(digits) : price;
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };
    const formatDateShort = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
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
            'USD/CAD': 4,
            'NZD/USD': 4,
            'EUR/GBP': 4,
            'GBP/JPY': 3,
            'AUD/CAD': 4,
            'USD/CHF': 4,
        };
        return digits[symbol] || 4;
    };

    // Get unique symbols for filter
    const symbols = ['all', ...new Set(tradeHistory.map(t => t.symbol))];

    // Handle export
    const handleExport = () => {
        setExportSuccess(true);
        setTimeout(() => setExportSuccess(false), 3000);
    };

    // Handle print
    const handlePrint = () => {
        window.print();
    };

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredTrades.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredTrades.length / itemsPerPage);

    return (
        <CCard className="mb-4">
            <CCardHeader className="d-flex justify-content-between align-items-center">
                <div>
                    <h4 className="mb-0">
                        <CIcon icon={cilHistory} className="me-2 text-info" />
                        Trade History
                    </h4>
                    <small className="text-muted">
                        Complete record of all closed positions ({tradeHistory.length} total trades)
                    </small>
                </div>
                <div className="d-flex align-items-center gap-3">
                    <CBadge color="info">
                        <CIcon icon={cilBolt} className="me-1" size="sm" />
                        LIVE
                    </CBadge>
                    <span className="text-muted small">
                        Last Update: {lastUpdate.toLocaleTimeString()}
                    </span>
                    <div className="d-flex gap-2">
                        <CButton
                            size="sm"
                            color="secondary"
                            variant="outline"
                            onClick={handlePrint}
                        >
                            <CIcon icon={cilPrint} className="me-1" size="sm" />
                            Print
                        </CButton>
                        <CButton
                            size="sm"
                            color="secondary"
                            variant="outline"
                            onClick={handleExport}
                        >
                            <CIcon icon={cilArrowTop} className="me-1" size="sm" />
                            Export
                        </CButton>
                        <CButton
                            size="sm"
                            color="secondary"
                            variant="outline"
                            onClick={() => {
                                setLoading(true);
                                setTimeout(() => {
                                    setTradeHistory(mockTradeHistory);
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
            </CCardHeader>

            <CCardBody>
                {/* Live Status Bar */}
                <div className="border rounded p-2 mb-4 small">
                    <CRow className="align-items-center">
                        <CCol md="auto">
                            <CIcon icon={cilBolt} className="me-2 text-info" />
                            <strong>P&L Status: {netProfit >= 0 ? 'PROFIT' : 'LOSS'}</strong>
                        </CCol>
                        <CCol md="auto" className="text-muted">
                            Total Trades: <span className="fw-semibold">{totalTrades}</span>
                        </CCol>
                        <CCol md="auto" className="text-muted">
                            Win Rate: <span className="fw-semibold text-success">{winRate.toFixed(1)}%</span>
                        </CCol>
                        <CCol md="auto" className="text-muted">
                            Net P&L: <span className={`fw-semibold ${netProfit >= 0 ? 'text-success' : 'text-danger'}`}>
                                {netProfit >= 0 ? '+' : ''}{formatCurrency(netProfit)}
                            </span>
                        </CCol>
                    </CRow>
                </div>

                {/* Success Alert */}
                {exportSuccess && (
                    <CAlert color="success" className="mb-3" dismissible>
                        <CIcon icon={cilCheck} className="me-2" />
                        Trade history exported successfully!
                    </CAlert>
                )}

                {/* Error Alert */}
                {exportError && (
                    <CAlert color="danger" className="mb-3" dismissible>
                        <CIcon icon={cilWarning} className="me-2" />
                        {exportError}
                    </CAlert>
                )}

                {/* Account Summary Bar */}
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

                {/* Summary Cards - Uniform size with PnLTracker */}
                <CRow className="mb-4 g-3">
                    <CCol md={3}>
                        <div className="border rounded p-2">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                                <small className="text-muted">Total Trades</small>
                                <CIcon icon={cilHistory} className="text-primary" size="sm" />
                            </div>
                            <div className="fw-bold fs-6">{totalTrades}</div>
                            <small className="text-muted">Win Rate: {winRate.toFixed(1)}%</small>
                        </div>
                    </CCol>
                    <CCol md={3}>
                        <div className="border rounded p-2">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                                <small className="text-muted">Net Profit</small>
                                <CIcon icon={cilMoney} className="text-success" size="sm" />
                            </div>
                            <div className={`fw-bold fs-6 ${netProfit >= 0 ? 'text-success' : 'text-danger'}`}>
                                {netProfit >= 0 ? '+' : ''}{formatCurrency(netProfit)}
                            </div>
                            <small className="text-muted">{winningTrades}W / {losingTrades}L</small>
                        </div>
                    </CCol>
                    <CCol md={3}>
                        <div className="border rounded p-2">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                                <small className="text-muted">Avg Win/Loss</small>
                                <CIcon icon={cilBarChart} className="text-warning" size="sm" />
                            </div>
                            <div className="fw-bold fs-6">
                                <span className="text-success">{formatCurrency(avgProfit)}</span>
                                <span className="text-muted mx-1">/</span>
                                <span className="text-danger">{formatCurrency(Math.abs(avgLoss))}</span>
                            </div>
                            <small className="text-muted">PF: {profitFactor.toFixed(2)}</small>
                        </div>
                    </CCol>
                    <CCol md={3}>
                        <div className="border rounded p-2">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                                <small className="text-muted">Total Costs</small>
                                <CIcon icon={cilChartPie} className="text-info" size="sm" />
                            </div>
                            <div className="fw-bold fs-6">
                                <span className="text-danger">Comm: {formatCurrency(totalCommission)}</span>
                            </div>
                            <small className={totalSwap >= 0 ? 'text-success' : 'text-danger'}>
                                Swap: {totalSwap >= 0 ? '+' : ''}{formatCurrency(totalSwap)}
                            </small>
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
                        Trade Records
                    </h6>
                    <div className="d-flex gap-2">
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
                            <option value="all">All Types</option>
                            <option value="BUY">BUY</option>
                            <option value="SELL">SELL</option>
                        </CFormSelect>
                        <CFormSelect
                            size="sm"
                            style={{ width: '100px' }}
                            value={filterDate}
                            onChange={(e) => {
                                setFilterDate(e.target.value);
                                setCurrentPage(1);
                            }}
                        >
                            <option value="all">All Time</option>
                            <option value="today">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                        </CFormSelect>
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
                        <p className="text-muted mt-3">Loading trade history...</p>
                    </div>
                ) : (
                    <>
                        {/* Trade History Table */}
                        <CTable hover responsive className="mb-3 border">
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell className="small">Date</CTableHeaderCell>
                                    <CTableHeaderCell className="small">Symbol</CTableHeaderCell>
                                    <CTableHeaderCell className="small">Type</CTableHeaderCell>
                                    <CTableHeaderCell className="small text-end">Lots</CTableHeaderCell>
                                    <CTableHeaderCell className="small text-end">Entry</CTableHeaderCell>
                                    <CTableHeaderCell className="small text-end">Exit</CTableHeaderCell>
                                    <CTableHeaderCell className="small text-end">Profit</CTableHeaderCell>
                                    <CTableHeaderCell className="small text-end">Pips</CTableHeaderCell>
                                    <CTableHeaderCell className="small text-end">Net</CTableHeaderCell>
                                    <CTableHeaderCell className="small">Duration</CTableHeaderCell>
                                    <CTableHeaderCell className="small text-center">Details</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {currentItems.length > 0 ? (
                                    currentItems.map(trade => (
                                        <CTableRow key={trade.id}>
                                            <CTableDataCell className="small">
                                                <CIcon icon={cilClock} size="sm" className="me-1 text-muted" />
                                                {formatDateShort(trade.exitTime)}
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
                                            <CTableDataCell className="text-end small">
                                                {formatPrice(trade.entryPrice, trade.symbol)}
                                            </CTableDataCell>
                                            <CTableDataCell className="text-end small">
                                                {formatPrice(trade.exitPrice, trade.symbol)}
                                            </CTableDataCell>
                                            <CTableDataCell className={`text-end fw-semibold small ${trade.profit >= 0 ? 'text-success' : 'text-danger'}`}>
                                                {trade.profit >= 0 ? '+' : ''}{formatCurrency(trade.profit)}
                                            </CTableDataCell>
                                            <CTableDataCell className={`text-end small ${trade.profitPips >= 0 ? 'text-success' : 'text-danger'}`}>
                                                {trade.profitPips >= 0 ? '+' : ''}{trade.profitPips}
                                            </CTableDataCell>
                                            <CTableDataCell className={`text-end fw-semibold small ${trade.netProfit >= 0 ? 'text-success' : 'text-danger'}`}>
                                                {trade.netProfit >= 0 ? '+' : ''}{formatCurrency(trade.netProfit)}
                                            </CTableDataCell>
                                            <CTableDataCell className="small">{trade.duration}</CTableDataCell>
                                            <CTableDataCell className="text-center">
                                                <CButton
                                                    size="sm"
                                                    color="info"
                                                    variant="ghost"
                                                    onClick={() => {
                                                        setSelectedTrade(trade);
                                                        setDetailModalVisible(true);
                                                    }}
                                                >
                                                    <CIcon icon={cilZoom} size="sm" />
                                                </CButton>
                                            </CTableDataCell>
                                        </CTableRow>
                                    ))
                                ) : (
                                    <CTableRow>
                                        <CTableDataCell colSpan={11} className="text-center py-4 text-muted">
                                            <CIcon icon={cilBan} size="lg" className="mb-2" />
                                            <p>No trade history found matching your filters</p>
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

                        {/* Additional Metrics - Matching PnLTracker style */}
                        <CRow className="mt-4 g-3">
                            <CCol md={3}>
                                <div className="border rounded p-2">
                                    <small className="text-muted d-block">Best Trade</small>
                                    <span className="fw-semibold text-success">+{formatCurrency(bestTrade)}</span>
                                </div>
                            </CCol>
                            <CCol md={3}>
                                <div className="border rounded p-2">
                                    <small className="text-muted d-block">Worst Trade</small>
                                    <span className="fw-semibold text-danger">{formatCurrency(worstTrade)}</span>
                                </div>
                            </CCol>
                            <CCol md={3}>
                                <div className="border rounded p-2">
                                    <small className="text-muted d-block">Total Pips</small>
                                    <span className="fw-semibold text-info">{totalPips}</span>
                                </div>
                            </CCol>
                            <CCol md={3}>
                                <div className="border rounded p-2">
                                    <small className="text-muted d-block">Avg Pips/Trade</small>
                                    <span className="fw-semibold">{avgPipsPerTrade.toFixed(1)}</span>
                                </div>
                            </CCol>
                        </CRow>

                        <CRow className="mt-3 g-3">
                            <CCol md={3}>
                                <div className="border rounded p-2">
                                    <small className="text-muted d-block">Total Lots</small>
                                    <span className="fw-semibold text-warning">{totalLots.toFixed(2)}</span>
                                </div>
                            </CCol>
                            <CCol md={3}>
                                <div className="border rounded p-2">
                                    <small className="text-muted d-block">Expectancy</small>
                                    <span className={`fw-semibold ${expectancy >= 0 ? 'text-success' : 'text-danger'}`}>
                                        {expectancy >= 0 ? '+' : ''}{formatCurrency(expectancy)}
                                    </span>
                                </div>
                            </CCol>
                            <CCol md={3}>
                                <div className="border rounded p-2">
                                    <small className="text-muted d-block">Profit Factor</small>
                                    <span className="fw-semibold text-info">{profitFactor.toFixed(2)}</span>
                                </div>
                            </CCol>
                            <CCol md={3}>
                                <div className="border rounded p-2">
                                    <small className="text-muted d-block">Win/Loss Ratio</small>
                                    <span className="fw-semibold">{(avgProfit / Math.abs(avgLoss)).toFixed(2)}</span>
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
                    Trade history includes all closed positions with realized P&L.
                </div>
                <div className="d-flex gap-3">
                    <span>Connection: <span className="fw-semibold text-success">WebSocket</span></span>
                    <span>Data Source: <span className="fw-semibold">Closed Trades</span></span>
                    <span>
                        Net P&L: <span className={`fw-semibold ${netProfit >= 0 ? 'text-success' : 'text-danger'}`}>
                            {netProfit >= 0 ? '+' : ''}{formatCurrency(netProfit)}
                        </span>
                    </span>
                </div>
            </CCardFooter>

            {/* Trade Details Modal - Kept the same as it's already well-structured */}
            <CModal
                visible={detailModalVisible}
                onClose={() => setDetailModalVisible(false)}
                alignment="center"
                size="lg"
            >
                <CModalHeader>
                    <CModalTitle>Trade Details - {selectedTrade?.symbol}</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    {selectedTrade && (
                        <div>
                            <CRow className="mb-3">
                                <CCol sm={6}>
                                    <div className="border rounded p-2 mb-2">
                                        <small className="text-muted d-block">Trade Summary</small>
                                        <div className="d-flex justify-content-between">
                                            <span>Type:</span>
                                            <CBadge color={selectedTrade.type === 'BUY' ? 'success' : 'danger'}>
                                                {selectedTrade.type}
                                            </CBadge>
                                        </div>
                                        <div className="d-flex justify-content-between mt-1">
                                            <span>Symbol:</span>
                                            <span className="fw-semibold">{selectedTrade.symbol}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mt-1">
                                            <span>Lots:</span>
                                            <span className="fw-semibold">{selectedTrade.lots.toFixed(2)}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mt-1">
                                            <span>Status:</span>
                                            <CBadge color="secondary">CLOSED</CBadge>
                                        </div>
                                    </div>
                                </CCol>
                                <CCol sm={6}>
                                    <div className="border rounded p-2 mb-2">
                                        <small className="text-muted d-block">Price Details</small>
                                        <div className="d-flex justify-content-between mt-1">
                                            <span>Entry Price:</span>
                                            <span className="fw-semibold">{formatPrice(selectedTrade.entryPrice, selectedTrade.symbol)}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mt-1">
                                            <span>Exit Price:</span>
                                            <span className="fw-semibold">{formatPrice(selectedTrade.exitPrice, selectedTrade.symbol)}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mt-1">
                                            <span>Stop Loss:</span>
                                            <span className="text-danger">{formatPrice(selectedTrade.stopLoss, selectedTrade.symbol)}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mt-1">
                                            <span>Take Profit:</span>
                                            <span className="text-success">{formatPrice(selectedTrade.takeProfit, selectedTrade.symbol)}</span>
                                        </div>
                                    </div>
                                </CCol>
                            </CRow>

                            <CRow className="mb-3">
                                <CCol sm={6}>
                                    <div className="border rounded p-2">
                                        <small className="text-muted d-block">Time & Duration</small>
                                        <div className="d-flex justify-content-between mt-1">
                                            <span>Entry Time:</span>
                                            <span className="small">{formatDate(selectedTrade.entryTime)}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mt-1">
                                            <span>Exit Time:</span>
                                            <span className="small">{formatDate(selectedTrade.exitTime)}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mt-1">
                                            <span>Duration:</span>
                                            <span className="fw-semibold">{selectedTrade.duration}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mt-1">
                                            <span>Close Method:</span>
                                            <CBadge color={selectedTrade.closeMethod === 'market' ? 'info' : selectedTrade.closeMethod === 'limit' ? 'success' : 'warning'}>
                                                {selectedTrade.closeMethod}
                                            </CBadge>
                                        </div>
                                    </div>
                                </CCol>
                                <CCol sm={6}>
                                    <div className="border rounded p-2">
                                        <small className="text-muted d-block">Financial Result</small>
                                        <div className="d-flex justify-content-between mt-1">
                                            <span>Gross P&L:</span>
                                            <span className={selectedTrade.profit >= 0 ? 'text-success fw-semibold' : 'text-danger fw-semibold'}>
                                                {selectedTrade.profit >= 0 ? '+' : ''}{formatCurrency(selectedTrade.profit)}
                                            </span>
                                        </div>
                                        <div className="d-flex justify-content-between mt-1">
                                            <span>Commission:</span>
                                            <span className="text-danger">-{formatCurrency(selectedTrade.commission)}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mt-1">
                                            <span>Swap:</span>
                                            <span className={selectedTrade.swap >= 0 ? 'text-success' : 'text-danger'}>
                                                {selectedTrade.swap >= 0 ? '+' : ''}{formatCurrency(selectedTrade.swap)}
                                            </span>
                                        </div>
                                        <div className="d-flex justify-content-between mt-1 pt-1 border-top">
                                            <span className="fw-bold">Net P&L:</span>
                                            <span className={`fw-bold ${selectedTrade.netProfit >= 0 ? 'text-success' : 'text-danger'}`}>
                                                {selectedTrade.netProfit >= 0 ? '+' : ''}{formatCurrency(selectedTrade.netProfit)}
                                            </span>
                                        </div>
                                        <div className="d-flex justify-content-between mt-1">
                                            <span>Return %:</span>
                                            <span className={selectedTrade.returnPct >= 0 ? 'text-success' : 'text-danger'}>
                                                {selectedTrade.returnPct >= 0 ? '+' : ''}{selectedTrade.returnPct.toFixed(2)}%
                                            </span>
                                        </div>
                                    </div>
                                </CCol>
                            </CRow>

                            <div className="border rounded p-2">
                                <small className="text-muted d-block mb-2">Pip Analysis</small>
                                <CRow>
                                    <CCol sm={4}>
                                        <span className="text-muted">Pips Gained:</span>
                                        <span className="fw-semibold ms-2 text-success">{selectedTrade.profitPips >= 0 ? '+' : ''}{selectedTrade.profitPips}</span>
                                    </CCol>
                                    <CCol sm={4}>
                                        <span className="text-muted">Pip Value:</span>
                                        <span className="fw-semibold ms-2 text-info">
                                            {formatCurrency(Math.abs(selectedTrade.profit) / Math.abs(selectedTrade.profitPips))}
                                        </span>
                                    </CCol>
                                    <CCol sm={4}>
                                        <span className="text-muted">Margin Used:</span>
                                        <span className="fw-semibold ms-2 text-warning">{formatCurrency(selectedTrade.margin)}</span>
                                    </CCol>
                                </CRow>
                            </div>
                        </div>
                    )}
                </CModalBody>
                <CModalFooter>
                    <CButton
                        color="secondary"
                        variant="outline"
                        onClick={() => setDetailModalVisible(false)}
                    >
                        Close
                    </CButton>
                    <CButton
                        color="info"
                        onClick={() => setDetailModalVisible(false)}
                    >
                        <CIcon icon={cilCheck} className="me-2" />
                        OK
                    </CButton>
                </CModalFooter>
            </CModal>
        </CCard>
    );
};

export default TradeHistory;