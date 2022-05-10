import React, { useContext, useEffect } from "react";
import { NavLink } from "react-router-dom";
import UserContext from "../Context/user/userContext";
import { MobileNav } from "./MobileNav";

const Navbar = () => {
  const { isAuthenticated, role, logoutUser } = useContext(UserContext);

  const studentItems = [
    {
      id: 1,
      value: "Choose Test",
      directory: "/view-tests",
    },
    {
      id: 2,
      value: "Log Out",
      directory: "/",
    },
  ];

  const teacherItems = [
    {
      id: 1,
      value: "Question Bank",
      directory: "/question-bank",
    },
    {
      id: 2,
      value: "Create Test",
      directory: "/test-creation",
    },
    {
      id: 3,
      value: "Grade Tests",
      directory: "/grade-tests",
    },
    {
      id: 4,
      value: "Log Out",
      directory: "/",
    },
  ];
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
              <MobileNav
                id="MobileNav"
                items={teacherItems}
                logoutUser={logoutUser}
              ></MobileNav>
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
              <MobileNav
                id="MobileNav"
                items={studentItems}
                logoutUser={logoutUser}
              ></MobileNav>
            </>
          )}
        </nav>
      )}
    </>
  );
};

export default Navbar;
