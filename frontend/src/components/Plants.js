import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { plantsArray } from "../reducers/plantReducer";
import styled from "styled-components";
import { COLORS } from "../GlobalStyles";
import background from "../assets/monstera-bg.jpg";

export const Plants = () => {
  const plants = useSelector(plantsArray);

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
  const [filteredPlants, setFilteredPlants] = useState("");
  const [selectedType, setSelectedType] = useState("");
  // initially sets filter to all plants in database
  useEffect(() => {
    setFilteredPlants(plants);
    setSelectedType("all");
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
              return (
                <Card to={`/plants/${plant._id}`} key={plant._id}>
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
  flex: 1 0 33.33%;
  font-style: ${(props) => (props.active ? "italic" : "normal")};
  border-bottom: ${(props) =>
    props.active ? "1px solid #000" : "1px solid transparent"};
  &:hover {
    cursor: pointer;
    font-style: italic;
    border-bottom: 1px dotted #000;
  }
  @media (max-width: 1000px) {
    margin-right: 50px;
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

const Card = styled(Link)`
  background: #fff;
  height: 250px;
  width: 225px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  margin: 10px;
  border-radius: 20px;
  &:hover {
    color: ${COLORS.darkest};
    box-shadow: 0 0 10px ${COLORS.light};
  }
`;

const Image = styled.img`
  height: 200px;
`;

const Name = styled.p`
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 10px;
`;
