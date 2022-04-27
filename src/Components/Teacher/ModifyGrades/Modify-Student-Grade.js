import axios from "axios";
import clone from "just-clone";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";

const ModifyStudentGrades = () => {
  const location = useLocation();
  let params = [];
  location.search.split("&").forEach((e) => {
    params.push(e.split("=")[1]);
  });
  params = {
    test_key: params[0],
    student_name: params[1],
  };

  const [full_payload, setFullPayLoad] = useState({});
  const [data, setData] = useState({});
  const [comment, setComment] = useState([]);
  const [questions, setQuestions] = useState(new Map());
  const [student_responses, setStudentResponses] = useState({});
  const [initData, setInitData] = useState({});

  useEffect(() => {
    getGrades();
  }, []);

  const handleChange = (event) => {
    let data_clone = clone(data);
    const question_key = event.target.name.split(",")[0];
    const index = event.target.name.split(",")[1];
    data_clone[question_key].testcases[index].points_earned = parseFloat(
      event.target.value
    );
    setData(data_clone);
  };

  const handleChangeFunctionName = (event) => {
    let data_clone = clone(data);
    const question_key = event.target.name.split(",")[0];

    data_clone[question_key].function_name.points_earned = parseFloat(
      event.target.value
    );
    setData(data_clone);
  };

  const handleChangeConstraint = (event) => {
    let data_clone = clone(data);
    const question_key = event.target.name.split(",")[0];

    data_clone[question_key].constrains_score.points_earned = parseFloat(
      event.target.value
    );
    setData(data_clone);
  };

  const handleComment = (event) => {
    const index = parseInt(event.target.name);
    const comment_copy = comment.slice();
    comment_copy[index] = event.target.value;
    setComment(comment_copy);
  };

  /*  const getGrades = async () => {
      const student_name = params.student_name;
      await axios
         .get(`https://w81a61.deta.dev/users/${student_name}`)
         .then((response) => {
            const payload = response.data.grades[params.test_key];
            setData(payload);
            console.log(payload, "teh payload on get");
            setFullPayLoad(response.data.grades);
            setComment(response.data.grades[params.test_key].comment || "");
         });
   }; */

  const getGrades = async () => {
    const getQuestions = async () => {
      let questions_copy = new Map();
      await axios.get("https://w81a61.deta.dev/question").then((response) => {
        for (let d of response.data[0]) {
          questions_copy.set(d.key, d.questionData);
        }
        setQuestions(questions_copy);
      });
    };

    const student_name = params.student_name;
    const test_key = params.test_key;
    await axios
      .get(`https://w81a61.deta.dev/users/${student_name}`)
      .then((response) => {
        getQuestions();
        setInitData(response.data.grades[params.test_key]);
        setData(response.data.grades[params.test_key]);
        setFullPayLoad(response.data.grades);
        setStudentResponses(response.data.tests[test_key]);
        setComment(response.data.grades[params.test_key].comment || []);
      });
  };

  const updateGrades = async () => {
    const student_name = params.student_name;
    const test_key = params.test_key;
    const pl = {
      grades: full_payload,
    };
    pl.grades[test_key] = data;
    pl.grades[test_key].comment = comment;
    await axios
      .put(`https://w81a61.deta.dev/users/${student_name}`, pl, {
        headers: {
          "content-type": "application/json",
        },
      })
      .then((r) => {
        alert("updated");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  let total_points = 0;
  let points_counter = 0;

  for (let q in initData);

  let tables = [];
  let index = -1;
  for (let question_key in data) {
    if (question_key != "comment") {
      index++;
      const question_data = data[question_key];
      const init_data = initData[question_key];
      const expected_function_name = question_data.function_name.function_name;
      const student_function_name =
        question_data.function_name.student_function_name;
      const points_earned = question_data.function_name.points_earned;
      const points_total = question_data.function_name.points;
      total_points += parseFloat(points_total);
      points_counter += parseFloat(points_earned);

      if (undefined == init_data){
         console.log(question_data, "q");
         console.log(init_data, "i")
         console.log(initData, question_key)
      }

      let tablerows = [];
      const function_name_row = (
        <tr key={[question_key, expected_function_name]}>
          <td className="questionTablecolumn center">
            <strong>name:</strong> {expected_function_name}
          </td>
          <td className="center">{student_function_name}</td>
          <td className="center">
            <input
              name={[question_key, expected_function_name]}
              type="number"
              className="padding modifyScore"
              value={
                points_earned % 1 === 0
                  ? points_earned
                  : points_earned.toFixed(3)
              }
              onChange={handleChangeFunctionName}
            />
          </td>
          <td className="center">
          {Math.round((points_earned + Number.EPSILON) * 100) / 100}
          </td>
          <td className="center">
          {Math.round((points_total + Number.EPSILON) * 100) / 100}
          </td>
        </tr>
      );

      if (question_data.constraints_score.constraint) {
        const constraint = question_data.constraints_score.constraint;
        const points_earned = question_data.constraints_score.points_earned;
        const points_total = question_data.constraints_score.points;
        total_points += parseFloat(points_total);
        points_counter += parseFloat(points_earned);
        const constraint_row = (
          <tr key={[question_key, constraint]}>
            <td className="questionTablecolumn center">
              <strong>constraint:</strong> {constraint}
            </td>
            <td className="center">{points_earned != 0 ? "PASS" : "FAIL"}</td>
            <td className="center">
              <input
                className="padding modifyScore"
                name={[question_key, constraint]}
                type="number"
                value={Math.round((points_earned + Number.EPSILON) * 100) / 100}
                onChange={handleChangeFunctionName}
              />
            </td>
            <td className="center">
              {points_earned % 1 === 0
                ? points_earned
                : points_earned.toFixed(3)}
            </td>
            <td className="center">
            {Math.round((points_total + Number.EPSILON) * 100) / 100}
            </td>
          </tr>
        );
        tablerows.push(constraint_row);
      }

      tablerows.push(function_name_row);
      const question_text = questions.has(question_key)
        ? questions.get(question_key).question
        : "";

      let table = (
        <div class="questionResponse" key={question_key}>
          <br />
          <h3>Student Response:</h3>
          <p className="questionResponse">
            <strong>Question:</strong> {question_text}
          </p>
          <h4>Student Code:</h4>
          <pre className="outlineQuestion">
            {student_responses[question_key]}
          </pre>
          <table className="questionTable">
            <thead>
              <tr>
                <th className="questionTablecolumn ">EXPECTED</th>
                <th className="questionTablecolumn">RUN</th>
                <th className="questionTablecolumn">MODIFY</th>
                <th className="questionTablecolumn">AUTOGRADED</th>
                <th className="questionTablecolumn">MAX</th>
              </tr>
            </thead>
            <tbody>{tablerows}</tbody>
          </table>
          <h4>Add or Modify Comment:</h4>
          <textarea
            name={index}
            cols="20"
            rows="5"
            className="modifyComment"
            value={comment[index]}
            onChange={handleComment}
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

        const auto_score = init_data.testcases[i].points_earned;

        const testcase_row = (
          <tr key={[question_key, i]}>
            <td className="questionTablecolumn center">
              {expected_function_name}({input})→
              {expected_output}
            </td>
            <td className="center">{student_output}</td>
            <td className="center">
              <input
                name={[question_key, i]}
                className="padding modifyScore"
                type="number"
                value={Math.round((points_earned + Number.EPSILON) * 100) / 100}
                onChange={handleChange}
              />
            </td>
            <td className="center ">
              {Math.round((auto_score + Number.EPSILON) * 100) / 100}
            </td>
            <td className="center">
               {Math.round((points_total + Number.EPSILON) * 100) / 100}
            </td>
          </tr>
        );
        tablerows.push(testcase_row);
      }
    }
  }

  return (
    <div className="column">
      {tables}
      <h2>
        Total Score: {Math.round((points_counter + Number.EPSILON) * 100) / 100}/{total_points}
      </h2>
      <input
        className="gradeTestsButton margin"
        type="button"
        value="Update"
        onClick={updateGrades}
      />
    </div>
  );
};

export default ModifyStudentGrades;
