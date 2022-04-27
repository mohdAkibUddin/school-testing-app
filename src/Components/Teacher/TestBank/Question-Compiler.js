import React from "react";
import "../../all.css";
import axios from "axios";

class QuestionCompiler extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: new Map(),
      question_keys: props.question_keys,
      submission_warning: false,
      test_name: "",
    };
  }

  async postData(data) {
    data.testName = this.state.test_name;
    await axios
      .post("https://w81a61.deta.dev/test", data, {
        headers: {
          "content-type": "application/json",
        },
      })
      .then((response) => {
        console.log("we gucci, test saved :)");
        window.location.reload(false);
      });
  }

  handleSubmit = () => {
    let submission_warning = false;
    for (let question of this.props.question_keys) {
      console.log(question);
      if (!this.state.questions.has(question)) {
        submission_warning = true;
        this.setState({
          submission_warning: submission_warning,
        });
        break;
      }
    }
    if (!submission_warning) {
      let payload = {
        questionKeys: [],
      };
      for (let [key, points_array] of this.state.questions) {
        console.log(points_array, "bing");
        payload.questionKeys.push({
          questionKey: key,
          testcase_weight: points_array[0],
          function_name_weight: points_array[1],
          constraint_weight: points_array[2],
        });
      }
      this.postData(payload);
    }
  };

  handleChange = (event) => {
    let questions = new Map(this.state.questions);
    let point_values = [];
    const testcase_count = event.target.name.split(",")[1];
    const key = event.target.name.split(",")[2];
    const constraint = event.target.name.split(",")[3];

    if (constraint !== "") {
      point_values.push(
        (0.6 * parseFloat(event.target.value)) / parseFloat(testcase_count)
      );
      point_values.push(0.2 * parseFloat(event.target.value));
      point_values.push(0.2 * parseFloat(event.target.value));
      questions.set(key, point_values);

      if (event.target.value === "" || parseFloat(event.target.value) === 0) {
        questions.delete(key);
      }
      console.log(questions, "aa");
      this.setState({
        questions: questions,
      });
    } else {
      point_values.push(
        (0.8 * parseFloat(event.target.value)) / parseFloat(testcase_count)
      );
      point_values.push(0.2 * parseFloat(event.target.value));
      questions.set(key, point_values);
      point_values.push(0);

      if (event.target.value === "" || parseFloat(event.target.value) === 0) {
        questions.delete(key);
      }

      this.setState({
        questions: questions,
      });
    }
  };

  handleTestName = (event) => {
    this.setState({
      test_name: event.target.value,
    });
  };

  componentDidUpdate(prev_props) {
    if (prev_props.question_keys !== this.props.question_keys) {
      this.setState({
        question_keys: this.props.question_keys,
      });
    }
  }

  render() {
    let questionsToRender = [];
    let counter = 0;

    this.props.questions.forEach((question, i) => {
      if (this.state.question_keys.has(question.key)) {
        ++counter;
        let testcases = [];
        question.questionData.testcases.forEach((testcase, i) => {
          testcases.push(
            <p key={[testcase, "_", i]}>
              {question.questionData.function_name}({testcase.input})→
              {testcase.output};
            </p>
          );
        });

        let constraints = <h4>No Constraints</h4>;
        if (question.questionData.constraint !== "") {
          console.log(question.questionData);
          constraints = <h4>Constraint: {question.questionData.constraint}</h4>;
        }

        questionsToRender.push(
          <div key={question.key} className="question-compiler-element">
            <div className="line">
              <p>{counter}. </p>
              <h3>{question.questionData.function_name}</h3>
            </div>
            <p>{question.questionData.question}</p>
            <h4>Expected Values</h4>
            {testcases}
            <h4>Expected Types</h4>
            <p>
              {question.questionData.function_name}(
              {question.questionData.types_input.join(", ")})→
              {question.questionData.types_output.join(", ")};
            </p>
            {constraints}
            <div className="line">
              <p>Points: </p>
              <input
                type="number"
                placeholder="total"
                name={[
                  "total",
                  question.questionData.testcaseCount,
                  question.key,
                  question.questionData.constraint,
                ]}
                onChange={this.handleChange}
              />
            </div>
          </div>
        );
      }
    });

    return (
      <div id="test-questions" className="outline">
        <h3>Test Name:</h3>
        <input
          type="text"
          value={this.state.test_name}
          onChange={this.handleTestName}
        />
        <div style={{ height: "80vh" }} className="scrollable-container">
          {questionsToRender}
        </div>
        <div
          style={{ textAlign: "center" }}
          hidden={!this.state.submission_warning}
        >
          <h3>Non-Zero Values Expected !!!</h3>
        </div>
        <div className="wrapper">
          <input type="submit" onClick={this.handleSubmit} />
        </div>
      </div>
    );
  }
}

export default QuestionCompiler;
