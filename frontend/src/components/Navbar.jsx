import React, { useContext, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { UserContext } from '../contexts/UserContext'

import styled from 'styled-components'
import { COLORS, BREAKPOINTS } from '../GlobalStyles'
import { BiSearch, BiCog, BiPlusCircle, BiLogInCircle, BiLogOutCircle } from 'react-icons/bi'
import { MdOutlineAdminPanelSettings } from 'react-icons/md'
import { TiHeartOutline } from 'react-icons/ti'
import { CgProfile } from 'react-icons/cg'
import { Hamburger } from './general/Hamburger'
import { ImageLoader } from './loaders/ImageLoader'

export const Navbar = () => {
  const { currentUser } = useContext(UserContext)
  const [expanded, setExpanded] = useState(false)

  return (
    <Wrapper>
      <div className='inner'>
        {/* NAV HEADER */}
        <NavLink to='/' className='logo' onClick={() => setExpanded(false)}>
          plantgeek
        </NavLink>
        <div className='mobile'>
          {currentUser && (
            <NavLink
              className='profile-link avatar'
              to='/profile'
              onClick={() => setExpanded(false)}
            >
              {currentUser.imageUrl ? (
                <ImageLoader src={currentUser.imageUrl} alt='' borderRadius='50%' />
              ) : (
                <span className='initials'>{currentUser.firstName.charAt(0).toUpperCase()}</span>
              )}
            </NavLink>
          )}
          <div className='hamburger' onClick={() => setExpanded(!expanded)}>
            <Hamburger expanded={expanded} />
          </div>
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

// keep components like this outside of other components to avoid unnecessary re-rendering
const MenuLinks = () => {
  const { currentUser, handleLogout, notificationsCount } = useContext(UserContext)

  return (
    <div className='links'>
      <NavLink to='/browse'>
        <div className='icon'>
          <BiSearch />
        </div>
        <span className='label'>browse</span>
      </NavLink>
      <NavLink to='/contribute'>
        <div className='icon'>
          <BiPlusCircle />
        </div>
        <span className='label'>contribute</span>
      </NavLink>
      <NavLink to='/care'>
        <div className='icon'>
          <TiHeartOutline />
        </div>
        <span className='label'>care tips</span>
      </NavLink>
      {currentUser ? (
        <>
          <div className='user'>
            <div className='avatar'>
              {currentUser.imageUrl ? (
                <ImageLoader src={currentUser.imageUrl} alt='' borderRadius='50%' />
              ) : (
                <span className='initials'>{currentUser.firstName.charAt(0).toUpperCase()}</span>
              )}
            </div>
            {currentUser.firstName} {currentUser.lastName}
          </div>
          <NavLink to='/profile'>
            <div className='icon'>
              <CgProfile />
            </div>
            <span className='label'>profile</span>
          </NavLink>
          {currentUser.role === 'admin' && (
            <NavLink to='/admin'>
              <div className='icon'>
                <MdOutlineAdminPanelSettings />
              </div>
              <span className='label'>
                admin
                {notificationsCount > 0 && (
                  <span className='review-notification-badge'>{notificationsCount}</span>
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
      font-size: 1.3rem;
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
    .mobile {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .user {
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      font-weight: bold;
      font-size: 1rem;
      color: #fff;
      padding: 20px 0 10px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .avatar {
      height: 30px;
      width: 30px;
      border-radius: 50%;
      display: flex;
      img {
        border-radius: 50%;
        max-height: 100%;
        max-width: 100%;
        object-fit: cover;
        flex: 1;
      }
      .initials {
        background: ${COLORS.light};
        border-radius: 50%;
        font-size: 0.8rem;
        font-weight: bold;
        color: ${COLORS.darkest};
        height: 100%;
        width: 100%;
        display: grid;
        place-content: center;
      }
    }
  }
  @media only screen and (min-width: ${BREAKPOINTS.tablet}) {
    padding: 10px 30px;
    .inner {
      .flyout-menu {
        transition: 0.6s ease-in-out;
        .links {
          max-width: 300px;
        }
      }
      .mobile {
        gap: 20px;
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
      .mobile {
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
