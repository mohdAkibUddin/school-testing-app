import axios from "axios";
import QuestionBoard from "../QuestionBank/Question-Board";
import React from "react";
import "../../all.css";
import QuestionCompiler from "./Question-Compiler";

class TestCreation extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         question_keys: new Set(),
         questions: [],
         displayedCategoryBoxes: new Map() /* This is the responsiblity of QuestionBank itself, refactor later*/,
      };
      this.initializeData();
   }

   async initializeData() {
      await axios.get("https://w81a61.deta.dev/question").then((response) => {
         const questions = response.data[0];

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

   actionButtonCallback = (key) => {
      let question_keys = new Set(this.state.question_keys);
      question_keys.add(key);
      this.setState({
         question_keys: question_keys,
      });
   };

   render() {
      let questions = this.state.questions;
      return (
         <div className="parent-container">
            <QuestionCompiler
               question_keys={this.state.question_keys}
               questions={this.state.questions}
            />
            <QuestionBoard
               button_text={"Add"}
               actionButtonCallback={this.actionButtonCallback}
               displayedCategoryBoxes={this.state.displayedCategoryBoxes}
               questions={questions}
            />
         </div>
      );
   }
}

export default TestCreation;
