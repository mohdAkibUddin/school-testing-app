import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../Context/user/userContext";

const Navbar = () => {
  let navigate = useNavigate();
  const { isAuthenticated, role, logoutUser } = useContext(UserContext);

  const questionPage = () => {
    navigate("/question-bank");
  };
  const testPage = () => {
    navigate("/test-creation");
  };

  const chooseTestPage = () => {
    navigate("/view-tests");
  };

  const gradeTestpage = () => {
    navigate("/grade-tests");
  };

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
                <button onClick={questionPage} type="submit">
                  Question Bank
                </button>
                <button onClick={testPage} type="submit">
                  Create Test
                </button>
                <button onClick={gradeTestpage} type="submit">
                  Grade Tests
                </button>
                <button type="submit" onClick={logoutUser}>
                  Log Out
                </button>
              </div>
            </>
          ) : (
            <>
              <div id="first">
                <h1>Welcome Student</h1>
              </div>
              <div id="second">
                <button onClick={chooseTestPage} type="submit">
                  Choose Test
                </button>
                <button type="submit" onClick={logoutUser}>
                  Log Out
                </button>
              </div>
            </>
          )}
        </nav>
      )}
    </>
  );
};

export default Navbar;
