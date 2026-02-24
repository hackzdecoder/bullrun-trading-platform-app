import React from 'react'
import {
  CAvatar,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilUser,
  cilPowerStandby,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useNavigate } from 'react-router-dom'

import avatar8 from './../../assets/images/avatars/8.jpg'

const AppHeaderDropdown = () => {
  const navigate = useNavigate()

  // Mock account data - replace with real data from your store/context
  const accountData = {
    balance: 12580.45,
    equity: 13250.30,
    margin: 4250.15,
    marginLevel: 312.5,
    openPositions: 3
  }

  const handleLogout = () => {
    // Add your logout logic here (clear tokens, store, etc.)
    console.log('Logging out...')
    navigate('/login')
  }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar src={avatar8} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end" style={{ width: '250px' }}>
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">
          <div className="d-flex justify-content-between align-items-center">
            <span>Trading Account</span>
          </div>
        </CDropdownHeader>

        {/* Account Metrics */}
        <div className="px-3 py-2">
          <div className="d-flex justify-content-between mb-1">
            <span>Balance:</span>
            <span className="fw-semibold">${accountData.balance.toFixed(2)}</span>
          </div>
          <div className="d-flex justify-content-between mb-1">
            <span>Equity:</span>
            <span className="fw-semibold text-success">${accountData.equity.toFixed(2)}</span>
          </div>
          <div className="d-flex justify-content-between mb-1">
            <span>Margin:</span>
            <span className="fw-semibold">${accountData.margin.toFixed(2)}</span>
          </div>
          <div className="d-flex justify-content-between mb-1">
            <span>Margin Level:</span>
            <span className="fw-semibold text-info">{accountData.marginLevel}%</span>
          </div>
          <div className="d-flex justify-content-between">
            <span>Open Positions:</span>
            <span className="fw-semibold">{accountData.openPositions}</span>
          </div>
        </div>

        <CDropdownDivider />

        {/* Profile */}
        <CDropdownItem onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem>

        {/* Logout with power off icon */}
        <CDropdownItem onClick={handleLogout} style={{ cursor: 'pointer' }}>
          <CIcon icon={cilPowerStandby} className="me-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown