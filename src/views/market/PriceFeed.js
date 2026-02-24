import React from 'react';
import { CCard, CCardHeader, CCardBody } from '@coreui/react';

const PriceFeed = () => {
  return (
    <CCard className="mb-4">
      <CCardHeader>
        <h4>Price Feed</h4>
      </CCardHeader>
      <CCardBody>
        <p>Real-time Bid/Ask prices will be displayed here</p>
      </CCardBody>
    </CCard>
  );
};

export default PriceFeed; 
