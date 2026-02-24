import React from 'react';
import { CCard, CCardHeader, CCardBody } from '@coreui/react';

const AccountOverview = () => {
    return (
        <CCard className="mb-4">
            <CCardHeader>
                <h4>Account Overview</h4>
            </CCardHeader>
            <CCardBody>
                <p>Balance, Equity, Margin details will be displayed here</p>
            </CCardBody>
        </CCard>
    );
};

export default AccountOverview;