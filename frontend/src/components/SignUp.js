import React, { useState } from "react";
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

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleName = (ev) => {
    setName(ev.target.value);
  };

  const handleEmail = (ev) => {
    setEmail(ev.target.value);
  };

  const handleUsername = (ev) => {
    setUsername(ev.target.value);
  };

  const handlePassword = (ev) => {
    setPassword(ev.target.value);
  };

  const handleSignUp = (ev) => {
    ev.preventDefault();
    // TODO:
    // validate email (must be new, must include @)
    // validate username (must be new, must be between 4-10 chars)
    // validate password (must be between 6-12 chars)
    // show errors on page to user
    const existingUser = users.find((user) => {
      return user.email === email || user.username === username;
    });
    if (existingUser) {
      console.log("This account already exists!");
      // show prompt to user
      // send to login page?
    } else {
      fetch("/users", {
        method: "POST",
        body: JSON.stringify({
          email: email,
          name: name,
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
            // clear/reset form
            // send new user to their profile?
          }
        });
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
        <Form>
          <Label htmlFor="name">full name</Label>
          <Input
            required
            type="text"
            name="signup"
            id="name"
            onChange={handleName}
          />
          <Label htmlFor="email">email</Label>
          <Input
            required
            type="text"
            name="signup"
            id="email"
            onChange={handleEmail}
          />
          <Label htmlFor="username">username</Label>
          <Input
            required
            type="text"
            name="signup"
            id="username"
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
          <Button type="submit" onClick={handleSignUp}>
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
  padding: 30px;
`;

const Label = styled.label`
  font-size: 0.8rem;
  position: relative;
  top: 25px;
  left: 20px;
  width: fit-content;
`;

const Input = styled.input`
  margin: 0 10px;
  text-align: right;
  border: 2px solid transparent;
  &:focus {
    outline: none;
    border: 2px solid ${COLORS.medium};
  }
`;

const Button = styled.button`
  margin: 23px 10px;
`;
