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

  // FIXME:
  const [validName, setValidName] = useState(true);
  const [validEmail, setValidEmail] = useState(true);
  const [validUsername, setValidUsername] = useState(true);
  const [validPassword, setValidPassword] = useState(true);

  const handleSignUp = (ev) => {
    ev.preventDefault();

    // FIXME: signup successful when submit empty form
    setValidName(name.length > 3);
    setValidEmail(email.includes("@"));
    setValidUsername(username.length > 3);
    setValidPassword(password.length > 5);

    const existingUser = users.find((user) => {
      return user.email === email || user.username === username;
    });

    if (existingUser) {
      console.log(
        "An account has already been registered with this email or username"
      );
    } else if (!validName) {
      console.log("Please enter your name");
    } else if (!validEmail) {
      console.log("Please use a valid email");
    } else if (!validUsername) {
      console.log("Username must be at least 4 characters in length");
    } else if (!validPassword) {
      console.log("Password must be at least 6 characters in length");
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
            // TODO:
            // clear/reset form
            // welcome/send to profile?
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
            error={!validName}
          />
          <Error error={!validName}>please enter your name</Error>
          <Label htmlFor="email">email</Label>
          <Input
            required
            type="text"
            name="signup"
            id="email"
            minLength="5"
            maxLength="30"
            onChange={handleEmail}
            error={!validEmail}
          />
          <Error error={!validEmail}>please enter a valid email address</Error>
          <Label htmlFor="username">username</Label>
          <Input
            required
            type="text"
            name="signup"
            id="username"
            minLength="4"
            maxLength="10"
            onChange={handleUsername}
            error={!validUsername}
          />
          <Error error={!validUsername}>username too short</Error>
          <Label htmlFor="password">password</Label>
          <Input
            required
            type="password"
            name="signup"
            id="password"
            minLength="6"
            maxLength="12"
            onChange={handlePassword}
            error={!validPassword}
          />
          <Error error={!validPassword}>password too short</Error>
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
  width: 500px;
  /* min-width: 400px;
  max-width: 700px; */
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
  top: 25px;
  left: 30px;
  padding: 10px;
  font-size: 0.9rem;
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
  text-align: right;
  margin-right: 20px;
`;

const Button = styled.button`
  margin: 30px 0;
  border-radius: 15px;
`;
