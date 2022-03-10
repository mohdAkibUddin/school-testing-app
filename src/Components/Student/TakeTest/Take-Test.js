import React from "react";
import { useLocation } from "react-router";
import TestPage from "./Test-Page";


const TakeTest = () => {
   const location = useLocation();

   const test_key = location.search.substring(1, );
   const username = JSON.parse(localStorage.getItem("userData")).payload.username;
   return (
      <TestPage
         test_key={test_key}
         student_name={username}
      />
   );
}

export default TakeTest;
