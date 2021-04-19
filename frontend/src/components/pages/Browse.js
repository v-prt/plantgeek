import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { plantsArray } from "../../reducers/plantReducer";
import { LoginContext } from "../../context/LoginContext";

import styled from "styled-components";
import { COLORS } from "../../GlobalStyles";
import background from "../../assets/monstera-bg.jpg";
import { ActionBar } from "../ActionBar";

export const Browse = () => {
  const plants = useSelector(plantsArray);
  const { loggedIn } = useContext(LoginContext);

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
  // FIXME: plants is empty if loading on this page (need to make sure filter isnt reset after using action bar)
  const [filteredPlants, setFilteredPlants] = useState(plants);
  const [selectedType, setSelectedType] = useState("all");
  // initially sets filter to all plants in db
  // useEffect(() => {
  //     setFilteredPlants(plants);
  //   }, [plants]);
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
                <Card key={plant._id}>
                  <Link to={`/plant-profile/${plant._id}`}>
                    <Image src={plant.image} />
                  </Link>
                  <Name>{plant.name}</Name>
                  {loggedIn && <ActionBar id={plant._id} />}
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

const Card = styled.div`
  background: #fff;
  height: 310px;
  width: 250px;
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
`;
