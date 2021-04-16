import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";
import { Provider } from "react-redux";
import configureStore from "./store";
import { LoginProvider } from "./context/LoginContext";

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <LoginProvider>
      <App />
    </LoginProvider>
  </Provider>,
  document.getElementById("root")
);
