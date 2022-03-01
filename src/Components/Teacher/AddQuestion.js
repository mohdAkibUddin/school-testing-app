import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./question-bank.css";

class AddQuestion extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         question: props.question || "",
         function_name: props.function_name || "",
         types_input: props.types_input || [""],
         types_output: props.types_output || [""],
         testcases: props.testcases || [{ input: "", output: "" }],
         testcaseCount: props.testcaseCount || 1,
         difficulty: props.difficulty || "",
         categories: props.categories || "",
      };
      this.handleChange = this.handleChange.bind(this);
      this.handleChangeTestCase = this.handleChangeTestCase.bind(this);
      this.handleChangeTypes = this.handleChangeTypes.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.addBox = this.addBox.bind(this);
   }

   handleSubmit(event) {
      event.preventDefault();
      postToQuestionBank(this.state);
   }

   handleChange(event) {
      this.setState({
         [event.target.name]: event.target.value,
      });
      console.log(this.state[event.target.name]);
   }

   handleChangeTypes(event) {
      const arr = event.target.value.split(" ");
      this.setState({
         [event.target.name]: arr,
      });
      console.log(this.state[event.target.name]);
   }

   handleChangeTestCase(event) {
      const arr = String(event.target.name).split(" ");
      let testcases = this.state.testcases.slice();
      testcases[parseInt(arr[0])][arr[1]] = event.target.value;
      this.setState({
         testcases: testcases,
      });
      console.log(this.state.testcases);
   }

   addBox(event) {
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
      let extraTestcaseBoxes = [];

      for (let i = 1; i < this.state.testcaseCount; i++) {
         extraTestcaseBoxes.push(
            <div key={i}>
               <input
                  name={i + " input"}
                  type="text"
                  value={this.state.testcases[i].input}
                  placeholder="input"
                  onChange={this.handleChangeTestCase}
               />
               <input
                  name={i + " output"}
                  type="text"
                  value={this.state.testcases[i].output}
                  placeholder="output"
                  onChange={this.handleChangeTestCase}
               />
            </div>
         );
      }

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
                  <div>
                     <input
                        name={"0 input"}
                        type="text"
                        value={this.state.testcases[0].input}
                        placeholder="input"
                        onChange={this.handleChangeTestCase}
                     />
                     <input
                        name={"0 output"}
                        type="text"
                        value={this.state.testcases[0].output}
                        placeholder="output"
                        onChange={this.handleChangeTestCase}
                     />
                  </div>
                  {extraTestcaseBoxes}
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
                  <p>Categoeies</p>
                  <input
                     type="text"
                     name="categories"
                     value={this.state.categories}
                     placeholder="recursion, memoization"
                     onChange={this.handleChange}
                  />
               </label>
               <br />
               <br />
               <input type="submit" onClick={this.handleSubmit} />
            </form>
         </div>
      );
   }
}

function postToQuestionBank(data) {
   console.log(data);
}



export default AddQuestion;