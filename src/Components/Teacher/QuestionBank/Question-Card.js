import axios from "axios";
import React from "react";
import "../../all.css";

class QuestionCard extends React.Component {
  constructor(props) {
    super(props);
  }

  handleClick = () => {
    this.props.actionButtonCallback(this.props.question_key);
  };

  handleDelete = async () => {
    const question_key = this.props.question_key;
    axios.delete(`https://w81a61.deta.dev/question/${question_key}`);
  };

  render() {
    const p_tag = { margin: "1em" };
    return (
      <>
        <h3>Question Details: </h3>
        <div className="question-card">
          {console.log(this.props.isButtonActive)}
          {this.props.isButtonActive ? (
            <div>
              <input
                className="questionButton"
                type="button"
                value={this.props.button_text}
                onClick={this.handleClick}
              />
            </div>
          ) : (
            <></>
          )}

          <div>Name: {this.props.function_name}</div>
          <div>
            <input
              className="questionButton"
              type="button"
              value="Delete"
              onClick={this.handleDelete}
            />
          </div>
        </div>

        <p style={p_tag}> Description: {this.props.question}</p>
      </>
    );
  }
}

export default QuestionCard;
