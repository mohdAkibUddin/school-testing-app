import axios from "axios";
import clone from "just-clone";
import React from "react";
import "../../all.css";

class AddQuestion extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         questions: props.questions,

         question: props.question || "",
         function_name: props.function_name || "",
         types_input: props.types_input || [""],
         types_output: props.types_output || [""],
         testcases: props.testcases || [{ input: "", output: "" }],
         testcaseCount: props.testcaseCount || 1,
         difficulty: props.difficulty || "",
         categories: props.categories || [""],
      };

      this.handleChange = this.handleChange.bind(this);
      this.handleChangeTestCase = this.handleChangeTestCase.bind(this);
      this.handleChangeTypes = this.handleChangeTypes.bind(this);
      this.handleChangeCategories = this.handleChangeCategories.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.addBox = this.addBox.bind(this);
   }

   async postData(data) {
      await axios.post("https://w81a61.deta.dev/question", data, {
         headers: {
            "content-type": "application/json"
         }
      }).then(response => {
         this.props.parentCallback();
      });
   }

   handleSubmit = (event) => {
      event.preventDefault();
      let data = clone(this.state);
      delete data.questions;
      data = {
         "questionData" : data
      }
      this.postData(data);
      this.setState({
         questions: [],

         question: "",
         function_name: "",
         types_input: [""],
         types_output: [""],
         testcases: [{ input: "", output: "" }],
         testcaseCount: 1,
         difficulty: "",
         categories: [""],
      });
   }

   handleChange = (event) => {
      this.setState({
         [event.target.name]: event.target.value,
      });
   };

   handleChangeTypes = (event) => {
      const arr = event.target.value.split(" ");
      this.setState({
         [event.target.name]: arr,
      });
   }

   handleChangeCategories = (event) => {
      const arr = event.target.value.split(" ");
      this.setState({
         [event.target.name]: arr,
      });
   }

   handleChangeTestCase = (event) => {
      const arr = String(event.target.name).split(" ");
      let testcases = this.state.testcases.slice();
      testcases[parseInt(arr[0])][arr[1]] = event.target.value;
      this.setState({
         testcases: testcases,
      });
   }

   addBox = (event) => {
      let testcases = this.state.testcases.slice();
      testcases.push({
         input: "",
         output: "",
      });
      this.setState({
         testcases: testcases,
         testcaseCount: this.state.testcaseCount + 1,
      });
   }

   render() {
      let testcaseBoxes = [];
      this.state.testcases.forEach((testcase, i) => {
         testcaseBoxes.push(
            <div key={i}>
               <input
                  name={i + " input"}
                  type="text"
                  value={testcase.input}
                  placeholder="input"
                  onChange={this.handleChangeTestCase}
               />
               <input
                  name={i + " output"}
                  type="text"
                  value={testcase.output}
                  placeholder="output"
                  onChange={this.handleChangeTestCase}
               />
            </div>
         );
      });

      return (
         <div className="outline">
            <h1>Add Question</h1>
            <form onSubmit={this.handleSubmit}>
               <label>
                  <p>Question:</p>
                  <textarea
                     name="question"
                     cols="30"
                     rows="10"
                     value={this.state.question}
                     onChange={this.handleChange}
                  />
                  <p>Function Name:</p>
                  <input
                     type="text"
                     name="function_name"
                     value={this.state.function_name}
                     placeholder="func"
                     onChange={this.handleChange}
                  />
                  <p>Input Type(s) (Space Seperated)</p>
                  <input
                     type="text"
                     name="types_input"
                     value={this.state.types_input.join(" ")}
                     placeholder="List[int] int"
                     onChange={this.handleChangeTypes}
                  />
                  <p>Output Type(s) (Space Seperated)</p>
                  <input
                     type="text"
                     name="types_output"
                     value={this.state.types_output.join(" ")}
                     placeholder="int"
                     onChange={this.handleChangeTypes}
                  />
                  <p>Testcase(s) Space Seperated</p>
                  {testcaseBoxes}
                  <input type="button" value="Add Case" onClick={this.addBox} />
                  <br />
                  <p>Difficulty</p>
                  <input
                     type="text"
                     name="difficulty"
                     value={this.state.difficulty}
                     placeholder="medium"
                     onChange={this.handleChange}
                  />
                  <p>Categories Space Seperated</p>
                  <input
                     type="text"
                     name="categories"
                     value={this.state.categories.join(" ")}
                     placeholder="recursion, memoization"
                     onChange={this.handleChangeCategories}
                  />
               </label>
               <br />
               <br />
               <input type="submit"/>
            </form>
         </div>
      );
   }
}

export default AddQuestion;
