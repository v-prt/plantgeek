import React from "react";
import styled from "styled-components";
import { COLORS } from "../GlobalStyles";
import { RiPlantLine } from "react-icons/ri";
import { TiHeartOutline } from "react-icons/ti";
import { MdStarBorder } from "react-icons/md";

export const ActionBar = () => {
  const handleCollection = () => {
    // TODO: add plant to user's collection
  };
  const handleFavorites = () => {
    // TODO: add plant to user's favorites
  };
  const handleWishlist = () => {
    // TODO: add plant to user's wishlist
  };

  return (
    <Wrapper>
      <Action onClick={handleCollection}>
        <RiPlantLine />
      </Action>
      <Action onClick={handleFavorites}>
        <TiHeartOutline />
      </Action>
      <Action onClick={handleWishlist}>
        <MdStarBorder />
      </Action>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background: #f2f2f2;
  width: 90%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 5px;
  border-radius: 20px;
  padding: 5px;
`;

const Action = styled.button`
  border-radius: 50%;
  height: 30px;
  width: 30px;
  padding-top: 5px;
  display: flex;
  align-content: center;
  justify-content: center;
  font-size: 1.3rem;
  // TODO: make hover/focus style stay active if in user's lists
  &:hover {
    background: ${COLORS.light};
    color: #fff;
  }
  &:focus {
    background: ${COLORS.light};
  }
`;
