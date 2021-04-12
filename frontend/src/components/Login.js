import React from "react";
import styled from "styled-components";
import background from "../assets/monstera-bg.jpg";

export const Login = () => {
  return (
    <Wrapper>
      <Form>
        <input type="text" placeholder="name" />
        <input type="password" placeholder="password" />
        <button type="submit">Log In</button>
      </Form>
    </Wrapper>
  );
};

const Wrapper = styled.main`
  background: url(${background}) center center / cover;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Form = styled.form`
  background: rgba(255, 255, 255, 0.5);
  min-width: 300px;
  max-width: 500px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 20px;
  input {
    margin: 10px;
  }
`;