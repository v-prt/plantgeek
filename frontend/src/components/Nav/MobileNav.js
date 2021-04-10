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

export const MobileNav = () => {
  return (
    <Wrapper>
      <Link to="/">
        <Logo>
          <FaLeaf />
        </Logo>
      </Link>
      <Link to="/plants">
        <BiSearch />
      </Link>
      <Link to="/login">
        <BiLogInCircle />
      </Link>
      <Link to="/logout">
        <BiLogOutCircle />
      </Link>
      <Link to="/user/profile">
        <BsPerson />
      </Link>
      <Link to="/user/collection">
        <RiPlantLine />
      </Link>
      <Link to="/user/favorites">
        <TiHeartOutline />
      </Link>
      <Link to="/user/wishlist">
        <MdStarBorder />
      </Link>
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
`;

const Logo = styled.span`
  color: #009900;
  font-size: 2rem;
`;

const Link = styled(NavLink)`
  color: #fff;
  font-size: 2rem;
  padding-top: 10px;
  &.active {
    color: ${COLORS.light};
  }
`;
