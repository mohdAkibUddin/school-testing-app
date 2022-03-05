import React from "react";
import "../../all.css";

class QuestionCard extends React.Component {
   constructor(props) {
      super(props);
   }

   handleClick = () => {
      this.props.actionButtonCallback(this.props.question_key)
   }

   render() {
      const p_tag = {margin: "1em"};
      return (
         <>
            <div className="question-card">
               <div>
                  <input type="button" value={this.props.button_text} onClick={this.handleClick}/>
               </div>
               <div>{this.props.function_name}</div>
               <div>
                  <button>delete</button>
               </div>
            </div>
            <p style={p_tag}>{this.props.question}</p>
         </>
      );
   }
}

export default QuestionCard;
