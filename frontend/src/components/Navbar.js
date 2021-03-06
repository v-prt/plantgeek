import React, { useContext } from 'react'
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
import styled from 'styled-components/macro'
import { COLORS, BREAKPOINTS } from '../GlobalStyles'
import { Pulser } from '../components/general/Pulser'

export const Navbar = () => {
  const { handleLogout, currentUser } = useContext(UserContext)

  const { data: plantsToReview } = useQuery(['plants-to-review'], async () => {
    const { data } = await axios.get(`${API_URL}/plants-to-review`)
    return data.plants
  })

  return (
    <Wrapper>
      <div className='inner'>
        <div className='logo'>
          <NavLink to='/'>
            <img src={plantgeekLogo} alt='' />
            <span className='label'>plantgeek</span>
          </NavLink>
        </div>
        <div className='nav-links'>
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
              <NavLink to='/login'>
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
  z-index: 9999;
  .inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    a,
    .logout-btn {
      position: relative;
      color: #fff;
      display: flex;
      align-items: center;
      margin: 10px;
      &:hover:not(.active) {
        transform: scale(1.1);
      }
      &.active {
        color: ${COLORS.light};
      }
    }
    .label {
      display: none;
    }
    .logo {
      img {
        height: 30px;
        filter: invert(1);
      }
    }
    .nav-links {
      display: flex;
      align-items: center;
    }
    .icon {
      display: grid;
      font-size: 1.5rem;
    }
  }
  @media only screen and (min-width: ${BREAKPOINTS.tablet}) {
    right: 0;
    height: 100%;
    width: 55px;
    .inner {
      flex-direction: column;
      justify-content: flex-start;
      padding: 20px;
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
        img {
          height: 40px;
          margin-right: 10px;
        }
        .label {
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
            margin: 0 15px 0 7px;
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
