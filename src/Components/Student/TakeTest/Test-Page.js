import axios from "axios";
import React from "react";
import clone from "just-clone";

class TestPage extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         questions: [],
         student_response: {},
      };
   }

   componentDidMount = () => {
      this.initializeTest(this.props.test_key);
   }

   async initializeTest(test_key) {
      await axios.get(`https://w81a61.deta.dev/test/${test_key}`).then((test_data) => {
         test_data = test_data.data.testData;
         let questions = [];
         let student_response = {};
         test_data.forEach((data) => {
            const points =
               data.function_name_weight +
               data.questionData.testcaseCount * data.testcase_weight;
            questions.push({
               question_data: data.questionData,
               question_key: data.key,
               points: points,
            });
            student_response[data.key] = "";
         });
         this.setState({
            questions: questions,
            student_response: student_response
         });
      });
   }

   handleSubmit = async () => {
      const handleSubmitHelper = async (data) => {
         const student_name = this.props.student_name;
         data.tests[this.props.test_key] = this.state.student_response;
         const payload = {
            "tests" : data.tests
         };
   
         await axios.put(`https://w81a61.deta.dev/users/${student_name}`, payload, {
            headers: {
               "content-type": "application/json"
            }
         });
      }

      const student_name = this.props.student_name;
      await axios.get(`https://w81a61.deta.dev/users/${student_name}`).then(response => {
         handleSubmitHelper(response.data);
      });
   }

  

   handleChange = (event) => {
      let student_response = clone(this.state.student_response);
      student_response[event.target.name] = event.target.value;
      this.setState({
         student_response: student_response
      });
   }

   render() {
      let questionsToRender = [];
      let counter = 0;

      this.state.questions.forEach((question, i) => {
         let points = question.points;
         let key = question.question_key
         question = question.question_data;

         let testcases = [];
         question.testcases.forEach((testcase, i) => {
            testcases.push(
               <p key={[key, testcase, i]}>
                  {question.function_name}({testcase.input})→
                  {testcase.output};
               </p>
            );
         });

         questionsToRender.push(
            <div key={key} className="question-compiler-element">
               <div className="line">
                  <p>{++counter}. </p>
                  <h3>{question.function_name}</h3>
               </div>
               <p>{question.question}</p>
               <h4>Expected Values</h4>
               {testcases}
               <h4>Expected Types</h4>
               <p>
                  {question.function_name}({question.types_input.join(", ")})→
                  {question.types_output.join(", ")};
               </p>
               <div className="line">
                  <p>Points: {points}</p>
                  <br />
                  <textarea 
                     name={key}
                     cols="90"
                     rows="15"
                     value={this.state.student_response.key}
                     onChange={this.handleChange}
                  />
               </div>
            </div>
         );
      });

      return (
         <div className="padded">
            {questionsToRender}
            <div className="wrapper">
               <input type="submit" onClick={this.handleSubmit} hidden={this.state.questions.length === 0}/>
            </div>
         </div>
      );
   }
}

export default TestPage;
