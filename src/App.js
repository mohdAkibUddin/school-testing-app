import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Login/Login";
import QuestionCreation from "./Components/Teacher/QuestionBank/Question-Creation";
import TestCreation from "./Components/Teacher/TestBank/TestCreation";

const App = () => {
   return (
      <Router>
         <Routes>
            <Route path="/welcome" />
            <Route path="/question-bank" element={<QuestionCreation />} />
            <Route path="/test-creation" element={<TestCreation />} />
            <Route path="/" element={<Login />} />
         </Routes>
      </Router>
   );
};
export default App;
