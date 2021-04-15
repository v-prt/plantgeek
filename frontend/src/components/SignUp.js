import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { usersArray } from "../reducers/userReducer";
import { requestUsers, receiveUsers } from "../actions.js";

import styled from "styled-components";
import { COLORS } from "../GlobalStyles";
import { TiHeartOutline } from "react-icons/ti";
import { MdStarBorder } from "react-icons/md";
import { RiPlantLine } from "react-icons/ri";
import background from "../assets/monstera-bg.jpg";

export const SignUp = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const users = useSelector(usersArray);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newUser, setNewUser] = useState(false);

  const handleUsername = (ev) => {
    setUsername(ev.target.value);
  };

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

  // TODO: hash password for security
  const handleSignUp = (ev) => {
    ev.preventDefault();
    const existingUser = users.find((user) => {
      return user.username === username;
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
            // TODO: show confirmation to user
          }
        });
    } else {
      console.log("This username is taken");
      // TODO: show error to user
    }
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
        <Form autoComplete="off">
          <Label htmlFor="username">username</Label>
          <Input
            required
            type="text"
            name="signup"
            id="name"
            maxLength="15"
            onChange={handleUsername}
          />
          <Label htmlFor="password">password</Label>
          <Input
            required
            type="password"
            name="signup"
            id="password"
            onChange={handlePassword}
          />
          <Button type="submit" onClick={handleSignUp} disabled={!completeForm}>
            CREATE ACCOUNT
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
  width: 500px;
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
  border: 2px solid ${COLORS.light};
  border-radius: 15px;
  text-align: right;
  &:focus {
    outline: none;
    border: 2px solid ${COLORS.medium};
  }
`;

const Button = styled.button`
  margin: 30px 0;
  border-radius: 15px;
`;
