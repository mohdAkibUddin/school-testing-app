import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Login/Login";
import QuestionCreation from "./Components/Teacher/QuestionBank/Question-Creation";
import TestCreation from "./Components/Teacher/TestBank/Test-Creation";
import Welcome from "./Components/Student/Welcome";
import UserState from "./Context/user/UserState";
import PrivateRoute from "./Components/PrivateRoute.js";

const App = () => {
   return (
      // <UserState>
      //    <Router>
      //       <Routes>
      //          <Route
      //             exact
      //             path="/welcome"
      //             element={
      //                <PrivateRoute component={Welcome} role={"student"} />
      //             }
      //          />
      //          <Route
      //             exact
      //             path="/question-bank"
      //             element={
      //                <PrivateRoute
      //                   component={QuestionCreation}
      //                   role={"teacher"}
      //                />
      //             }
      //          />
      //          <Route
      //             exact
      //             path="/test-creation"
      //             element={
      //                <PrivateRoute component={TestCreation} role={"teacher"} />
      //             }
      //          />
      //          <Route exact path="/" element={<Login />} />
      //       </Routes>
      //    </Router>
      // </UserState>
      <Router>
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
         </Routes>
      </Router>
   );
};
export default App;
