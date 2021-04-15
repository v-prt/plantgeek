import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { usersArray } from "../reducers/userReducer";
import { requestUsers, receiveUsers } from "../actions.js";

import styled from "styled-components";
import { COLORS } from "../GlobalStyles";
import { TiHeartOutline } from "react-icons/ti";
import { MdStarBorder } from "react-icons/md";
import { RiPlantLine } from "react-icons/ri";
import background from "../assets/monstera-bg.jpg";
import { GoEye, GoEyeClosed } from "react-icons/go";

export const SignUp = () => {
  const dispatch = useDispatch();
  const users = useSelector(usersArray);

  const [username, setUsername] = useState("");
  const handleUsername = (ev) => {
    setUsername(ev.target.value);
  };

  const [password, setPassword] = useState("");
  const handlePassword = (ev) => {
    setPassword(ev.target.value);
  };

  // DISABLES BUTTON UNTIL FORM HAS BEEN COMPLETED
  const [completeForm, setCompleteForm] = useState(false);
  useEffect(() => {
    if (username.length > 3 && password.length > 5) {
      setCompleteForm(true);
    } else {
      setCompleteForm(false);
    }
  }, [username, password]);

  // UPDATES STORE AFTER NEW USER ADDED TO DB
  const [newUser, setNewUser] = useState(false);
  useEffect(() => {
    dispatch(requestUsers());
    fetch("/users")
      .then((res) => res.json())
      .then((json) => {
        dispatch(receiveUsers(json.data));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [newUser]);

  const [usernameTaken, setUsernameTaken] = useState(undefined);
  const handleSignUp = (ev) => {
    ev.preventDefault();

    // resets value between login attempts
    setUsernameTaken(undefined);

    const existingUser = users.find((user) => {
      return user.username.toLowerCase() === username.toLowerCase();
    });
    if (!existingUser) {
      fetch("/users", {
        method: "POST",
        body: JSON.stringify({
          username: username,
          password: password,
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (res.status === 500) {
            console.error("Signup error!");
          }
          return res.json();
        })
        .then((data) => {
          if (data) {
            console.log("Signup successful!");
            setNewUser(true);
            // TODO: hash password for security
          }
        });
    } else setUsernameTaken(true);
  };

  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <Wrapper>
      <Card>
        <LoginLink to="/login">Have an account? Log in</LoginLink>
        <Info>
          <h1>welcome to plantgeek!</h1>
          {!newUser && (
            <>
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
            </>
          )}
        </Info>
        {newUser ? (
          <Confirmation>
            <p>Thank you for creating an account!</p>
            <p>Please save your credentials in a safe place.</p>
            <Credentials>
              <p>
                <b>username:</b>
                <Username>{username}</Username>
              </p>
              <Password>
                <b>password:</b>
                <PasswordToggle onClick={togglePassword}>
                  {passwordVisible ? <GoEyeClosed /> : <GoEye />}
                </PasswordToggle>
                <Secret show={passwordVisible}>{password}</Secret>
              </Password>
            </Credentials>
          </Confirmation>
        ) : (
          <Form autoComplete="off">
            <Label htmlFor="username">username</Label>
            <Input
              required
              type="text"
              name="signup"
              id="username"
              maxLength="15"
              onChange={handleUsername}
              error={usernameTaken}
            />
            <Error error={usernameTaken}>sorry, this username is taken</Error>
            <Label htmlFor="password">password</Label>
            <Input
              required
              type="password"
              name="signup"
              id="password"
              onChange={handlePassword}
            />
            <SignUpBtn
              type="submit"
              onClick={handleSignUp}
              disabled={!completeForm}
            >
              CREATE ACCOUNT
            </SignUpBtn>
          </Form>
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
  display: flex;
  flex-direction: column;
  width: 500px;
`;

const LoginLink = styled(Link)`
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

const Info = styled.section`
  background: ${COLORS.light};
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
  background: ${COLORS.lightest};
  height: 30px;
  width: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  border-radius: 50%;
  font-size: 1.3rem;
`;

const Confirmation = styled.div`
  background: ${COLORS.lightest};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
`;

const Credentials = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px;
`;

const Username = styled.span`
  padding: 0 10px;
`;

const Password = styled.div`
  display: flex;
`;

const Secret = styled.span`
  visibility: ${(props) => (props.show ? "visible" : "hidden")};
`;

const PasswordToggle = styled.button`
  color: #1a1a1a;
  margin: 0 10px;
  &:hover {
    color: ${COLORS.light};
  }
  &:focus {
    color: ${COLORS.light};
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

const SignUpBtn = styled.button`
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
