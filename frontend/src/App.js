import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import GlobalStyles from "./GlobalStyles";
import { Navbar } from "./components/Nav/Navbar";
import { Home } from "./components/Home";
import { Plants } from "./components/Plants";
import { Login } from "./components/Login";
import { Profile } from "./components/Profile";

export const App = () => {
  return (
    <BrowserRouter>
      <GlobalStyles />
      <Navbar />
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
    </BrowserRouter>
  );
};
