import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Login/Login";
import QuestionCreation from "./Components/Teacher/QuestionBank/Question-Creation";
import TestCreation from "./Components/Teacher/TestBank/Test-Creation";
import ViewTests from "./Components/Student/ViewTests/View-Tests";
import UserState from "./Context/user/UserState";
import PrivateRoute from "./Components/PrivateRoute.js";
import Navbar from "./Components/Navbar";
const App = () => {
  return (
    <UserState>
      <Router>
        <Navbar />
        <Routes>
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
        </Routes>
      </Router>
    </UserState>
  );
};
export default App;
