import React, { useContext, useEffect } from "react";
import { NavLink } from "react-router-dom";
import UserContext from "../Context/user/userContext";

const Navbar = () => {
  const { isAuthenticated, role, logoutUser } = useContext(UserContext);

  return (
    <>
      {!isAuthenticated ? (
        <></>
      ) : (
        <nav id="nav">
          {role === "teacher" ? (
            <>
              <div id="first">
                <h1>Welcome Teacher</h1>
              </div>
              <div id="second">
                <NavLink
                  exact
                  style={({ isActive }) => ({
                    color: isActive ? "#fff" : "#002D62",
                  })}
                  to="/question-bank"
                  type="submit"
                >
                  Question Bank
                </NavLink>
                <NavLink
                  exact
                  style={({ isActive }) => ({
                    color: isActive ? "#fff" : "#002D62",
                  })}
                  to="/test-creation"
                  type="submit"
                >
                  Create Test
                </NavLink>
                <NavLink
                  exact
                  style={({ isActive }) => ({
                    color: isActive ? "#fff" : "#002D62",
                  })}
                  to="/grade-tests"
                  type="submit"
                >
                  Grade Tests
                </NavLink>
                <NavLink
                  exact
                  style={({ isActive }) => ({
                    color: isActive ? "#fff" : "#002D62",
                  })}
                  to="/"
                  type="submit"
                  onClick={logoutUser}
                >
                  Log Out
                </NavLink>
              </div>
            </>
          ) : (
            <>
              <div id="first">
                <h1>Welcome Student</h1>
              </div>
              <div id="second">
                <NavLink
                  exact
                  style={({ isActive }) => ({
                    color: isActive ? "#fff" : "#002D62",
                  })}
                  to="/view-tests"
                  type="submit"
                >
                  Choose Test
                </NavLink>
                <NavLink
                  exact
                  style={({ isActive }) => ({
                    color: isActive ? "#fff" : "#002D62",
                  })}
                  to="/"
                  type="submit"
                  onClick={logoutUser}
                >
                  Log Out
                </NavLink>
              </div>
            </>
          )}
        </nav>
      )}
    </>
  );
};

export default Navbar;
