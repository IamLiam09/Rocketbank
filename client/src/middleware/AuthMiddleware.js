// AuthMiddleware.js
import React from "react";
import { Redirect } from "react-router-dom";

const AuthMiddleware = ({ isAuthenticated, children }) => {
  if (isAuthenticated) {
    // User is already authenticated, redirect to the home page
    return <Redirect to="/home" />;
  }

  return children;
};

export default AuthMiddleware;
