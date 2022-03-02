import React from "react";
import "../../../question-bank.css";

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

export default QuestionCard
