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

  return (
    <>
      {!isAuthenticated ? (
        <></>
      ) : (
        <div>
          {role === "teacher" ? (
            <div class="Nav">
              <h1>Welcome Teacher</h1>
              <button onClick={questionPage} type="submit">
                Question Bank
              </button>
              <button onClick={testPage} type="submit">
                Create Test
              </button>
            </div>
          ) : (
            <div class="Nav">
              <h1>Welcome Student</h1>
              <button type="submit">Student Page</button>
            </div>
          )}
          <button type="submit" onClick={logoutUser}>
            Log Out
          </button>
        </div>
      )}
    </>
  );
};

export default Navbar;
