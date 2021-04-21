import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LoginContext } from "../../context/LoginContext";
import { useSelector } from "react-redux";
import { usersArray } from "../../reducers/userReducer";

import styled from "styled-components";
import { COLORS } from "../../GlobalStyles";
import { RiArrowRightSFill } from "react-icons/ri";
import placeholder from "../../assets/avatar-placeholder.png";

import { FeaturedPlants } from "../FeaturedPlants";

export const Homepage = () => {
  const users = useSelector(usersArray);
  const [user, setUser] = useState([]);
  const { loggedIn } = useContext(LoginContext);

  // makes window scroll to top between renders
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (loggedIn) {
      setUser(users.find((user) => user.username === loggedIn.username));
    }
  }, [loggedIn, users]);

  // TODO: improve site info, fix lists, add more content to heading (profile info/image? stats? random tip?)
  return (
    <Wrapper>
      <Heading>
        {loggedIn ? (
          <Row>
            <h1>welcome back, {user.username}</h1>{" "}
            <img src={user.avatar ? user.avatar : placeholder} alt="" />
          </Row>
        ) : (
          <h1>welcome!</h1>
        )}
      </Heading>
      <SiteInfo>
        <Link to="/browse">
          <h2>
            browse houseplants <RiArrowRightSFill />
          </h2>
        </Link>
        <li>view your plant's profile to learn how to care for it</li>
        <li>check if your plant is pet friendly</li>
        {loggedIn ? (
          <>
            <Link to={`/user-profile/${loggedIn.username}`}>
              <h2>
                view your profile <RiArrowRightSFill />
              </h2>
            </Link>
            <li>
              view your own collection and quickly refer to your plants' needs
            </li>
            <li>keep a list of your favorite plants</li>
            <li>add plants you would like to own to your wishlist</li>
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
  min-height: 100vh;
`;

const Heading = styled.section`
  background: ${COLORS.light};
  width: 80%;
  display: flex;
  justify-content: flex-end;
  margin: 15px 30px;
  border-radius: 20px;
  padding: 30px;
  h1 {
    font-size: 1.8rem;
  }
  img {
    height: 80px;
    width: 80px;
    border-radius: 50%;
    margin-left: 20px;
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
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
