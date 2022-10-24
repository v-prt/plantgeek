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
import { IoIosHelpCircleOutline } from 'react-icons/io'
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
        <div className='hamburger' onClick={() => setMenuExpanded(!menuExpanded)}>
          {menuExpanded ? <CloseOutlined /> : <MenuOutlined />}
        </div>
        <NavLink to='/' className='logo' onClick={() => setMenuExpanded(false)}>
          plantgeek
        </NavLink>
        <NavLink to='/browse' className='browse mobile' onClick={() => setMenuExpanded(false)}>
          <div className='icon'>
            <BiSearch />
          </div>
        </NavLink>

        <div
          className={`nav-links ${menuExpanded && 'expanded'}`}
          onClick={() => setMenuExpanded(false)}>
          <div className='nav-links-inner'>
            <NavLink to='/'>
              <div className='icon'>
                <img src={plantgeekLogo} alt='' />
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
                  <NavLink to='/review'>
                    <div className='icon'>
                      <BiBadgeCheck />
                    </div>
                    <span className='label'>
                      review
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
                <NavLink to='/about'>
                  <div className='icon'>
                    <IoIosHelpCircleOutline />
                  </div>
                  <span className='label'>about</span>
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
    .logout-btn,
    .login-link {
      margin-top: 30px;
      border-top: 1px dotted rgba(255, 255, 255, 0.4);
      padding-top: 30px;
    }
    .nav-links {
      background: rgba(0, 0, 0, 0.5);
      position: absolute;
      top: 54px;
      left: -100%;
      height: 100vh;
      width: 100vw;
      transition: 0.4s ease-in-out;
      .nav-links-inner {
        background: #222;
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 40px;
      }
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
  /* FIXME: can't scroll within nav links on mobile landscape */
  @media only screen and (min-width: ${BREAKPOINTS.tablet}) {
    .nav-links {
      transition: 0.6s ease-in-out;
      .nav-links-inner {
        max-width: 300px;
        margin-right: auto;
      }
    }
  }
  @media only screen and (min-width: ${BREAKPOINTS.desktop}) {
    left: 0;
    width: auto;
    height: 100vh;
    padding: 30px 50px;
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
        margin-bottom: 50px;
      }
      .hamburger {
        display: none;
      }
      .label {
        display: flex;
      }
      .nav-links {
        width: 100%;
        background: transparent;
        position: relative;
        height: auto;
        width: auto;
        top: 0;
        left: 0;
        margin-right: auto;
        .nav-links-inner {
          background: transparent;
          padding: 0;
          gap: 0;
        }
        a,
        .logout-btn {
          width: 100%;
          margin: 20px 0;
          .icon {
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
