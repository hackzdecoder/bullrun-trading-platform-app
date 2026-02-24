import React from 'react';
import { CCard, CCardHeader, CCardBody } from '@coreui/react';

const UsedMargin = () => {
  return (
    <CCard className="mb-4">
      <CCardHeader>
        <h4>Used Margin</h4>
      </CCardHeader>
      <CCardBody>
        <p>Locked/Used margin: $4,250.15</p>
      </CCardBody>
    </CCard>
  );
};

export default UsedMargin;
