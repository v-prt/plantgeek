import React from "react";
import { NavLink } from "react-router-dom";
import { FaLeaf } from "react-icons/fa";
import { BiSearch, BiLogInCircle, BiLogOutCircle } from "react-icons/bi";
import { RiPlantLine } from "react-icons/ri";
import { BsPerson } from "react-icons/bs";
import { TiHeartOutline } from "react-icons/ti";
import { MdStarBorder } from "react-icons/md";
import styled from "styled-components";
import { COLORS } from "../../GlobalStyles";

export const DesktopNav = () => {
  return (
    <Wrapper>
      <Link to="/">
        <Title>plantgeek</Title>
        <Logo>
          <FaLeaf />
        </Logo>
      </Link>
      <Link to="/plants">
        browse
        <Icon>
          <BiSearch />
        </Icon>
      </Link>
      <Link to="/login">
        login
        <Icon>
          <BiLogInCircle />
        </Icon>
      </Link>
      <Link to="/logout">
        logout
        <Icon>
          <BiLogOutCircle />
        </Icon>
      </Link>
      <Link to="/user/profile">
        profile
        <Icon>
          <BsPerson />
        </Icon>
      </Link>
      <Link to="/user/collection">
        collection
        <Icon>
          <RiPlantLine />
        </Icon>
      </Link>
      <Link to="/user/favorites">
        favorites
        <Icon>
          <TiHeartOutline />
        </Icon>
      </Link>
      <Link to="/user/wishlist">
        wishlist
        <Icon>
          <MdStarBorder />
        </Icon>
      </Link>
    </Wrapper>
  );
};

const Wrapper = styled.nav`
  background: ${COLORS.darkest};
  height: 100vh;
  width: 200px;
  position: fixed;
  right: 0;
  display: flex;
  flex-direction: column;
  text-align: right;
  padding: 20px;
`;

const Link = styled(NavLink)`
  color: #fff;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  &.active {
    color: ${COLORS.light};
  }
`;

const Title = styled.span`
  font-family: "Comfortaa", sans-serif;
  color: #fff;
  font-size: 1.5rem;
  margin-top: 10px;
`;

const Logo = styled.span`
  font-size: 2rem;
  margin: 10px 0 0 15px;
  color: #009900;
`;

const Icon = styled.span`
  font-size: 2rem;
  margin: 10px 0 0 15px;
`;
