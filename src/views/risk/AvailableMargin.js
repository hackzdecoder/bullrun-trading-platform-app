import React from 'react';
import { CCard, CCardHeader, CCardBody } from '@coreui/react';

const AvailableMargin = () => {
  return (
    <CCard className="mb-4">
      <CCardHeader>
        <h4>Available Margin</h4>
      </CCardHeader>
      <CCardBody>
        <p>Margin available for new trades: $8,330.15</p>
      </CCardBody>
    </CCard>
  );
};

export default AvailableMargin; 
