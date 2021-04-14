import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { useSelector } from "react-redux";
import { usersArray } from "../reducers/userReducer";

import styled from "styled-components";
import { COLORS } from "../GlobalStyles";
import { TiHeartOutline } from "react-icons/ti";
import { MdStarBorder } from "react-icons/md";
import { RiPlantLine } from "react-icons/ri";
import background from "../assets/monstera-bg.jpg";

export const SignUp = () => {
  const history = useHistory();
  const users = useSelector(usersArray);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validName, setValidName] = useState(undefined);
  const [validEmail, setValidEmail] = useState(undefined);
  const [validPassword, setValidPassword] = useState(undefined);
  const [existingEmail, setExistingEmail] = useState(undefined);

  const handleName = (ev) => {
    setName(ev.target.value);
  };

  const handleEmail = (ev) => {
    setEmail(ev.target.value);
  };

  const handlePassword = (ev) => {
    setPassword(ev.target.value);
  };

  // FIXME: need to click submit twice
  const handleSignUp = (ev) => {
    ev.preventDefault();

    setValidName(name.length > 2);
    setValidEmail(email.includes("@"));
    setValidPassword(password.length > 5);
    setExistingEmail(
      users.find((user) => {
        return user.email === email;
      })
    );

    if (validName && validEmail && validPassword && !existingEmail) {
      fetch("/users", {
        method: "POST",
        body: JSON.stringify({
          name: name,
          email: email,
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
            // TODO: replace alert with confirmation page
            alert("Your account has been created! Please login");
            history.push("/login");
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
          <Label htmlFor="name">name</Label>
          <Input
            required
            type="text"
            name="signup"
            id="name"
            onChange={handleName}
            error={validName === false}
          />
          <Error error={validName === false}>please enter your name</Error>
          <Label htmlFor="email">email</Label>
          <Input
            required
            type="text"
            name="signup"
            id="email"
            minLength="5"
            maxLength="30"
            onChange={handleEmail}
            error={validEmail === false}
          />
          <Error error={validEmail === false}>
            please enter a valid email address
          </Error>
          <Error error={existingEmail}>this email is already in use</Error>
          <Label htmlFor="password">password</Label>
          <Input
            required
            type="password"
            name="signup"
            id="password"
            minLength="6"
            maxLength="12"
            onChange={handlePassword}
            error={validPassword === false}
          />
          <Error error={validPassword === false}>password too short</Error>
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
  text-align: right;
  margin-right: 20px;
`;

const Button = styled.button`
  margin: 30px 0;
  border-radius: 15px;
`;
