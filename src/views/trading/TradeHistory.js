import React from 'react';
import { CCard, CCardHeader, CCardBody } from '@coreui/react';

const TradeHistory = () => {
    return (
        <CCard className="mb-4">
            <CCardHeader>
                <h4>Trade History</h4>
            </CCardHeader>
            <CCardBody>
                <p>Trade history will be displayed here</p>
            </CCardBody>
        </CCard>
    );
};

export default TradeHistory;