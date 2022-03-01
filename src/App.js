import React, { useState } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route
  } from "react-router-dom";
import Login from "./Components/login";
import QuestionBoard from "./Components/Teacher/QuestionBoard";
const App = () => {
    return(
        <Router>
          <Routes>
          <Route path='/welcome' />
          <Route path='/question' element={<QuestionBoard/>} />
          <Route path='/' element={<Login/>} />
          </Routes>
      </Router>
    )
};
export default App;