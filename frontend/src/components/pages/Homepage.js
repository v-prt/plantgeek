import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { LoginContext } from "../../context/LoginContext";

import styled from "styled-components";
import { COLORS } from "../../GlobalStyles";
import { RiArrowRightSFill } from "react-icons/ri";
import stem from "../../assets/stem.png";

import { FeaturedPlants } from "../FeaturedPlants";

export const Homepage = () => {
  const { loggedIn } = useContext(LoginContext);

  // makes window scroll to top between renders
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // TODO: improve site info, fix lists, add more content to heading (profile info/image? stats? random tip?)
  return (
    <Wrapper>
      <Heading>
        {loggedIn ? (
          <h1>welcome back, {loggedIn.username}</h1>
        ) : (
          <h1>welcome!</h1>
        )}
        <Background src={stem} alt="" />
      </Heading>
      <SiteInfo>
        <Link to="/browse">
          <h2>
            browse houseplants <RiArrowRightSFill />
          </h2>
        </Link>
        <li>
          find your plant and view its profile to learn how to care for it
        </li>
        <li>check if your plant is pet friendly</li>
        {loggedIn ? (
          <>
            <Link to={`/user-profile/${loggedIn.username}`}>
              <h2>
                view your profile <RiArrowRightSFill />
              </h2>
            </Link>
            <li>manage your collection, favorites, and wishlist</li>
            <li>see your friends</li>
          </>
        ) : (
          <>
            <Link to="/signup">
              <h2>
                create an account <RiArrowRightSFill />
              </h2>
            </Link>
            <p>keep a list of your own houseplant collection</p>
            <li>quickly view your plant's needs</li>
            <li>upload photos of your own plants</li>
            <p>save your favorite plants</p>
            <p>create a wishlist</p>
            <p>make friends</p>
            <li>find users who like similar plants</li>
            <li>share plant care tips with other users</li>
          </>
        )}
      </SiteInfo>
      <FeaturedPlants />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Heading = styled.section`
  background: ${COLORS.light};
  width: 80%;
  margin: 15px 30px;
  border-radius: 20px;
  padding: 30px 30px 0 30px;
  h1 {
    font-size: 1.8rem;
    text-align: right;
  }
`;

const Background = styled.img`
  position: relative;
  bottom: -8px;
  height: 200px;
`;

const SiteInfo = styled.section`
  background: #fff;
  width: 80%;
  margin: 15px 30px;
  border-radius: 20px;
  padding: 0 30px 20px 30px;
  h2 {
    display: flex;
    align-items: center;
    margin-top: 20px;
  }
  li {
    margin-left: 20px;
  }
`;
