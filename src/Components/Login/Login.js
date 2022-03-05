import React, { useState, useContext, createContext } from "react";
import UserContext from "../../Context/user/userContext";
import { Navigate } from "react-router-dom";

const Login = ({ history }) => {
  const { isAuthenticated, getUser, logoutUser, errorMessages, role } =
    useContext(UserContext);

  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });

  const onChange = (e) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    getUser(loginForm);
  };

  const renderForm = (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label>Username </label>
          <input onChange={onChange} type="text" name="username" required />
        </div>
        <div className="input-container">
          <label>Password </label>
          <input onChange={onChange} type="password" name="password" required />
        </div>
        <div className="button-container">
          <input type="submit" />
        </div>
      </form>
    </div>
  );
  return (
    <div className="app">
      <div className="login-form">
        <div className="title">Sign In</div>
        {renderForm}
        {isAuthenticated ? (role == "teacher" ? (<Navigate to="/test-creation" />) : (<Navigate to="/welcome" />)) : (
          <div>
            {errorMessages.message ? (
              <h1>{errorMessages.message}</h1>
            ) : (
              <h1></h1>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default Login;
