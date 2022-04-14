import React from "react";
import "../../all.css";
import axios from "axios";
import clone from "just-clone";

class GradesPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      student_responses: {},
      comment: "",
      questions: new Map(),
    };
  }

  componentDidMount = () => {
    this.getGrades();
  };

  getGrades = async () => {
    const getQuestions = async () => {
      let questions = new Map();
      await axios.get("https://w81a61.deta.dev/question").then((response) => {
        for (let d of response.data[0]) {
          questions.set(d.key, d.questionData);
        }
        this.setState({
          questions: questions,
        });
      });
    };

    const student_name = this.props.student_name;
    await axios
      .get(`https://w81a61.deta.dev/users/${student_name}`)
      .then((response) => {
        getQuestions();
        const data = response.data.grades[this.props.test_key];
        const student_responses = response.data.tests[this.props.test_key];
        this.setState({
          data: data,
          student_responses: student_responses,
          comment: data.comment || "",
        });
      });
  };

  render() {
    let total_points = 0;
    let points_counter = 0;
    let tables = [];
    const data = this.state.data;
    let index = -1;
    for (let question_key in data) {
      if (question_key != "comment") {
        index++;
        const question_data = data[question_key];
        const expected_function_name =
          question_data.function_name.function_name;
        const student_function_name =
          question_data.function_name.student_function_name;
        const points_earned = question_data.function_name.points_earned;
        const points_total = question_data.function_name.points;
        total_points += parseFloat(points_total);
        points_counter += parseFloat(points_earned);

        let tablerows = [];
        const function_name_row = (
          <tr key={[question_key, expected_function_name]}>
            <td>
              <strong>name:</strong> {expected_function_name}
            </td>
            <td>{student_function_name}</td>
            <td>{points_earned}</td>
            <td>{points_total}</td>
          </tr>
        );
        tablerows.push(function_name_row);

        if (question_data.constraints_score.constraint) {
          const constraint = question_data.constraints_score.constraint;
          const points_earned = question_data.constraints_score.points_earned;
          const points_total = question_data.constraints_score.points;
          const constraint_row = (
            <tr key={[question_key, constraint]}>
              <td>
                <strong>constraint:</strong> {constraint}
              </td>
              <td>{points_earned != 0 ? "PASS" : "FAIL"}</td>
              <td>{points_earned}</td>
              <td>{points_total}</td>
            </tr>
          );
          tablerows.push(constraint_row);
        }

        const question_text = this.state.questions.has(question_key)
          ? this.state.questions.get(question_key).question
          : "";
        let table = (
          <div key={question_key}>
            <br />
            <h4>Student Response:</h4>
            <p>Question: {question_text}</p>
            <pre>{this.state.student_responses[question_key]}</pre>
            <table>
              <thead>
                <tr>
                  <th>EXPECTED</th>
                  <th>STUDENT RUN OUTPUT</th>
                  <th>EARNED</th>
                  <th>MAX POINTS AVAILABLE</th>
                </tr>
              </thead>
              <tbody>{tablerows}</tbody>
            </table>
            <textarea
              readOnly
              value={this.state.comment[index]}
              id=""
              cols="30"
              rows="10"
            ></textarea>
            <br />
          </div>
        );
        tables.push(table);

        const testcases = question_data.testcases;
        for (let i in testcases) {
          const testcase = testcases[i];
          const expected_output = testcase.expected_output;
          const student_output = testcase.student_output;
          const input = testcase.input;
          const points_total = testcase.points;
          const points_earned = testcase.points_earned;
          total_points += parseFloat(points_total);
          points_counter += parseFloat(points_earned);

          const testcase_row = (
            <tr key={[question_key, i]}>
              <td>
                {expected_function_name}({input})→
                {expected_output}
              </td>
              <td>{student_output}</td>
              <td>{points_earned}</td>
              <td>{points_total}</td>
            </tr>
          );
          tablerows.push(testcase_row);
        }
      }
    }

    return (
      <div className="padded">
        {tables}
        <h2>
          Total Points Earned: {points_counter}/{total_points}
        </h2>
      </div>
    );
  }
}

export default GradesPage;
