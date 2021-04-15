import React, { useState } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { usersArray } from "../reducers/userReducer";
// import { login } from "../actions.js";

import styled from "styled-components";
import { COLORS } from "../GlobalStyles";
import background from "../assets/monstera-bg.jpg";

export const Login = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const users = useSelector(usersArray);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmail = (ev) => {
    setEmail(ev.target.value);
  };

  const handlePassword = (ev) => {
    setPassword(ev.target.value);
  };

  // FIXME: only works for first user
  const handleLogin = (ev) => {
    ev.preventDefault();
    users.find((user) => {
      if (user.email === email && user.password === password) {
        // dispatch(login(user));
        console.log(user, "Signed in!");
        // TODO: username instead of id
        history.push(`/${user._id}/profile`);
      } else {
        console.log("Incorrect login information");
        // TODO: handle wrong email and show error to user
        // TODO: handle wrong password and show error to user
      }
      return user;
    });
  };

  return (
    <Wrapper>
      <Card>
        <SignUpLink to="/signup">Don't have an account? Sign up</SignUpLink>
        <Form>
          <Input type="text" placeholder="email" onChange={handleEmail} />
          <Input
            type="password"
            placeholder="password"
            onChange={handlePassword}
          />
          <Button type="submit" onClick={handleLogin}>
            LOG IN
          </Button>
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
