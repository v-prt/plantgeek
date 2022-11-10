import React, { useContext, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useQuery } from 'react-query'
import { API_URL } from '../constants'
import axios from 'axios'
import numeral from 'numeral'
import { UserContext } from '../contexts/UserContext'

import styled from 'styled-components/macro'
import { COLORS, BREAKPOINTS } from '../GlobalStyles'
import {
  BiHome,
  BiSearch,
  BiCog,
  BiPlusCircle,
  BiLogInCircle,
  BiLogOutCircle,
} from 'react-icons/bi'
import { MdOutlineAdminPanelSettings } from 'react-icons/md'
import { TiHeartOutline } from 'react-icons/ti'
import { CgProfile } from 'react-icons/cg'
import { MenuOutlined, CloseOutlined } from '@ant-design/icons'

export const Navbar = () => {
  const { handleLogout, currentUser } = useContext(UserContext)
  const [expanded, setExpanded] = useState(false)

  const { data: plantsToReview } = useQuery(['plants-to-review'], async () => {
    const { data } = await axios.get(`${API_URL}/plants-to-review`)
    return data.plants
  })

  const MenuLinks = () => {
    return (
      <div className='links'>
        <NavLink exact to='/'>
          <div className='icon'>
            <BiHome />
          </div>
          <span className='label'>home</span>
        </NavLink>
        <NavLink to='/browse'>
          <div className='icon'>
            <BiSearch />
          </div>
          <span className='label'>browse</span>
        </NavLink>
        {currentUser ? (
          <>
            <NavLink to='/profile'>
              <div className='icon'>
                <CgProfile />
              </div>
              <span className='label'>profile</span>
            </NavLink>
            <NavLink to='/contribute'>
              <div className='icon'>
                <BiPlusCircle />
              </div>
              <span className='label'>contribute</span>
            </NavLink>
            {currentUser.role === 'admin' && (
              <NavLink to='/admin'>
                <div className='icon'>
                  <MdOutlineAdminPanelSettings />
                </div>
                <span className='label'>
                  admin
                  {plantsToReview?.length > 0 && (
                    <span className='review-notification-badge'>
                      {numeral(plantsToReview.length).format('0a')}
                    </span>
                  )}
                </span>
              </NavLink>
            )}
            <NavLink to='/settings'>
              <div className='icon'>
                <BiCog />
              </div>
              <span className='label'>settings</span>
            </NavLink>
            <button className='logout-btn' onClick={handleLogout}>
              <div className='icon'>
                <BiLogOutCircle />
              </div>
              <span className='label'>log out</span>
            </button>
          </>
        ) : (
          <>
            <NavLink to='/guidelines'>
              <div className='icon'>
                <TiHeartOutline />
              </div>
              <span className='label'>care tips</span>
            </NavLink>
            <NavLink to='/signup' className='login-link'>
              <div className='icon'>
                <CgProfile />
              </div>
              <span className='label'>sign up</span>
            </NavLink>
            <NavLink to='/login' className='login-link'>
              <div className='icon'>
                <BiLogInCircle />
              </div>
              <span className='label'>log in</span>
            </NavLink>
          </>
        )}
      </div>
    )
  }

  return (
    <Wrapper>
      <div className='inner'>
        {/* NAV HEADER */}
        <NavLink exact to='/' className='logo' onClick={() => setExpanded(false)}>
          plantgeek
        </NavLink>
        <div className='hamburger' onClick={() => setExpanded(!expanded)}>
          {expanded ? <CloseOutlined /> : <MenuOutlined />}
        </div>

        {/* SIDEBAR FOR DESKTOP */}
        <div className='sidebar-menu'>
          <MenuLinks />
        </div>
        {/* FLYOUT MENU FOR TABLET AND MOBILE */}
        <div className={`flyout-menu ${expanded && 'expanded'}`} onClick={() => setExpanded(false)}>
          <MenuLinks />
        </div>
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.nav`
  background: ${COLORS.darkest};
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 99;
  padding: 10px 20px;
  .inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .mobile-ctas {
      display: flex;
      align-items: center;
      gap: 12px;
      button {
        border-color: #fff;
      }
    }
    .logo {
      font-family: 'Lobster Two', cursive;
      font-size: 1.8rem;
      line-height: 1;
      padding-bottom: 5px;
    }
    .hamburger {
      color: #fff;
      display: grid;
      place-content: center;
      width: 25px;
      font-size: 1.2rem;
    }
    a,
    .logout-btn {
      position: relative;
      color: #fff;
      display: flex;
      align-items: center;
      gap: 10px;
      &.browse {
        display: none;
        &.mobile {
          display: block;
        }
      }
    }
    .sidebar-menu {
      display: none;
    }
    .flyout-menu {
      background: rgba(0, 0, 0, 0.5);
      position: fixed;
      top: 54px;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 99;
      transform: translateX(100%);
      transition: 0.3s ease-in-out;
      .links {
        background: #222;
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 20px 0 0 20px;
        height: 100%;
        margin-left: auto;
        a,
        .logout-btn {
          padding: 10px 20px 10px 10px;
          border-radius: 20px 0 0 20px;
          &.active {
            background: rgba(255, 255, 255, 0.1);
          }
        }
      }
      &.expanded {
        transform: translateX(0);
      }
    }
    .icon {
      display: grid;
      place-content: center;
      width: 25px;
      font-size: 1.5rem;
      img {
        height: 25px;
        width: 25px;
        filter: invert(1);
      }
    }
    .label {
      color: #fff;
      font-size: 1rem;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .review-notification-badge {
      font-size: 0.7rem;
      border-radius: 10px;
      background: ${COLORS.light};
      color: ${COLORS.darkest};
      margin-top: 2px;
      padding: 0 5px;
      font-weight: bold;
    }
  }
  @media only screen and (min-width: ${BREAKPOINTS.tablet}) {
    .flyout-menu {
      transition: 0.6s ease-in-out;
      .links {
        max-width: 300px;
      }
    }
  }
  @media only screen and (min-width: ${BREAKPOINTS.desktop}) {
    left: 0;
    width: auto;
    height: 100vh;
    padding: 0;
    .inner {
      flex-direction: column;
      justify-content: flex-start;
      a {
        &.browse {
          &.mobile {
            display: none;
          }
        }
      }
      .logo {
        width: 100%;
        gap: 10px;
        font-size: 2.5rem;
        margin-bottom: 40px;
        padding: 30px 50px;
      }
      .hamburger {
        display: none;
      }
      .label {
        display: flex;
      }
      .sidebar-menu {
        display: block;
        width: 100%;
        .links {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-left: 30px;
          a,
          .logout-btn {
            padding: 10px;
            border-radius: 20px 0 0 20px;
            &:hover,
            &.active {
              background: rgba(255, 255, 255, 0.1);
            }
          }
        }
      }
      .flyout-menu {
        display: none;
      }
    }
  }
`
