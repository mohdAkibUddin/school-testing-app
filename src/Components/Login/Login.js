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
          <label>Username: </label>
          <input onChange={onChange} type="text" name="username" required />
        </div>
        <div className="input-container">
          <label>Password: </label>
          <input onChange={onChange} type="password" name="password" required />
        </div>
        <div className="button-container">
          <input className="buttonLogin" type="submit" />
        </div>
      </form>
    </div>
  );
  return (
    <div className="app">
      <div className="login-form">
        <img
          className="loginImage"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1200px-Python-logo-notext.svg.png"
        />
        <div className="title">Sign In</div>
        {renderForm}
        {isAuthenticated ? (
          role == "teacher" ? (
            <Navigate to="/grade-tests" />
          ) : (
            <Navigate to="/view-tests" />
          )
        ) : (
          <div>
            {console.log(errorMessages)}
            {errorMessages.message ? (
              <h1 id="errorMessage">{errorMessages.message}</h1>
            ) : (
              <></>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default Login;
