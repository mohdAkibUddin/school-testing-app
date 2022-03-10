import React from "react";
import "../../all.css";
import axios from "axios";

class GradesPage extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         data: {}
      };
   }

   componentDidMount = () => {
      this.getGrades();
   }

   getGrades = async () => {
      const student_name = this.props.student_name;
      await axios.get(`https://w81a61.deta.dev/users/${student_name}`).then(response => {
         const data = response.data.grades[this.props.test_key];
         this.setState({
            data: data
         });
      });
   }

   render() {
      let tables = [];
      const data = this.state.data;
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
      return <div className="padded">
         {tables}
      </div>;
   }
}

export default GradesPage;
