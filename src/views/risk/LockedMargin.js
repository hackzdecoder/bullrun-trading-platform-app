import React from 'react';
import { CCard, CCardHeader, CCardBody } from '@coreui/react';

const LockedMargin = () => {
  return (
    <CCard className="mb-4">
      <CCardHeader>
        <h4>Locked Margin</h4>
      </CCardHeader>
      <CCardBody>
        <p>Margin locked for open positions: $4,250.15</p>
      </CCardBody>
    </CCard>
  );
};

export default LockedMargin; 
