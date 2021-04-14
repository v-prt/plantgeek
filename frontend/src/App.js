import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  requestPlants,
  receivePlants,
  requestUsers,
  receiveUsers,
} from "./actions.js";

import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Home } from "./components/Home";
import { Plants } from "./components/Plants";
import { Login } from "./components/Login";
import { SignUp } from "./components/SignUp";
import { PlantInfo } from "./components/PlantInfo";
import { Profile } from "./components/Profile";

import styled from "styled-components";
import GlobalStyles from "./GlobalStyles";

export const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(requestPlants());
    fetch("/plants")
      .then((res) => res.json())
      .then((json) => {
        dispatch(receivePlants(json.data));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [dispatch]);

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
  }, [dispatch]);

  return (
    <BrowserRouter>
      <GlobalStyles />
      <Navbar />
      <Main>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/plants">
            <Plants />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/signup">
            <SignUp />
          </Route>
          <Route path="/user/profile">
            <Profile />
          </Route>
          <Route path="/plants/:id">
            <PlantInfo />
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
