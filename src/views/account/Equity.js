import React from 'react';
import { CCard, CCardHeader, CCardBody } from '@coreui/react';

const Equity = () => {
  return (
    <CCard className="mb-4">
      <CCardHeader>
        <h4>Equity</h4>
      </CCardHeader>
      <CCardBody>
        <p>Current account equity: $13,250.30</p>
      </CCardBody>
    </CCard>
  );
};

export default Equity; 
