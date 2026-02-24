import React from 'react';
import { CCard, CCardHeader, CCardBody } from '@coreui/react';

const Balance = () => {
  return (
    <CCard className="mb-4">
      <CCardHeader>
        <h4>Balance</h4>
      </CCardHeader>
      <CCardBody>
        <p>Current account balance: $12,580.45</p>
      </CCardBody>
    </CCard>
  );
};

export default Balance; 
