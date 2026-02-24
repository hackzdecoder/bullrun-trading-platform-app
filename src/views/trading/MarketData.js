import React from 'react';
import { CCard, CCardHeader, CCardBody } from '@coreui/react';

const MarketData = () => {
    return (
        <CCard className="mb-4">
            <CCardHeader>
                <h4>Market Data</h4>
            </CCardHeader>
            <CCardBody>
                <p>Market data and prices will be displayed here</p>
            </CCardBody>
        </CCard>
    );
};

export default MarketData;