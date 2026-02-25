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
    CFormSwitch,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CBadge,
    CAlert,
    CProgress,
    CProgressBar,
    CNav,
    CNavItem,
    CNavLink,
    CTabContent,
    CTabPane,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
    cilWarning,
    cilShieldAlt,
    cilSpeedometer,
    cilArrowTop,
    cilArrowBottom,
    cilInfo,
    cilHistory,
    cilReload,
    cilClock,
    cilBolt,
    cilCheck,
    cilX,
    cilDollar,
    cilWallet,
    cilGraph,
    cilBarChart,
    cilChartPie,
    cilSettings,
    cilLockLocked,
    cilCheckCircle,
    cilOptions,
    cilCalculator,
} from '@coreui/icons';
import currency from 'currency.js';

const RiskSettings = () => {
    // State
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const [activeTab, setActiveTab] = useState(0); // Changed to index-based
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [saveError, setSaveError] = useState('');

    // Risk settings state
    const [settings, setSettings] = useState({
        // General Settings
        maxRiskPerTrade: 2.0,
        maxDailyLoss: 5.0,
        maxWeeklyLoss: 15.0,
        maxMonthlyLoss: 25.0,
        maxOpenPositions: 10,
        maxLotsPerTrade: 5.0,
        maxPositionSize: 10000,

        // Stop Loss Settings
        defaultStopLoss: true,
        defaultStopLossPips: 20,
        trailingStopEnabled: true,
        trailingStopDistance: 15,
        guaranteedStopLoss: false,
        guaranteedStopFee: 0.5,

        // Take Profit Settings
        defaultTakeProfit: true,
        defaultTakeProfitPips: 40,
        riskRewardRatio: 2.0,
        autoLockProfits: true,
        lockProfitPercentage: 50,

        // Margin Settings
        maxLeverage: 100,
        autoReduceLeverage: true,
        marginCallWarning: 150,
        stopOutLevel: 80,
        autoClosePositions: true,

        // Alerts & Notifications
        priceAlerts: true,
        marginAlerts: true,
        pnlAlerts: true,
        emailNotifications: true,
        pushNotifications: false,
        smsNotifications: false,

        // Trade Protection
        oneClickTrading: false,
        confirmLargeTrades: true,
        largeTradeThreshold: 5000,
        maxSlippage: 0.5,
        autoHedging: false,
    });

    // Risk history
    const riskHistory = [
        { date: '2024-01-15', maxRisk: 2.0, dailyLoss: 2.15, weeklyLoss: 8.5, monthlyLoss: 15.2, violations: 0 },
        { date: '2024-01-14', maxRisk: 2.0, dailyLoss: 1.8, weeklyLoss: 7.2, monthlyLoss: 13.8, violations: 0 },
        { date: '2024-01-13', maxRisk: 2.0, dailyLoss: 2.5, weeklyLoss: 6.5, monthlyLoss: 12.5, violations: 1 },
        { date: '2024-01-12', maxRisk: 2.0, dailyLoss: 1.2, weeklyLoss: 4.8, monthlyLoss: 10.2, violations: 0 },
        { date: '2024-01-11', maxRisk: 2.0, dailyLoss: 3.1, weeklyLoss: 3.9, monthlyLoss: 8.7, violations: 1 },
    ];

    // Risk warnings
    const riskWarnings = [
        { id: 1, type: 'Daily Loss', value: '2.15%', limit: '5.0%', status: 'safe', message: 'Within daily limit' },
        { id: 2, type: 'Weekly Loss', value: '8.5%', limit: '15.0%', status: 'warning', message: 'Approaching weekly limit' },
        { id: 3, type: 'Monthly Loss', value: '15.2%', limit: '25.0%', status: 'safe', message: 'Within monthly limit' },
        { id: 4, type: 'Open Positions', value: '5', limit: '10', status: 'safe', message: 'Below maximum' },
    ];

    // Format functions
    const formatCurrency = (value) => currency(value, { precision: 2, symbol: '$' }).format();
    const formatNumber = (value, decimals = 2) => Number(value).toFixed(decimals);
    const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    // Handle setting change
    const handleSettingChange = (key, value) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // Save settings
    const saveSettings = () => {
        setSaveError('');
        // Simulate API call
        setTimeout(() => {
            setSaveSuccess(true);
            setLastUpdate(new Date());
            setTimeout(() => setSaveSuccess(false), 3000);
        }, 500);
    };

    // Reset to defaults
    const resetToDefaults = () => {
        setSettings({
            maxRiskPerTrade: 2.0,
            maxDailyLoss: 5.0,
            maxWeeklyLoss: 15.0,
            maxMonthlyLoss: 25.0,
            maxOpenPositions: 10,
            maxLotsPerTrade: 5.0,
            maxPositionSize: 10000,
            defaultStopLoss: true,
            defaultStopLossPips: 20,
            trailingStopEnabled: true,
            trailingStopDistance: 15,
            guaranteedStopLoss: false,
            guaranteedStopFee: 0.5,
            defaultTakeProfit: true,
            defaultTakeProfitPips: 40,
            riskRewardRatio: 2.0,
            autoLockProfits: true,
            lockProfitPercentage: 50,
            maxLeverage: 100,
            autoReduceLeverage: true,
            marginCallWarning: 150,
            stopOutLevel: 80,
            autoClosePositions: true,
            priceAlerts: true,
            marginAlerts: true,
            pnlAlerts: true,
            emailNotifications: true,
            pushNotifications: false,
            smsNotifications: false,
            oneClickTrading: false,
            confirmLargeTrades: true,
            largeTradeThreshold: 5000,
            maxSlippage: 0.5,
            autoHedging: false,
        });
    };

    // Get status badge color
    const getStatusColor = (status) => {
        switch (status) {
            case 'safe': return 'success';
            case 'warning': return 'warning';
            case 'danger': return 'danger';
            default: return 'secondary';
        }
    };

    return (
        <CCard className="mb-4">
            <CCardHeader className="d-flex justify-content-between align-items-center">
                <div>
                    <h4 className="mb-0">
                        <CIcon icon={cilShieldAlt} className="me-2 text-warning" />
                        Risk Settings
                    </h4>
                    <small className="text-muted">Configure risk management parameters and trading limits</small>
                </div>
                <div className="d-flex align-items-center gap-2">
                    <CBadge color="info">
                        <CIcon icon={cilBolt} className="me-1" size="sm" />
                        ACTIVE
                    </CBadge>
                    <span className="text-muted small">
                        Last Update: {lastUpdate.toLocaleTimeString()}
                    </span>
                </div>
            </CCardHeader>

            <CCardBody>
                {/* Success/Error Alerts */}
                {saveSuccess && (
                    <CAlert color="success" className="mb-4">
                        <CIcon icon={cilCheckCircle} className="me-2" />
                        Risk settings saved successfully!
                    </CAlert>
                )}
                {saveError && (
                    <CAlert color="danger" className="mb-4">
                        <CIcon icon={cilWarning} className="me-2" />
                        {saveError}
                    </CAlert>
                )}

                {/* Live Status Bar */}
                <div className="border rounded p-2 mb-4 small">
                    <CRow className="align-items-center">
                        <CCol md="auto">
                            <CIcon icon={cilBolt} className="me-2 text-info" />
                            <strong>Risk Protection: Active</strong>
                        </CCol>
                        <CCol md="auto" className="text-muted">
                            Current Risk Level: <span className="fw-semibold text-warning">Moderate</span>
                        </CCol>
                        <CCol md="auto" className="text-muted">
                            Today's Loss: <span className="fw-semibold text-danger">2.15%</span>
                        </CCol>
                        <CCol md="auto" className="text-muted">
                            Positions: <span className="fw-semibold">5/10</span>
                        </CCol>
                    </CRow>
                </div>

                {/* Risk Warnings */}
                <CRow className="mb-4 g-3">
                    {riskWarnings.map(warning => (
                        <CCol md={3} key={warning.id}>
                            <div className={`border rounded p-2 border-${getStatusColor(warning.status)}`}>
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="small text-muted">{warning.type}</span>
                                    <CBadge color={getStatusColor(warning.status)}>
                                        {warning.status.toUpperCase()}
                                    </CBadge>
                                </div>
                                <div className="fw-semibold mt-1">
                                    {warning.value} / {warning.limit}
                                </div>
                                <small className="text-muted">{warning.message}</small>
                            </div>
                        </CCol>
                    ))}
                </CRow>

                {/* Settings Tabs - Fixed with CNav and CTabContent */}
                <CNav variant="tabs" className="mb-4">
                    <CNavItem>
                        <CNavLink
                            active={activeTab === 0}
                            onClick={() => setActiveTab(0)}
                        >
                            <CIcon icon={cilSettings} className="me-2" />
                            General
                        </CNavLink>
                    </CNavItem>
                    <CNavItem>
                        <CNavLink
                            active={activeTab === 1}
                            onClick={() => setActiveTab(1)}
                        >
                            <CIcon icon={cilShieldAlt} className="me-2" />
                            Stop Loss
                        </CNavLink>
                    </CNavItem>
                    <CNavItem>
                        <CNavLink
                            active={activeTab === 2}
                            onClick={() => setActiveTab(2)}
                        >
                            <CIcon icon={cilArrowTop} className="me-2" />
                            Take Profit
                        </CNavLink>
                    </CNavItem>
                    <CNavItem>
                        <CNavLink
                            active={activeTab === 3}
                            onClick={() => setActiveTab(3)}
                        >
                            <CIcon icon={cilSpeedometer} className="me-2" />
                            Margin
                        </CNavLink>
                    </CNavItem>
                    <CNavItem>
                        <CNavLink
                            active={activeTab === 4}
                            onClick={() => setActiveTab(4)}
                        >
                            <CIcon icon={cilWarning} className="me-2" />
                            Alerts
                        </CNavLink>
                    </CNavItem>
                    <CNavItem>
                        <CNavLink
                            active={activeTab === 5}
                            onClick={() => setActiveTab(5)}
                        >
                            <CIcon icon={cilLockLocked} className="me-2" />
                            Protection
                        </CNavLink>
                    </CNavItem>
                </CNav>

                <CTabContent>
                    {/* General Settings Tab */}
                    <CTabPane visible={activeTab === 0}>
                        <div className="p-3 border rounded">
                            <h6 className="mb-4">General Risk Parameters</h6>
                            <CRow className="g-4">
                                <CCol md={6}>
                                    <label className="form-label small">Max Risk Per Trade (%)</label>
                                    <CInputGroup size="sm">
                                        <CFormInput
                                            type="number"
                                            value={settings.maxRiskPerTrade}
                                            onChange={(e) => handleSettingChange('maxRiskPerTrade', parseFloat(e.target.value))}
                                            step="0.1"
                                            min="0.5"
                                            max="5"
                                        />
                                        <CInputGroupText>%</CInputGroupText>
                                    </CInputGroup>
                                    <small className="text-muted">Maximum risk per individual trade</small>
                                </CCol>
                                <CCol md={6}>
                                    <label className="form-label small">Max Daily Loss (%)</label>
                                    <CInputGroup size="sm">
                                        <CFormInput
                                            type="number"
                                            value={settings.maxDailyLoss}
                                            onChange={(e) => handleSettingChange('maxDailyLoss', parseFloat(e.target.value))}
                                            step="0.5"
                                            min="1"
                                            max="20"
                                        />
                                        <CInputGroupText>%</CInputGroupText>
                                    </CInputGroup>
                                    <small className="text-muted">Trading will stop at this daily loss</small>
                                </CCol>
                                <CCol md={6}>
                                    <label className="form-label small">Max Weekly Loss (%)</label>
                                    <CInputGroup size="sm">
                                        <CFormInput
                                            type="number"
                                            value={settings.maxWeeklyLoss}
                                            onChange={(e) => handleSettingChange('maxWeeklyLoss', parseFloat(e.target.value))}
                                            step="0.5"
                                            min="5"
                                            max="30"
                                        />
                                        <CInputGroupText>%</CInputGroupText>
                                    </CInputGroup>
                                </CCol>
                                <CCol md={6}>
                                    <label className="form-label small">Max Monthly Loss (%)</label>
                                    <CInputGroup size="sm">
                                        <CFormInput
                                            type="number"
                                            value={settings.maxMonthlyLoss}
                                            onChange={(e) => handleSettingChange('maxMonthlyLoss', parseFloat(e.target.value))}
                                            step="0.5"
                                            min="10"
                                            max="50"
                                        />
                                        <CInputGroupText>%</CInputGroupText>
                                    </CInputGroup>
                                </CCol>
                                <CCol md={4}>
                                    <label className="form-label small">Max Open Positions</label>
                                    <CFormInput
                                        size="sm"
                                        type="number"
                                        value={settings.maxOpenPositions}
                                        onChange={(e) => handleSettingChange('maxOpenPositions', parseInt(e.target.value))}
                                    />
                                </CCol>
                                <CCol md={4}>
                                    <label className="form-label small">Max Lots Per Trade</label>
                                    <CFormInput
                                        size="sm"
                                        type="number"
                                        value={settings.maxLotsPerTrade}
                                        onChange={(e) => handleSettingChange('maxLotsPerTrade', parseFloat(e.target.value))}
                                        step="0.1"
                                    />
                                </CCol>
                                <CCol md={4}>
                                    <label className="form-label small">Max Position Size (USD)</label>
                                    <CInputGroup size="sm">
                                        <CInputGroupText>$</CInputGroupText>
                                        <CFormInput
                                            type="number"
                                            value={settings.maxPositionSize}
                                            onChange={(e) => handleSettingChange('maxPositionSize', parseFloat(e.target.value))}
                                        />
                                    </CInputGroup>
                                </CCol>
                            </CRow>
                        </div>
                    </CTabPane>

                    {/* Stop Loss Settings Tab */}
                    <CTabPane visible={activeTab === 1}>
                        <div className="p-3 border rounded">
                            <h6 className="mb-4">Stop Loss Configuration</h6>
                            <CRow className="g-4">
                                <CCol md={6}>
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span className="small">Default Stop Loss</span>
                                        <CFormSwitch
                                            checked={settings.defaultStopLoss}
                                            onChange={(e) => handleSettingChange('defaultStopLoss', e.target.checked)}
                                        />
                                    </div>
                                    {settings.defaultStopLoss && (
                                        <CInputGroup size="sm">
                                            <CFormInput
                                                type="number"
                                                value={settings.defaultStopLossPips}
                                                onChange={(e) => handleSettingChange('defaultStopLossPips', parseInt(e.target.value))}
                                            />
                                            <CInputGroupText>pips</CInputGroupText>
                                        </CInputGroup>
                                    )}
                                </CCol>
                                <CCol md={6}>
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span className="small">Trailing Stop</span>
                                        <CFormSwitch
                                            checked={settings.trailingStopEnabled}
                                            onChange={(e) => handleSettingChange('trailingStopEnabled', e.target.checked)}
                                        />
                                    </div>
                                    {settings.trailingStopEnabled && (
                                        <CInputGroup size="sm">
                                            <CFormInput
                                                type="number"
                                                value={settings.trailingStopDistance}
                                                onChange={(e) => handleSettingChange('trailingStopDistance', parseInt(e.target.value))}
                                            />
                                            <CInputGroupText>pips</CInputGroupText>
                                        </CInputGroup>
                                    )}
                                </CCol>
                                <CCol md={6}>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="small">Guaranteed Stop Loss</span>
                                        <CFormSwitch
                                            checked={settings.guaranteedStopLoss}
                                            onChange={(e) => handleSettingChange('guaranteedStopLoss', e.target.checked)}
                                        />
                                    </div>
                                    {settings.guaranteedStopLoss && (
                                        <small className="text-muted">Fee: {settings.guaranteedStopFee}%</small>
                                    )}
                                </CCol>
                            </CRow>
                        </div>
                    </CTabPane>

                    {/* Take Profit Settings Tab */}
                    <CTabPane visible={activeTab === 2}>
                        <div className="p-3 border rounded">
                            <h6 className="mb-4">Take Profit Configuration</h6>
                            <CRow className="g-4">
                                <CCol md={6}>
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span className="small">Default Take Profit</span>
                                        <CFormSwitch
                                            checked={settings.defaultTakeProfit}
                                            onChange={(e) => handleSettingChange('defaultTakeProfit', e.target.checked)}
                                        />
                                    </div>
                                    {settings.defaultTakeProfit && (
                                        <CInputGroup size="sm">
                                            <CFormInput
                                                type="number"
                                                value={settings.defaultTakeProfitPips}
                                                onChange={(e) => handleSettingChange('defaultTakeProfitPips', parseInt(e.target.value))}
                                            />
                                            <CInputGroupText>pips</CInputGroupText>
                                        </CInputGroup>
                                    )}
                                </CCol>
                                <CCol md={6}>
                                    <label className="form-label small">Risk/Reward Ratio</label>
                                    <CInputGroup size="sm">
                                        <CFormInput
                                            type="number"
                                            value={settings.riskRewardRatio}
                                            onChange={(e) => handleSettingChange('riskRewardRatio', parseFloat(e.target.value))}
                                            step="0.1"
                                            min="1"
                                        />
                                        <CInputGroupText>:1</CInputGroupText>
                                    </CInputGroup>
                                </CCol>
                                <CCol md={6}>
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span className="small">Auto-Lock Profits</span>
                                        <CFormSwitch
                                            checked={settings.autoLockProfits}
                                            onChange={(e) => handleSettingChange('autoLockProfits', e.target.checked)}
                                        />
                                    </div>
                                    {settings.autoLockProfits && (
                                        <CInputGroup size="sm">
                                            <CFormInput
                                                type="number"
                                                value={settings.lockProfitPercentage}
                                                onChange={(e) => handleSettingChange('lockProfitPercentage', parseInt(e.target.value))}
                                            />
                                            <CInputGroupText>%</CInputGroupText>
                                        </CInputGroup>
                                    )}
                                </CCol>
                            </CRow>
                        </div>
                    </CTabPane>

                    {/* Margin Settings Tab */}
                    <CTabPane visible={activeTab === 3}>
                        <div className="p-3 border rounded">
                            <h6 className="mb-4">Margin & Leverage Settings</h6>
                            <CRow className="g-4">
                                <CCol md={6}>
                                    <label className="form-label small">Max Leverage</label>
                                    <CInputGroup size="sm">
                                        <CFormInput
                                            type="number"
                                            value={settings.maxLeverage}
                                            onChange={(e) => handleSettingChange('maxLeverage', parseInt(e.target.value))}
                                        />
                                        <CInputGroupText>x</CInputGroupText>
                                    </CInputGroup>
                                </CCol>
                                <CCol md={6}>
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span className="small">Auto-Reduce Leverage</span>
                                        <CFormSwitch
                                            checked={settings.autoReduceLeverage}
                                            onChange={(e) => handleSettingChange('autoReduceLeverage', e.target.checked)}
                                        />
                                    </div>
                                </CCol>
                                <CCol md={4}>
                                    <label className="form-label small">Margin Call Level</label>
                                    <CInputGroup size="sm">
                                        <CFormInput
                                            type="number"
                                            value={settings.marginCallWarning}
                                            onChange={(e) => handleSettingChange('marginCallWarning', parseInt(e.target.value))}
                                        />
                                        <CInputGroupText>%</CInputGroupText>
                                    </CInputGroup>
                                </CCol>
                                <CCol md={4}>
                                    <label className="form-label small">Stop Out Level</label>
                                    <CInputGroup size="sm">
                                        <CFormInput
                                            type="number"
                                            value={settings.stopOutLevel}
                                            onChange={(e) => handleSettingChange('stopOutLevel', parseInt(e.target.value))}
                                        />
                                        <CInputGroupText>%</CInputGroupText>
                                    </CInputGroup>
                                </CCol>
                                <CCol md={4}>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="small">Auto-Close Positions</span>
                                        <CFormSwitch
                                            checked={settings.autoClosePositions}
                                            onChange={(e) => handleSettingChange('autoClosePositions', e.target.checked)}
                                        />
                                    </div>
                                </CCol>
                            </CRow>
                        </div>
                    </CTabPane>

                    {/* Alerts Settings Tab */}
                    <CTabPane visible={activeTab === 4}>
                        <div className="p-3 border rounded">
                            <h6 className="mb-4">Alert & Notification Settings</h6>
                            <CRow className="g-4">
                                <CCol md={6}>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <span className="small">Price Alerts</span>
                                        <CFormSwitch
                                            checked={settings.priceAlerts}
                                            onChange={(e) => handleSettingChange('priceAlerts', e.target.checked)}
                                        />
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <span className="small">Margin Alerts</span>
                                        <CFormSwitch
                                            checked={settings.marginAlerts}
                                            onChange={(e) => handleSettingChange('marginAlerts', e.target.checked)}
                                        />
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <span className="small">P&L Alerts</span>
                                        <CFormSwitch
                                            checked={settings.pnlAlerts}
                                            onChange={(e) => handleSettingChange('pnlAlerts', e.target.checked)}
                                        />
                                    </div>
                                </CCol>
                                <CCol md={6}>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <span className="small">Email Notifications</span>
                                        <CFormSwitch
                                            checked={settings.emailNotifications}
                                            onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                                        />
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <span className="small">Push Notifications</span>
                                        <CFormSwitch
                                            checked={settings.pushNotifications}
                                            onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                                        />
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <span className="small">SMS Notifications</span>
                                        <CFormSwitch
                                            checked={settings.smsNotifications}
                                            onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
                                        />
                                    </div>
                                </CCol>
                            </CRow>
                        </div>
                    </CTabPane>

                    {/* Protection Settings Tab */}
                    <CTabPane visible={activeTab === 5}>
                        <div className="p-3 border rounded">
                            <h6 className="mb-4">Trade Protection Settings</h6>
                            <CRow className="g-4">
                                <CCol md={6}>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <span className="small">One-Click Trading</span>
                                        <CFormSwitch
                                            checked={settings.oneClickTrading}
                                            onChange={(e) => handleSettingChange('oneClickTrading', e.target.checked)}
                                        />
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <span className="small">Confirm Large Trades</span>
                                        <CFormSwitch
                                            checked={settings.confirmLargeTrades}
                                            onChange={(e) => handleSettingChange('confirmLargeTrades', e.target.checked)}
                                        />
                                    </div>
                                    {settings.confirmLargeTrades && (
                                        <CInputGroup size="sm" className="mb-3">
                                            <CInputGroupText>$</CInputGroupText>
                                            <CFormInput
                                                type="number"
                                                value={settings.largeTradeThreshold}
                                                onChange={(e) => handleSettingChange('largeTradeThreshold', parseFloat(e.target.value))}
                                            />
                                        </CInputGroup>
                                    )}
                                </CCol>
                                <CCol md={6}>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <span className="small">Auto Hedging</span>
                                        <CFormSwitch
                                            checked={settings.autoHedging}
                                            onChange={(e) => handleSettingChange('autoHedging', e.target.checked)}
                                        />
                                    </div>
                                    <label className="form-label small">Max Slippage</label>
                                    <CInputGroup size="sm">
                                        <CFormInput
                                            type="number"
                                            value={settings.maxSlippage}
                                            onChange={(e) => handleSettingChange('maxSlippage', parseFloat(e.target.value))}
                                            step="0.1"
                                            min="0.1"
                                        />
                                        <CInputGroupText>%</CInputGroupText>
                                    </CInputGroup>
                                </CCol>
                            </CRow>
                        </div>
                    </CTabPane>
                </CTabContent>

                {/* Risk History Table */}
                <div className="mt-4">
                    <h6 className="mb-3">
                        <CIcon icon={cilHistory} className="me-2" />
                        Risk History (Last 5 Days)
                    </h6>
                    <CTable hover responsive size="sm" className="mb-0 border">
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell className="small">Date</CTableHeaderCell>
                                <CTableHeaderCell className="small text-end">Max Risk %</CTableHeaderCell>
                                <CTableHeaderCell className="small text-end">Daily Loss %</CTableHeaderCell>
                                <CTableHeaderCell className="small text-end">Weekly Loss %</CTableHeaderCell>
                                <CTableHeaderCell className="small text-end">Monthly Loss %</CTableHeaderCell>
                                <CTableHeaderCell className="small text-end">Violations</CTableHeaderCell>
                                <CTableHeaderCell className="small">Status</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {riskHistory.map((day, index) => (
                                <CTableRow key={index}>
                                    <CTableDataCell className="small">{formatDate(day.date)}</CTableDataCell>
                                    <CTableDataCell className="text-end small">{day.maxRisk}%</CTableDataCell>
                                    <CTableDataCell className={`text-end small ${day.dailyLoss > settings.maxDailyLoss ? 'text-danger' : 'text-success'}`}>
                                        {day.dailyLoss}%
                                    </CTableDataCell>
                                    <CTableDataCell className={`text-end small ${day.weeklyLoss > settings.maxWeeklyLoss ? 'text-danger' : 'text-success'}`}>
                                        {day.weeklyLoss}%
                                    </CTableDataCell>
                                    <CTableDataCell className={`text-end small ${day.monthlyLoss > settings.maxMonthlyLoss ? 'text-danger' : 'text-success'}`}>
                                        {day.monthlyLoss}%
                                    </CTableDataCell>
                                    <CTableDataCell className="text-end small">{day.violations}</CTableDataCell>
                                    <CTableDataCell>
                                        <CBadge color={day.violations === 0 ? 'success' : 'warning'}>
                                            {day.violations === 0 ? 'Compliant' : 'Warning'}
                                        </CBadge>
                                    </CTableDataCell>
                                </CTableRow>
                            ))}
                        </CTableBody>
                    </CTable>
                </div>

                {/* Action Buttons */}
                <div className="d-flex gap-2 mt-4">
                    <CButton color="primary" onClick={saveSettings}>
                        <CIcon icon={cilCheck} className="me-2" />
                        Save Settings
                    </CButton>
                    <CButton color="secondary" variant="outline" onClick={resetToDefaults}>
                        Reset to Defaults
                    </CButton>
                </div>
            </CCardBody>

            {/* Footer */}
            <CCardFooter className="d-flex justify-content-between align-items-center small text-muted">
                <div className="d-flex align-items-center">
                    <CIcon icon={cilInfo} className="me-2" />
                    Risk settings are applied in real-time to all new positions. Changes may affect existing positions.
                </div>
                <div className="d-flex gap-3">
                    <span>Connection: <span className="fw-semibold text-success">Secure</span></span>
                    <span>Risk Level: <span className="fw-semibold text-warning">Moderate</span></span>
                    <span>Last Saved: {lastUpdate.toLocaleTimeString()}</span>
                </div>
            </CCardFooter>
        </CCard>
    );
};

export default RiskSettings;