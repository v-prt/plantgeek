import React from "react";
import { Link } from "react-router-dom";
import { GiMonsteraLeaf } from "react-icons/gi";
import { BiLogInCircle, BiLogOutCircle } from "react-icons/bi";
import { RiPlantLine } from "react-icons/ri";
import { BsPerson } from "react-icons/bs";
import { TiHeartOutline } from "react-icons/ti";
import { MdStarBorder } from "react-icons/md";
import styled from "styled-components";
import { COLORS } from "../../GlobalStyles";

export const DesktopNav = () => {
  return (
    <Wrapper>
      <NavLink to="/">
        <Title>plantgeek</Title>
        <Icon>
          <GiMonsteraLeaf />
        </Icon>
      </NavLink>
      <NavLink to="/login">
        login
        <Icon>
          <BiLogInCircle />
        </Icon>
      </NavLink>
      <NavLink to="/">
        logout
        <Icon>
          <BiLogOutCircle />
        </Icon>
      </NavLink>
      <NavLink to="/currentuser/profile">
        profile
        <Icon>
          <BsPerson />
        </Icon>
      </NavLink>
      <NavLink to="/currentuser/collection">
        collection
        <Icon>
          <RiPlantLine />
        </Icon>
      </NavLink>
      <NavLink to="/currentuser/favorites">
        favorites
        <Icon>
          <TiHeartOutline />
        </Icon>
      </NavLink>
      <NavLink to="/currentuser/wishlist">
        wishlist
        <Icon>
          <MdStarBorder />
        </Icon>
      </NavLink>
    </Wrapper>
  );
};

const Wrapper = styled.nav`
  background: ${COLORS.darkest};
  color: white;
  height: 100vh;
  width: 200px;
  position: fixed;
  right: 0;
  display: flex;
  flex-direction: column;
  text-align: right;
  padding: 20px;
`;

const NavLink = styled(Link)`
  color: white;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const Title = styled.span`
  font-size: 1.5rem;
`;

const Icon = styled.span`
  font-size: 2rem;
  margin-left: 15px;
  padding-top: 10px;
`;
