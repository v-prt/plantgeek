import React, { useState, useEffect, useRef, useContext } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { usersArray } from "../reducers/userReducer";
import { LoginContext } from "../context/LoginContext";

import styled from "styled-components";
import { COLORS } from "../GlobalStyles";
import background from "../assets/monstera-bg.jpg";

export const Login = () => {
  const history = useHistory();
  const users = useSelector(usersArray);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [incorrectUsername, setIncorrectUsername] = useState(undefined);
  const [incorrectPassword, setIncorrectPassword] = useState(undefined);
  const { loggedIn, setLoggedIn } = useContext(LoginContext);

  // FOCUSES ON FIRST INPUT ON LOAD
  const input = useRef(null);
  useEffect(() => {
    if (!loggedIn) {
      input.current.focus();
    }
  }, [loggedIn, input]);

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
          history.push(`/${user.username}/profile`);
          setLoggedIn({
            username: username,
            timestamp: new Date().getTime(),
          });
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
        {loggedIn ? (
          <Alert>You're already logged in, {loggedIn.username}!</Alert>
        ) : (
          <>
            <SignUpLink to="/signup">Don't have an account? Sign up</SignUpLink>
            <Welcome>
              <h1>welcome back!</h1>
            </Welcome>
            <Form autoComplete="off">
              <Label htmlFor="username">username</Label>
              <Input
                required
                type="text"
                name="login"
                id="username"
                onChange={handleUsername}
                error={incorrectUsername}
                ref={input}
              />
              <Error error={incorrectUsername}>
                this username doesn't exist
              </Error>
              <Label htmlFor="password">password</Label>
              <Input
                required
                type="password"
                name="login"
                id="password"
                onChange={handlePassword}
                error={incorrectPassword}
              />
              <Error error={incorrectPassword}>incorrect password</Error>
              <LoginBtn
                type="submit"
                onClick={handleLogin}
                disabled={!username || !password}
              >
                LOG IN
              </LoginBtn>
            </Form>
          </>
        )}
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
  background: ${COLORS.lightest};
  display: flex;
  flex-direction: column;
  width: 500px;
`;

const Alert = styled.div`
  text-align: center;
  font-size: 1.5rem;
  padding: 50px;
`;

const SignUpLink = styled(Link)`
  background: ${COLORS.medium};
  color: #fff;
  padding: 5px;
  display: flex;
  justify-content: center;
  font-weight: bold;
  &:hover {
    background: #1a1a1a;
    color: #fff;
  }
`;

const Welcome = styled.div`
  background: ${COLORS.light};
  padding: 20px;
  h1 {
    margin: 10px;
    text-align: center;
  }
`;

const Form = styled.form`
  background: ${COLORS.lightest};
  display: flex;
  flex-direction: column;
  padding: 0 30px;
`;

const Label = styled.label`
  background: ${COLORS.lightest};
  width: fit-content;
  position: relative;
  top: 15px;
  left: 30px;
  padding: 0 10px;
  font-size: 0.9rem;
  border-radius: 10px;
`;

const Input = styled.input`
  background: ${COLORS.lightest};
  border: ${(props) =>
    props.error ? "2px solid #ff0000" : `2px solid ${COLORS.light}`};
  border-radius: 15px;
  text-align: right;
  &:focus {
    outline: none;
    border: 2px solid ${COLORS.medium};
  }
`;

const Error = styled.p`
  display: ${(props) => (props.error ? "block" : "none")};
  color: #ff0000;
  text-align: center;
`;

const LoginBtn = styled.button`
  background: ${COLORS.darkest};
  color: ${COLORS.lightest};
  margin: 30px 0;
  border-radius: 15px;
  padding: 10px;
  &:hover {
    background: ${COLORS.medium};
  }
  &:focus {
    background: ${COLORS.medium};
  }
  &:disabled:hover {
    background: ${COLORS.darkest};
  }
`;
