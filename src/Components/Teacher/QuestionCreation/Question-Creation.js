import axios from "axios";
import AddQuestion from "./Child-Components/Add-Question";
import QuestionBoard from  "./Child-Components/Question-Board/Question-Board";
import React from "react";

class QuestionCreation extends React.Component {
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

export default QuestionCreation;
