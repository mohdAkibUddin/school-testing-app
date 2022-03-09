import React from "react";
import GradesPage from "./Grades-Page";
import { useLocation } from "react-router";

const ViewGrades = () => {
   const location = useLocation();

   const test_key = location.search.substring(1, );
   
   return (
      <GradesPage
         test_key={test_key}
         student_name={"student"}
      />
   );
}

export default ViewGrades;
