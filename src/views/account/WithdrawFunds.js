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
    CAlert,
    CSpinner,
    CProgress,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
    cilWallet,
    cilDollar,
    cilArrowTop,
    cilArrowBottom,
    cilInfo,
    cilHistory,
    cilReload,
    cilClock,
    cilBank,
    cilCreditCard,
    cilCheck,
    cilWarning,
    cilX,
    cilBolt,
    cilCloudDownload,
    cilMoney,
    cilCalendar,
    cilUser,
    cilLockLocked,
    cilCheckCircle,
} from '@coreui/icons';
import currency from 'currency.js';

const WithdrawFunds = () => {
    // State
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Withdrawal form state
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [selectedMethod, setSelectedMethod] = useState('bank');
    const [selectedCurrency, setSelectedCurrency] = useState('USD');
    const [selectedAccount, setSelectedAccount] = useState('');
    const [withdrawNote, setWithdrawNote] = useState('');
    const [agreeTerms, setAgreeTerms] = useState(false);

    // Account data
    const accountData = {
        balance: 12580.45,
        equity: 13250.30,
        freeMargin: 10910.15,
        currency: 'USD',
        dailyWithdrawalLimit: 5000,
        monthlyWithdrawalLimit: 20000,
        dailyWithdrawn: 500,
        monthlyWithdrawn: 2450,
        pendingWithdrawals: 500,
        availableForWithdrawal: 10910.15,
        minWithdrawal: 10,
        maxWithdrawal: 5000,
        withdrawalFee: 2.50,
        feeType: 'fixed', // 'fixed' or 'percentage'
        feePercentage: 0.5,
    };

    // Withdrawal methods
    const withdrawalMethods = [
        { id: 'bank', name: 'Bank Transfer', icon: cilBank, processingTime: '1-3 business days', fee: 2.50, min: 50, max: 5000, currencies: ['USD', 'EUR', 'GBP'] },
        { id: 'paypal', name: 'PayPal', icon: cilWallet, processingTime: '24 hours', fee: 1.50, min: 10, max: 2000, currencies: ['USD', 'EUR'] },
        { id: 'card', name: 'Credit/Debit Card', icon: cilCreditCard, processingTime: '2-5 business days', fee: 3.00, min: 20, max: 3000, currencies: ['USD', 'EUR', 'GBP'] },
        { id: 'crypto', name: 'Cryptocurrency', icon: cilMoney, processingTime: '1-2 hours', fee: 0.50, min: 50, max: 5000, currencies: ['BTC', 'ETH', 'USDT'] },
        { id: 'wire', name: 'Wire Transfer', icon: cilBank, processingTime: '3-5 business days', fee: 5.00, min: 100, max: 10000, currencies: ['USD', 'EUR', 'GBP'] },
    ];

    // Saved accounts
    const savedAccounts = [
        { id: 1, method: 'bank', name: 'Chase Bank ****1234', accountNumber: '****1234', routing: '****5678', verified: true },
        { id: 2, method: 'paypal', name: 'user@email.com', email: 'user@email.com', verified: true },
        { id: 3, method: 'card', name: 'Visa ****4321', cardNumber: '****4321', expiry: '12/25', verified: true },
        { id: 4, method: 'crypto', name: 'BTC Wallet', address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', verified: false },
    ];

    // Withdrawal history
    const withdrawalHistory = [
        { id: 1, date: '2024-01-15', method: 'Bank Transfer', amount: 500.00, currency: 'USD', status: 'completed', reference: 'WDR-2024-023', processingDate: '2024-01-16' },
        { id: 2, date: '2024-01-12', method: 'PayPal', amount: 250.00, currency: 'USD', status: 'completed', reference: 'WDR-2024-022', processingDate: '2024-01-13' },
        { id: 3, date: '2024-01-10', method: 'Credit Card', amount: 1000.00, currency: 'USD', status: 'pending', reference: 'WDR-2024-021', processingDate: '2024-01-15' },
        { id: 4, date: '2024-01-08', method: 'Bank Transfer', amount: 750.00, currency: 'USD', status: 'completed', reference: 'WDR-2024-020', processingDate: '2024-01-09' },
        { id: 5, date: '2024-01-05', method: 'Crypto', amount: 200.00, currency: 'BTC', status: 'processing', reference: 'WDR-2024-019', processingDate: '2024-01-06' },
        { id: 6, date: '2024-01-03', method: 'PayPal', amount: 150.00, currency: 'USD', status: 'completed', reference: 'WDR-2024-018', processingDate: '2024-01-04' },
    ];

    // Format functions
    const formatCurrency = (value) => currency(value, { precision: 2, symbol: '$' }).format();
    const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    // Get selected method details
    const currentMethod = withdrawalMethods.find(m => m.id === selectedMethod) || withdrawalMethods[0];

    // Calculate fees
    const calculateFee = (amount) => {
        const numAmount = parseFloat(amount) || 0;
        if (accountData.feeType === 'fixed') {
            return currentMethod.fee;
        } else {
            return numAmount * (accountData.feePercentage / 100);
        }
    };

    const fee = calculateFee(withdrawAmount);
    const netAmount = (parseFloat(withdrawAmount) || 0) - fee;
    const remainingDailyLimit = accountData.dailyWithdrawalLimit - accountData.dailyWithdrawn;
    const remainingMonthlyLimit = accountData.monthlyWithdrawalLimit - accountData.monthlyWithdrawn;

    // Validation
    const isValidAmount = () => {
        const amount = parseFloat(withdrawAmount);
        if (isNaN(amount) || amount <= 0) return false;
        if (amount < currentMethod.min) return false;
        if (amount > currentMethod.max) return false;
        if (amount > accountData.availableForWithdrawal) return false;
        if (amount > remainingDailyLimit) return false;
        if (amount > remainingMonthlyLimit) return false;
        return true;
    };

    const isFormValid = () => {
        return isValidAmount() && selectedAccount && agreeTerms;
    };

    // Handle withdraw submit
    const handleWithdraw = () => {
        setError('');

        if (!isFormValid()) {
            setError('Please check all fields and ensure amount is valid');
            return;
        }

        setShowConfirmModal(true);
    };

    const confirmWithdraw = () => {
        setShowConfirmModal(false);
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
            setShowSuccessModal(true);
            setWithdrawAmount('');
            setSelectedAccount('');
            setAgreeTerms(false);
            setLastUpdate(new Date());
        }, 2000);
    };

    // Get status badge color
    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'completed': return 'success';
            case 'pending': return 'warning';
            case 'processing': return 'info';
            case 'cancelled': return 'danger';
            default: return 'secondary';
        }
    };

    // Filter accounts by selected method
    const filteredAccounts = savedAccounts.filter(acc => acc.method === selectedMethod);

    return (
        <CCard className="mb-4">
            <CCardHeader className="d-flex justify-content-between align-items-center">
                <div>
                    <h4 className="mb-0">
                        <CIcon icon={cilCloudDownload} className="me-2 text-warning" />
                        Withdraw Funds
                    </h4>
                    <small className="text-muted">Securely withdraw funds from your trading account</small>
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
                {/* Success/Error Alerts */}
                {error && (
                    <CAlert color="danger" className="mb-4">
                        <CIcon icon={cilWarning} className="me-2" />
                        {error}
                    </CAlert>
                )}

                {success && (
                    <CAlert color="success" className="mb-4">
                        <CIcon icon={cilCheckCircle} className="me-2" />
                        Withdrawal request submitted successfully!
                    </CAlert>
                )}

                {/* Live Status Bar */}
                <div className="border rounded p-2 mb-4 small">
                    <CRow className="align-items-center">
                        <CCol md="auto">
                            <CIcon icon={cilBolt} className="me-2 text-info" />
                            <strong>Withdrawal Status: Available</strong>
                        </CCol>
                        <CCol md="auto" className="text-muted">
                            Available Balance: <span className="fw-semibold text-success">{formatCurrency(accountData.availableForWithdrawal)}</span>
                        </CCol>
                        <CCol md="auto" className="text-muted">
                            Daily Limit: <span className="fw-semibold">{formatCurrency(remainingDailyLimit)}</span>
                        </CCol>
                        <CCol md="auto" className="text-muted">
                            Pending: <span className="fw-semibold text-warning">{formatCurrency(accountData.pendingWithdrawals)}</span>
                        </CCol>
                    </CRow>
                </div>

                {/* Main Withdrawal Form - Removed background */}
                <CRow>
                    <CCol lg={8}>
                        <div className="p-4 mb-4">
                            <h5 className="mb-4">Withdrawal Details</h5>

                            {/* Amount */}
                            <div className="mb-4">
                                <label className="form-label fw-semibold">Amount to Withdraw</label>
                                <CInputGroup>
                                    <CInputGroupText>{selectedCurrency}</CInputGroupText>
                                    <CFormInput
                                        type="number"
                                        placeholder={`Min: ${currentMethod.min} ${selectedCurrency}`}
                                        value={withdrawAmount}
                                        onChange={(e) => setWithdrawAmount(e.target.value)}
                                        step="0.01"
                                        min={currentMethod.min}
                                        max={Math.min(currentMethod.max, accountData.availableForWithdrawal)}
                                    />
                                    <CInputGroupText>.00</CInputGroupText>
                                </CInputGroup>
                                {withdrawAmount && (
                                    <div className="mt-2 small">
                                        <span className="text-muted me-3">Fee: {formatCurrency(fee)}</span>
                                        <span className="text-muted me-3">You'll receive: <span className="fw-semibold text-success">{formatCurrency(netAmount)}</span></span>
                                    </div>
                                )}
                            </div>

                            {/* Withdrawal Method */}
                            <div className="mb-4">
                                <label className="form-label fw-semibold">Withdrawal Method</label>
                                <CRow className="g-2">
                                    {withdrawalMethods.map(method => (
                                        <CCol md={4} key={method.id}>
                                            <div
                                                className={`border rounded p-2 ${selectedMethod === method.id ? 'border-primary bg-primary bg-opacity-10' : ''}`}
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => setSelectedMethod(method.id)}
                                            >
                                                <div className="d-flex align-items-center">
                                                    <CIcon icon={method.icon} className={`me-2 ${selectedMethod === method.id ? 'text-primary' : 'text-muted'}`} />
                                                    <div>
                                                        <div className="fw-semibold small">{method.name}</div>
                                                        <small className="text-muted">{method.processingTime}</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </CCol>
                                    ))}
                                </CRow>
                            </div>

                            {/* Saved Accounts */}
                            <div className="mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <label className="form-label fw-semibold mb-0">Select Withdrawal Account</label>
                                    <CButton size="sm" color="link" className="p-0">
                                        + Add New Account
                                    </CButton>
                                </div>
                                {filteredAccounts.length > 0 ? (
                                    <CRow className="g-2">
                                        {filteredAccounts.map(account => (
                                            <CCol md={6} key={account.id}>
                                                <div
                                                    className={`border rounded p-2 ${selectedAccount === account.id ? 'border-success bg-success bg-opacity-10' : ''}`}
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => setSelectedAccount(account.id)}
                                                >
                                                    <div className="d-flex justify-content-between align-items-start">
                                                        <div>
                                                            <div className="fw-semibold small">{account.name}</div>
                                                            <small className="text-muted">
                                                                {account.accountNumber || account.email || account.address?.substring(0, 15) + '...'}
                                                            </small>
                                                        </div>
                                                        {account.verified && (
                                                            <CBadge color="success" size="sm">Verified</CBadge>
                                                        )}
                                                    </div>
                                                </div>
                                            </CCol>
                                        ))}
                                    </CRow>
                                ) : (
                                    <div className="text-center py-3 border rounded">
                                        <p className="text-muted small mb-2">No saved accounts for this method</p>
                                        <CButton size="sm" color="primary">Add New Account</CButton>
                                    </div>
                                )}
                            </div>

                            {/* Notes */}
                            <div className="mb-4">
                                <label className="form-label fw-semibold">Additional Notes (Optional)</label>
                                <CFormInput
                                    placeholder="Any additional information for this withdrawal"
                                    value={withdrawNote}
                                    onChange={(e) => setWithdrawNote(e.target.value)}
                                />
                            </div>

                            {/* Terms Agreement */}
                            <div className="mb-4">
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="agreeTerms"
                                        checked={agreeTerms}
                                        onChange={(e) => setAgreeTerms(e.target.checked)}
                                    />
                                    <label className="form-check-label small" htmlFor="agreeTerms">
                                        I confirm that the withdrawal details are correct and I understand that fees may apply.
                                        Withdrawals are processed according to the platform's terms and conditions.
                                    </label>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="d-flex gap-2">
                                <CButton
                                    color="warning"
                                    className="text-white"
                                    disabled={!isFormValid() || loading}
                                    onClick={handleWithdraw}
                                >
                                    {loading ? (
                                        <>
                                            <CSpinner size="sm" className="me-2" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <CIcon icon={cilCloudDownload} className="me-2" />
                                            Withdraw Funds
                                        </>
                                    )}
                                </CButton>
                                <CButton
                                    color="secondary"
                                    variant="outline"
                                    onClick={() => {
                                        setWithdrawAmount('');
                                        setSelectedAccount('');
                                        setAgreeTerms(false);
                                        setError('');
                                    }}
                                >
                                    Clear Form
                                </CButton>
                            </div>
                        </div>
                    </CCol>

                    {/* Right Column - Summary & Limits */}
                    <CCol lg={4}>
                        {/* Account Summary */}
                        <div className="border rounded p-3 mb-4">
                            <h6 className="mb-3">Account Summary</h6>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted small">Balance:</span>
                                <span className="fw-semibold">{formatCurrency(accountData.balance)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted small">Equity:</span>
                                <span className="fw-semibold text-info">{formatCurrency(accountData.equity)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted small">Free Margin:</span>
                                <span className="fw-semibold text-success">{formatCurrency(accountData.freeMargin)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted small">Pending:</span>
                                <span className="fw-semibold text-warning">{formatCurrency(accountData.pendingWithdrawals)}</span>
                            </div>
                            <div className="d-flex justify-content-between pt-2 border-top">
                                <span className="text-muted small">Available:</span>
                                <span className="fw-semibold text-success">{formatCurrency(accountData.availableForWithdrawal)}</span>
                            </div>
                        </div>

                        {/* Withdrawal Limits */}
                        <div className="border rounded p-3 mb-4">
                            <h6 className="mb-3">Withdrawal Limits</h6>
                            <div className="mb-3">
                                <div className="d-flex justify-content-between mb-1">
                                    <span className="text-muted small">Daily Limit:</span>
                                    <span className="fw-semibold">{formatCurrency(remainingDailyLimit)} remaining</span>
                                </div>
                                <CProgress height={4} value={(accountData.dailyWithdrawn / accountData.dailyWithdrawalLimit) * 100} color="warning" />
                                <small className="text-muted">{formatCurrency(accountData.dailyWithdrawn)} used of {formatCurrency(accountData.dailyWithdrawalLimit)}</small>
                            </div>
                            <div className="mb-3">
                                <div className="d-flex justify-content-between mb-1">
                                    <span className="text-muted small">Monthly Limit:</span>
                                    <span className="fw-semibold">{formatCurrency(remainingMonthlyLimit)} remaining</span>
                                </div>
                                <CProgress height={4} value={(accountData.monthlyWithdrawn / accountData.monthlyWithdrawalLimit) * 100} color="info" />
                                <small className="text-muted">{formatCurrency(accountData.monthlyWithdrawn)} used of {formatCurrency(accountData.monthlyWithdrawalLimit)}</small>
                            </div>
                            <div className="small text-muted mt-2">
                                <CIcon icon={cilInfo} size="sm" className="me-1" />
                                Limits reset daily at 00:00 UTC
                            </div>
                        </div>

                        {/* Method Details */}
                        <div className="border rounded p-3">
                            <h6 className="mb-3">Method Details</h6>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted small">Method:</span>
                                <span className="fw-semibold">{currentMethod.name}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted small">Processing:</span>
                                <span className="fw-semibold">{currentMethod.processingTime}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted small">Fee:</span>
                                <span className="fw-semibold text-warning">{formatCurrency(currentMethod.fee)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted small">Min Amount:</span>
                                <span className="fw-semibold">{formatCurrency(currentMethod.min)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted small">Max Amount:</span>
                                <span className="fw-semibold">{formatCurrency(currentMethod.max)}</span>
                            </div>
                            <div className="d-flex justify-content-between">
                                <span className="text-muted small">Currencies:</span>
                                <span className="fw-semibold">{currentMethod.currencies.join(', ')}</span>
                            </div>
                        </div>
                    </CCol>
                </CRow>

                {/* Withdrawal History */}
                <div className="mt-4">
                    <h6 className="mb-3">
                        <CIcon icon={cilHistory} className="me-2" />
                        Recent Withdrawals
                    </h6>
                    <CTable hover responsive size="sm" className="mb-0 border">
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell className="small">Date</CTableHeaderCell>
                                <CTableHeaderCell className="small">Method</CTableHeaderCell>
                                <CTableHeaderCell className="small text-end">Amount</CTableHeaderCell>
                                <CTableHeaderCell className="small">Status</CTableHeaderCell>
                                <CTableHeaderCell className="small">Reference</CTableHeaderCell>
                                <CTableHeaderCell className="small">Processed</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {withdrawalHistory.map(item => (
                                <CTableRow key={item.id}>
                                    <CTableDataCell className="small">
                                        <CIcon icon={cilCalendar} size="sm" className="me-1 text-muted" />
                                        {formatDate(item.date)}
                                    </CTableDataCell>
                                    <CTableDataCell className="small">{item.method}</CTableDataCell>
                                    <CTableDataCell className="text-end fw-semibold text-warning small">
                                        {formatCurrency(item.amount)}
                                    </CTableDataCell>
                                    <CTableDataCell>
                                        <CBadge color={getStatusBadgeColor(item.status)}>
                                            {item.status.toUpperCase()}
                                        </CBadge>
                                    </CTableDataCell>
                                    <CTableDataCell className="small text-muted">{item.reference}</CTableDataCell>
                                    <CTableDataCell className="small text-muted">{formatDate(item.processingDate)}</CTableDataCell>
                                </CTableRow>
                            ))}
                        </CTableBody>
                    </CTable>
                </div>

                {/* Confirmation Modal */}
                <CModal visible={showConfirmModal} onClose={() => setShowConfirmModal(false)}>
                    <CModalHeader>
                        <CModalTitle>Confirm Withdrawal</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <p>Please confirm your withdrawal details:</p>
                        <div className="border rounded p-3 mb-3">
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Amount:</span>
                                <span className="fw-semibold text-warning">{formatCurrency(parseFloat(withdrawAmount))}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Fee:</span>
                                <span className="fw-semibold text-danger">-{formatCurrency(fee)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2 pt-2 border-top">
                                <span className="text-muted">You'll receive:</span>
                                <span className="fw-semibold text-success">{formatCurrency(netAmount)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Method:</span>
                                <span className="fw-semibold">{currentMethod.name}</span>
                            </div>
                            <div className="d-flex justify-content-between">
                                <span className="text-muted">Processing Time:</span>
                                <span className="fw-semibold">{currentMethod.processingTime}</span>
                            </div>
                        </div>
                        <p className="small text-muted mb-0">
                            By confirming, you authorize this withdrawal from your trading account.
                            This action cannot be undone.
                        </p>
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="secondary" variant="outline" onClick={() => setShowConfirmModal(false)}>
                            <CIcon icon={cilX} className="me-1" />
                            Cancel
                        </CButton>
                        <CButton color="warning" className="text-white" onClick={confirmWithdraw}>
                            <CIcon icon={cilCheck} className="me-1" />
                            Confirm Withdrawal
                        </CButton>
                    </CModalFooter>
                </CModal>

                {/* Success Modal */}
                <CModal visible={showSuccessModal} onClose={() => setShowSuccessModal(false)}>
                    <CModalHeader>
                        <CModalTitle>Withdrawal Submitted</CModalTitle>
                    </CModalHeader>
                    <CModalBody className="text-center py-4">
                        <CIcon icon={cilCheckCircle} size="3xl" className="text-success mb-3" />
                        <h5>Withdrawal Request Successful!</h5>
                        <p className="text-muted mb-0">
                            Your withdrawal of {formatCurrency(parseFloat(withdrawAmount))} has been submitted.
                            It will be processed within {currentMethod.processingTime}.
                        </p>
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="primary" onClick={() => setShowSuccessModal(false)}>
                            Done
                        </CButton>
                    </CModalFooter>
                </CModal>
            </CCardBody>

            {/* Footer */}
            <CCardFooter className="d-flex justify-content-between align-items-center small text-muted">
                <div className="d-flex align-items-center">
                    <CIcon icon={cilInfo} className="me-2" />
                    Withdrawals are processed securely. Fees may apply based on your selected method.
                </div>
                <div className="d-flex gap-3">
                    <span>Connection: <span className="fw-semibold text-success">Secure (SSL)</span></span>
                    <span>24/7 Support: <span className="fw-semibold">Live Chat</span></span>
                </div>
            </CCardFooter>
        </CCard>
    );
};

export default WithdrawFunds;