import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import UserContext from "../Context/user/userContext";

const Navbar = () => {
  const { isAuthenticated, logoutUser } = useContext(UserContext);

  return (
    <>
      {!isAuthenticated ? (
        <></>
      ) : (
        <button type="submit" onClick={logoutUser}>
          Log Out
        </button>
      )}
    </>
  );
};

export default Navbar;
