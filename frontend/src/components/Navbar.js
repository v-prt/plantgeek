import React, { useContext, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { API_URL } from '../constants'
import { useQuery } from 'react-query'
import axios from 'axios'
import { UserContext } from '../contexts/UserContext'

import plantgeekLogo from '../assets/logo.webp'
import {
  BiSearch,
  BiCog,
  BiPlusCircle,
  BiLogInCircle,
  BiLogOutCircle,
  BiBadgeCheck,
} from 'react-icons/bi'
import { CgProfile } from 'react-icons/cg'
import { MoreOutlined, CloseCircleOutlined } from '@ant-design/icons'
import styled from 'styled-components/macro'
import { COLORS, BREAKPOINTS } from '../GlobalStyles'
import { Pulser } from '../components/general/Pulser'

export const Navbar = () => {
  const { handleLogout, currentUser } = useContext(UserContext)
  const [menuExpanded, setMenuExpanded] = useState(false)

  const { data: plantsToReview } = useQuery(['plants-to-review'], async () => {
    const { data } = await axios.get(`${API_URL}/plants-to-review`)
    return data.plants
  })

  return (
    <Wrapper>
      <div className='inner'>
        <div className='logo' onClick={() => setMenuExpanded(false)}>
          <NavLink to='/'>
            <img src={plantgeekLogo} alt='' />
            <span className='label'>plantgeek</span>
          </NavLink>
        </div>
        <div className='mobile-menu-icon' onClick={() => setMenuExpanded(!menuExpanded)}>
          {menuExpanded ? <CloseCircleOutlined /> : <MoreOutlined />}
        </div>
        <div
          className={`nav-links ${menuExpanded && 'expanded'}`}
          onClick={() => setMenuExpanded(false)}>
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
              <NavLink to='/settings'>
                <div className='icon'>
                  <BiCog />
                </div>
                <span className='label'>settings</span>
              </NavLink>
              <NavLink to='/contribute'>
                <div className='icon'>
                  <BiPlusCircle />
                </div>
                <span className='label'>contribute</span>
              </NavLink>
              {currentUser.role === 'admin' && (
                <NavLink to='/review'>
                  <div className='icon'>
                    <BiBadgeCheck />
                  </div>
                  <span className='label'>review</span>
                  {plantsToReview?.length > 0 && <Pulser color='orange' />}
                </NavLink>
              )}
              <button className='logout-btn' onClick={handleLogout}>
                <div className='icon'>
                  <BiLogOutCircle />
                </div>
                <span className='label'>log out</span>
              </button>
            </>
          ) : (
            <>
              <NavLink to='/login' className='login-link'>
                <div className='icon'>
                  <BiLogInCircle />
                </div>
                <span className='label'>log in</span>
              </NavLink>
            </>
          )}
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
  .inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    a,
    .logout-btn {
      color: #fff;
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 10px;
      &.active {
        color: ${COLORS.light};
      }
    }
    .logout-btn,
    .login-link {
      margin-top: 30px;
      border-top: 1px dotted rgba(255, 255, 255, 0.4);
      padding-top: 30px;
    }
    .logo {
      img {
        height: 30px;
        filter: invert(1);
      }
      .label {
        display: none;
      }
    }
    .nav-links {
      background: #222;
      position: absolute;
      top: 50px;
      left: 100%;
      height: 100vh;
      width: 100vw;
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 20px;
      transition: 0.2s ease-in-out;
      &.expanded {
        left: 0;
      }
    }
    .label {
      color: #fff;
      font-size: 1rem;
    }
    .icon {
      display: grid;
      font-size: 1.5rem;
    }
  }
  .mobile-menu-icon {
    color: #fff;
    font-size: 1.2rem;
  }
  @media only screen and (min-width: ${BREAKPOINTS.tablet}) {
    left: 0;
    height: 100%;
    width: 55px;
    .label {
      display: none;
    }
    .inner {
      flex-direction: column;
      justify-content: flex-start;
      padding: 20px;
      .mobile-menu-icon {
        display: none;
      }
      .nav-links {
        background: transparent;
        position: relative;
        height: auto;
        width: auto;
        padding: 0;
        gap: 0;
        top: 0;
        left: 0;
      }
      a,
      .logout-btn {
        margin: 20px 0;
      }
      .logo {
        margin-bottom: 30px;
      }
      .nav-links {
        flex-direction: column;
      }
    }
  }
  @media only screen and (min-width: ${BREAKPOINTS.desktop}) {
    width: 240px;
    .inner {
      padding: 20px 40px;
      .label {
        display: block;
      }
      .logo {
        width: 100%;
        gap: 10px;
        img {
          height: 40px;
        }
        .label {
          display: block;
          color: #fff;
          font-size: 1.5rem;
        }
      }
      .nav-links {
        width: 100%;
        a,
        .logout-btn {
          width: 100%;
          .icon {
            margin: 0 10px 0 7px;
            font-size: 1.6rem;
          }
          .label {
            font-size: 1.1rem;
          }
        }
      }
    }
  }
`
