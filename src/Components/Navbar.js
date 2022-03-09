import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../Context/user/userContext";

const Navbar = () => {
  let navigate = useNavigate();
  // const { isAuthenticated, role, logoutUser } = useContext(UserContext);
  const role = "teacher"

  const questionPage = () => {
    navigate("/question-bank");
  };
  const testPage = () => {
    navigate("/test-creation");
  };

  return (
    <>
      {!true ? (
        <></>
      ) : (
        <div>
          {role === "teacher" ? (
            <>
              <button onClick={questionPage} type="submit">
                Question Bank
              </button>
              <button onClick={testPage} type="submit">
                Create Test
              </button>
            </>
          ) : (
            <button type="submit">Student Page</button>
          )}
          <button type="submit" onClick={"logoutUser"}>
            Log Out
          </button>
        </div>
      )}
    </>
  );
};

export default Navbar;
