import React from 'react';
import { CCard, CCardHeader, CCardBody } from '@coreui/react';

const StopLossTakeProfit = () => {
  return (
    <CCard className="mb-4">
      <CCardHeader>
        <h4>Stop Loss / Take Profit</h4>
      </CCardHeader>
      <CCardBody>
        <p>Manage SL/TP levels for open positions</p>
      </CCardBody>
    </CCard>
  );
};

export default StopLossTakeProfit; 
