import React, { useContext, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useQuery } from 'react-query'
import { API_URL } from '../constants'
import axios from 'axios'
import numeral from 'numeral'
import { UserContext } from '../contexts/UserContext'

import styled from 'styled-components/macro'
import { COLORS, BREAKPOINTS } from '../GlobalStyles'
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
import { MenuOutlined, CloseOutlined } from '@ant-design/icons'

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
        <NavLink to='/browse' className='browse mobile' onClick={() => setMenuExpanded(false)}>
          <div className='icon'>
            <BiSearch />
          </div>
        </NavLink>
        <NavLink to='/' className='logo' onClick={() => setMenuExpanded(false)}>
          <img src={plantgeekLogo} alt='' />
          <span className='label'>plantgeek</span>
        </NavLink>
        <div className='hamburger' onClick={() => setMenuExpanded(!menuExpanded)}>
          {menuExpanded ? <CloseOutlined /> : <MenuOutlined />}
        </div>

        <div
          className={`nav-links ${menuExpanded && 'expanded'}`}
          onClick={() => setMenuExpanded(false)}>
          <NavLink to='/browse' className='browse'>
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
                <NavLink to='/review'>
                  <div className='icon'>
                    <BiBadgeCheck />
                  </div>
                  <span className='label'>
                    review
                    {plantsToReview?.length > 0 && (
                      // FIXME: not visible on tablet
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
  padding: 10px 20px;
  .inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .logo {
      img {
        height: 35px;
        filter: invert(1);
      }
      .label {
        display: none;
      }
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
    .logout-btn,
    .login-link {
      margin-top: 30px;
      border-top: 1px dotted rgba(255, 255, 255, 0.4);
      padding-top: 30px;
    }
    .nav-links {
      background: #222;
      position: absolute;
      top: 55px;
      left: 100%;
      height: 100vh;
      width: 100vw;
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 40px;
      transition: 0.2s ease-in-out;
      a,
      .logout-btn {
        margin: 10px;
      }
      &.expanded {
        left: 0;
      }
    }
    .icon {
      display: grid;
      place-content: center;
      width: 25px;
      font-size: 1.5rem;
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
    left: 0;
    width: auto;
    height: 100vh;
    padding: 40px 10px;

    .inner {
      flex-direction: column;
      justify-content: flex-start;
      a {
        &.browse {
          display: flex;
          &.mobile {
            display: none;
          }
        }
      }
      .logo {
        margin-bottom: 30px;
      }
      .hamburger {
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
        flex-direction: column;
        a,
        .logout-btn {
          margin: 15px;
        }
      }
      .label {
        display: none;
      }
    }
  }
  @media only screen and (min-width: ${BREAKPOINTS.desktop}) {
    padding: 40px;
    .inner {
      .label {
        display: flex;
      }
      .logo {
        width: 100%;
        gap: 10px;
        img {
          height: 40px;
        }
        .label {
          display: flex;
          color: #fff;
          font-size: 1.5rem;
        }
      }
      .nav-links {
        width: 100%;
        a,
        .logout-btn {
          width: 100%;
          margin: 20px 0;
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
