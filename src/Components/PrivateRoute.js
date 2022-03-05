import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import UserContext from "../Context/user/userContext";
// import userReducer from "./userReducer";
import { GET_USER } from "../Context/types";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated, loading, dispatch } = useContext(UserContext);
  if (localStorage.getItem("userData")) {
    console.log(localStorage.getItem("userData"));
    // dispatch();
  }
  return (
    <>{!isAuthenticated && !loading ? <Navigate to="/" /> : <Component />}</>
  );
};

export default PrivateRoute;
