import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./question-bank.css";

function QuestionCard(props) {
   return (
      <div className="question-card">
         <div>
            <button>view</button>
         </div>
         <div>{props.value}</div>
         <div>
            <button>delete</button>
         </div>
      </div>
   );
}

class QuestionBoard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			searchString: ""
		}
      this.handleChange = this.handleChange.bind(this);
	}

   renderQuestionCard(value) {
		if (String(value).toLowerCase().includes(this.state.searchString.toLowerCase())) {
			return <QuestionCard value={value} />;
		}
   }

	handleChange(event) {
		this.setState({
			[event.target.name]: event.target.value
		});
	}

   render() {
      let questionCards = [];
      const questions = fetchFromQuestionBank();
      for (let q in questions) {
         console.log();
         questionCards.push(
            <span key={q}>
               {this.renderQuestionCard(questions[q][0].function_name)}
            </span>
         );
      }
      return (
         <div className="outline">
            <h1>Question Bank</h1>
            <input
               type="text"
               name="searchString"
               placeholder="search function name"
               value={this.state.searchString}
               onChange={this.handleChange}
            />
            {questionCards}
         </div>
      );
   }
}

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

ReactDOM.render(<QuestionBoard />, document.getElementById("question-bank"));

ReactDOM.render(<AddQuestion />, document.getElementById("add-question"));

function postToQuestionBank(data) {
   console.log(data);
}

function fetchFromQuestionBank() {
   const questions = {
      q1: [
         { function_name: "twoSum" },
         { question: "lorem ipsum" },
         {
            testcases: [{ input1: "output1" }, { input2: "output2" }],
         },
         { difficulty: "easy" },
         {
            categories: ["maps", "iteration"],
         },
      ],
      q2: [{ function_name: "travelingSalesman" }],
      q3: [{ function_name: "addUpChange" }],
      q4: [{ function_name: "climbingStairs" }],
   };

   return questions;
}
