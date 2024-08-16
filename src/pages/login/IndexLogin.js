import React from "react";
import LoginContext from "../../context/LoginContext";
import Login from "./Login";
export const IndexLogin = () => {
  return (
    <LoginContext>
      <Login />
    </LoginContext>
  );
};
