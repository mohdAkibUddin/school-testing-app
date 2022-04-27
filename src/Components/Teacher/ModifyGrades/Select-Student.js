import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";

class SelectStudent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      students: [],
    };
  }

  componentDidMount = () => {
    this.getStudents();
  };

  getStudents = async () => {
    await axios.get(`https://w81a61.deta.dev/users`).then((response) => {
      let students = [];
      response.data[0].forEach((element) => {
        if (element.role === "student") {
          students.push(element.key);
        }
      });
      this.setState({
        students: students,
      });
    });
  };

  render() {
    let student_buttons = [];
    const test_key = this.props.test_key;
    console.log(test_key);
    this.state.students.forEach((student) => {
      student_buttons.push(
        <div className="tests" key={student}>
          <h2> Student Name: </h2>
          <Link
            to={{
              pathname: "/modify-student-grades",
              search: `test_key=${test_key}&student_name=${student}`,
            }}
          >
            <input className="gradeTestsButton" type="button" value={student} />
          </Link>
        </div>
      );
    });
    console.log(this.state.students, this.props.test_key);
    return (
      <div className="padding column">
        <h1>Students</h1>
        <div className="students">{student_buttons}</div>
      </div>
    );
  }
}

export default SelectStudent;
