import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { plantsArray } from "../reducers/plantReducer";
import styled from "styled-components";
import { COLORS } from "../GlobalStyles";
import background from "../assets/monstera-bg.jpg";

export const Plants = () => {
  const plants = useSelector(plantsArray);

  // GETS ALL TYPES OF PLANTS IN DATABASE AND SORTS ALPHABETICALLY
  const [types, setTypes] = useState([]);
  useEffect(() => {
    let tempArr = [];
    plants.forEach((plant) => {
      // skip type if already added to array
      if (!tempArr.includes(plant.type)) {
        tempArr.push(plant.type);
      }
    });
    setTypes(tempArr);
  }, [plants]);
  types.sort();

  // FILTERS PLANTS BASED ON TYPE SELECTED
  const [filter, setFilter] = useState("");
  // initially sets filter to all plants in database
  useEffect(() => {
    setFilter(plants);
  }, [plants]);
  const handleFilter = (type) => {
    let tempArr = [];
    plants.forEach((plant) => {
      if (plant.type === type) {
        tempArr.push(plant);
      }
    });
    setFilter(tempArr);
  };

  // TODO: sort all plants alphabetically

  return (
    <Wrapper>
      <Banner />
      <Main>
        <Actions>
          <Search type="text" placeholder="search plants" />
          <Filter>
            <h2>filter plants</h2>
            <ul>
              <Type onClick={() => setFilter(plants)}>all</Type>
              {types &&
                types.map((type) => {
                  return <Type onClick={() => handleFilter(type)}>{type}</Type>;
                })}
            </ul>
          </Filter>
        </Actions>
        <Results>
          {filter &&
            filter.map((plant) => {
              return (
                <Card key={plant._id}>
                  <Image src={plant.image} />
                  <Name>{plant.name}</Name>
                </Card>
              );
            })}
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

const Type = styled.li`
  &:hover {
    cursor: pointer;
    font-style: italic;
  }
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
  width: 225px;
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

const Name = styled.p`
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 10px;
`;
