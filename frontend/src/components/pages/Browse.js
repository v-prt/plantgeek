import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { plantsArray } from "../../reducers/plantReducer";

import styled from "styled-components";
import { COLORS } from "../../GlobalStyles";
import background from "../../assets/monstera-bg.jpg";
import { PlantCard } from "../PlantCard";

export const Browse = () => {
  const plants = useSelector(plantsArray);

  // makes window scroll to top between renders
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // SORTS ALL PLANTS ALPHABETICALLY BY NAME
  const compare = (a, b) => {
    const plantA = a.name.toLowerCase();
    const plantB = b.name.toLowerCase();
    let comparison = 0;
    if (plantA > plantB) {
      comparison = 1;
    } else if (plantA < plantB) {
      comparison = -1;
    }
    return comparison;
  };
  plants.sort(compare);

  // GETS ALL TYPES OF PLANTS AND SORTS ALPHABETICALLY
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

  // FILTERS PLANTS BASED ON SELECTED TYPE
  // FIXME: make filter not reset after using action bar
  const [filteredPlants, setFilteredPlants] = useState(plants);
  const [selectedType, setSelectedType] = useState("all");
  // initially sets filter to all plants in db
  useEffect(() => {
    setFilteredPlants(plants);
  }, [plants]);
  const handleFilter = (type) => {
    let tempArr = [];
    plants.forEach((plant) => {
      if (plant.type === type) {
        tempArr.push(plant);
      }
    });
    setFilteredPlants(tempArr);
    setSelectedType(type);
  };
  const removeFilter = () => {
    setFilteredPlants(plants);
    setSelectedType("all");
  };

  return (
    <Wrapper>
      <Banner />
      <Main>
        <Actions>
          <Search type="text" placeholder="search plants" />
          <Filter>
            <h2>filter plants</h2>
            <Types>
              <Type
                key="all"
                onClick={() => removeFilter()}
                active={selectedType === "all"}
              >
                all
              </Type>
              {types &&
                types.map((type) => {
                  return (
                    <Type
                      key={type}
                      onClick={() => handleFilter(type)}
                      active={type === selectedType}
                    >
                      {type}
                    </Type>
                  );
                })}
            </Types>
          </Filter>
        </Actions>
        <Results>
          {filteredPlants &&
            filteredPlants.map((plant) => {
              return <PlantCard plant={plant} />;
            })}
        </Results>
      </Main>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
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
  h2 {
    margin-left: 5px;
  }
`;

const Types = styled.ul`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  @media (max-width: 1000px) {
    flex-direction: row;
  }
`;

const Type = styled.li`
  // TODO: (stretch) improve look of columns in mobile mode
  /* flex: 1 0 33.33%; */
  background: ${(props) => (props.active ? `${COLORS.light}` : "transparent")};
  border-radius: 20px;
  margin: 2px;
  padding: 0 10px;
  font-style: ${(props) => (props.active ? "italic" : "normal")};
  &:hover {
    background: ${COLORS.light};
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
