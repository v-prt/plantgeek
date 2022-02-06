import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { UserContext } from '../contexts/UserContext'

import plantgeekLogo from '../assets/logo.webp'
import { BiSearch, BiLogInCircle, BiLogOutCircle } from 'react-icons/bi'
import { CgProfile } from 'react-icons/cg'
import { AiOutlinePlusCircle } from 'react-icons/ai'
import { BiCog } from 'react-icons/bi'
import styled from 'styled-components/macro'
import { COLORS } from '../GlobalStyles'

export const Navbar = () => {
  const { handleLogout, currentUser } = useContext(UserContext)

  return (
    <Wrapper>
      <Div>
        <Link to='/'>
          <Title>plantgeek</Title>
          <Logo src={plantgeekLogo} alt='' />
        </Link>
      </Div>
      <Link to='/browse'>
        <Label>browse</Label>
        <Icon>
          <BiSearch />
        </Icon>
      </Link>
      {currentUser ? (
        <>
          <Link to={`/user-profile/${currentUser.username}`}>
            <Label>profile</Label>
            <Icon>
              <CgProfile />
            </Icon>
          </Link>
          <Link to='/settings'>
            <Label>settings</Label>
            <Icon>
              <BiCog />
            </Icon>
          </Link>
          <Link to='/contribute'>
            <Label>contribute</Label>
            <Icon>
              <AiOutlinePlusCircle />
            </Icon>
          </Link>
          <LogoutBtn onClick={handleLogout}>
            <Label>log out</Label>
            <Icon>
              <BiLogOutCircle />
            </Icon>
          </LogoutBtn>
        </>
      ) : (
        <>
          <Link to='/login'>
            <Label>log in</Label>
            <Icon>
              <BiLogInCircle />
            </Icon>
          </Link>
        </>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.nav`
  background: ${COLORS.darkest};
  height: 100vh;
  width: 45px;
  position: fixed;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 100;
  @media only screen and (min-width: 500px) {
    width: 55px;
  }
  @media only screen and (min-width: 1000px) {
    padding: 20px;
    width: 200px;
    align-items: flex-end;
  }
`

const Div = styled.div`
  display: flex;
  margin: 20px 0;
`

const Logo = styled.img`
  filter: invert(1);
  width: 30px;
  margin: 10px 5px;
  @media only screen and (min-width: 500px) {
    width: 40px;
  }
  @media only screen and (min-width: 1000px) {
    margin-right: 6px;
  }
`

const Link = styled(NavLink)`
  color: #fff;
  display: flex;
  align-items: center;
  &.active {
    color: ${COLORS.light};
  }
`

const LogoutBtn = styled.button`
  color: #fff;
  display: flex;
  align-items: center;
  span {
    font-size: 1rem;
  }
  &:hover {
    color: ${COLORS.light};
  }
  &:focus {
    color: ${COLORS.light};
  }
`

const Title = styled.span`
  display: none;
  font-family: 'Comfortaa', cursive;
  color: #fff;
  font-size: 1.5rem;
  margin-right: 15px;
  @media only screen and (min-width: 1000px) {
    display: block;
  }
`

const Label = styled.span`
  display: none;
  margin-right: 15px;
  @media only screen and (min-width: 1000px) {
    display: block;
  }
`

const Icon = styled.div`
  font-size: 1.5rem;
  margin: 10px 10px 0 10px;
  @media only screen and (min-width: 500px) {
    font-size: 2rem;
  }
`
