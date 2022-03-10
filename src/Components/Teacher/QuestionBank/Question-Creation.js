import axios from "axios";
import AddQuestion from "./Add-Question";
import QuestionBoard from  "./Question-Board";
import React from "react";

class QuestionCreation extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         questions: [],
         displayedCategoryBoxes: new Map(),
      };
   }

   componentDidMount = () => {
      this.initializeData();
   }

   initializeData = async () => {
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

   handleCallback = () => {
      this.initializeData();
   };

   render() {

      return (
         <div className="parent-container">
            <AddQuestion
               parentCallback={this.handleCallback}
               questions={this.state.questions}
            />
            <QuestionBoard
               // button_text={"View"}
               displayedCategoryBoxes={this.state.displayedCategoryBoxes}
               questions={this.state.questions}
            />
            
         </div>
      );
   }
}

export default QuestionCreation;
