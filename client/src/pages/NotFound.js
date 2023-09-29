import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="container mt-5">
      <div className="alert alert-danger">
        <h4 className="alert-heading">Page Not Found</h4>
        <p>
          The page you are looking for does not exist. Please{" "}
          <Link to="/">register</Link> or{" "}
          <Link to="/login">login</Link> to access the bank.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
