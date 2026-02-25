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
    CProgress,
    CProgressBar,
    CAlert,
    CInputGroup,
    CFormInput,
    CInputGroupText,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
    cilWallet,
    cilDollar,
    cilInfo,
    cilReload,
    cilSpeedometer,
    cilArrowTop,
    cilArrowBottom,
    cilChart,
    cilCalculator,
    cilClock,
    cilWarning,
    cilCheckCircle,
    cilSearch,
    cilFilter,
    cilGraph,
    cilPeople,
    cilCart,
    cilBasket,
    cilBank,
    cilChartPie,
} from '@coreui/icons';
import currency from 'currency.js';

const AccountOverview = () => {
    // State
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const [showDetails, setShowDetails] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState('daily');
    const [searchTerm, setSearchTerm] = useState('');

    // Account data (simulated)
    const [accountData, setAccountData] = useState({
        // Core metrics
        balance: 25000.00,
        equity: 25750.50,
        usedMargin: 8450.75,
        freeMargin: 17299.75,
        marginLevel: 304.5,

        // Trading stats
        openPositions: 5,
        totalPnl: 750.50,
        dailyPnl: 125.25,
        weeklyPnl: 450.75,
        monthlyPnl: 1850.50,

        // Account info
        accountId: 'ACC-12345',
        accountType: 'Premium',
        currency: 'USD',
        leverage: '1:100',
        credit: 0.00,

        // Performance
        winRate: 68.5,
        profitFactor: 1.85,
        avgWin: 245.50,
        avgLoss: -132.75,
        totalTrades: 156,
        winningTrades: 107,
        losingTrades: 49,

        // Risk metrics
        dailyLossLimit: 5000.00,
        monthlyLossLimit: 15000.00,
        maxDrawdown: 1250.75,
        drawdownPercent: 4.85,
    });

    // Transaction history
    const [transactionHistory, setTransactionHistory] = useState([
        { id: 1, date: '2024-01-15 09:30', type: 'Deposit', amount: 5000.00, balance: 25000.00, status: 'Completed' },
        { id: 2, date: '2024-01-14 15:45', type: 'Withdrawal', amount: -2000.00, balance: 20000.00, status: 'Completed' },
        { id: 3, date: '2024-01-13 11:20', type: 'Trade P&L', amount: 125.25, balance: 22000.00, status: 'Completed' },
        { id: 4, date: '2024-01-12 16:30', type: 'Trade P&L', amount: -75.50, balance: 21874.75, status: 'Completed' },
        { id: 5, date: '2024-01-11 10:15', type: 'Commission', amount: -12.50, balance: 21950.25, status: 'Completed' },
        { id: 6, date: '2024-01-10 14:20', type: 'Swap', amount: -2.35, balance: 21962.75, status: 'Completed' },
        { id: 7, date: '2024-01-09 09:45', type: 'Deposit', amount: 3000.00, balance: 21965.10, status: 'Completed' },
        { id: 8, date: '2024-01-08 13:30', type: 'Trade P&L', amount: 320.50, balance: 18965.10, status: 'Completed' },
    ]);

    // Performance history
    const [performanceHistory, setPerformanceHistory] = useState([
        { period: '2024-01-15', trades: 4, profit: 450.00, loss: 120.00, net: 330.00, volume: 2.8 },
        { period: '2024-01-14', trades: 3, profit: 600.00, loss: 0, net: 600.00, volume: 2.3 },
        { period: '2024-01-13', trades: 2, profit: 70.00, loss: 0, net: 70.00, volume: 0.8 },
        { period: '2024-01-12', trades: 5, profit: 580.00, loss: 200.00, net: 380.00, volume: 3.2 },
        { period: '2024-01-11', trades: 3, profit: 90.00, loss: 0, net: 90.00, volume: 1.5 },
        { period: '2024-01-10', trades: 4, profit: 320.00, loss: 80.00, net: 240.00, volume: 2.1 },
        { period: '2024-01-09', trades: 2, profit: 300.00, loss: 0, net: 300.00, volume: 1.2 },
    ]);

    // Simulate real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            setLastUpdate(new Date());
            // Simulate small random changes
            setAccountData(prev => {
                const change = (Math.random() - 0.5) * 10;
                const newEquity = prev.equity + change;
                const newFreeMargin = newEquity - prev.usedMargin;
                const newMarginLevel = (newEquity / prev.usedMargin) * 100;

                return {
                    ...prev,
                    equity: newEquity,
                    freeMargin: newFreeMargin,
                    marginLevel: newMarginLevel,
                };
            });
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    // Format functions
    const formatCurrency = (value) => currency(value, { precision: 2, symbol: '$' }).format();
    const formatPercent = (value) => value.toFixed(1) + '%';
    const formatNumber = (value, decimals = 2) => value.toFixed(decimals);
    const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    // Margin level status
    const getMarginLevelStatus = (level) => {
        if (level > 300) return { text: 'Safe', color: 'success', icon: cilCheckCircle };
        if (level > 150) return { text: 'Warning', color: 'warning', icon: cilWarning };
        if (level > 120) return { text: 'High Risk', color: 'danger', icon: cilWarning };
        return { text: 'Liquidation Risk', color: 'dark', icon: cilWarning };
    };

    const marginStatus = getMarginLevelStatus(accountData.marginLevel);

    // Filter transaction history
    const filteredTransactions = transactionHistory.filter(item => {
        return searchTerm === '' ||
            item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            formatCurrency(item.amount).includes(searchTerm) ||
            item.status.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <CCard className="mb-4">
            <CCardHeader className="d-flex justify-content-between align-items-center">
                <div>
                    <h4 className="mb-0">
                        <CIcon icon={cilBank} className="me-2" />
                        Account Overview
                    </h4>
                    <small className="text-muted">Complete account summary and performance metrics</small>
                </div>
                <div className="d-flex gap-2 align-items-center">
                    <CBadge color="info" className="me-2">{accountData.accountType}</CBadge>
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
                        <CCol md="auto" className="text-muted">
                            Account: <span className="fw-semibold">{accountData.accountId}</span>
                        </CCol>
                        <CCol md="auto" className="text-muted">
                            Currency: <span className="fw-semibold">{accountData.currency}</span>
                        </CCol>
                    </CRow>
                </div>

                {/* Main Account Metrics */}
                <CRow className="mb-4">
                    <CCol md={4}>
                        <div className="border rounded p-3 text-center">
                            <small className="text-muted d-block">Balance</small>
                            <div className="fw-bold fs-2">{formatCurrency(accountData.balance)}</div>
                            <div className="d-flex justify-content-center gap-3 mt-2">
                                <span className="text-muted small">ID: {accountData.accountId}</span>
                                <span className="text-muted small">Leverage: {accountData.leverage}</span>
                            </div>
                        </div>
                    </CCol>
                    <CCol md={4}>
                        <div className="border rounded p-3 text-center">
                            <small className="text-muted d-block">Equity</small>
                            <div className="fw-bold fs-2 text-info">{formatCurrency(accountData.equity)}</div>
                            <div className="mt-2">
                                <span className="text-muted small me-3">P&L: </span>
                                <span className={`fw-semibold ${accountData.totalPnl >= 0 ? 'text-success' : 'text-danger'}`}>
                                    {accountData.totalPnl >= 0 ? '+' : ''}{formatCurrency(accountData.totalPnl)}
                                </span>
                            </div>
                        </div>
                    </CCol>
                    <CCol md={4}>
                        <div className="border rounded p-3 text-center">
                            <small className="text-muted d-block">Margin Level</small>
                            <div className={`fw-bold fs-2 text-${marginStatus.color}`}>
                                {formatPercent(accountData.marginLevel)}
                            </div>
                            <CBadge color={marginStatus.color} className="mt-2">
                                <CIcon icon={marginStatus.icon} className="me-1" size="sm" />
                                {marginStatus.text}
                            </CBadge>
                        </div>
                    </CCol>
                </CRow>

                {/* Margin Breakdown */}
                <CRow className="mb-4 g-3">
                    <CCol md={4}>
                        <div className="border rounded p-2">
                            <small className="text-muted d-block">Used Margin</small>
                            <span className="fw-bold fs-5 text-warning">{formatCurrency(accountData.usedMargin)}</span>
                            <CProgress height={4} className="mt-2">
                                <CProgressBar
                                    value={(accountData.usedMargin / accountData.equity) * 100}
                                    color="warning"
                                />
                            </CProgress>
                            <small className="text-muted">{((accountData.usedMargin / accountData.equity) * 100).toFixed(1)}% of equity</small>
                        </div>
                    </CCol>
                    <CCol md={4}>
                        <div className="border rounded p-2">
                            <small className="text-muted d-block">Free Margin</small>
                            <span className="fw-bold fs-5 text-success">{formatCurrency(accountData.freeMargin)}</span>
                            <CProgress height={4} className="mt-2">
                                <CProgressBar
                                    value={(accountData.freeMargin / accountData.equity) * 100}
                                    color="success"
                                />
                            </CProgress>
                            <small className="text-muted">{((accountData.freeMargin / accountData.equity) * 100).toFixed(1)}% of equity</small>
                        </div>
                    </CCol>
                    <CCol md={4}>
                        <div className="border rounded p-2">
                            <small className="text-muted d-block">Credit</small>
                            <span className="fw-bold fs-5 text-info">{formatCurrency(accountData.credit)}</span>
                            <div className="mt-2">
                                <small className="text-muted">Open Positions: </small>
                                <CBadge color="secondary">{accountData.openPositions}</CBadge>
                            </div>
                        </div>
                    </CCol>
                </CRow>

                {/* Performance Stats */}
                <CRow className="mb-4 g-3">
                    <CCol md={3}>
                        <div className="border rounded p-2">
                            <small className="text-muted d-block">Win Rate</small>
                            <span className="fw-bold fs-5 text-info">{accountData.winRate}%</span>
                            <div className="d-flex justify-content-between mt-1 small">
                                <span className="text-success">{accountData.winningTrades} wins</span>
                                <span className="text-danger">{accountData.losingTrades} losses</span>
                            </div>
                        </div>
                    </CCol>
                    <CCol md={3}>
                        <div className="border rounded p-2">
                            <small className="text-muted d-block">Profit Factor</small>
                            <span className="fw-bold fs-5 text-success">{accountData.profitFactor}</span>
                            <div className="d-flex justify-content-between mt-1 small">
                                <span>Avg Win: <span className="text-success">+{formatCurrency(accountData.avgWin)}</span></span>
                                <span>Avg Loss: <span className="text-danger">{formatCurrency(accountData.avgLoss)}</span></span>
                            </div>
                        </div>
                    </CCol>
                    <CCol md={3}>
                        <div className="border rounded p-2">
                            <small className="text-muted d-block">Total Trades</small>
                            <span className="fw-bold fs-5">{accountData.totalTrades}</span>
                            <div className="d-flex justify-content-between mt-1 small">
                                <span>Daily: {accountData.dailyPnl >= 0 ? '+' : ''}{formatCurrency(accountData.dailyPnl)}</span>
                                <span>Weekly: {accountData.weeklyPnl >= 0 ? '+' : ''}{formatCurrency(accountData.weeklyPnl)}</span>
                            </div>
                        </div>
                    </CCol>
                    <CCol md={3}>
                        <div className="border rounded p-2">
                            <small className="text-muted d-block">Max Drawdown</small>
                            <span className="fw-bold fs-5 text-danger">{formatCurrency(accountData.maxDrawdown)}</span>
                            <div className="d-flex justify-content-between mt-1 small">
                                <span className="text-muted">({accountData.drawdownPercent}%)</span>
                                <span className="text-muted">Daily Limit: {formatCurrency(accountData.dailyLossLimit)}</span>
                            </div>
                        </div>
                    </CCol>
                </CRow>

                {/* Risk Limits */}
                <div className="mb-4">
                    <h6 className="mb-3">
                        <CIcon icon={cilSpeedometer} className="me-2" />
                        Risk Limits
                    </h6>
                    <CRow className="g-3">
                        <CCol md={6}>
                            <div className="border rounded p-2">
                                <div className="d-flex justify-content-between mb-1">
                                    <small className="text-muted">Daily Loss Limit</small>
                                    <span className="fw-semibold">{formatCurrency(accountData.dailyLossLimit)}</span>
                                </div>
                                <CProgress height={4}>
                                    <CProgressBar
                                        value={(Math.abs(accountData.dailyPnl) / accountData.dailyLossLimit) * 100}
                                        color={Math.abs(accountData.dailyPnl) > accountData.dailyLossLimit * 0.8 ? 'danger' : 'warning'}
                                    />
                                </CProgress>
                                <small className="text-muted">Current loss: {formatCurrency(Math.abs(accountData.dailyPnl))}</small>
                            </div>
                        </CCol>
                        <CCol md={6}>
                            <div className="border rounded p-2">
                                <div className="d-flex justify-content-between mb-1">
                                    <small className="text-muted">Monthly Loss Limit</small>
                                    <span className="fw-semibold">{formatCurrency(accountData.monthlyLossLimit)}</span>
                                </div>
                                <CProgress height={4}>
                                    <CProgressBar
                                        value={(Math.abs(accountData.monthlyPnl) / accountData.monthlyLossLimit) * 100}
                                        color={Math.abs(accountData.monthlyPnl) > accountData.monthlyLossLimit * 0.8 ? 'danger' : 'warning'}
                                    />
                                </CProgress>
                                <small className="text-muted">Current loss: {formatCurrency(Math.abs(accountData.monthlyPnl))}</small>
                            </div>
                        </CCol>
                    </CRow>
                </div>

                {/* Performance History Table with Search */}
                <div className="mt-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="mb-0">
                            <CIcon icon={cilChartPie} className="me-2" />
                            Performance History
                        </h6>
                        <div className="d-flex gap-2">
                            <div className="btn-group" role="group">
                                <CButton
                                    size="sm"
                                    color={selectedPeriod === 'daily' ? 'primary' : 'secondary'}
                                    variant={selectedPeriod === 'daily' ? undefined : 'outline'}
                                    onClick={() => setSelectedPeriod('daily')}
                                >
                                    Daily
                                </CButton>
                                <CButton
                                    size="sm"
                                    color={selectedPeriod === 'weekly' ? 'primary' : 'secondary'}
                                    variant={selectedPeriod === 'weekly' ? undefined : 'outline'}
                                    onClick={() => setSelectedPeriod('weekly')}
                                >
                                    Weekly
                                </CButton>
                                <CButton
                                    size="sm"
                                    color={selectedPeriod === 'monthly' ? 'primary' : 'secondary'}
                                    variant={selectedPeriod === 'monthly' ? undefined : 'outline'}
                                    onClick={() => setSelectedPeriod('monthly')}
                                >
                                    Monthly
                                </CButton>
                            </div>
                            <CButton
                                size="sm"
                                color="secondary"
                                variant="outline"
                                onClick={() => setShowDetails(!showDetails)}
                            >
                                <CIcon icon={cilCalculator} className="me-1" />
                                {showDetails ? 'Hide Stats' : 'Show Stats'}
                            </CButton>
                        </div>
                    </div>

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
                            {performanceHistory.map((item, index) => (
                                <CTableRow key={index}>
                                    <CTableDataCell className="fw-semibold">{formatDate(item.period)}</CTableDataCell>
                                    <CTableDataCell className="text-end">{item.trades}</CTableDataCell>
                                    <CTableDataCell className="text-end text-success">+{formatCurrency(item.profit)}</CTableDataCell>
                                    <CTableDataCell className="text-end text-danger">-{formatCurrency(item.loss)}</CTableDataCell>
                                    <CTableDataCell className={`text-end fw-semibold ${item.net >= 0 ? 'text-success' : 'text-danger'}`}>
                                        {item.net >= 0 ? '+' : ''}{formatCurrency(item.net)}
                                    </CTableDataCell>
                                    <CTableDataCell className="text-end text-info">{item.volume}</CTableDataCell>
                                </CTableRow>
                            ))}
                        </CTableBody>
                    </CTable>
                </div>

                {/* Transaction History with Search */}
                <div className="mt-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="mb-0">
                            <CIcon icon={cilClock} className="me-2" />
                            Transaction History
                        </h6>
                        <CInputGroup size="sm" style={{ width: '250px' }}>
                            <CInputGroupText>
                                <CIcon icon={cilSearch} />
                            </CInputGroupText>
                            <CFormInput
                                placeholder="Search transactions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                autoComplete="off"
                            />
                        </CInputGroup>
                    </div>

                    <CTable hover responsive size="sm" className="mb-0 border">
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell className="small">Date</CTableHeaderCell>
                                <CTableHeaderCell className="small">Type</CTableHeaderCell>
                                <CTableHeaderCell className="small text-end">Amount</CTableHeaderCell>
                                <CTableHeaderCell className="small text-end">Balance</CTableHeaderCell>
                                <CTableHeaderCell className="small">Status</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {filteredTransactions.length > 0 ? (
                                filteredTransactions.map(item => (
                                    <CTableRow key={item.id}>
                                        <CTableDataCell className="fw-semibold small">{item.date}</CTableDataCell>
                                        <CTableDataCell>
                                            <CBadge color={
                                                item.type === 'Deposit' ? 'success' :
                                                    item.type === 'Withdrawal' ? 'danger' :
                                                        item.type === 'Trade P&L' ? (item.amount > 0 ? 'success' : 'danger') :
                                                            'warning'
                                            } size="sm">
                                                {item.type}
                                            </CBadge>
                                        </CTableDataCell>
                                        <CTableDataCell className={`text-end ${item.amount > 0 ? 'text-success' : 'text-danger'}`}>
                                            {item.amount > 0 ? '+' : ''}{formatCurrency(item.amount)}
                                        </CTableDataCell>
                                        <CTableDataCell className="text-end">{formatCurrency(item.balance)}</CTableDataCell>
                                        <CTableDataCell>
                                            <CBadge color={item.status === 'Completed' ? 'success' : 'warning'} size="sm">
                                                {item.status}
                                            </CBadge>
                                        </CTableDataCell>
                                    </CTableRow>
                                ))
                            ) : (
                                <CTableRow>
                                    <CTableDataCell colSpan={5} className="text-center py-4 text-muted">
                                        No transactions found matching "{searchTerm}"
                                    </CTableDataCell>
                                </CTableRow>
                            )}
                        </CTableBody>
                    </CTable>

                    {/* Search Results Count */}
                    {searchTerm && filteredTransactions.length > 0 && (
                        <div className="text-end mt-1 small text-muted">
                            Found {filteredTransactions.length} transaction(s)
                        </div>
                    )}
                </div>

                {/* Detailed Stats (Conditional) */}
                {showDetails && (
                    <div className="mt-4 border rounded p-3">
                        <h6 className="mb-3">
                            <CIcon icon={cilGraph} className="me-2" />
                            Detailed Statistics
                        </h6>
                        <CRow className="g-3">
                            <CCol md={3}>
                                <div className="border rounded p-2">
                                    <small className="text-muted d-block">Total Deposits</small>
                                    <span className="fw-bold">+{formatCurrency(28000)}</span>
                                </div>
                            </CCol>
                            <CCol md={3}>
                                <div className="border rounded p-2">
                                    <small className="text-muted d-block">Total Withdrawals</small>
                                    <span className="fw-bold text-danger">-{formatCurrency(2000)}</span>
                                </div>
                            </CCol>
                            <CCol md={3}>
                                <div className="border rounded p-2">
                                    <small className="text-muted d-block">Net Deposit</small>
                                    <span className="fw-bold text-success">{formatCurrency(26000)}</span>
                                </div>
                            </CCol>
                            <CCol md={3}>
                                <div className="border rounded p-2">
                                    <small className="text-muted d-block">Total P&L</small>
                                    <span className={`fw-bold ${accountData.totalPnl >= 0 ? 'text-success' : 'text-danger'}`}>
                                        {accountData.totalPnl >= 0 ? '+' : ''}{formatCurrency(accountData.totalPnl)}
                                    </span>
                                </div>
                            </CCol>
                            <CCol md={3}>
                                <div className="border rounded p-2">
                                    <small className="text-muted d-block">Commission Paid</small>
                                    <span className="fw-bold text-danger">-{formatCurrency(156.75)}</span>
                                </div>
                            </CCol>
                            <CCol md={3}>
                                <div className="border rounded p-2">
                                    <small className="text-muted d-block">Swap Paid</small>
                                    <span className="fw-bold text-danger">-{formatCurrency(23.45)}</span>
                                </div>
                            </CCol>
                            <CCol md={3}>
                                <div className="border rounded p-2">
                                    <small className="text-muted d-block">Avg Trade Duration</small>
                                    <span className="fw-bold">4.5h</span>
                                </div>
                            </CCol>
                            <CCol md={3}>
                                <div className="border rounded p-2">
                                    <small className="text-muted d-block">Best Trade</small>
                                    <span className="fw-bold text-success">+{formatCurrency(420.50)}</span>
                                </div>
                            </CCol>
                        </CRow>
                    </div>
                )}

                {/* Account Tips */}
                <CAlert color="info" className="mt-4 mb-0 small">
                    <CRow className="align-items-center">
                        <CCol md="auto">
                            <CIcon icon={cilInfo} size="lg" className="me-2" />
                        </CCol>
                        <CCol>
                            <strong>Account Summary:</strong> Your {accountData.accountType} account has a balance of {formatCurrency(accountData.balance)} with {accountData.openPositions} open positions.
                            Current margin level is {formatPercent(accountData.marginLevel)} ({marginStatus.text}).
                            You have {formatCurrency(accountData.freeMargin)} free margin available for new trades.
                        </CCol>
                    </CRow>
                </CAlert>
            </CCardBody>

            <CCardFooter className="d-flex justify-content-between align-items-center small text-muted">
                <div className="d-flex align-items-center">
                    <CIcon icon={cilInfo} className="me-2" />
                    Account data updates in real-time. Last updated: {lastUpdate.toLocaleTimeString()}
                </div>
                <div>
                    <span className="me-3">Account Type: <span className="fw-semibold text-info">{accountData.accountType}</span></span>
                    <span>Leverage: <span className="fw-semibold">{accountData.leverage}</span></span>
                </div>
            </CCardFooter>
        </CCard>
    );
};

export default AccountOverview;