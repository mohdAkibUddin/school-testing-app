import axios from "axios";
import React from "react";
import "../../all.css";
import { Link } from "react-router-dom";

class GradeTests extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tests: new Map() /* boolean ? graded : not_graded */,
      test_names: new Map(),
    };
  }

  componentDidMount = () => {
    this.initializeTests(this.props.student_name || "student");
  };

  initializeTests = async () => {
    let tests = new Map();
    const test_names = new Map();
    await axios.get("https://w81a61.deta.dev/test").then((response) => {
      const test_keys = response.data[0];
      console.log(test_keys);
      for (let test of test_keys) {
        tests.set(test.key, test.gradesReleased[1]);
        test_names.set(test.key, test.testName);
      }
    });
    this.setState({
      tests: tests,
      test_names: test_names,
    });
  };

  handleClick = async (test_key) => {
    if (test_key) {
      const payload = {
        gradesReleased: [false, true],
      };
      await axios
        .put(`https://w81a61.deta.dev/test/${test_key}`, payload, {
          headers: {
            "content-type": "application/json",
          },
        })
        .then((r) => {
          this.autoGrade(test_key);
        });
    }
  };

  autoGrade = async (test_key) => {
    await axios
      .post(`https://w81a61.deta.dev/autograder/${test_key}`)
      .then((r) => {
        this.initializeTests();
      });
  };

  render() {
    let graded_tests = [];
    let ungraded_tests = [];

    for (let [test_key, auto_graded] of this.state.tests) {
      console.log(test_key);
      let element;
      if (!auto_graded) {
        element = (
          <div className="tests" key={test_key}>
            <h3> Test Name: </h3>
            <input
              className="gradeTestsButton"
              type="submit"
              value={this.state.test_names.get(test_key)}
              onClick={() => {
                this.handleClick(test_key);
              }}
            />
            <br />
            <br />
          </div>
        );
      } else {
        element = (
          <div className="tests" key={test_key}>
            <h3> Test Name: </h3>
            <Link
              to={{
                pathname: "/modify-grades",
                search: test_key,
              }}
            >
              <input
                className="questionButton"
                type="submit"
                value={this.state.test_names.get(test_key)}
              />
            </Link>

            <br />
            <br />
          </div>
        );
      }

      auto_graded ? graded_tests.push(element) : ungraded_tests.push(element);
    }

    return (
      <div className="horizontal-aligned-container">
        <div className="outline">
          <h3 className="testTitle">Click On An Exam to Initiate Grading</h3>
          {ungraded_tests}
        </div>
        <div className="outline">
          <h3 className="testTitle">
            Click On An Exam to Modify Autograded Results
          </h3>
          {graded_tests}
        </div>
      </div>
    );
  }
}

export default GradeTests;
