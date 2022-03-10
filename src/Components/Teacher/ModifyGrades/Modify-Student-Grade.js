import axios from "axios";
import clone from "just-clone";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";

const ModifyStudentGrades = () => {
   const location = useLocation();
   location.search = location.search.substring(1);
   let params = [];
   location.search.split("&").forEach((e) => {
      params.push(e.split("=")[1]);
   });
   params = {
      test_key: params[0],
      student_name: params[1],
   };

   const [full_payload, setFullPayLoad] = useState({});
   const [data, setData] = useState({});

   useEffect(() => {
      getGrades();
   }, []);

   const handleChange = (event) => {
      let data_clone = clone(data);
      const question_key = event.target.name.split(',')[0];
      const index = event.target.name.split(',')[1];
      data_clone[question_key].testcases[index].points_earned = parseFloat(event.target.value);
      setData(data_clone);
   }

   const getGrades = async () => {
      const student_name = params.student_name;
      await axios
         .get(`https://w81a61.deta.dev/users/${student_name}`)
         .then((response) => {
            const payload = response.data.grades[params.test_key];
            setData(payload);
            setFullPayLoad(response.data.grades);
         });
   };

   const updateGrades = async () => {
      full_payload[params.test_key] = data;
      const pl = {
         "grades": full_payload
      }
      const student_name = params.student_name;
      await axios.put(
         `https://w81a61.deta.dev/users/${student_name}`,
         pl,
         {
            headers: {
               "content-type": "application/json",
            },
         }
      ).then(r => {
         alert("updated");
      });
   }

   let total_points = 0;
   let points_counter = 0;

   let tables = [];
   for (let question_key in data) {
      const question_data = data[question_key];
      const expected_function_name = question_data.function_name.function_name;
      const student_function_name =
         question_data.function_name.student_function_name;
      const points_earned = question_data.function_name.points_earned;
      const points_total = question_data.function_name.points;
      total_points += parseFloat(points_total);
      points_counter += parseFloat(points_earned);
      
      let tablerows = [];
      const function_name_row = (
         <tr key={[question_key, expected_function_name]}>
            <td>{expected_function_name}</td>
            <td>{student_function_name}</td>
            <td>
               {points_earned}/{points_total}
            </td>
         </tr>
      );
      tablerows.push(function_name_row);

      let table = (
         <div key={question_key}>
            <br />
            <table>
               <thead>
                  <tr>
                     <th>EXPECTED</th>
                     <th>RUN</th>
                     <th>POINTS</th>
                  </tr>
               </thead>
               <tbody>{tablerows}</tbody>
            </table>
            <br />
         </div>
      );
      tables.push(table);

      const testcases = question_data.testcases;
      for (let i in testcases) {
         const testcase = testcases[i];
         const expected_output = testcase.expected_output;
         const student_output = testcase.student_output;
         const input = testcase.input;
         const points_total = testcase.points;
         const points_earned = testcase.points_earned;
         total_points += parseFloat(points_total);
         points_counter += parseFloat(points_earned);

         const testcase_row = (
            <tr key={[question_key, i]}>
               <td>
                  {expected_function_name}({input})→
                  {expected_output}
               </td>
               <td>{student_output}</td>
               <td>
                  <input name={[question_key, i]} type="number" value={points_earned} onChange={handleChange}/>
                  /{points_total}
               </td>
            </tr>
         );
         tablerows.push(testcase_row);
      }
   }

  
   return (
      <div className="padded">
         {tables}
         <h2>{points_counter}/{total_points}</h2>
         <input type="button" value="Update" onClick={updateGrades}/>
      </div>
   );
};

export default ModifyStudentGrades;
