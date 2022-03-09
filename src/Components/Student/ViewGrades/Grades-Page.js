import React from "react";
import "../../all.css";

class GradesPage extends React.Component {
   constructor(props) {
      super(props);
      this.data = {
         the_LITERAL_test_key: {
            the_LITERAL_question_key: {
               function_name: {
                  function_name: "the name of the function",
                  student_function_name: "the name the student submitted",
                  points_earned: 0,
                  points: 5,
               },
               testcases: [
                  {
                     student_output:
                        "the output that the students code generated",
                     expected_output: "the output you compared against",
                     points_earned: "number of points they got",
                     points: "how much the testcase was worth",
                     input: "input",
                  },
                  {
                     student_output:
                        "the output that the students code generated",
                     expected_output: "the output you compared against",
                     points_earned: "number of points they got",
                     points: "how much the testcase was worth",
                     input: "input",
                  },
               ],
            },
            the_LITERAL_question_key2: {
               function_name: {
                  function_name: "the name of the function",
                  student_function_name: "the name the student submitted",
                  points_earned: 5,
                  points: 5,
               },
               testcases: [
                  {
                     student_output:
                        "the output that the students code generated",
                     expected_output: "the output you compared against",
                     points_earned: "number of points they got",
                     points: "how much the testcase was worth",
                     input: "input",
                  },
                  {
                     student_output:
                        "the output that the students code generated",
                     expected_output: "the output you compared against",
                     points_earned: "number of points they got",
                     points: "how much the testcase was worth",
                     input: "input",
                  },
               ],
            },
         },
      };
      this.state = {
         data: this.data,
      };
   }

   render() {
      let tables = [];
      const data = this.state.data.the_LITERAL_test_key;
      for (let question_key in data) {
         const question_data = data[question_key];
         const expected_function_name = question_data.function_name.function_name;
         const student_function_name = question_data.function_name.student_function_name;
         const points_earned = question_data.function_name.points_earned;
         const points_total = question_data.function_name.points;

         
         let tablerows = [];
         const function_name_row = (<tr key={[question_key, expected_function_name]}>
            <td>{expected_function_name}</td>
            <td>{student_function_name}</td>
            <td>{points_earned}/{points_total}</td>
         </tr>);
         tablerows.push(function_name_row);

         let table = (
            <>
               <br />
               <table key={question_key}>
                  <thead>
                  <tr>
                     <th>EXPECTED</th>
                     <th>RUN</th>
                     <th>POINTS</th>
                  </tr>
                  </thead>
                  <tbody>
                     {tablerows}
                  </tbody>
               </table>
               <br />
            </>
            
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

            const testcase_row = (
               <tr key={[question_key, i]}>
                  <td>
                     {expected_function_name}(
                     {input})→
                     {expected_output}
                  </td>
                  <td>{student_output}</td>
                  <td>{points_earned}/{points_total}</td>
               </tr>
            );
            tablerows.push(testcase_row);
         }

      }
      return <>
         {tables}
      </>;
   }
}

export default GradesPage;
