import React from 'react';
import { CCard, CCardHeader, CCardBody } from '@coreui/react';

const RiskSettings = () => {
    return (
        <CCard className="mb-4">
            <CCardHeader>
                <h4>Risk Settings</h4>
            </CCardHeader>
            <CCardBody>
                <p>Risk management settings will be configured here</p>
            </CCardBody>
        </CCard>
    );
};

export default RiskSettings;