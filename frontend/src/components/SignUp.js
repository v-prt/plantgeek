import React from "react";
import { useSelector } from "react-redux";
import { usersArray } from "../reducers/userReducer";

import styled from "styled-components";
import { COLORS } from "../GlobalStyles";
import { TiHeartOutline } from "react-icons/ti";
import { MdStarBorder } from "react-icons/md";
import { RiPlantLine } from "react-icons/ri";
import background from "../assets/monstera-bg.jpg";

export const SignUp = () => {
  const users = useSelector(usersArray);

  const handleSignUp = () => {
    // required info: email, name, username, password
    // check if email or username already exists in db
    // if yes, push to login
    // else, sign up successful
    // set logged in = true
    // push to profile
  };

  return (
    <Wrapper>
      <Card>
        <Info>
          <h1>welcome to plantgeek!</h1>
          <p>You may create an account in order to...</p>
          <ul>
            <li>
              <Icon>
                <RiPlantLine />
              </Icon>
              show off your collection
            </li>
            <li>
              <Icon>
                <TiHeartOutline />
              </Icon>
              save your favorite plants
            </li>
            <li>
              <Icon>
                <MdStarBorder />
              </Icon>
              create a wishlist
            </li>
          </ul>
        </Info>
        <Form>
          <Input type="text" placeholder="full name" required />
          <Input type="text" placeholder="email" required />
          <Input type="text" placeholder="username" required />
          <Input type="password" placeholder="password" required />
          <Button type="submit">CREATE ACCOUNT</Button>
        </Form>
      </Card>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background: url(${background}) center center / cover;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.5);
  display: flex;
  flex-direction: column;
`;

const Info = styled.section`
  background: ${COLORS.lightest};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  h1 {
    margin: 10px;
  }
  li {
    display: flex;
    font-size: 1.1rem;
    margin: 10px;
  }
`;

const Icon = styled.div`
  background: ${COLORS.light};
  height: 30px;
  width: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  border-radius: 50%;
  font-size: 1.3rem;
`;

const Form = styled.form`
  width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 30px;
`;

const Input = styled.input`
  margin: 10px;
  text-align: center;
`;

const Button = styled.button``;
