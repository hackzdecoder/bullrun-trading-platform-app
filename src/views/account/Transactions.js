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
    CInputGroup,
    CFormInput,
    CInputGroupText,
    CPagination,
    CPaginationItem,
    CSpinner,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
    cilTransfer,
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
    cilWallet,
    cilCreditCard,
    cilBank,
    cilCart,
    cilBolt,
    cilCalendar,
    cilUser,
    cilCheckCircle,
    cilWarning,
    cilCloudDownload,
} from '@coreui/icons';
import currency from 'currency.js';

const Transactions = () => {
    // State
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState([]);
    const [filterType, setFilterType] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const itemsPerPage = 8;

    // Mock transaction data
    const mockTransactions = [
        { id: 1, date: '2024-01-15 09:30', type: 'deposit', amount: 2500.00, currency: 'USD', method: 'Bank Transfer', status: 'completed', reference: 'DEP-2024-001', fee: 0.00, balance: 12580.45 },
        { id: 2, date: '2024-01-14 14:20', type: 'withdrawal', amount: -500.00, currency: 'USD', method: 'PayPal', status: 'pending', reference: 'WDR-2024-023', fee: 2.50, balance: 12315.60 },
        { id: 3, date: '2024-01-15 11:45', type: 'trade', amount: 264.85, currency: 'USD', method: 'EUR/USD', status: 'profit', reference: 'TRD-2024-089', fee: 1.20, balance: 12580.45 },
        { id: 4, date: '2024-01-14 10:15', type: 'trade', amount: -125.30, currency: 'USD', method: 'GBP/USD', status: 'loss', reference: 'TRD-2024-088', fee: 1.20, balance: 12315.60 },
        { id: 5, date: '2024-01-15 08:00', type: 'fee', amount: -2.50, currency: 'USD', method: 'Commission', status: 'completed', reference: 'FEE-2024-012', fee: 0.00, balance: 12580.45 },
        { id: 6, date: '2024-01-13 16:30', type: 'deposit', amount: 1000.00, currency: 'USD', method: 'Credit Card', status: 'completed', reference: 'DEP-2024-002', fee: 0.00, balance: 12440.90 },
        { id: 7, date: '2024-01-12 11:20', type: 'trade', amount: 342.50, currency: 'USD', method: 'BTC/USD', status: 'profit', reference: 'TRD-2024-087', fee: 1.50, balance: 12098.40 },
        { id: 8, date: '2024-01-11 15:45', type: 'withdrawal', amount: -300.00, currency: 'USD', method: 'Bank Transfer', status: 'completed', reference: 'WDR-2024-022', fee: 1.50, balance: 11913.20 },
        { id: 9, date: '2024-01-10 09:15', type: 'trade', amount: 425.75, currency: 'USD', method: 'ETH/USD', status: 'profit', reference: 'TRD-2024-086', fee: 1.20, balance: 11992.10 },
        { id: 10, date: '2024-01-09 14:30', type: 'deposit', amount: 500.00, currency: 'USD', method: 'PayPal', status: 'completed', reference: 'DEP-2024-003', fee: 0.00, balance: 11566.35 },
        { id: 11, date: '2024-01-08 10:45', type: 'trade', amount: -45.20, currency: 'USD', method: 'AUD/USD', status: 'loss', reference: 'TRD-2024-085', fee: 1.20, balance: 11334.90 },
        { id: 12, date: '2024-01-07 16:20', type: 'trade', amount: 189.30, currency: 'USD', method: 'USD/CAD', status: 'profit', reference: 'TRD-2024-084', fee: 1.20, balance: 11380.10 },
        { id: 13, date: '2024-01-06 11:10', type: 'withdrawal', amount: -200.00, currency: 'USD', method: 'Credit Card', status: 'completed', reference: 'WDR-2024-021', fee: 1.00, balance: 11190.80 },
        { id: 14, date: '2024-01-05 09:50', type: 'deposit', amount: 1500.00, currency: 'USD', method: 'Wire Transfer', status: 'completed', reference: 'DEP-2024-004', fee: 5.00, balance: 11000.50 },
        { id: 15, date: '2024-01-04 13:25', type: 'fee', amount: -10.00, currency: 'USD', method: 'Monthly Fee', status: 'completed', reference: 'FEE-2024-011', fee: 0.00, balance: 9500.50 },
    ];

    // Format functions
    const formatCurrency = (value) => currency(value, { precision: 2, symbol: '$' }).format();
    const formatDateTime = (date) => new Date(date).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    // Load data on mount
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setTransactions(mockTransactions);
            setLastUpdate(new Date());
            setLoading(false);
        }, 800);
    }, []);

    // Filter transactions
    const filteredTransactions = transactions.filter(t => {
        const matchesType = filterType === 'all' || t.type === filterType;
        const matchesStatus = filterStatus === 'all' || t.status === filterStatus;

        const matchesSearch = searchQuery === '' ||
            t.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.method.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.amount.toString().includes(searchQuery) ||
            formatCurrency(t.amount).includes(searchQuery) ||
            t.status.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesType && matchesStatus && matchesSearch;
    });

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

    // Get unique types and statuses for filters
    const types = ['all', ...new Set(transactions.map(t => t.type))];
    const statuses = ['all', ...new Set(transactions.map(t => t.status))];

    // Calculate totals
    const totalDeposits = filteredTransactions
        .filter(t => t.type === 'deposit')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalWithdrawals = filteredTransactions
        .filter(t => t.type === 'withdrawal')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const totalTradingPL = filteredTransactions
        .filter(t => t.type === 'trade')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalFees = filteredTransactions
        .filter(t => t.type === 'fee' || t.fee > 0)
        .reduce((sum, t) => sum + Math.abs(t.fee || (t.amount < 0 ? t.amount : 0)), 0);

    const netFlow = totalDeposits - totalWithdrawals + totalTradingPL - totalFees;

    // Get badge color for transaction type
    const getTypeBadgeColor = (type) => {
        switch (type) {
            case 'deposit': return 'success';
            case 'withdrawal': return 'warning';
            case 'trade': return 'info';
            case 'fee': return 'secondary';
            default: return 'light';
        }
    };

    // Get badge color for status
    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'completed': return 'success';
            case 'pending': return 'warning';
            case 'profit': return 'success';
            case 'loss': return 'danger';
            default: return 'light';
        }
    };

    // Get icon for transaction method
    const getMethodIcon = (method) => {
        if (method.includes('Bank')) return cilBank;
        if (method.includes('Credit')) return cilCreditCard;
        if (method.includes('PayPal')) return cilWallet;
        if (method.includes('Commission')) return cilCart;
        if (method.includes('EUR') || method.includes('GBP') || method.includes('USD')) return cilTransfer;
        return cilMoney;
    };

    return (
        <CCard className="mb-4">
            <CCardHeader className="d-flex justify-content-between align-items-center">
                <div>
                    <h4 className="mb-0">
                        <CIcon icon={cilTransfer} className="me-2 text-info" />
                        Transactions
                    </h4>
                    <small className="text-muted">Complete transaction history and financial activity</small>
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
                            <strong>Transaction Monitoring Active</strong>
                        </CCol>
                        <CCol md="auto" className="text-muted">
                            Total Transactions: <span className="fw-semibold">{filteredTransactions.length}</span>
                        </CCol>
                        <CCol md="auto" className="text-muted">
                            Period: <span className="fw-semibold">Last 30 Days</span>
                        </CCol>
                        <CCol md="auto" className="text-muted">
                            Currency: <span className="fw-semibold">USD</span>
                        </CCol>
                    </CRow>
                </div>

                {/* Summary Cards - 2x2 Grid */}
                <CRow className="mb-4 g-3">
                    <CCol md={6}>
                        <div className="border rounded p-3">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <span className="small text-muted">Total Deposits</span>
                                <CIcon icon={cilCloudDownload} className="text-success" />
                            </div>
                            <div className="fw-bold fs-4 text-success">+{formatCurrency(totalDeposits)}</div>
                            <small className="text-muted">Incoming funds</small>
                        </div>
                    </CCol>
                    <CCol md={6}>
                        <div className="border rounded p-3">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <span className="small text-muted">Total Withdrawals</span>
                                <CIcon icon={cilWallet} className="text-warning" />
                            </div>
                            <div className="fw-bold fs-4 text-danger">-{formatCurrency(totalWithdrawals)}</div>
                            <small className="text-muted">Outgoing funds</small>
                        </div>
                    </CCol>
                    <CCol md={6}>
                        <div className="border rounded p-3">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <span className="small text-muted">Trading P&L</span>
                                <CIcon icon={cilMoney} className="text-info" />
                            </div>
                            <div className={`fw-bold fs-4 ${totalTradingPL >= 0 ? 'text-success' : 'text-danger'}`}>
                                {totalTradingPL >= 0 ? '+' : ''}{formatCurrency(totalTradingPL)}
                            </div>
                            <small className="text-muted">From closed trades</small>
                        </div>
                    </CCol>
                    <CCol md={6}>
                        <div className="border rounded p-3">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <span className="small text-muted">Total Fees</span>
                                <CIcon icon={cilCart} className="text-secondary" />
                            </div>
                            <div className="fw-bold fs-4 text-warning">-{formatCurrency(totalFees)}</div>
                            <small className="text-muted">Commissions & charges</small>
                        </div>
                    </CCol>
                </CRow>

                {/* Net Flow Card */}
                <div className="mb-4">
                    <div className={`border rounded p-3 ${netFlow >= 0 ? 'border-success' : 'border-danger'}`}>
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <span className="small text-muted">NET FLOW</span>
                                <div className={`fw-bold fs-3 ${netFlow >= 0 ? 'text-success' : 'text-danger'}`}>
                                    {netFlow >= 0 ? '+' : '-'}{formatCurrency(Math.abs(netFlow))}
                                </div>
                            </div>
                            <CIcon
                                icon={netFlow >= 0 ? cilArrowTop : cilArrowBottom}
                                size="xl"
                                className={netFlow >= 0 ? 'text-success' : 'text-danger'}
                            />
                        </div>
                        <small className="text-muted">Overall financial impact (deposits - withdrawals + trading - fees)</small>
                    </div>
                </div>

                {/* Filters */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0">
                        <CIcon icon={cilFilter} className="me-2" />
                        Transaction History
                    </h6>
                    <div className="d-flex gap-2">
                        <div className="d-flex gap-2">
                            <CFormSelect
                                size="sm"
                                style={{ width: '120px' }}
                                value={filterType}
                                onChange={(e) => {
                                    setFilterType(e.target.value);
                                    setCurrentPage(1);
                                }}
                            >
                                {types.map(type => (
                                    <option key={type} value={type}>
                                        {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                                    </option>
                                ))}
                            </CFormSelect>
                            <CFormSelect
                                size="sm"
                                style={{ width: '120px' }}
                                value={filterStatus}
                                onChange={(e) => {
                                    setFilterStatus(e.target.value);
                                    setCurrentPage(1);
                                }}
                            >
                                {statuses.map(status => (
                                    <option key={status} value={status}>
                                        {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                                    </option>
                                ))}
                            </CFormSelect>
                            <CInputGroup size="sm" style={{ width: '250px' }}>
                                <CInputGroupText>
                                    <CIcon icon={cilSearch} />
                                </CInputGroupText>
                                <CFormInput
                                    placeholder="Search transactions..."
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
                                        setTransactions(mockTransactions);
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
                            Search results for "{searchQuery}": {filteredTransactions.length} transactions found
                        </span>
                    </div>
                )}

                {/* Loading State */}
                {loading ? (
                    <div className="text-center py-5">
                        <CSpinner color="primary" />
                        <p className="text-muted mt-3">Loading transaction history...</p>
                    </div>
                ) : (
                    <>
                        {/* Transactions Table */}
                        <CTable hover responsive className="mb-3 border">
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell className="small">Date & Time</CTableHeaderCell>
                                    <CTableHeaderCell className="small">Type</CTableHeaderCell>
                                    <CTableHeaderCell className="small">Method</CTableHeaderCell>
                                    <CTableHeaderCell className="small text-end">Amount</CTableHeaderCell>
                                    <CTableHeaderCell className="small text-end">Fee</CTableHeaderCell>
                                    <CTableHeaderCell className="small text-end">Balance</CTableHeaderCell>
                                    <CTableHeaderCell className="small">Status</CTableHeaderCell>
                                    <CTableHeaderCell className="small">Reference</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {currentItems.length > 0 ? (
                                    currentItems.map(transaction => (
                                        <CTableRow key={transaction.id}>
                                            <CTableDataCell className="small">
                                                <CIcon icon={cilClock} size="sm" className="me-1 text-muted" />
                                                {formatDateTime(transaction.date)}
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                <CBadge color={getTypeBadgeColor(transaction.type)}>
                                                    {transaction.type.toUpperCase()}
                                                </CBadge>
                                            </CTableDataCell>
                                            <CTableDataCell className="small">
                                                <CIcon icon={getMethodIcon(transaction.method)} size="sm" className="me-1 text-muted" />
                                                {transaction.method}
                                            </CTableDataCell>
                                            <CTableDataCell className={`text-end fw-semibold small ${transaction.amount >= 0 ? 'text-success' : 'text-danger'}`}>
                                                {transaction.amount >= 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                                            </CTableDataCell>
                                            <CTableDataCell className="text-end small text-warning">
                                                {transaction.fee > 0 ? `-${formatCurrency(transaction.fee)}` : '-'}
                                            </CTableDataCell>
                                            <CTableDataCell className="text-end fw-semibold small">
                                                {formatCurrency(transaction.balance)}
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                <CBadge color={getStatusBadgeColor(transaction.status)}>
                                                    {transaction.status.toUpperCase()}
                                                </CBadge>
                                            </CTableDataCell>
                                            <CTableDataCell className="small text-muted">{transaction.reference}</CTableDataCell>
                                        </CTableRow>
                                    ))
                                ) : (
                                    <CTableRow>
                                        <CTableDataCell colSpan={8} className="text-center py-4 text-muted">
                                            <CIcon icon={cilBan} size="lg" className="mb-2" />
                                            <p>No transactions found matching your criteria</p>
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
                        {filteredTransactions.length > itemsPerPage && (
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <small className="text-muted">
                                    Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredTransactions.length)} of {filteredTransactions.length} transactions
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

                        {/* Transaction Statistics - 2x2 Grid */}
                        <CRow className="mt-4 g-3">
                            <CCol md={3}>
                                <div className="border rounded p-2">
                                    <div className="small text-muted">Deposit Count</div>
                                    <div className="fw-semibold fs-5">
                                        {transactions.filter(t => t.type === 'deposit').length}
                                    </div>
                                </div>
                            </CCol>
                            <CCol md={3}>
                                <div className="border rounded p-2">
                                    <div className="small text-muted">Withdrawal Count</div>
                                    <div className="fw-semibold fs-5">
                                        {transactions.filter(t => t.type === 'withdrawal').length}
                                    </div>
                                </div>
                            </CCol>
                            <CCol md={3}>
                                <div className="border rounded p-2">
                                    <div className="small text-muted">Trade Count</div>
                                    <div className="fw-semibold fs-5">
                                        {transactions.filter(t => t.type === 'trade').length}
                                    </div>
                                </div>
                            </CCol>
                            <CCol md={3}>
                                <div className="border rounded p-2">
                                    <div className="small text-muted">Avg Transaction</div>
                                    <div className="fw-semibold fs-6">
                                        {formatCurrency(totalDeposits + totalWithdrawals + Math.abs(totalTradingPL) / transactions.length || 0)}
                                    </div>
                                </div>
                            </CCol>
                        </CRow>

                        <CRow className="mt-3 g-3">
                            <CCol md={3}>
                                <div className="border rounded p-2">
                                    <div className="small text-muted">Completed</div>
                                    <div className="fw-semibold fs-5 text-success">
                                        {transactions.filter(t => t.status === 'completed' || t.status === 'profit').length}
                                    </div>
                                </div>
                            </CCol>
                            <CCol md={3}>
                                <div className="border rounded p-2">
                                    <div className="small text-muted">Pending</div>
                                    <div className="fw-semibold fs-5 text-warning">
                                        {transactions.filter(t => t.status === 'pending').length}
                                    </div>
                                </div>
                            </CCol>
                            <CCol md={3}>
                                <div className="border rounded p-2">
                                    <div className="small text-muted">Losing Trades</div>
                                    <div className="fw-semibold fs-5 text-danger">
                                        {transactions.filter(t => t.status === 'loss').length}
                                    </div>
                                </div>
                            </CCol>
                            <CCol md={3}>
                                <div className="border rounded p-2">
                                    <div className="small text-muted">Success Rate</div>
                                    <div className="fw-semibold fs-5 text-info">
                                        {((transactions.filter(t => t.status === 'completed' || t.status === 'profit').length /
                                            transactions.filter(t => t.status !== 'pending').length) * 100).toFixed(1)}%
                                    </div>
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
                    Transactions update in real-time. All amounts shown in USD.
                </div>
                <div className="d-flex gap-3">
                    <span>Connection: <span className="fw-semibold text-success">Secure</span></span>
                    <span>Last Transaction: <span className="fw-semibold">{formatDateTime('2024-01-15 11:45')}</span></span>
                    <span>
                        Net Flow: <span className={netFlow >= 0 ? 'fw-semibold text-success' : 'fw-semibold text-danger'}>
                            {netFlow >= 0 ? '+' : '-'}{formatCurrency(Math.abs(netFlow))}
                        </span>
                    </span>
                </div>
            </CCardFooter>
        </CCard>
    );
};

export default Transactions;