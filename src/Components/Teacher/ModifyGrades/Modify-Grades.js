import axios from "axios";
import React from "react";
import { useLocation } from "react-router";
import SelectStudent from "./Select-Student";

const ModifyGrades = () => {
   const location = useLocation();

   const test_key = location.search.substring(1, );
   console.log(test_key)
   
   const releaseGrade = async () => {
      const pl = {
         "gradesReleased" : [true, true]
      }
      await axios.put(`https://w81a61.deta.dev/test/${test_key}`,pl,{
         headers: {
            "content-type": "application/json",
         },
      }).then(r => {
         alert("published");
      });
   }

   return (
      <div>
         <SelectStudent
            test_key={test_key}
         />
         <input type="button" value="PUBLISH GRADES" onClick={releaseGrade}/>
      </div>
      
   );
}

export default ModifyGrades;
