import React from 'react';
import { CCard, CCardHeader, CCardBody } from '@coreui/react';

const FreeMargin = () => {
  return (
    <CCard className="mb-4">
      <CCardHeader>
        <h4>Free Margin</h4>
      </CCardHeader>
      <CCardBody>
        <p>Available free margin: $8,330.15</p>
      </CCardBody>
    </CCard>
  );
};

export default FreeMargin; 
