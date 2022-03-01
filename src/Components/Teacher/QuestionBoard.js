import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./question-bank.css";
import AddQuestion from "./AddQuestion";
import QuestionCard from "./QuestionCard";

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
        <div>
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
            <AddQuestion/>
            <QuestionCard/>
         </div>
      );
   }
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
export default QuestionBoard;