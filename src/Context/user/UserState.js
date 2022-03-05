import React, { useReducer, useState } from "react";
import UserContext from "./userContext";
import userReducer from "./userReducer";

import axios from "axios";

import { GET_USER, SET_LOADING, LOGOUT } from "../types";

const UserState = (props) => {
  const initialState = {
    tests: null,
    username: null,
    role: null,
    isAuthenticated: false,
    loading: false,
  };
  const [errorMessages, setErrorMessages] = useState({});
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Login User
  const getUser = async (loginForm) => {
    setLoading();
    const res = await axios.get(
      "https://w81a61.deta.dev/users/" + loginForm.username
    );
    const userData = res.data;
    if (userData) {
      if (userData.password !== loginForm.password) {
        // Invalid password
        setErrorMessages({ message: "Invalid Credentials" });
      } else {
        await dispatch({
          type: GET_USER,
          payload: {
            username: loginForm.username,
            role: userData.role,
            tests: userData.tests,
          },
        });
        localStorage.setItem("userData", {
          type: GET_USER,
          payload: {
            username: loginForm.username,
            role: userData.role,
            tests: userData.tests,
          },
        });
      }
    } else {
      // Username not found
      setErrorMessages({ message: "Invalid Credentials" });
    }
  };

  // Trigger loading state
  const setLoading = () => {
    dispatch({ type: SET_LOADING });
  };

  const logoutUser = () => {
    dispatch({ dispatch: LOGOUT });
    localStorage.setItem("userData", initialState);
  };

  return (
    <UserContext.Provider
      value={{
        tests: state.detail,
        username: state.username,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        role: state.role,
        getUser,
        errorMessages,
        logoutUser,
        dispatch,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserState;
