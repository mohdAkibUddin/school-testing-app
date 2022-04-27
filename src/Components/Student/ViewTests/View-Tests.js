import axios from "axios";
import React from "react";
import "../../all.css";
import { Link } from "react-router-dom";

class ViewTests extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      graded_tests: new Set(),
      ungraded_tests: new Map() /* boolean ? takeable : untakeable */,
      test_names: new Map(),
    };
  }

  componentDidMount = () => {
    console.log(JSON.parse(localStorage.getItem("userData")).payload.username);
    this.initializeTests(
      JSON.parse(localStorage.getItem("userData")).payload.username
    );
  };

  initializeTests = async () => {
    let graded_tests = new Set();
    let ungraded_tests = new Map();
    let test_names = new Map();
    await axios.get("https://w81a61.deta.dev/test").then((response) => {
      const tests = response.data[0];
      for (let test of tests) {
        test.gradesReleased[0]
          ? graded_tests.add(test.key)
          : ungraded_tests.set(test.key, true);
        test_names.set(test.key, test.testName);
      }
    });
    this.setState({
      graded_tests: graded_tests,
      ungraded_tests: ungraded_tests,
      test_names: test_names,
    });
    this.initializeTakeableTests();
  };

  initializeTakeableTests = async () => {
    const student_name = JSON.parse(localStorage.getItem("userData")).payload
      .username;
    let ungraded_tests = new Map(this.state.ungraded_tests);
    await axios
      .get(`https://w81a61.deta.dev/users/${student_name}`)
      .then((response) => {
        const tests = response.data.tests;
        console.log(tests);
        for (let test_key in tests) {
          if (!this.state.graded_tests.has(test_key)) {
            ungraded_tests.set(test_key, false);
          }
        }
        this.setState({
          ungraded_tests: ungraded_tests,
        });
      });
  };

  render() {
    let reviewable_tests = [];
    let takeable_tests = [];
    let taken_ungraded_tests = [];

    this.state.graded_tests.forEach((test_key) => {
      reviewable_tests.push(
        <div className="tests" key={test_key}>
          <h3>Test Name:</h3>
          <Link
            to={{
              pathname: "/view-grades",
              search: test_key,
            }}
          >
            <input
              className="gradeTestsButton"
              value={this.state.test_names.get(test_key)}
              type="button"
              key={test_key}
            />
          </Link>
          <br />
          <br />
        </div>
      );
    });

    for (let [test_key, takeable] of this.state.ungraded_tests) {
      let element = (
        <div className="tests">
          <h3>Test Name:</h3>
          <Link
            to={{
              pathname: "/take-test",
              search: test_key,
            }}
          >
            <input
              className="gradeTestsButton"
              value={this.state.test_names.get(test_key)}
              type="button"
              key={test_key}
              disabled={!takeable}
            />
          </Link>
          <br />
          <br />
        </div>
      );
      takeable
        ? takeable_tests.push(element)
        : taken_ungraded_tests.push(element);
    }

    return (
      <div className="horizontal-aligned-container">
        <div className="outline-view-tests">
          <h3>Review Graded Exams</h3>
          {reviewable_tests}
        </div>
        <div className="outline-view-tests">
          <h3>Take Exams</h3>
          {takeable_tests}
        </div>
        <div className="outline-view-tests">
          <h3>Awaiting Grade</h3>
          {taken_ungraded_tests}
        </div>
      </div>
    );
  }
}

export default ViewTests;
