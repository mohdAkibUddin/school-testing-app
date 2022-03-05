import React, { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import UserContext from "../Context/user/userContext";
// import userReducer from "./userReducer";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated, loading, dispatch, username } =
    useContext(UserContext);

  useEffect(() => {
    if (
      !isAuthenticated &&
      !loading &&
      !username &&
      localStorage.getItem("userData")
    ) {
      dispatch(JSON.parse(localStorage.getItem("userData")));
    }
  }, [dispatch, isAuthenticated, loading, username]);

  return (
    <>{!isAuthenticated && !loading ? <Navigate to="/" /> : <Component />}</>
  );
};

export default PrivateRoute;
