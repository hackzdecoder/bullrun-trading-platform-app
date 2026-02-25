import React from 'react';
import { CCard, CCardHeader, CCardBody } from '@coreui/react';

const OpenPosition = () => {
    return (
        <CCard className="mb-4">
            <CCardHeader>
                <h4>Open Positions</h4>
            </CCardHeader>
            <CCardBody>
                <p>List of open positions will be displayed here</p>
            </CCardBody>
        </CCard>
    );
};

export default OpenPosition;