import axios from "axios";
import React from "react";
import "../../all.css";

class GradeTests extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         tests: new Map() /* boolean ? graded : not_graded */,
      };
   }

   componentDidMount = () => {
      this.initializeTests(this.props.student_name || "student");
   };

   initializeTests = async () => {
      let tests = new Map();
      await axios.get("https://w81a61.deta.dev/test").then((response) => {
         const test_keys = response.data[0];
         for (let test of test_keys) {
            tests.set(test.key, test.gradesReleased);
         }
      });
      this.setState({
         tests: tests,
      });
   };

   handleClick = async (test_key) => {
      if (test_key) {
         const payload = {
            gradesReleased: true,
         };
         await axios.put(`https://w81a61.deta.dev/test/${test_key}`, payload, {
            headers: {
               "content-type": "application/json",
            },
         });
      }
   };

   render() {
      let graded_tests = [];
      let ungraded_tests = [];

      for (let [test_key, graded] of this.state.tests) {
         let element = (
            <input
               key={test_key}
               type="submit"
               value={test_key}
               onClick={() => {this.handleClick(test_key)}}
            />
         );
         graded ? graded_tests.push(element) : ungraded_tests.push(element);
      }

      

      return (
         <div className="horizontal-aligned-container">
            <div className="outline">
               <h3>Click On An Exam to Initiate Grading</h3>
               {ungraded_tests}
            </div>
            <div className="outline">{graded_tests}</div>
         </div>
      );
   }
}

export default GradeTests;
