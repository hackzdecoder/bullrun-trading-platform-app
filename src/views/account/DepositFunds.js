import React, { useState } from 'react';
import {
    CCard,
    CCardHeader,
    CCardBody,
    CCardFooter,
    CRow,
    CCol,
    CButton,
    CFormSelect,
    CInputGroup,
    CFormInput,
    CInputGroupText,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CBadge,
    CAlert,
    CSpinner,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
    cilBank,
    cilCreditCard,
    cilWallet,
    cilCheck,
    cilInfo,
    cilWarning,
    cilHistory,
    cilReload,
    cilDollar,
    cilArrowRight,
    cilArrowLeft,
    cilClock,
    cilCheckCircle,
    cilX,
} from '@coreui/icons';
import currency from 'currency.js';

const DepositFunds = () => {
    // State
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [depositAmount, setDepositAmount] = useState('');
    const [selectedCurrency, setSelectedCurrency] = useState('USD');
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [depositSuccess, setDepositSuccess] = useState(false);
    const [depositError, setDepositError] = useState('');
    const [processing, setProcessing] = useState(false);
    const [filterMethod, setFilterMethod] = useState('all');

    // Mock account data
    const accountData = {
        balance: 25840.75,
        equity: 26350.30,
        margin: 4250.15,
        freeMargin: 22100.15,
        marginLevel: 325.8,
        currency: 'USD'
    };

    // Mock deposit methods
    const depositMethods = [
        {
            id: 1,
            name: 'Bank Transfer',
            method: 'bank',
            icon: cilBank,
            processingTime: '1-3 business days',
            minAmount: 100,
            maxAmount: 50000,
            fee: 0,
            feeType: 'free',
            currencies: ['USD', 'EUR', 'GBP'],
            description: 'Direct bank transfer from your account',
            instructions: 'Use the provided bank details to complete transfer',
        },
        {
            id: 2,
            name: 'Credit / Debit Card',
            method: 'card',
            icon: cilCreditCard,
            processingTime: 'Instant',
            minAmount: 20,
            maxAmount: 10000,
            fee: 2.9,
            feeType: 'percentage',
            currencies: ['USD', 'EUR', 'GBP'],
            description: 'Visa, Mastercard, American Express',
            instructions: 'Enter your card details securely',
        },
        {
            id: 3,
            name: 'Cryptocurrency',
            method: 'crypto',
            icon: cilWallet,
            processingTime: '10-30 minutes',
            minAmount: 50,
            maxAmount: 100000,
            fee: 0.5,
            feeType: 'percentage',
            currencies: ['BTC', 'ETH', 'USDT'],
            description: 'Bitcoin, Ethereum, USDT',
            instructions: 'Send crypto to the provided wallet address',
        },
        {
            id: 4,
            name: 'Wire Transfer',
            method: 'wire',
            icon: cilBank,
            processingTime: '1-2 business days',
            minAmount: 500,
            maxAmount: 100000,
            fee: 15,
            feeType: 'fixed',
            currencies: ['USD', 'EUR', 'GBP'],
            description: 'International wire transfer',
            instructions: 'Use SWIFT code for international transfers',
        },
        {
            id: 5,
            name: 'E-Wallet',
            method: 'ewallet',
            icon: cilWallet,
            processingTime: 'Instant',
            minAmount: 10,
            maxAmount: 5000,
            fee: 1.5,
            feeType: 'percentage',
            currencies: ['USD', 'EUR'],
            description: 'PayPal, Skrill, Neteller',
            instructions: 'Login to your e-wallet to complete payment',
        },
    ];

    // Mock deposit history
    const depositHistory = [
        { id: 1, date: '2024-01-15', method: 'Bank Transfer', amount: 5000.00, currency: 'USD', status: 'completed', txid: 'TRX123456' },
        { id: 2, date: '2024-01-12', method: 'Credit Card', amount: 1000.00, currency: 'USD', status: 'completed', txid: 'TRX123457' },
        { id: 3, date: '2024-01-10', method: 'Cryptocurrency', amount: 2500.00, currency: 'BTC', status: 'completed', txid: '0xabc123def456' },
        { id: 4, date: '2024-01-08', method: 'Wire Transfer', amount: 10000.00, currency: 'USD', status: 'pending', txid: 'TRX123458' },
        { id: 5, date: '2024-01-05', method: 'E-Wallet', amount: 500.00, currency: 'USD', status: 'completed', txid: 'TRX123459' },
    ];

    // Filter methods
    const filteredMethods = filterMethod === 'all'
        ? depositMethods
        : depositMethods.filter(m => m.method === filterMethod);

    // Format functions
    const formatCurrency = (value) => currency(value, { precision: 2, symbol: '$' }).format();
    const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    // Calculate fee
    const calculateFee = () => {
        if (!selectedMethod || !depositAmount) return 0;
        const amount = parseFloat(depositAmount) || 0;
        if (selectedMethod.feeType === 'free') return 0;
        if (selectedMethod.feeType === 'fixed') return selectedMethod.fee;
        if (selectedMethod.feeType === 'percentage') return (amount * selectedMethod.fee) / 100;
        return 0;
    };

    // Calculate net deposit
    const calculateNetDeposit = () => {
        const amount = parseFloat(depositAmount) || 0;
        const fee = calculateFee();
        return amount - fee;
    };

    // Handle method selection
    const handleSelectMethod = (method) => {
        setSelectedMethod(method);
        setDepositError('');
    };

    // Handle deposit confirmation
    const handleDepositConfirm = () => {
        if (!selectedMethod) {
            setDepositError('Please select a deposit method');
            return;
        }

        const amount = parseFloat(depositAmount);
        if (!amount || amount <= 0) {
            setDepositError('Please enter a valid amount');
            return;
        }

        if (amount < selectedMethod.minAmount) {
            setDepositError(`Minimum deposit amount is ${formatCurrency(selectedMethod.minAmount)}`);
            return;
        }

        if (amount > selectedMethod.maxAmount) {
            setDepositError(`Maximum deposit amount is ${formatCurrency(selectedMethod.maxAmount)}`);
            return;
        }

        setConfirmModalVisible(true);
    };

    // Execute deposit
    const handleExecuteDeposit = () => {
        setProcessing(true);

        setTimeout(() => {
            setConfirmModalVisible(false);
            setDepositSuccess(true);
            setProcessing(false);

            setTimeout(() => {
                setDepositSuccess(false);
                setSelectedMethod(null);
                setDepositAmount('');
            }, 3000);
        }, 1500);
    };

    // Cancel selection
    const handleCancel = () => {
        setSelectedMethod(null);
        setDepositAmount('');
        setDepositError('');
    };

    // Get unique methods for filter
    const methods = ['all', ...new Set(depositMethods.map(m => m.method))];

    return (
        <CCard className="mb-4">
            <CCardHeader className="d-flex justify-content-between align-items-center">
                <div>
                    <h4 className="mb-0">
                        <CIcon icon={cilWallet} className="me-2 text-success" />
                        Deposit Funds
                    </h4>
                    <small className="text-muted">Add funds to your trading account</small>
                </div>
                <CBadge color="success">Secure Transaction</CBadge>
            </CCardHeader>

            <CCardBody>
                {/* Success Alert */}
                {depositSuccess && (
                    <CAlert color="success" className="mb-3" dismissible>
                        <CIcon icon={cilCheck} className="me-2" />
                        Deposit successful! Funds have been added to your account.
                    </CAlert>
                )}

                {/* Error Alert */}
                {depositError && (
                    <CAlert color="danger" className="mb-3" dismissible>
                        <CIcon icon={cilWarning} className="me-2" />
                        {depositError}
                    </CAlert>
                )}

                {/* Account Summary Bar */}
                <CRow className="mb-4 g-3">
                    <CCol md={3}>
                        <div className="border rounded p-2 text-center">
                            <small className="text-muted d-block">Current Balance</small>
                            <span className="fw-bold fs-5 text-success">{formatCurrency(accountData.balance)}</span>
                        </div>
                    </CCol>
                    <CCol md={3}>
                        <div className="border rounded p-2 text-center">
                            <small className="text-muted d-block">Equity</small>
                            <span className="fw-bold fs-5">{formatCurrency(accountData.equity)}</span>
                        </div>
                    </CCol>
                    <CCol md={3}>
                        <div className="border rounded p-2 text-center">
                            <small className="text-muted d-block">Free Margin</small>
                            <span className="fw-bold fs-5 text-success">{formatCurrency(accountData.freeMargin)}</span>
                        </div>
                    </CCol>
                    <CCol md={3}>
                        <div className="border rounded p-2 text-center">
                            <small className="text-muted d-block">Margin Level</small>
                            <span className="fw-bold fs-5" style={{ color: accountData.marginLevel > 300 ? '#0ECB81' : accountData.marginLevel > 150 ? '#F0B90B' : '#F6465D' }}>
                                {accountData.marginLevel.toFixed(1)}%
                            </span>
                        </div>
                    </CCol>
                </CRow>

                {/* Deposit Methods Table */}
                <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="mb-0">
                            <CIcon icon={cilWallet} className="me-2" />
                            Deposit Methods ({filteredMethods.length})
                        </h5>
                        <div className="d-flex gap-2">
                            <CFormSelect
                                size="sm"
                                style={{ width: '150px' }}
                                value={filterMethod}
                                onChange={(e) => setFilterMethod(e.target.value)}
                            >
                                {methods.map(method => (
                                    <option key={method} value={method}>
                                        {method === 'all' ? 'All Methods' : method.charAt(0).toUpperCase() + method.slice(1)}
                                    </option>
                                ))}
                            </CFormSelect>
                            <CButton size="sm" color="secondary" variant="outline">
                                <CIcon icon={cilReload} className="me-1" size="sm" />
                                Refresh
                            </CButton>
                        </div>
                    </div>

                    <CTable hover responsive className="mb-0 border">
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell style={{ width: '60px' }}>Select</CTableHeaderCell>
                                <CTableHeaderCell>Method</CTableHeaderCell>
                                <CTableHeaderCell>Processing Time</CTableHeaderCell>
                                <CTableHeaderCell className="text-end">Min Amount</CTableHeaderCell>
                                <CTableHeaderCell className="text-end">Max Amount</CTableHeaderCell>
                                <CTableHeaderCell className="text-end">Fee</CTableHeaderCell>
                                <CTableHeaderCell>Currencies</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {filteredMethods.length > 0 ? (
                                filteredMethods.map(method => (
                                    <CTableRow
                                        key={method.id}
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => handleSelectMethod(method)}
                                    >
                                        <CTableDataCell>
                                            <CButton
                                                size="sm"
                                                color={selectedMethod?.id === method.id ? 'success' : 'primary'}
                                                className="p-1 px-3"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSelectMethod(method);
                                                }}
                                            >
                                                {selectedMethod?.id === method.id ? 'Selected' : 'Select'}
                                            </CButton>
                                        </CTableDataCell>
                                        <CTableDataCell>
                                            <div className="d-flex align-items-center">
                                                <CIcon icon={method.icon} className="me-2 text-info" />
                                                <span className="fw-semibold">{method.name}</span>
                                            </div>
                                            <small className="text-muted d-block">{method.description}</small>
                                        </CTableDataCell>
                                        <CTableDataCell>
                                            <div className="d-flex align-items-center">
                                                <CIcon icon={cilClock} size="sm" className="me-1 text-muted" />
                                                {method.processingTime}
                                            </div>
                                        </CTableDataCell>
                                        <CTableDataCell className="text-end">{formatCurrency(method.minAmount)}</CTableDataCell>
                                        <CTableDataCell className="text-end">{formatCurrency(method.maxAmount)}</CTableDataCell>
                                        <CTableDataCell className="text-end">
                                            {method.fee === 0 ? (
                                                <CBadge color="success">Free</CBadge>
                                            ) : (
                                                <span className="text-warning">
                                                    {method.feeType === 'percentage' ? `${method.fee}%` : formatCurrency(method.fee)}
                                                </span>
                                            )}
                                        </CTableDataCell>
                                        <CTableDataCell>
                                            <div className="d-flex gap-1">
                                                {method.currencies.map(curr => (
                                                    <CBadge key={curr} color="secondary" className="me-1">{curr}</CBadge>
                                                ))}
                                            </div>
                                        </CTableDataCell>
                                    </CTableRow>
                                ))
                            ) : (
                                <CTableRow>
                                    <CTableDataCell colSpan={7} className="text-center py-4 text-muted">
                                        <CIcon icon={cilWallet} size="lg" className="mb-2" />
                                        <p>No deposit methods found</p>
                                    </CTableDataCell>
                                </CTableRow>
                            )}
                        </CTableBody>
                    </CTable>
                </div>

                {/* Deposit Form - Shows when method selected */}
                {selectedMethod ? (
                    <div className="mt-4 pt-3 border-top">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="mb-0">
                                <CIcon icon={selectedMethod.icon} className="me-2 text-info" />
                                {selectedMethod.name} Deposit
                            </h5>
                            <CButton
                                size="sm"
                                color="light"
                                variant="outline"
                                onClick={handleCancel}
                            >
                                <CIcon icon={cilX} className="me-1" size="sm" />
                                Change Method
                            </CButton>
                        </div>

                        {/* Method Details */}
                        <div className="border rounded p-3 mb-4 bg-light">
                            <CRow>
                                <CCol md={4}>
                                    <small className="text-muted d-block">Processing Time</small>
                                    <span className="fw-semibold">{selectedMethod.processingTime}</span>
                                </CCol>
                                <CCol md={4}>
                                    <small className="text-muted d-block">Limits</small>
                                    <span className="fw-semibold">
                                        {formatCurrency(selectedMethod.minAmount)} - {formatCurrency(selectedMethod.maxAmount)}
                                    </span>
                                </CCol>
                                <CCol md={4}>
                                    <small className="text-muted d-block">Fee</small>
                                    <span className={`fw-semibold ${selectedMethod.fee === 0 ? 'text-success' : 'text-warning'}`}>
                                        {selectedMethod.fee === 0 ? 'Free' :
                                            selectedMethod.feeType === 'percentage' ? `${selectedMethod.fee}%` : formatCurrency(selectedMethod.fee)}
                                    </span>
                                </CCol>
                            </CRow>
                            <div className="mt-2 small text-muted">
                                <CIcon icon={cilInfo} size="sm" className="me-1" />
                                {selectedMethod.instructions}
                            </div>
                        </div>

                        {/* Deposit Amount Input */}
                        <CRow className="mb-4">
                            <CCol md={6}>
                                <label className="form-label fw-semibold">Deposit Amount</label>
                                <CInputGroup>
                                    <CInputGroupText>
                                        <CIcon icon={cilDollar} />
                                    </CInputGroupText>
                                    <CFormInput
                                        type="number"
                                        value={depositAmount}
                                        onChange={(e) => setDepositAmount(e.target.value)}
                                        placeholder="Enter amount"
                                        min={selectedMethod.minAmount}
                                        max={selectedMethod.maxAmount}
                                        step="0.01"
                                    />
                                    <CFormSelect
                                        value={selectedCurrency}
                                        onChange={(e) => setSelectedCurrency(e.target.value)}
                                        style={{ maxWidth: '100px' }}
                                    >
                                        {selectedMethod.currencies.map(curr => (
                                            <option key={curr} value={curr}>{curr}</option>
                                        ))}
                                    </CFormSelect>
                                </CInputGroup>
                                <small className="text-muted">
                                    Min: {formatCurrency(selectedMethod.minAmount)} / Max: {formatCurrency(selectedMethod.maxAmount)}
                                </small>
                            </CCol>
                        </CRow>

                        {/* Fee Breakdown */}
                        {depositAmount && (
                            <div className="border rounded p-3 mb-4">
                                <h6 className="fw-semibold mb-3">Deposit Summary</h6>
                                <CRow>
                                    <CCol md={4}>
                                        <div className="d-flex justify-content-between mb-2">
                                            <span className="text-muted">Deposit Amount:</span>
                                            <span className="fw-semibold">{formatCurrency(parseFloat(depositAmount) || 0)}</span>
                                        </div>
                                    </CCol>
                                    <CCol md={4}>
                                        <div className="d-flex justify-content-between mb-2">
                                            <span className="text-muted">Fee:</span>
                                            <span className={`fw-semibold ${calculateFee() === 0 ? 'text-success' : 'text-warning'}`}>
                                                {calculateFee() === 0 ? 'Free' : formatCurrency(calculateFee())}
                                            </span>
                                        </div>
                                    </CCol>
                                    <CCol md={4}>
                                        <div className="d-flex justify-content-between mb-2">
                                            <span className="text-muted">Net Deposit:</span>
                                            <span className="fw-semibold text-success">{formatCurrency(calculateNetDeposit())}</span>
                                        </div>
                                    </CCol>
                                </CRow>
                                <div className="border-top pt-2 mt-2">
                                    <div className="d-flex justify-content-between">
                                        <span className="text-muted">New Balance After Deposit:</span>
                                        <span className="fw-bold text-success">
                                            {formatCurrency(accountData.balance + calculateNetDeposit())}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="d-flex gap-2">
                            <CButton
                                color="success"
                                size="lg"
                                className="flex-fill py-3"
                                onClick={handleDepositConfirm}
                                disabled={processing}
                            >
                                {processing ? (
                                    <CSpinner size="sm" className="me-2" />
                                ) : (
                                    <CIcon icon={cilWallet} className="me-2" size="lg" />
                                )}
                                Proceed to Deposit
                            </CButton>
                            <CButton
                                color="secondary"
                                variant="outline"
                                size="lg"
                                className="flex-fill py-3"
                                onClick={handleCancel}
                                disabled={processing}
                            >
                                Cancel
                            </CButton>
                        </div>

                        {/* Security Note */}
                        <div className="mt-3 small text-muted">
                            <CIcon icon={cilInfo} className="me-1" />
                            All deposits are secure and encrypted. Funds will be credited to your account after confirmation.
                        </div>
                    </div>
                ) : (
                    /* No Selection Message */
                    <div className="text-center py-5 border rounded">
                        <CIcon icon={cilWallet} size="3xl" className="mb-3 text-muted" />
                        <h6 className="mb-2">Select a Deposit Method</h6>
                        <p className="text-muted small mb-0">
                            Choose your preferred deposit method from the table above to add funds
                        </p>
                    </div>
                )}

                {/* Deposit History */}
                <div className="mt-5">
                    <h5 className="mb-3">
                        <CIcon icon={cilHistory} className="me-2" />
                        Recent Deposits
                    </h5>
                    <CTable hover responsive size="sm" className="mb-0 border">
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell>Date</CTableHeaderCell>
                                <CTableHeaderCell>Method</CTableHeaderCell>
                                <CTableHeaderCell className="text-end">Amount</CTableHeaderCell>
                                <CTableHeaderCell>Status</CTableHeaderCell>
                                <CTableHeaderCell>Transaction ID</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {depositHistory.map(deposit => (
                                <CTableRow key={deposit.id}>
                                    <CTableDataCell className="small">{formatDate(deposit.date)}</CTableDataCell>
                                    <CTableDataCell>{deposit.method}</CTableDataCell>
                                    <CTableDataCell className="text-end fw-semibold text-success">
                                        +{formatCurrency(deposit.amount)}
                                    </CTableDataCell>
                                    <CTableDataCell>
                                        <CBadge color={deposit.status === 'completed' ? 'success' : 'warning'}>
                                            {deposit.status === 'completed' ? <CIcon icon={cilCheckCircle} className="me-1" size="sm" /> : null}
                                            {deposit.status}
                                        </CBadge>
                                    </CTableDataCell>
                                    <CTableDataCell>
                                        <small className="text-muted">{deposit.txid}</small>
                                    </CTableDataCell>
                                </CTableRow>
                            ))}
                        </CTableBody>
                    </CTable>
                </div>
            </CCardBody>

            {/* Footer */}
            <CCardFooter className="d-flex justify-content-between align-items-center small text-muted">
                <div className="d-flex align-items-center">
                    <CIcon icon={cilInfo} className="me-2" />
                    Minimum deposit: $10 | Maximum deposit: $100,000
                </div>
                <div>
                    <span className="me-3">
                        <CIcon icon={cilCheckCircle} className="me-1 text-success" />
                        Secure SSL Encryption
                    </span>
                    <span>
                        <CIcon icon={cilBank} className="me-1 text-info" />
                        PCI Compliant
                    </span>
                </div>
            </CCardFooter>

            {/* Confirmation Modal */}
            <CModal
                visible={confirmModalVisible}
                onClose={() => setConfirmModalVisible(false)}
                alignment="center"
                size="lg"
            >
                <CModalHeader>
                    <CModalTitle>Confirm Deposit</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    {selectedMethod && (
                        <div>
                            <p className="mb-3 text-muted">Please review your deposit details:</p>

                            <div className="border rounded p-3 mb-3">
                                <CRow className="mb-3">
                                    <CCol sm={6}>
                                        <div className="mb-2">
                                            <span className="text-muted">Method:</span>
                                            <span className="fw-semibold ms-2">{selectedMethod.name}</span>
                                        </div>
                                        <div className="mb-2">
                                            <span className="text-muted">Amount:</span>
                                            <span className="fw-semibold ms-2">{formatCurrency(parseFloat(depositAmount) || 0)}</span>
                                        </div>
                                        <div className="mb-2">
                                            <span className="text-muted">Currency:</span>
                                            <span className="fw-semibold ms-2">{selectedCurrency}</span>
                                        </div>
                                    </CCol>
                                    <CCol sm={6}>
                                        <div className="mb-2">
                                            <span className="text-muted">Fee:</span>
                                            <span className={`fw-semibold ms-2 ${calculateFee() === 0 ? 'text-success' : 'text-warning'}`}>
                                                {calculateFee() === 0 ? 'Free' : formatCurrency(calculateFee())}
                                            </span>
                                        </div>
                                        <div className="mb-2">
                                            <span className="text-muted">Net Deposit:</span>
                                            <span className="fw-semibold ms-2 text-success">{formatCurrency(calculateNetDeposit())}</span>
                                        </div>
                                        <div className="mb-2">
                                            <span className="text-muted">Processing:</span>
                                            <span className="fw-semibold ms-2">{selectedMethod.processingTime}</span>
                                        </div>
                                    </CCol>
                                </CRow>
                            </div>

                            <div className="border rounded p-3">
                                <h6 className="fw-semibold mb-2">Instructions</h6>
                                <p className="small text-muted mb-0">{selectedMethod.instructions}</p>
                            </div>
                        </div>
                    )}
                </CModalBody>
                <CModalFooter>
                    <CButton
                        color="secondary"
                        variant="outline"
                        onClick={() => setConfirmModalVisible(false)}
                        disabled={processing}
                    >
                        Cancel
                    </CButton>
                    <CButton
                        color="success"
                        onClick={handleExecuteDeposit}
                        disabled={processing}
                    >
                        {processing ? (
                            <>
                                <CSpinner size="sm" className="me-2" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <CIcon icon={cilCheck} className="me-2" />
                                Confirm Deposit
                            </>
                        )}
                    </CButton>
                </CModalFooter>
            </CModal>
        </CCard>
    );
};

export default DepositFunds;