import React from "react";
import styled from "styled-components";
import { COLORS } from "../GlobalStyles";
import background from "../assets/monstera-bg.jpg";
import pothosGolden from "../assets/pothos-golden.jpeg";

export const Plants = () => {
  return (
    <Wrapper>
      <Banner />
      <Main>
        <Actions>
          <Search type="text" placeholder="search plants" />
          <Filter>
            <h2>filter plants</h2>
            {/* TODO: return list of types from array? */}
            <ul>
              <li>monstera</li>
              <li>philodendron</li>
              <li>pothos</li>
              <li>syngonium</li>
              <li>dracaena</li>
            </ul>
          </Filter>
        </Actions>
        <Results>
          {/* TODO: replace with actual plant data */}
          <Card>
            <Image src={pothosGolden} alt="" />
            <Name>Pothos Golden</Name>
          </Card>
          <Card>
            <Image src={pothosGolden} alt="" />
            <Name>Pothos Golden</Name>
          </Card>
          <Card>
            <Image src={pothosGolden} alt="" />
            <Name>Pothos Golden</Name>
          </Card>
          <Card>
            <Image src={pothosGolden} alt="" />
            <Name>Pothos Golden</Name>
          </Card>
          <Card>
            <Image src={pothosGolden} alt="" />
            <Name>Pothos Golden</Name>
          </Card>
          <Card>
            <Image src={pothosGolden} alt="" />
            <Name>Pothos Golden</Name>
          </Card>
          <Card>
            <Image src={pothosGolden} alt="" />
            <Name>Pothos Golden</Name>
          </Card>
          <Card>
            <Image src={pothosGolden} alt="" />
            <Name>Pothos Golden</Name>
          </Card>
          <Card>
            <Image src={pothosGolden} alt="" />
            <Name>Pothos Golden</Name>
          </Card>
          <Card>
            <Image src={pothosGolden} alt="" />
            <Name>Pothos Golden</Name>
          </Card>
        </Results>
      </Main>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Banner = styled.div`
  background: url(${background}) center center / cover;
  height: 120px;
  width: 100%;
`;

const Main = styled.main`
  display: flex;
  @media (max-width: 1000px) {
    flex-direction: column;
  }
`;

const Actions = styled.div`
  width: 25%;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-width: 1000px) {
    width: 100%;
  }
`;

const Search = styled.input`
  width: calc(100% - 50px);
  margin: 20px;
  border: 2px solid ${COLORS.light};
  border-radius: 20px;
  &:focus {
    outline: none;
    border: 2px solid ${COLORS.medium};
  }
`;

const Filter = styled.div`
  width: calc(100% - 50px);
  padding-bottom: 20px;
`;

const Results = styled.div`
  width: 75%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 10px 0;
  @media (max-width: 1000px) {
    width: 100%;
  }
`;

const Card = styled.div`
  background: #fff;
  height: 250px;
  width: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  margin: 10px;
  border-radius: 20px;
`;

const Image = styled.img`
  height: 200px;
`;

const Name = styled.p``;
