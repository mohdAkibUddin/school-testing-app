import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Login/Login";
import QuestionCreation from "./Components/Teacher/QuestionCreation/Question-Creation";
import Welcome from "./Components/Student/Welcome";
import UserState from "./Context/user/UserState";
import PrivateRoute from "./Components/PrivateRoute.js";
const App = () => {
  return (
    <UserState>
      <Router>
        <Routes>
          <Route
            exact
            path="/welcome"
            element={<PrivateRoute component={Welcome} role={"student"} />}
          />
          <Route
            exact
            path="/question-bank"
            element={
              <PrivateRoute component={QuestionCreation} role={"teacher"} />
            }
          />
          <Route exact path="/" element={<Login />} />
        </Routes>
      </Router>
    </UserState>
  );
};
export default App;
