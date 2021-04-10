import React from "react";
import styled from "styled-components";
import stem from "../assets/stem.png";

export const Home = () => {
  return (
    <Wrapper>
      <Background src={stem} alt="" />
      <Heading>welcome to plantgeek!</Heading>
    </Wrapper>
  );
};

const Wrapper = styled.main``;

const Background = styled.img`
  width: 150px;
  position: absolute;
  bottom: 0;
`;

const Heading = styled.h1`
  padding: 50px;
`;
