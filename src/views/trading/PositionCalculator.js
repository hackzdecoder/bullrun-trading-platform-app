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
  CInputGroup,
  CFormInput,
  CInputGroupText,
  CTable,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CAlert,
  CProgress,
  CProgressBar,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilCalculator,
  cilArrowTop,
  cilArrowBottom,
  cilInfo,
  cilWarning,
  cilTransfer,
} from '@coreui/icons';
import currency from 'currency.js';

const PositionCalculator = () => {
  // State for calculator inputs
  const [accountBalance, setAccountBalance] = useState(10000);
  const [riskPercentage, setRiskPercentage] = useState(2);
  const [entryPrice, setEntryPrice] = useState(1.0825);
  const [stopLossPrice, setStopLossPrice] = useState(1.0800);
  const [takeProfitPrice, setTakeProfitPrice] = useState(1.0880);
  const [leverage, setLeverage] = useState(10);
  const [symbol, setSymbol] = useState('EUR/USD');
  const [positionType, setPositionType] = useState('BUY');
  const [calculationResults, setCalculationResults] = useState({
    positionSize: 0,
    marginRequired: 0,
    riskAmount: 0,
    riskRewardRatio: 0,
    potentialProfit: 0,
    potentialLoss: 0,
    profitPips: 0,
    lossPips: 0,
    riskPercent: 0,
  });

  // Predefined symbols with their properties
  const symbols = [
    { name: 'EUR/USD', pipSize: 0.0001, contractSize: 100000, digits: 4, minLots: 0.01, maxLots: 100 },
    { name: 'GBP/USD', pipSize: 0.0001, contractSize: 100000, digits: 4, minLots: 0.01, maxLots: 100 },
    { name: 'USD/JPY', pipSize: 0.001, contractSize: 100000, digits: 3, minLots: 0.01, maxLots: 100 },
    { name: 'AUD/USD', pipSize: 0.0001, contractSize: 100000, digits: 4, minLots: 0.01, maxLots: 100 },
    { name: 'USD/CAD', pipSize: 0.0001, contractSize: 100000, digits: 4, minLots: 0.01, maxLots: 100 },
    { name: 'NZD/USD', pipSize: 0.0001, contractSize: 100000, digits: 4, minLots: 0.01, maxLots: 100 },
    { name: 'BTC/USD', pipSize: 1, contractSize: 1, digits: 1, minLots: 0.001, maxLots: 100 },
    { name: 'ETH/USD', pipSize: 1, contractSize: 1, digits: 1, minLots: 0.01, maxLots: 100 },
  ];

  // Get current symbol properties
  const currentSymbol = symbols.find(s => s.name === symbol) || symbols[0];

  // Format functions
  const formatCurrency = (value) => currency(value, { precision: 2, symbol: '$' }).format();
  const formatPrice = (price, digits = currentSymbol.digits) => {
    if (!price) return '0'.padEnd(digits + 2, '0');
    return typeof price === 'number' ? price.toFixed(digits) : price;
  };

  // Calculate position size and related metrics
  useEffect(() => {
    calculatePosition();
  }, [accountBalance, riskPercentage, entryPrice, stopLossPrice, takeProfitPrice, leverage, symbol, positionType]);

  const calculatePosition = () => {
    // Validate inputs
    if (!entryPrice || !stopLossPrice || accountBalance <= 0) return;

    const riskAmount = (accountBalance * riskPercentage) / 100;

    // Calculate pip difference
    let stopLossPips = 0;
    let takeProfitPips = 0;

    if (positionType === 'BUY') {
      stopLossPips = (entryPrice - stopLossPrice) / currentSymbol.pipSize;
      takeProfitPips = (takeProfitPrice - entryPrice) / currentSymbol.pipSize;
    } else {
      stopLossPips = (stopLossPrice - entryPrice) / currentSymbol.pipSize;
      takeProfitPips = (entryPrice - takeProfitPrice) / currentSymbol.pipSize;
    }

    // Ensure positive values
    stopLossPips = Math.abs(stopLossPips);
    takeProfitPips = Math.abs(takeProfitPips);

    // Calculate position size (lots)
    const pipValuePerLot = currentSymbol.contractSize * currentSymbol.pipSize;
    let positionSize = 0;

    if (stopLossPips > 0) {
      positionSize = riskAmount / (stopLossPips * pipValuePerLot);
    }

    // Round to min lot size
    const minLotStep = 0.01;
    positionSize = Math.round(positionSize / minLotStep) * minLotStep;
    positionSize = Math.max(currentSymbol.minLots, Math.min(currentSymbol.maxLots, positionSize));

    // Calculate margin required
    const marginRequired = (positionSize * currentSymbol.contractSize * entryPrice) / leverage;

    // Calculate potential profit/loss
    const profitLoss = positionSize * pipValuePerLot;
    const potentialProfit = takeProfitPips * profitLoss;
    const potentialLoss = stopLossPips * profitLoss;

    // Calculate risk/reward ratio
    const riskRewardRatio = stopLossPips > 0 ? (takeProfitPips / stopLossPips) : 0;

    // Calculate actual risk percentage
    const actualRiskAmount = stopLossPips * profitLoss;
    const actualRiskPercent = (actualRiskAmount / accountBalance) * 100;

    setCalculationResults({
      positionSize,
      marginRequired,
      riskAmount: actualRiskAmount,
      riskRewardRatio,
      potentialProfit,
      potentialLoss,
      profitPips: takeProfitPips,
      lossPips: stopLossPips,
      riskPercent: actualRiskPercent,
    });
  };

  // Quick preset risk percentages
  const setRiskPreset = (percent) => {
    setRiskPercentage(percent);
  };

  // Swap position type
  const swapPositionType = () => {
    setPositionType(prev => prev === 'BUY' ? 'SELL' : 'BUY');
  };

  return (
    <CCard className="mb-4">
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <div>
          <h4 className="mb-0">
            <CIcon icon={cilCalculator} className="me-2" />
            Position Calculator
          </h4>
          <small className="text-muted">Calculate position size, margin, and PnL before trading</small>
        </div>
        <CBadge color="info">Risk Management Tool</CBadge>
      </CCardHeader>

      <CCardBody>
        <CRow>
          {/* Left Column - Inputs */}
          <CCol md={6}>
            <div className="border rounded p-3 mb-3">
              <h5 className="fw-semibold mb-3">Account Parameters</h5>

              {/* Account Balance */}
              <div className="mb-3">
                <label className="form-label">Account Balance</label>
                <CInputGroup>
                  <CInputGroupText>$</CInputGroupText>
                  <CFormInput
                    type="number"
                    value={accountBalance}
                    onChange={(e) => setAccountBalance(parseFloat(e.target.value) || 0)}
                    min="100"
                    step="100"
                  />
                </CInputGroup>
              </div>

              {/* Risk Percentage */}
              <div className="mb-3">
                <label className="form-label">Risk Percentage</label>
                <CInputGroup>
                  <CFormInput
                    type="number"
                    value={riskPercentage}
                    onChange={(e) => setRiskPercentage(parseFloat(e.target.value) || 0)}
                    min="0.1"
                    max="100"
                    step="0.1"
                  />
                  <CInputGroupText>%</CInputGroupText>
                </CInputGroup>
              </div>

              {/* Quick Risk Presets */}
              <div className="d-flex gap-2 mb-3">
                <CButton size="sm" color="secondary" variant="outline" onClick={() => setRiskPreset(0.5)}>0.5%</CButton>
                <CButton size="sm" color="secondary" variant="outline" onClick={() => setRiskPreset(1)}>1%</CButton>
                <CButton size="sm" color="secondary" variant="outline" onClick={() => setRiskPreset(2)}>2%</CButton>
                <CButton size="sm" color="secondary" variant="outline" onClick={() => setRiskPreset(5)}>5%</CButton>
                <CButton size="sm" color="secondary" variant="outline" onClick={() => setRiskPreset(10)}>10%</CButton>
              </div>

              <h5 className="fw-semibold mb-3 mt-4">Trade Parameters</h5>

              {/* Symbol Selection */}
              <div className="mb-3">
                <label className="form-label">Symbol</label>
                <CFormSelect
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                >
                  {symbols.map(s => (
                    <option key={s.name} value={s.name}>{s.name}</option>
                  ))}
                </CFormSelect>
              </div>

              {/* Position Type */}
              <div className="mb-3">
                <label className="form-label">Position Type</label>
                <div className="d-flex gap-2">
                  <CButton
                    color={positionType === 'BUY' ? 'success' : 'light'}
                    variant={positionType === 'BUY' ? undefined : 'outline'}
                    onClick={() => setPositionType('BUY')}
                    className="flex-fill"
                  >
                    <CIcon icon={cilArrowTop} className="me-1" />
                    BUY / Long
                  </CButton>
                  <CButton
                    color={positionType === 'SELL' ? 'danger' : 'light'}
                    variant={positionType === 'SELL' ? undefined : 'outline'}
                    onClick={() => setPositionType('SELL')}
                    className="flex-fill"
                  >
                    <CIcon icon={cilArrowBottom} className="me-1" />
                    SELL / Short
                  </CButton>
                  <CButton
                    size="sm"
                    color="secondary"
                    variant="outline"
                    onClick={swapPositionType}
                  >
                    <CIcon icon={cilTransfer} />
                  </CButton>
                </div>
              </div>

              {/* Entry Price */}
              <div className="mb-3">
                <label className="form-label">Entry Price</label>
                <CInputGroup>
                  <CFormInput
                    type="number"
                    value={entryPrice}
                    onChange={(e) => setEntryPrice(parseFloat(e.target.value) || 0)}
                    step={currentSymbol.pipSize}
                  />
                  <CInputGroupText>{symbol}</CInputGroupText>
                </CInputGroup>
              </div>

              {/* Stop Loss */}
              <div className="mb-3">
                <label className="form-label text-danger">Stop Loss</label>
                <CInputGroup>
                  <CFormInput
                    type="number"
                    value={stopLossPrice}
                    onChange={(e) => setStopLossPrice(parseFloat(e.target.value) || 0)}
                    step={currentSymbol.pipSize}
                  />
                  <CInputGroupText>{symbol}</CInputGroupText>
                </CInputGroup>
                <small className="text-danger">
                  {positionType === 'BUY'
                    ? `Must be below ${formatPrice(entryPrice)}`
                    : `Must be above ${formatPrice(entryPrice)}`}
                </small>
              </div>

              {/* Take Profit */}
              <div className="mb-3">
                <label className="form-label text-success">Take Profit</label>
                <CInputGroup>
                  <CFormInput
                    type="number"
                    value={takeProfitPrice}
                    onChange={(e) => setTakeProfitPrice(parseFloat(e.target.value) || 0)}
                    step={currentSymbol.pipSize}
                  />
                  <CInputGroupText>{symbol}</CInputGroupText>
                </CInputGroup>
                <small className="text-success">
                  {positionType === 'BUY'
                    ? `Must be above ${formatPrice(entryPrice)}`
                    : `Must be below ${formatPrice(entryPrice)}`}
                </small>
              </div>

              {/* Leverage */}
              <div className="mb-3">
                <label className="form-label">Leverage</label>
                <CFormSelect
                  value={leverage}
                  onChange={(e) => setLeverage(parseFloat(e.target.value))}
                >
                  <option value="1">1:1</option>
                  <option value="5">1:5</option>
                  <option value="10">1:10</option>
                  <option value="20">1:20</option>
                  <option value="50">1:50</option>
                  <option value="100">1:100</option>
                  <option value="200">1:200</option>
                  <option value="500">1:500</option>
                </CFormSelect>
              </div>
            </div>
          </CCol>

          {/* Right Column - Results */}
          <CCol md={6}>
            <div className="border rounded p-3 mb-3">
              <h5 className="fw-semibold mb-3">Calculation Results</h5>

              {/* Position Size */}
              <div className="bg-light bg-opacity-25 p-3 rounded mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-muted">Position Size (Lots):</span>
                  <span className="fw-bold fs-5">{calculationResults.positionSize.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-muted">Margin Required:</span>
                  <span className="fw-semibold text-warning">{formatCurrency(calculationResults.marginRequired)}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted">Risk Amount:</span>
                  <span className="fw-semibold text-danger">{formatCurrency(calculationResults.riskAmount)}</span>
                  <span className="small text-muted">({calculationResults.riskPercent.toFixed(2)}%)</span>
                </div>
              </div>

              {/* Risk/Reward */}
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Risk/Reward Ratio:</span>
                  <span className="fw-semibold">1:{calculationResults.riskRewardRatio.toFixed(2)}</span>
                </div>
                <CProgress height={8}>
                  <CProgressBar
                    value={calculationResults.lossPips}
                    color="danger"
                    max={calculationResults.lossPips + calculationResults.profitPips}
                  />
                  <CProgressBar
                    value={calculationResults.profitPips}
                    color="success"
                    max={calculationResults.lossPips + calculationResults.profitPips}
                  />
                </CProgress>
                <div className="d-flex justify-content-between mt-1 small">
                  <span className="text-danger">Loss: {calculationResults.lossPips.toFixed(1)} pips</span>
                  <span className="text-success">Profit: {calculationResults.profitPips.toFixed(1)} pips</span>
                </div>
              </div>

              {/* P&L Projections */}
              <CRow className="mb-3">
                <CCol md={6}>
                  <div className="border rounded p-2 text-center">
                    <small className="text-muted d-block">Potential Loss</small>
                    <span className="fw-bold fs-5 text-danger">
                      {formatCurrency(calculationResults.potentialLoss)}
                    </span>
                    <small className="text-muted d-block">
                      {calculationResults.lossPips.toFixed(1)} pips
                    </small>
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="border rounded p-2 text-center">
                    <small className="text-muted d-block">Potential Profit</small>
                    <span className="fw-bold fs-5 text-success">
                      {formatCurrency(calculationResults.potentialProfit)}
                    </span>
                    <small className="text-muted d-block">
                      {calculationResults.profitPips.toFixed(1)} pips
                    </small>
                  </div>
                </CCol>
              </CRow>

              {/* Summary Table */}
              <CTable hover responsive size="sm" className="mb-0 border">
                <CTableBody>
                  <CTableRow>
                    <CTableHeaderCell>Contract Size</CTableHeaderCell>
                    <CTableDataCell className="text-end">{currentSymbol.contractSize.toLocaleString()}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Pip Value</CTableHeaderCell>
                    <CTableDataCell className="text-end">
                      {formatCurrency(currentSymbol.contractSize * currentSymbol.pipSize)} per lot
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Min Lots</CTableHeaderCell>
                    <CTableDataCell className="text-end">{currentSymbol.minLots}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Max Lots</CTableHeaderCell>
                    <CTableDataCell className="text-end">{currentSymbol.maxLots}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell>Max Position Size</CTableHeaderCell>
                    <CTableDataCell className="text-end">
                      {formatCurrency((accountBalance * leverage) / entryPrice * currentSymbol.contractSize)} lots
                    </CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>

              {/* Warning Messages */}
              {calculationResults.marginRequired > accountBalance && (
                <CAlert color="warning" className="mt-3 mb-0">
                  <CIcon icon={cilWarning} className="me-2" />
                  Insufficient balance for this position. Required margin exceeds account balance.
                </CAlert>
              )}

              {calculationResults.riskPercent > 5 && (
                <CAlert color="danger" className="mt-3 mb-0">
                  <CIcon icon={cilWarning} className="me-2" />
                  High risk! This trade risks more than 5% of your account.
                </CAlert>
              )}

              {calculationResults.riskRewardRatio < 1 && calculationResults.riskRewardRatio > 0 && (
                <CAlert color="warning" className="mt-3 mb-0">
                  <CIcon icon={cilInfo} className="me-2" />
                  Risk/Reward ratio is below 1:1. Consider adjusting your take profit.
                </CAlert>
              )}
            </div>
          </CCol>
        </CRow>

        {/* Quick Examples */}
        <div className="border-top pt-3 mt-2">
          <h6 className="fw-semibold mb-2">Quick Examples</h6>
          <div className="d-flex gap-2">
            <CButton size="sm" color="light" variant="outline" onClick={() => {
              setSymbol('EUR/USD');
              setEntryPrice(1.0825);
              setStopLossPrice(1.0800);
              setTakeProfitPrice(1.0880);
              setRiskPercentage(2);
            }}>
              EUR/USD Scalp
            </CButton>
            <CButton size="sm" color="light" variant="outline" onClick={() => {
              setSymbol('BTC/USD');
              setEntryPrice(43000);
              setStopLossPrice(42500);
              setTakeProfitPrice(44000);
              setRiskPercentage(1);
            }}>
              BTC Swing
            </CButton>
            <CButton size="sm" color="light" variant="outline" onClick={() => {
              setSymbol('USD/JPY');
              setEntryPrice(148.25);
              setStopLossPrice(148.10);
              setTakeProfitPrice(148.50);
              setRiskPercentage(1.5);
            }}>
              JPY Day Trade
            </CButton>
          </div>
        </div>
      </CCardBody>

      {/* Footer */}
      <CCardFooter className="d-flex justify-content-between align-items-center small text-muted">
        <div className="d-flex align-items-center">
          <CIcon icon={cilInfo} className="me-2" />
          Calculations are estimates. Actual values may vary based on broker and market conditions.
        </div>
        <div>
          <span className="me-3">
            Pip Value: <span className="fw-semibold">{formatCurrency(currentSymbol.contractSize * currentSymbol.pipSize)}</span>
          </span>
          <span>
            Max Risk: <span className="fw-semibold text-warning">{riskPercentage}%</span>
          </span>
        </div>
      </CCardFooter>
    </CCard>
  );
};

export default PositionCalculator;