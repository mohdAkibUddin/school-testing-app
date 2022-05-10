import axios from "axios";
import React from "react";
import clone from "just-clone";
import { Link } from "react-router-dom";

class TestPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display_index: 0,
      questions: [],
      student_response: {},
    };
  }

  componentDidMount = () => {
    this.initializeTest(this.props.test_key);
  };

  async initializeTest(test_key) {
    await axios
      .get(`https://w81a61.deta.dev/test/${test_key}`)
      .then((test_data) => {
        test_data = test_data.data.testData;
        let questions = [];
        let student_response = {};
        test_data.forEach((data) => {
          const points =
            data.constraint_weight +
            data.function_name_weight +
            data.questionData.testcaseCount * data.testcase_weight;
          questions.push({
            question_data: data.questionData,
            question_key: data.key,
            points: points,
          });
          student_response[data.key] = "";
        });
        this.setState({
          questions: questions,
          student_response: student_response,
        });
      });
  }

  handleSubmit = async () => {
    const handleSubmitHelper = async (data) => {
      const student_name = this.props.student_name;
      data.tests[this.props.test_key] = this.state.student_response;
      console.log(data.testTaken);
      let tests_taken = [...data.testTaken, this.props.test_key];
      const payload = {
        testTaken: tests_taken,
        tests: data.tests,
      };

      await axios.put(
        `https://w81a61.deta.dev/users/${student_name}`,
        payload,
        {
          headers: {
            "content-type": "application/json",
          },
        }
      );
    };

    const student_name = this.props.student_name;
    await axios
      .get(`https://w81a61.deta.dev/users/${student_name}`)
      .then((response) => {
        handleSubmitHelper(response.data);
      });
  };

  handleChange = (event) => {
    // if (event.keyCode === 9) {
    // 	event.preventDefault();
    // 	event.target.value =
    // 		event.target.value.substring(0, event.target.selectionStart) +
    // 		"\t" +
    // 		event.target.value.substring(event.target.selectionStart);
    // 	event.target.selection += 1;
    // }
    let student_response = clone(this.state.student_response);
    student_response[event.target.name] = event.target.value;
    this.setState({
      student_response: student_response,
    });
    console.log(this.state.student_response);
  };

  handleMove = (event) => {
    if (event.target.value === "Next") {
      this.setState({
        display_index: this.state.display_index + 1,
      });
    } else {
      this.setState({
        display_index: this.state.display_index - 1,
      });
    }
  };

  handleLegendClick = (event) => {
    this.setState({
      display_index: parseInt(event.target.value.split(" ")[1]) - 1,
    });
  };

  render() {
    let legend = [];
    let renderable_questions = [];
    let counter = 0;

    this.state.questions.forEach((question, i) => {
      const btn_value = "Question " + (i + 1);
      const completed = this.state.student_response[question.question_key];
      legend.push(
        <div key={i}>
          <input
            type="button"
            value={btn_value}
            key={i}
            onClick={this.handleLegendClick}
            className={completed ? "answered" : "nonAnswered"}
          />
          <br />
        </div>
      );

      let points = question.points;
      let key = question.question_key;
      question = question.question_data;

      let testcases = [];
      question.testcases.forEach((testcase, i) => {
        testcases.push(
          <p key={[key, testcase, i]}>
            {question.function_name}({testcase.input})→
            {testcase.output};
          </p>
        );
      });

      renderable_questions.push(
        <div key={key} className="question-compiler-element">
          <div className="line">
            <h2>{++counter}. </h2>
            <h2>{question.function_name}</h2>
          </div>
          <p className="questionDetails">
            <strong>Description: </strong>
            {question.question}
          </p>
          <h3>Expected Values</h3>
          {testcases}
          <h3>Expected Types</h3>
          <p className="questionDetails">
            {question.function_name}({question.types_input.join(", ")})→
            {question.types_output.join(", ")};
          </p>
          <h3>Points: {points}</h3>
          <h3>
            Constraint:{" "}
            {question.constraint == "" ? "NONE" : question.constraint}
          </h3>
          <textarea
            name={key}
            rows="15"
            value={this.state.student_response[key]}
            onChange={this.handleChange}
          />
        </div>
      );
    });

    return (
      <>
        <div className="padded">
          <div className="question-compiler-element tests">{legend}</div>
        </div>
        <div className="padding">
          {renderable_questions[this.state.display_index]}
          <input
            className="gradeTestsButton margin"
            type="button"
            value="Previous"
            hidden={this.state.display_index == 0}
            onClick={this.handleMove}
          />
          <input
            className="gradeTestsButton margin"
            type="button"
            value="Next"
            hidden={this.state.display_index == renderable_questions.length - 1}
            onClick={this.handleMove}
          />
          <div className="wrapper">
            <Link to="/view-tests">
              <input
                className="gradeTestsButton"
                type="submit"
                onClick={this.handleSubmit}
                hidden={this.state.questions.length === 0}
              />
            </Link>
          </div>
        </div>
      </>
    );
  }
}

export default TestPage;
