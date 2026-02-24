import React from 'react';
import { CCard, CCardHeader, CCardBody } from '@coreui/react';

const Transactions = () => {
    return (
        <CCard className="mb-4">
            <CCardHeader>
                <h4>Transactions</h4>
            </CCardHeader>
            <CCardBody>
                <p>Transaction history will be displayed here</p>
            </CCardBody>
        </CCard>
    );
};

export default Transactions;