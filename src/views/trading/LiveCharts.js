import React from 'react';
import { CCard, CCardHeader, CCardBody } from '@coreui/react';

const LiveCharts = () => {
    return (
        <CCard className="mb-4">
            <CCardHeader>
                <h4>Live Charts</h4>
            </CCardHeader>
            <CCardBody>
                <p>Live trading charts will be displayed here</p>
            </CCardBody>
        </CCard>
    );
};

export default LiveCharts;