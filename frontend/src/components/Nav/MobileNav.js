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

export const MobileNav = () => {
  return (
    <Wrapper>
      <NavLink to="/">
        <GiMonsteraLeaf />
      </NavLink>
      <NavLink to="/login">
        <BiLogInCircle />
      </NavLink>
      <NavLink to="/">
        <BiLogOutCircle />
      </NavLink>
      <NavLink to="/currentuser/profile">
        <BsPerson />
      </NavLink>
      <NavLink to="/currentuser/collection">
        <RiPlantLine />
      </NavLink>
      <NavLink to="/currentuser/favorites">
        <TiHeartOutline />
      </NavLink>
      <NavLink to="/currentuser/wishlist">
        <MdStarBorder />
      </NavLink>
    </Wrapper>
  );
};

const Wrapper = styled.nav`
  background: ${COLORS.darkest};
  color: white;
  height: 100vh;
  position: fixed;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const NavLink = styled(Link)`
  color: white;
  font-size: 2rem;
  padding-top: 10px;
`;
