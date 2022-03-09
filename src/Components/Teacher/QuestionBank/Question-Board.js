import React from "react";
import "../../all.css";
import clone from "just-clone";
import QuestionCard from "./Question-Card";

class QuestionBoard extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
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

   componentDidUpdate = (prevProps) => {
      if (
         prevProps.displayedCategoryBoxes !== this.props.displayedCategoryBoxes
      ) {
         let displayedCheckBoxes = clone(this.state.displayedCheckBoxes);
         displayedCheckBoxes.categories = this.props.displayedCategoryBoxes;
         this.setState({
            displayedCheckBoxes: displayedCheckBoxes,
         });
      }
      if (prevProps.questions !== this.props.questions) {
         this.setState({
            questions: this.props.questions,
         });
      }
   }

   actionButtonCallback = question_key => {
      this.props.actionButtonCallback(question_key)
   }

   renderQuestionCard = (value) => {
      if (String(value.questionData.function_name).toLowerCase().includes(this.state.searchString.toLowerCase())) {
         return (
            <QuestionCard
               question_key={value.key}
               button_text={this.props.button_text}
               actionButtonCallback={this.actionButtonCallback}
               function_name={value.questionData.function_name}
               question={value.questionData.question}
            />
         );
      }
   }

   handleSearch = (event) => {
      this.setState({
         [event.target.name]: event.target.value,
      });
   }

   handleChange = (event) => {
      this.setState({
         [event.target.name]: event.target.value,
      });
   }

   handleCheckbox = (event) => {
      let isFilteringActive = false;
      let displayedCheckBoxes = clone(this.state.displayedCheckBoxes);
      let checkedCheckBoxes = clone(this.state.checkedCheckBoxes);

      const categoryOrDifficulty = event.target.value;
      const name = event.target.name;

      displayedCheckBoxes[categoryOrDifficulty].set(
         name,
         !displayedCheckBoxes[categoryOrDifficulty].get(name)
      );

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

   handleMatchAll = () => {
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
         questionsToRender = questionsToRender.filter((question) => {
            return this.state.checkedCheckBoxes.difficulties.has(
               question.questionData.difficulty
            );
         });
      }
      if (this.state.filteringActive.categories) {
         if (this.state.match_all_categories) {
            questionsToRender = questionsToRender.filter((question) => {
               let canAdd = true;
               this.state.checkedCheckBoxes.categories.forEach(
                  (checkedCategory) => {
                     if (
                        !question.questionData.categories.includes(
                           checkedCategory
                        ) &&
                        !this.state.filteringActive.difficulties
                     ) {
                        canAdd = false;
                     }
                  }
               );
               return canAdd;
            });
         } else {
            questionsToRender = questionsToRender.filter((question) => {
               let canAdd = false;
               question.questionData.categories.forEach((category) => {
                  if (this.state.checkedCheckBoxes.categories.has(category))
                     canAdd = true;
               });
               return canAdd;
            });
         }
      }

      let questionCards = [];
      questionsToRender.forEach((question) => {
         questionCards.push(
            <span key={question.key}>
               {" "}
               {this.renderQuestionCard(question)}{" "}
            </span>
         );
      });



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
            <div className="scrollable-container">{questionCards}</div>
         </div>
      );
   }
}

export default QuestionBoard;
