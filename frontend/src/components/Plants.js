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
            <h2>filter by genus</h2>
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
          <Card>
            <Image src={pothosGolden} alt="" />
            <p>Pothos Golden</p>
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
  width: 100%;
  height: 120px;
`;

const Main = styled.main`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
`;

const Actions = styled.div`
  width: 250px;
`;

const Search = styled.input`
  border-radius: 20px;
  border: 2px solid ${COLORS.light};
  &:focus {
    outline: none;
    border: 2px solid ${COLORS.medium};
  }
`;

const Filter = styled.div`
  padding: 0 20px;
`;

const Results = styled.div`
  background: #fff;
  min-height: calc(100vh - 120px);
  flex-grow: 1;
  h2 {
    text-align: right;
  }
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Image = styled.img`
  height: 300px;
`;
