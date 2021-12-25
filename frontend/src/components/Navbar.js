import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { UserContext } from '../contexts/UserContext'

import plantgeekLogo from '../assets/logo.png'
import { BiSearch, BiLogInCircle, BiLogOutCircle } from 'react-icons/bi'
import { RiPlantLine } from 'react-icons/ri'
import { CgProfile } from 'react-icons/cg'
import { TiHeartOutline } from 'react-icons/ti'
import { AiOutlineStar, AiOutlinePlusCircle } from 'react-icons/ai'
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
          <Link to={`/user-collection/${currentUser.username}`}>
            <Label>collection</Label>
            <Icon>
              <RiPlantLine />
            </Icon>
          </Link>
          <Link to={`/user-favorites/${currentUser.username}`}>
            <Label>favorites</Label>
            <Icon>
              <TiHeartOutline />
            </Icon>
          </Link>
          <Link to={`/user-wishlist/${currentUser.username}`}>
            <Label>wishlist</Label>
            <Icon>
              <AiOutlineStar />
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
  position: fixed;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  @media (min-width: 1000px) {
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
  width: 40px;
  margin: 10px 5px;
  @media (min-width: 1000px) {
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
  @media (min-width: 1000px) {
    display: block;
  }
`

const Label = styled.span`
  display: none;
  margin-right: 15px;
  @media (min-width: 1000px) {
    display: block;
  }
`

const Icon = styled.div`
  font-size: 2rem;
  margin: 10px 10px 0 10px;
`
