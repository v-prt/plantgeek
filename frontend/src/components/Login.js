import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { usersArray } from "../reducers/userReducer";

import styled from "styled-components";
import { COLORS } from "../GlobalStyles";
import background from "../assets/monstera-bg.jpg";

export const Login = () => {
  const users = useSelector(usersArray);

  // const handleLogin = () => {
  //   ev.preventDefault();
  //   users.find((user) => {
  //     if (user.username === username) {
  //       if (user.password === password) {
  //         // set logged in = true
  //         // set local storage
  //         // push to profile
  //       } else {
  //         // warning - wrong password
  //       }
  //     } else {
  //       // username not in db - push to sign up
  //     }
  //   });
  // };

  return (
    <Wrapper>
      <Card>
        <SignUpLink to="/signup">Don't have an account? Sign up</SignUpLink>
        <Form>
          <Input type="text" placeholder="username" />
          <Input type="password" placeholder="password" />
          <Button type="submit">LOG IN</Button>
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

const SignUpLink = styled(Link)`
  background: ${COLORS.light};
  padding: 5px;
  display: flex;
  justify-content: center;
  font-weight: bold;
  &:hover {
    background: ${COLORS.medium};
    color: white;
  }
`;

const Form = styled.form`
  width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 30px;
`;

const Input = styled.input`
  text-align: center;
  margin: 10px;
`;

const Button = styled.button``;
