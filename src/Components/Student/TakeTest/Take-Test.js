import React from "react";
import { useLocation } from "react-router";
import TestPage from "./Test-Page";


const TakeTest = () => {
   const location = useLocation();

   const test_key = location.search.substring(1, );
   
   return (
      <TestPage
         test_key={test_key}
         student_name={"student"}
      />
   );
}

export default TakeTest;