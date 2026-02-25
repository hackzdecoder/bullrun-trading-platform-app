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
    CFormInput,
    CInputGroupText,
    CProgress,
    CSpinner,
    CPagination,
    CPaginationItem,
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
    cilReload,
    cilSearch,
    cilFilter,
    cilClock,
    cilWallet,
    cilChart,
    cilX,
    cilCheck,
    cilWarning,
    cilBolt,
    cilCalculator,
    cilGraph,
    cilHistory,
} from '@coreui/icons';
import currency from 'currency.js';

const OpenPosition = () => {
    // State
    const [loading, setLoading] = useState(true);
    const [positions, setPositions] = useState([]);
    const [filterSymbol, setFilterSymbol] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [sortBy, setSortBy] = useState('symbol');
    const [sortDirection, setSortDirection] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [closeModalVisible, setCloseModalVisible] = useState(false);
    const [closeSuccess, setCloseSuccess] = useState(false);
    const [closeError, setCloseError] = useState('');
    const [closingPosition, setClosingPosition] = useState(false);
    const itemsPerPage = 5;

    // Mock open positions data
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
            swap: -0.25,
            margin: 541.25,
            duration: '2h 15m',
            stopLoss: 1.0800,
            takeProfit: 1.0880,
            entryTime: '2024-01-15 09:30',
            commission: 1.50,
            contractSize: 100000,
            spread: 1.2,
            session: 'London/New York',
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
            swap: 0.12,
            margin: 379.50,
            duration: '5h 30m',
            stopLoss: 1.2660,
            takeProfit: 1.2600,
            entryTime: '2024-01-15 11:20',
            commission: 0.90,
            contractSize: 100000,
            spread: 1.5,
            session: 'London/New York',
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
            swap: -0.45,
            margin: 1482.80,
            duration: '1d 3h',
            stopLoss: 148.10,
            takeProfit: 148.50,
            entryTime: '2024-01-14 22:15',
            commission: 3.00,
            contractSize: 100000,
            spread: 1.8,
            session: 'Asia/London',
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
            swap: -0.50,
            margin: 2157.50,
            duration: '4h 45m',
            stopLoss: 42500,
            takeProfit: 43500,
            entryTime: '2024-01-15 08:30',
            commission: 2.50,
            contractSize: 1,
            spread: 5.0,
            session: '24/7',
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
            swap: 0.08,
            margin: 526.40,
            duration: '1h 20m',
            stopLoss: 0.6600,
            takeProfit: 0.6570,
            entryTime: '2024-01-15 14:45',
            commission: 2.40,
            contractSize: 100000,
            spread: 1.3,
            session: 'Asia/Pacific',
        },
        {
            id: 6,
            symbol: 'USD/CAD',
            type: 'BUY',
            lots: 0.4,
            entryPrice: 1.3480,
            currentPrice: 1.3483,
            profit: 12.00,
            profitPips: 3,
            swap: -0.15,
            margin: 539.32,
            duration: '45m',
            stopLoss: 1.3470,
            takeProfit: 1.3490,
            entryTime: '2024-01-15 15:30',
            commission: 1.20,
            contractSize: 100000,
            spread: 1.4,
            session: 'New York/London',
        },
        {
            id: 7,
            symbol: 'ETH/USD',
            type: 'SELL',
            lots: 0.2,
            entryPrice: 2850,
            currentPrice: 2835,
            profit: -15.00,
            profitPips: -15,
            swap: 0.05,
            margin: 567.00,
            duration: '2h 10m',
            stopLoss: 2870,
            takeProfit: 2820,
            entryTime: '2024-01-15 13:15',
            commission: 0.60,
            contractSize: 1,
            spread: 2.5,
            session: '24/7',
        },
        {
            id: 8,
            symbol: 'XAU/USD',
            type: 'BUY',
            lots: 0.1,
            entryPrice: 2035.50,
            currentPrice: 2036.20,
            profit: 7.00,
            profitPips: 7,
            swap: -0.20,
            margin: 203.62,
            duration: '30m',
            stopLoss: 2030.00,
            takeProfit: 2040.00,
            entryTime: '2024-01-15 16:00',
            commission: 0.30,
            contractSize: 100,
            spread: 2.0,
            session: 'London/New York',
        },
    ];

    // Load positions on mount
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setPositions(mockPositions);
            setLastUpdate(new Date());
            setLoading(false);
        }, 1000);
    }, []);

    // Format functions
    const formatCurrency = (value) => currency(value, { precision: 2, symbol: '$' }).format();

    const formatPrice = (price, symbol) => {
        if (!price) return '0.0000';

        if (symbol.includes('JPY')) return price.toFixed(3);
        if (symbol.includes('BTC') || symbol.includes('ETH') || symbol.includes('XAU')) return price.toFixed(1);
        return price.toFixed(4);
    };

    const getSymbolDigits = (symbol) => {
        if (symbol.includes('JPY')) return 3;
        if (symbol.includes('BTC') || symbol.includes('ETH') || symbol.includes('XAU')) return 1;
        return 4;
    };

    const formatDuration = (duration) => duration;

    // Filter and sort positions
    const getFilteredPositions = () => {
        let filtered = [...positions];

        // Type filter
        if (filterType !== 'all') {
            filtered = filtered.filter(p => p.type === filterType);
        }

        // Search filter
        if (filterSymbol) {
            filtered = filtered.filter(p =>
                p.symbol.toLowerCase().includes(filterSymbol.toLowerCase())
            );
        }

        // Sort
        filtered.sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];

            if (sortBy === 'profit' || sortBy === 'margin' || sortBy === 'lots') {
                aValue = parseFloat(aValue);
                bValue = parseFloat(bValue);
            }

            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        return filtered;
    };

    // Handle sort
    const handleSort = (column) => {
        if (sortBy === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortDirection('asc');
        }
    };

    // Handle close position
    const handleCloseClick = (position) => {
        setSelectedPosition(position);
        setCloseModalVisible(true);
        setCloseError('');
    };

    const handleExecuteClose = () => {
        setClosingPosition(true);

        setTimeout(() => {
            // Remove position from list
            setPositions(prev => prev.filter(p => p.id !== selectedPosition.id));
            setCloseModalVisible(false);
            setCloseSuccess(true);
            setClosingPosition(false);

            setTimeout(() => {
                setCloseSuccess(false);
                setSelectedPosition(null);
            }, 3000);
        }, 1500);
    };

    // Calculate totals
    const filteredPositions = getFilteredPositions();
    const totalLots = filteredPositions.reduce((sum, p) => sum + p.lots, 0);
    const totalProfit = filteredPositions.reduce((sum, p) => sum + p.profit, 0);
    const totalMargin = filteredPositions.reduce((sum, p) => sum + p.margin, 0);
    const totalSwap = filteredPositions.reduce((sum, p) => sum + p.swap, 0);
    const winningPositions = filteredPositions.filter(p => p.profit > 0).length;
    const losingPositions = filteredPositions.filter(p => p.profit < 0).length;
    const winRate = filteredPositions.length > 0 ? (winningPositions / filteredPositions.length * 100).toFixed(1) : 0;

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredPositions.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredPositions.length / itemsPerPage);

    // Get unique symbols and types
    const symbols = ['', ...new Set(positions.map(p => p.symbol))];
    const types = ['all', 'BUY', 'SELL'];

    // Get sort icon
    const getSortIcon = (column) => {
        if (sortBy !== column) return null;
        return sortDirection === 'asc' ? ' ↑' : ' ↓';
    };

    return (
        <CCard className="mb-4">
            <CCardHeader className="d-flex justify-content-between align-items-center">
                <div>
                    <h4 className="mb-0">
                        <CIcon icon={cilGraph} className="me-2" />
                        Open Positions
                    </h4>
                    <small className="text-muted">Monitor and manage your active trades ({positions.length} open)</small>
                </div>
                <div className="d-flex align-items-center gap-3">
                    <CBadge color="success">
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
                {closeSuccess && (
                    <CAlert color="success" className="mb-3" dismissible>
                        <CIcon icon={cilCheck} className="me-2" />
                        Position closed successfully! P&L: {selectedPosition?.profit >= 0 ? '+' : ''}{formatCurrency(selectedPosition?.profit || 0)}
                    </CAlert>
                )}

                {/* Live Status Bar */}
                <div className="border rounded p-2 mb-4 small">
                    <CRow className="align-items-center">
                        <CCol md="auto">
                            <CIcon icon={cilBolt} className="me-2 text-info" />
                            <strong>Market Status: <span className="text-success">OPEN</span></strong>
                        </CCol>
                        <CCol md="auto" className="text-muted">
                            Total P&L: <span className={`fw-semibold ${totalProfit >= 0 ? 'text-success' : 'text-danger'}`}>
                                {totalProfit >= 0 ? '+' : ''}{formatCurrency(totalProfit)}
                            </span>
                        </CCol>
                        <CCol md="auto" className="text-muted">
                            Used Margin: <span className="fw-semibold text-warning">{formatCurrency(totalMargin)}</span>
                        </CCol>
                        <CCol md="auto" className="text-muted">
                            Win Rate: <span className="fw-semibold text-info">{winRate}%</span>
                        </CCol>
                    </CRow>
                </div>

                {/* Summary Cards */}
                <CRow className="mb-4 g-3">
                    <CCol md={3}>
                        <div className="border rounded p-2">
                            <small className="text-muted d-block">Total P&L</small>
                            <span className={`fw-bold fs-5 ${totalProfit >= 0 ? 'text-success' : 'text-danger'}`}>
                                {totalProfit >= 0 ? '+' : ''}{formatCurrency(totalProfit)}
                            </span>
                        </div>
                    </CCol>
                    <CCol md={3}>
                        <div className="border rounded p-2">
                            <small className="text-muted d-block">Used Margin</small>
                            <span className="fw-bold fs-5 text-warning">{formatCurrency(totalMargin)}</span>
                        </div>
                    </CCol>
                    <CCol md={3}>
                        <div className="border rounded p-2">
                            <small className="text-muted d-block">Total Swap</small>
                            <span className={`fw-bold fs-5 ${totalSwap >= 0 ? 'text-success' : 'text-danger'}`}>
                                {totalSwap >= 0 ? '+' : ''}{formatCurrency(totalSwap)}
                            </span>
                        </div>
                    </CCol>
                    <CCol md={3}>
                        <div className="border rounded p-2">
                            <small className="text-muted d-block">Win Rate</small>
                            <span className="fw-bold fs-5 text-info">{winRate}%</span>
                            <small className="text-muted d-block">{winningPositions}W / {losingPositions}L</small>
                        </div>
                    </CCol>
                </CRow>

                {/* Filters */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0">
                        <CIcon icon={cilFilter} className="me-2" />
                        Position List
                    </h6>
                    <div className="d-flex gap-2">
                        <CInputGroup size="sm" style={{ width: '200px' }}>
                            <CInputGroupText>
                                <CIcon icon={cilSearch} />
                            </CInputGroupText>
                            <CFormInput
                                placeholder="Search symbol..."
                                value={filterSymbol}
                                onChange={(e) => {
                                    setFilterSymbol(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                            {filterSymbol && (
                                <CButton
                                    color="secondary"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setFilterSymbol('')}
                                >
                                    Clear
                                </CButton>
                            )}
                        </CInputGroup>
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
                        <CFormSelect
                            size="sm"
                            style={{ width: '120px' }}
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="symbol">Sort by Symbol</option>
                            <option value="type">Sort by Type</option>
                            <option value="lots">Sort by Lots</option>
                            <option value="profit">Sort by P&L</option>
                            <option value="margin">Sort by Margin</option>
                            <option value="duration">Sort by Duration</option>
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
                            <CIcon icon={cilReload} className="me-1" />
                            Refresh
                        </CButton>
                    </div>
                </div>

                {/* Search Results Summary */}
                {filterSymbol && (
                    <div className="mb-2 small">
                        <span className="text-muted">
                            Search results for "{filterSymbol}": {filteredPositions.length} positions found
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
                                    <CTableHeaderCell onClick={() => handleSort('symbol')} style={{ cursor: 'pointer' }} className="small">
                                        Symbol {getSortIcon('symbol')}
                                    </CTableHeaderCell>
                                    <CTableHeaderCell onClick={() => handleSort('type')} style={{ cursor: 'pointer' }} className="small">
                                        Type {getSortIcon('type')}
                                    </CTableHeaderCell>
                                    <CTableHeaderCell onClick={() => handleSort('lots')} style={{ cursor: 'pointer' }} className="small text-end">
                                        Lots {getSortIcon('lots')}
                                    </CTableHeaderCell>
                                    <CTableHeaderCell className="small text-end">Entry</CTableHeaderCell>
                                    <CTableHeaderCell className="small text-end">Current</CTableHeaderCell>
                                    <CTableHeaderCell onClick={() => handleSort('profit')} style={{ cursor: 'pointer' }} className="small text-end">
                                        P&L {getSortIcon('profit')}
                                    </CTableHeaderCell>
                                    <CTableHeaderCell className="small text-end">Pips</CTableHeaderCell>
                                    <CTableHeaderCell className="small text-end">Swap</CTableHeaderCell>
                                    <CTableHeaderCell onClick={() => handleSort('margin')} style={{ cursor: 'pointer' }} className="small text-end">
                                        Margin {getSortIcon('margin')}
                                    </CTableHeaderCell>
                                    <CTableHeaderCell onClick={() => handleSort('duration')} style={{ cursor: 'pointer' }} className="small text-end">
                                        Duration {getSortIcon('duration')}
                                    </CTableHeaderCell>
                                    <CTableHeaderCell className="small text-end">SL/TP</CTableHeaderCell>
                                    <CTableHeaderCell className="small">Session</CTableHeaderCell>
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
                                                    <CIcon icon={pos.type === 'BUY' ? cilArrowTop : cilArrowBottom} className="me-1" size="sm" />
                                                    {pos.type}
                                                </CBadge>
                                            </CTableDataCell>
                                            <CTableDataCell className="text-end small">{pos.lots.toFixed(2)}</CTableDataCell>
                                            <CTableDataCell className="text-end small">{formatPrice(pos.entryPrice, pos.symbol)}</CTableDataCell>
                                            <CTableDataCell className="text-end small">{formatPrice(pos.currentPrice, pos.symbol)}</CTableDataCell>
                                            <CTableDataCell className={`text-end fw-semibold small ${pos.profit >= 0 ? 'text-success' : 'text-danger'}`}>
                                                {pos.profit >= 0 ? '+' : ''}{formatCurrency(pos.profit)}
                                            </CTableDataCell>
                                            <CTableDataCell className={`text-end small ${pos.profitPips >= 0 ? 'text-success' : 'text-danger'}`}>
                                                {pos.profitPips >= 0 ? '+' : ''}{pos.profitPips}
                                            </CTableDataCell>
                                            <CTableDataCell className={`text-end small ${pos.swap >= 0 ? 'text-success' : 'text-danger'}`}>
                                                {formatCurrency(pos.swap)}
                                            </CTableDataCell>
                                            <CTableDataCell className="text-end small text-warning">{formatCurrency(pos.margin)}</CTableDataCell>
                                            <CTableDataCell className="text-end small text-muted">
                                                <CIcon icon={cilClock} size="sm" className="me-1" />
                                                {pos.duration}
                                            </CTableDataCell>
                                            <CTableDataCell className="text-end small">
                                                <span className="text-danger">{formatPrice(pos.stopLoss, pos.symbol)}</span>
                                                <span className="text-muted mx-1">/</span>
                                                <span className="text-success">{formatPrice(pos.takeProfit, pos.symbol)}</span>
                                            </CTableDataCell>
                                            <CTableDataCell className="small text-muted">{pos.session}</CTableDataCell>
                                            <CTableDataCell className="text-center">
                                                <CButton
                                                    size="sm"
                                                    color="danger"
                                                    variant="ghost"
                                                    className="py-0 px-2"
                                                    onClick={() => handleCloseClick(pos)}
                                                >
                                                    <CIcon icon={cilX} size="sm" />
                                                </CButton>
                                            </CTableDataCell>
                                        </CTableRow>
                                    ))
                                ) : (
                                    <CTableRow>
                                        <CTableDataCell colSpan={14} className="text-center py-4 text-muted">
                                            No positions found matching your filters
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

                        {/* Position Analysis */}
                        {filteredPositions.length > 0 && (
                            <div className="mt-4">
                                <h6 className="mb-3">
                                    <CIcon icon={cilCalculator} className="me-2" />
                                    Position Analysis
                                </h6>
                                <CRow className="g-3">
                                    <CCol md={3}>
                                        <div className="border rounded p-2">
                                            <small className="text-muted d-block">Best Performer</small>
                                            <div className="fw-semibold text-success">
                                                +{formatCurrency(Math.max(...filteredPositions.map(p => p.profit)))}
                                            </div>
                                            <small className="text-muted">
                                                {filteredPositions.find(p => p.profit === Math.max(...filteredPositions.map(p => p.profit)))?.symbol}
                                            </small>
                                        </div>
                                    </CCol>
                                    <CCol md={3}>
                                        <div className="border rounded p-2">
                                            <small className="text-muted d-block">Worst Performer</small>
                                            <div className="fw-semibold text-danger">
                                                {formatCurrency(Math.min(...filteredPositions.map(p => p.profit)))}
                                            </div>
                                            <small className="text-muted">
                                                {filteredPositions.find(p => p.profit === Math.min(...filteredPositions.map(p => p.profit)))?.symbol}
                                            </small>
                                        </div>
                                    </CCol>
                                    <CCol md={3}>
                                        <div className="border rounded p-2">
                                            <small className="text-muted d-block">Avg Position Size</small>
                                            <div className="fw-semibold">
                                                {(filteredPositions.reduce((sum, p) => sum + p.lots, 0) / filteredPositions.length).toFixed(2)} lots
                                            </div>
                                        </div>
                                    </CCol>
                                    <CCol md={3}>
                                        <div className="border rounded p-2">
                                            <small className="text-muted d-block">Long/Short Ratio</small>
                                            <div className="d-flex align-items-center">
                                                <span className="fw-semibold text-success me-2">
                                                    {filteredPositions.filter(p => p.type === 'BUY').length}
                                                </span>
                                                <span className="text-muted">/</span>
                                                <span className="fw-semibold text-danger ms-2">
                                                    {filteredPositions.filter(p => p.type === 'SELL').length}
                                                </span>
                                            </div>
                                        </div>
                                    </CCol>
                                </CRow>
                            </div>
                        )}
                    </>
                )}
            </CCardBody>

            {/* Footer */}
            <CCardFooter className="d-flex justify-content-between align-items-center small text-muted">
                <div className="d-flex align-items-center">
                    <CIcon icon={cilInfo} className="me-2" />
                    Positions update in real-time. Click on column headers to sort.
                </div>
                <div className="d-flex gap-3">
                    <span>Total Lots: <span className="fw-semibold">{totalLots.toFixed(2)}</span></span>
                    <span>Total Exposure: <span className="fw-semibold text-warning">{formatCurrency(totalMargin)}</span></span>
                    <span>Net P&L: <span className={`fw-semibold ${totalProfit >= 0 ? 'text-success' : 'text-danger'}`}>
                        {totalProfit >= 0 ? '+' : ''}{formatCurrency(totalProfit)}
                    </span></span>
                </div>
            </CCardFooter>

            {/* Close Position Modal */}
            <CModal
                visible={closeModalVisible}
                onClose={() => setCloseModalVisible(false)}
                alignment="center"
                size="lg"
            >
                <CModalHeader>
                    <CModalTitle>Close Position - {selectedPosition?.symbol}</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    {selectedPosition && (
                        <div>
                            {closeError && (
                                <CAlert color="danger" className="mb-3">
                                    <CIcon icon={cilWarning} className="me-2" />
                                    {closeError}
                                </CAlert>
                            )}

                            <p className="mb-3 text-muted">Please review the details below:</p>

                            <div className="border rounded p-3 mb-3">
                                <CRow className="mb-3">
                                    <CCol sm={6}>
                                        <div className="mb-2">
                                            <span className="text-muted">Symbol:</span>
                                            <span className="fw-semibold ms-2">{selectedPosition.symbol}</span>
                                        </div>
                                        <div className="mb-2">
                                            <span className="text-muted">Type:</span>
                                            <CBadge color={selectedPosition.type === 'BUY' ? 'success' : 'danger'} className="ms-2">
                                                {selectedPosition.type}
                                            </CBadge>
                                        </div>
                                        <div className="mb-2">
                                            <span className="text-muted">Lots:</span>
                                            <span className="fw-semibold ms-2">{selectedPosition.lots.toFixed(2)}</span>
                                        </div>
                                    </CCol>
                                    <CCol sm={6}>
                                        <div className="mb-2">
                                            <span className="text-muted">Entry Price:</span>
                                            <span className="fw-semibold ms-2">{formatPrice(selectedPosition.entryPrice, selectedPosition.symbol)}</span>
                                        </div>
                                        <div className="mb-2">
                                            <span className="text-muted">Current Price:</span>
                                            <span className="fw-semibold ms-2">{formatPrice(selectedPosition.currentPrice, selectedPosition.symbol)}</span>
                                        </div>
                                        <div className="mb-2">
                                            <span className="text-muted">Duration:</span>
                                            <span className="fw-semibold ms-2">{selectedPosition.duration}</span>
                                        </div>
                                    </CCol>
                                </CRow>

                                <div className="border-top pt-3">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="fw-semibold">Realized P&L:</span>
                                        <span className={`fw-bold fs-4 ${selectedPosition.profit >= 0 ? 'text-success' : 'text-danger'}`}>
                                            {selectedPosition.profit >= 0 ? '+' : ''}{formatCurrency(selectedPosition.profit)}
                                        </span>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center mt-2">
                                        <span className="text-muted">Pips:</span>
                                        <span className={`fw-semibold ${selectedPosition.profitPips >= 0 ? 'text-success' : 'text-danger'}`}>
                                            {selectedPosition.profitPips >= 0 ? '+' : ''}{selectedPosition.profitPips}
                                        </span>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center mt-2">
                                        <span className="text-muted">Margin to Release:</span>
                                        <span className="fw-semibold text-success">
                                            +{formatCurrency(selectedPosition.margin)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {selectedPosition.profit < 0 && (
                                <CAlert color="warning" className="mb-0">
                                    <CIcon icon={cilWarning} className="me-2" />
                                    You are about to close a position at a loss of {formatCurrency(Math.abs(selectedPosition.profit))}.
                                    This will be deducted from your balance.
                                </CAlert>
                            )}
                        </div>
                    )}
                </CModalBody>
                <CModalFooter>
                    <CButton
                        color="secondary"
                        variant="outline"
                        onClick={() => setCloseModalVisible(false)}
                        disabled={closingPosition}
                    >
                        Cancel
                    </CButton>
                    <CButton
                        color="danger"
                        onClick={handleExecuteClose}
                        disabled={closingPosition}
                    >
                        {closingPosition ? (
                            <>
                                <CSpinner size="sm" className="me-2" />
                                Closing...
                            </>
                        ) : (
                            <>
                                <CIcon icon={cilCheck} className="me-2" />
                                Confirm Close
                            </>
                        )}
                    </CButton>
                </CModalFooter>
            </CModal>
        </CCard>
    );
};

export default OpenPosition;