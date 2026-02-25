import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

import logo from 'src/assets/brand/bulrun-logo-main.png'
import { sygnet } from 'src/assets/brand/sygnet'

// sidebar nav config
import navigation from '../_nav'
import { right } from '@popperjs/core'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/" className="d-flex align-items-center">
          <img
            src={logo}
            className="sidebar-brand-full me-2"
            height={100}
            alt="Logo"
          />
          <div className="sidebar-brand-full d-flex flex-column mn-5">
            <span
              className="fw-bold fs-4 text-white lh-1"
              style={{
                fontFamily: 'Myriad Pro, "Myriad Pro Black", "Myriad Pro Bold", sans-serif',
                fontWeight: 900,
                letterSpacing: '0.5px',
                textDecoration: 'none',
                color: '#bebebe',
                marginLeft: -10
              }}
            >
              BULL RUN
            </span>
            <span
              className="small text-white-50"
              style={{
                fontFamily: 'Myriad Pro, sans-serif',
                fontSize: '0.7rem',
                letterSpacing: '0.3px',
                marginTop: '2px',
                marginLeft: -10
              }}
            >
              TRADING APPLICATION
            </span>
          </div>
          <span className="sidebar-brand-narrow">
            <img src={sygnet} height={32} alt="Sygnet" />
          </span>
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>
      <AppSidebarNav items={navigation} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
