import React, { useContext } from "react";
import { useHistory } from "react-router";
import { NavLink } from "react-router-dom";
import { LoginContext } from "../context/LoginContext";

import plantgeekLogo from "../assets/logo.png";
import { BiSearch, BiLogInCircle, BiLogOutCircle } from "react-icons/bi";
import { RiPlantLine } from "react-icons/ri";
import { BsPerson } from "react-icons/bs";
import { TiHeartOutline } from "react-icons/ti";
import { MdStarBorder } from "react-icons/md";
import { GoGear } from "react-icons/go";
import styled from "styled-components";
import { COLORS } from "../GlobalStyles";

export const Navbar = () => {
  const history = useHistory();
  const { currentUser, setCurrentUser, setLoggedIn } = useContext(LoginContext);

  const handleLogout = (ev) => {
    ev.preventDefault();
    setCurrentUser(undefined);
    setLoggedIn(false);
    history.push("/");
  };

  return (
    <Wrapper>
      <Div>
        <Link to="/">
          <Title>plantgeek</Title>
          <Logo src={plantgeekLogo} alt="" />
        </Link>
      </Div>
      <Link to="/browse">
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
              <BsPerson />
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
              <MdStarBorder />
            </Icon>
          </Link>
          <Link to="/settings">
            <Label>settings</Label>
            <Icon>
              <GoGear />
            </Icon>
          </Link>
          <LogoutBtn onClick={handleLogout}>
            <Label>logout</Label>
            <Icon>
              <BiLogOutCircle />
            </Icon>
          </LogoutBtn>
        </>
      ) : (
        <>
          <Link to="/login">
            <Label>login</Label>
            <Icon>
              <BiLogInCircle />
            </Icon>
          </Link>
        </>
      )}
    </Wrapper>
  );
};

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
`;

const Div = styled.div`
  display: flex;
  margin: 20px 0;
`;

const Logo = styled.img`
  filter: invert(1);
  width: 40px;
  margin: 10px 5px;
  @media (min-width: 1000px) {
    margin-right: 6px;
  }
`;

const Link = styled(NavLink)`
  color: #fff;
  display: flex;
  align-items: center;
  &.active {
    color: ${COLORS.light};
  }
`;

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
`;

const Title = styled.span`
  display: none;
  font-family: "Comfortaa", sans-serif;
  color: #fff;
  font-size: 1.5rem;
  margin-right: 15px;
  @media (min-width: 1000px) {
    display: block;
  }
`;

const Label = styled.span`
  display: none;
  margin-right: 15px;
  @media (min-width: 1000px) {
    display: block;
  }
`;

const Icon = styled.div`
  font-size: 2rem;
  margin: 10px 10px 0 10px;
`;
