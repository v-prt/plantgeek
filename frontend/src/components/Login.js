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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [incorrectUsername, setIncorrectUsername] = useState(undefined);
  const [incorrectPassword, setIncorrectPassword] = useState(undefined);

  const handleUsername = (ev) => {
    setUsername(ev.target.value);
  };

  const handlePassword = (ev) => {
    setPassword(ev.target.value);
  };

  const handleLogin = (ev) => {
    ev.preventDefault();
    // resets values between login attempts
    setIncorrectUsername(undefined);
    setIncorrectPassword(undefined);
    if (users.length > 0) {
      const user = users.find((user) => user.username === username);
      if (user) {
        if (user.password === password) {
          console.log("Signed in!");
          history.push(`/profile/${user.username}`);
          // TODO: add user data to local storage and save as current user
          // store name and generated id
          // store id temporarily in server with set timeout or interval, check if expired (eg: give it current date time and compare with 2 hrs later)
          // check when they login or refresh the page
          // compare to id object in server with date (time it has + timelimit) - current time
          // if it is =< 0 then its expired and redirect to login
        } else {
          console.log("Incorrect password!");
          setIncorrectPassword(true);
        }
      } else {
        console.log("This username hasn't been registered!");
        setIncorrectUsername(true);
      }
    } else {
      console.log("No users registered!");
      setIncorrectUsername(true);
    }
  };

  return (
    <Wrapper>
      <Card>
        <SignUpLink to="/signup">Don't have an account? Sign up</SignUpLink>
        <Form>
          <Input
            type="text"
            placeholder="username"
            onChange={handleUsername}
            error={incorrectUsername}
          />
          <Error error={incorrectUsername}>this username doesn't exist</Error>
          <Input
            type="password"
            placeholder="password"
            onChange={handlePassword}
            error={incorrectPassword}
          />
          <Error error={incorrectPassword}>incorrect password</Error>
          <Button
            type="submit"
            onClick={handleLogin}
            disabled={!username || !password}
          >
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
  border: ${(props) =>
    props.error ? "2px solid #ff0000" : `2px solid ${COLORS.light}`};
`;

const Error = styled.p`
  display: ${(props) => (props.error ? "block" : "none")};
  color: #ff0000;
  text-align: center;
`;

const Button = styled.button``;
