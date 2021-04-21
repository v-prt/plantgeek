import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { plantsArray } from "../reducers/plantReducer.js";
import styled from "styled-components";
import { RiArrowRightSFill } from "react-icons/ri";
import { PlantCard } from "./PlantCard";

export const FeaturedPlants = () => {
  const plants = useSelector(plantsArray);
  const [featuredPlants, setFeaturedPlants] = useState(undefined);

  // SETS FEATURED PLANTS (random plants change each time you load)
  useEffect(() => {
    const getRandomPlant = () => {
      const randomIndex = Math.floor(Math.random() * plants.length);
      const randomPlant = plants[randomIndex];
      return randomPlant;
    };
    // only run function when plants length > 0
    let tempArray = plants.length > 0 ? [] : undefined;
    if (tempArray) {
      while (tempArray.length < 6) {
        let randomPlant = getRandomPlant(plants);
        if (!tempArray.find((plant) => plant.name === randomPlant.name)) {
          tempArray.push(randomPlant);
        }
      }
    }
    setFeaturedPlants(tempArray);
  }, [plants]);

  return (
    <Wrapper>
      {featuredPlants ? (
        <>
          <Heading>featured houseplants</Heading>
          <Plants>
            {featuredPlants.map((plant) => {
              return <PlantCard key={plant._id} plant={plant} />;
            })}
          </Plants>
          <Link to="/browse">
            <BrowseLink>
              browse more houseplants <RiArrowRightSFill />
            </BrowseLink>
          </Link>
        </>
      ) : (
        <>Loading...</>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.section`
  background: #f2f2f2;
  padding: 30px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Heading = styled.h2`
  text-align: center;
`;

const BrowseLink = styled.h2`
  display: flex;
  align-items: center;
  margin-top: 20px;
`;

const Plants = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 0 50px;
  max-width: 900px;
`;
