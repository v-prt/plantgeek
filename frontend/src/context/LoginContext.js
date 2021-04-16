import React, { createContext, useEffect } from "react";
import usePersistedState from "../hooks/use-persisted-state.hook";

export const LoginContext = createContext(null);
export const LoginProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = usePersistedState("logged-in", false);

  useEffect(() => {
    if (loggedIn) {
      let timeElapsed = new Date().getTime() - loggedIn.timestamp;
      let seconds = timeElapsed / 1000;
      if (seconds > 120) {
        setLoggedIn(false);
      }
    }
  });

  const logOut = (ev) => {
    ev.preventDefault();
    setLoggedIn(false);
  };

  return (
    <LoginContext.Provider
      value={{
        loggedIn,
        setLoggedIn,
        logOut,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};
