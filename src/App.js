import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Login/Login";
import QuestionCreation from "./Components/Teacher/QuestionCreation/Question-Creation";

const App = () => {
   return (
      <Router>
         <Routes>
            <Route path="/welcome" />
            <Route path="/question-bank" element={<QuestionCreation/>} />
            <Route path="/" element={<Login />} />
         </Routes>
      </Router>
   );
};
export default App;