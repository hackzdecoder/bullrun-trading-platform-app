import React from 'react';
import { CCard, CCardHeader, CCardBody } from '@coreui/react';

const ClosePosition = () => {
  return (
    <CCard className="mb-4">
      <CCardHeader>
        <h4>Close Position</h4>
      </CCardHeader>
      <CCardBody>
        <p>Manual position closure with PnL calculation</p>
        <p>Current Market Price: 1.2050</p>
        <p>Entry Price: 1.2000</p>
        <p>PnL: $500 profit</p>
      </CCardBody>
    </CCard>
  );
};

export default ClosePosition;