import React from 'react';
import { CCard, CCardHeader, CCardBody } from '@coreui/react';

const OrderPanel = () => {
    return (
        <CCard className="mb-4">
            <CCardHeader>
                <h4>Order Panel</h4>
            </CCardHeader>
            <CCardBody>
                <p>Order Panel - Trade execution interface will be here</p>
            </CCardBody>
        </CCard>
    );
};

export default OrderPanel;