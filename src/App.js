import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Login/Login";
import QuestionCreation from "./Components/Teacher/QuestionBank/Question-Creation";
import TestCreation from "./Components/Teacher/TestBank/Test-Creation";
import ViewTests from "./Components/Student/ViewTests/View-Tests";
import UserState from "./Context/user/UserState";
import PrivateRoute from "./Components/PrivateRoute.js";
import Navbar from "./Components/Navbar";
import TakeTest from "./Components/Student/TakeTest/Take-Test";
import GradeTests from "./Components/Teacher/GradeTests/Grade-Tests";
import ViewGrades from "./Components/Student/ViewGrades/View-Grades";

const App = () => {
  return (
    <UserState>
      <Router>
         <Navbar />
         <Routes>
            <Route
               exact
               path="/question-bank"
               element={<QuestionCreation />}
            />
            <Route
               exact
               path="/test-creation"
               element={<TestCreation />}
            />
            <Route
               exact
               path="/take-test"
               element={<TakeTest />}
            />
            <Route
               exact
               path="/view-tests"
               element={<ViewTests />}
            />
            <Route
               exact
               path="/grade-tests"
               element={<GradeTests />}
            />
            <Route
               exact
               path="/view-grades"
               element={<ViewGrades />}
            />
         </Routes>
        {/* <Navbar /> */}
        {/* <Routes>
          <Route
            exact
            path="/view-tests"
            element={<PrivateRoute component={ViewTests} role={"student"} />}
          />
          <Route
            exact
            path="/question-bank"
            element={
              <PrivateRoute component={QuestionCreation} role={"teacher"} />
            }
          />
          <Route
            exact
            path="/test-creation"
            element={<PrivateRoute component={TestCreation} role={"teacher"} />}
          />
          <Route exact path="/" element={<Login />} />
        </Routes> */}
      </Router>
    </UserState>
  );
};
export default App;
