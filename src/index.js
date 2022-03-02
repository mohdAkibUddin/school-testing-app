import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

ReactDOM.render(
   <App/>,
   document.getElementById("add-question")
);

/* import React from "react";
import ReactDOM from "react-dom";
import "./question-bank.css";
import clone from "just-clone";
import axios from "axios";

function getQuestionBank() {
   const promise = axios.get("https://w81a61.deta.dev/question");
   const dataPromise = promise.then((response) => {
      return response.data[0];
   });
   return dataPromise;
}

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

class App extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         questions: [],
         displayedCategoryBoxes: new Map(),
      };
      this.initializeData();
   }

   async initializeData() {
      await axios.get("https://w81a61.deta.dev/question").then((response) => {
         const questions = response.data[0];
         console.log(questions, "balls");

         let displayedCategories = new Map();
         questions.forEach((question) => {
            question.questionData.categories.forEach((category) => {
               displayedCategories.set(category, false);
            });
         });

         this.setState({
            questions: questions,
            displayedCategoryBoxes: displayedCategories,
         });
      });
   }

   handleCallback = () => {
      this.initializeData();
   };

   render() {
      let questions = this.state.questions;
      return (
         <>
            <QuestionBoard
               displayedCategoryBoxes={this.state.displayedCategoryBoxes}
               questions={questions}
            />
            <AddQuestion
               parentCallback={this.handleCallback}
               questions={questions}
            />
         </>
      );
   }
}

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
         console.log('postrequest!', response);
      });
   }

   handleSubmit(event) {
      event.preventDefault();
      let data = clone(this.state);
      delete data.questions;
      data = {
         "questionData" : data
      }
      this.postData(data);
      this.props.parentCallback();
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
      console.log();
   }

   handleChange = (event) => {
      this.setState({
         [event.target.name]: event.target.value,
      });
   };

   handleChangeTypes(event) {
      const arr = event.target.value.split(" ");
      this.setState({
         [event.target.name]: arr,
      });
   }

   handleChangeCategories(event) {
      const arr = event.target.value.split(" ");
      this.setState({
         [event.target.name]: arr,
      });
   }

   handleChangeTestCase(event) {
      const arr = String(event.target.name).split(" ");
      let testcases = this.state.testcases.slice();
      testcases[parseInt(arr[0])][arr[1]] = event.target.value;
      this.setState({
         testcases: testcases,
      });
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
               <input type="submit" onClick={this.handleSubmit} />
            </form>
         </div>
      );
   }
}

class QuestionBoard extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         num: 10,
         searchString: "",
         displayedCheckBoxes: {
            categories: props.displayedCategoryBoxes,
            difficulties: new Map([
               ["easy", false],
               ["medium", false],
               ["hard", false],
            ]),
         },
         checkedCheckBoxes: {
            categories: new Set(),
            difficulties: new Set(),
         },
         filteringActive: {
            categories: false,
            difficulties: false,
         },
         match_all_categories: true,
         questions: props.questions,
      };

      this.handleSearch = this.handleSearch.bind(this);
      this.handleCheckbox = this.handleCheckbox.bind(this);
      this.handleMatchAll = this.handleMatchAll.bind(this);
   }

   componentDidUpdate(prevProps) {
      if (prevProps.displayedCategoryBoxes !== this.props.displayedCategoryBoxes) {
         let displayedCheckBoxes = clone(this.state.displayedCheckBoxes);
         displayedCheckBoxes.categories = this.props.displayedCategoryBoxes;
         this.setState({
            displayedCheckBoxes: displayedCheckBoxes,
         });
      }
      if (prevProps.questions !==  this.props.questions) {
         this.setState({
            questions: this.props.questions
         });
      }
   }

   renderQuestionCard(value) {
      console.log(value);
      if (
         String(value.function_name)
            .toLowerCase()
            .includes(this.state.searchString.toLowerCase())
      ) {
         return <QuestionCard value={value.function_name} />;
      }
   }

   handleSearch(event) {
      this.setState({
         [event.target.name]: event.target.value,
      });
   }

   handleChange(event) {
      this.setState({
         [event.target.name]: event.target.value,
      });
   }

   handleCheckbox(event) {
      let isFilteringActive = false;
      let displayedCheckBoxes = clone(this.state.displayedCheckBoxes);
      let checkedCheckBoxes = clone(this.state.checkedCheckBoxes);

      const categoryOrDifficulty = event.target.value;
      const name = event.target.name;

      displayedCheckBoxes[categoryOrDifficulty].set(
         name,
         !displayedCheckBoxes[categoryOrDifficulty].get(name)
      );

      console.log(displayedCheckBoxes[categoryOrDifficulty]);

      checkedCheckBoxes[categoryOrDifficulty] = new Set();
      for (let [key, value] of displayedCheckBoxes[categoryOrDifficulty]) {
         if (value) {
            isFilteringActive = true;
            checkedCheckBoxes[categoryOrDifficulty].add(key);
         }
      }

      let filteringActive = clone(this.state.filteringActive);
      filteringActive[categoryOrDifficulty] = isFilteringActive;

      this.setState({
         filteringActive: filteringActive,
         displayedCheckBoxes: displayedCheckBoxes,
         checkedCheckBoxes: checkedCheckBoxes,
      });
   }

   handleMatchAll(event) {
      this.setState({
         match_all_categories: !this.state.match_all_categories,
      });
   }

   render() {
      let categoryCheckboxes = [];
      for (let [category] of this.state.displayedCheckBoxes.categories) {
         categoryCheckboxes.push(
            <div key={category}>
               <label htmlFor={category}>
                  <input
                     type="checkbox"
                     name={category}
                     id={category}
                     value="categories"
                     onChange={this.handleCheckbox}
                  />
                  {category}
               </label>
            </div>
         );
      }

      let difficulties = ["easy", "medium", "hard"];
      let difficultyCheckBoxes = [];
      difficulties.forEach((difficulty) => {
         difficultyCheckBoxes.push(
            <div key={difficulty}>
               <label htmlFor={difficulty}>
                  <input
                     type="checkbox"
                     name={difficulty}
                     id={difficulty}
                     value="difficulties"
                     onChange={this.handleCheckbox}
                  />
                  {difficulty}
               </label>
            </div>
         );
      });

      let questionsToRender = this.state.questions;

      if (this.state.filteringActive.difficulties) {
         console.log("filtering.diff")
         questionsToRender = questionsToRender.filter(question => {
            return this.state.checkedCheckBoxes.difficulties.has(question.questionData.difficulty)
         });
      }
      if (this.state.filteringActive.categories) {
         if (this.state.match_all_categories) {
            questionsToRender = questionsToRender.filter(question => {
               let canAdd = true;
               this.state.checkedCheckBoxes.categories.forEach((checkedCategory) => {
                  if (!question.questionData.categories.includes(checkedCategory) &&!this.state.filteringActive.difficulties) {
                     canAdd = false;
                  }
               });
               return canAdd;
            });
         } else {
            questionsToRender = questionsToRender.filter(question => {
               let canAdd = false;
               question.questionData.categories.forEach(category => {
                  if (this.state.checkedCheckBoxes.categories.has(category)) canAdd = true;
               });
               return canAdd;
            });
         }
      }
      
      let questionCards = []
      questionsToRender.forEach(question => {
         questionCards.push(<span key={question.key}> {this.renderQuestionCard(question.questionData)} </span>);
      })

      console.log(this.state.match_all_categories);
      return (
         <div className="outline">
            <h1>Question Bank</h1>
            <input
               type="text"
               name="searchString"
               placeholder="search function name"
               value={this.state.searchString}
               onChange={this.handleSearch}
            />
            <div className="horizontal-aligned-container">
               <div>
                  <form>
                     <label htmlFor="match_all_categories">
                        <input
                           checked={this.state.match_all_categories}
                           type="checkbox"
                           name="match_all_categories"
                           id="match_all_categories"
                           value={this.state.match_all_categories}
                           onChange={this.handleMatchAll}
                        />
                        Match All
                     </label>
                     <p>Select Categories</p>
                     {categoryCheckboxes}
                  </form>
               </div>
               <div>
                  <br />
                  <p>Select Difficulty</p>
                  {difficultyCheckBoxes}
               </div>
            </div>
            {questionCards}
         </div>
      );
   }
}

ReactDOM.render(
   <App questions={getQuestionBank} />,
   document.getElementById("add-question")
); */