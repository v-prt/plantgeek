import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import styled from "styled-components";
import GlobalStyles from "./GlobalStyles";
import { Navbar } from "./components/Navbar";
import { Home } from "./components/Home";
import { Plants } from "./components/Plants";
import { Login } from "./components/Login";
import { Profile } from "./components/Profile";

export const App = () => {
  return (
    <BrowserRouter>
      <GlobalStyles />
      <Navbar />
      <Main>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/plants">
            <Plants />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/user/profile">
            <Profile />
          </Route>
        </Switch>
      </Main>
    </BrowserRouter>
  );
};

// adjusts width of main content to account for responsive navbar
const Main = styled.main`
  width: calc(100vw - 240px);
  @media (max-width: 999px) {
    width: calc(100vw - 92px);
  }
`;
