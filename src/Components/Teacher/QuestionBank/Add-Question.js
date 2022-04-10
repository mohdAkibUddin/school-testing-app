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
         testcases: props.testcases || [{ input: "", output: "" }, { input: "", output: "" }],
         testcaseCount: props.testcaseCount || 2,
         difficulty: props.difficulty || "",
         categories: props.categories || [],
         constraint: props.constraint || "",

         checkbox_disabled: {
            difficulty: null,
            constraint: null,
         }
      };

      this.handleChange = this.handleChange.bind(this);
      this.handleChangeTestCase = this.handleChangeTestCase.bind(this);
      this.handleChangeTypes = this.handleChangeTypes.bind(this);
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

      delete data.checkbox_disabled;
      delete data.questions;
      data = {
         "questionData" : data
      }
      console.log(data.questionData);
      this.postData(data);
      this.setState({
         questions: [],

         question: "",
         function_name: "",
         types_input: [""],
         types_output: [""],
         testcases: [{ input: "", output: "" }, { input: "", output: "" }],
         testcaseCount: 2,
         difficulty: "",
         categories: [],
         constraint: "",

         checkbox_disabled: {
            difficulty: null,
            constraint: null,
         }
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

   handleCheckbox = event => {
      if (event.target.value === "constraint" || event.target.value === "difficulty") {
         let checkbox_disabled = clone(this.state.checkbox_disabled);
         if (checkbox_disabled[event.target.value] === event.target.name) {
            checkbox_disabled[event.target.value] = null;
         } else {
            checkbox_disabled[event.target.value] = event.target.name;
         }
         this.setState({
            checkbox_disabled: checkbox_disabled,
            [event.target.value]: checkbox_disabled[event.target.value]
         });
      } else {
         let categories = new Set(this.state.categories);
         if (categories.has(event.target.name)) {
            categories.delete(event.target.name);
         } else {
            categories.add(event.target.name);
         }
         categories = Array.from(categories);
         console.log(categories);

         this.setState({
            categories: categories
         });
      }      
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

      let difficulties = ["easy", "medium", "hard"];
      let difficultyCheckBoxes = [];
      difficulties.forEach((difficulty) => {
         difficultyCheckBoxes.push(
            <div key={"difficulty" + difficulty}>
               <label htmlFor={difficulty}>
                  <input
                     checked={this.state.difficulty === difficulty}
                     type="checkbox"
                     name={difficulty}
                     id={"difficulty" + difficulty}
                     value="difficulty"
                     onChange={this.handleCheckbox}
                     disabled={this.state.checkbox_disabled["difficulty"] !== null && this.state.checkbox_disabled["difficulty"] !== difficulty}
                  />
                  {difficulty}
               </label>
            </div>
         );
      });

      let categories = ["iteration", "arithmetic", "string", "recursion", "maps", "conditionals"];
      let categoryCheckboxes = [];
      categories.forEach((category) => {
         categoryCheckboxes.push(
            <div key={"category" + category}>
               <label htmlFor={category}>
                  <input
                     checked={this.state.categories.includes(category)}
                     type="checkbox"
                     name={category}
                     id={"category" + category}
                     value="category"
                     onChange={this.handleCheckbox}
                  />
                  {category}
               </label>
            </div>
         );
      });

      let constraints = ["for", "while", "hard"];
      let constraintCheckBoxes = [];
      constraints.forEach((constraint) => {
         constraintCheckBoxes.push(
            <div key={"constraint" + constraint}>
               <label htmlFor={constraint}>
                  <input
                     checked={this.state.constraint === constraint}
                     type="checkbox"
                     name={constraint}
                     id={"constraint" + constraint}
                     value="constraint"
                     onChange={this.handleCheckbox}
                     disabled={this.state.checkbox_disabled["constraint"] !== null && this.state.checkbox_disabled["constraint"] !== constraint}
                  />
                  {constraint}
               </label>
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
                  <input type="button" value="Add Case" onClick={this.addBox} hidden={this.state.testcaseCount === 5}/>
                  <br />
                  <p>Difficulty</p>
                  {difficultyCheckBoxes}
                  <p>Categories</p>
                  {categoryCheckboxes}
                  <p>Constraint</p>
                  {constraintCheckBoxes}
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
