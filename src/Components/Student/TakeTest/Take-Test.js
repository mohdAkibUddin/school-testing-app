import React from "react";
import TestPage from "./Test-Page";

class TakeTest extends React.Component {
   constructor(props) {
      super(props);
   }

   render() {
      return (
         <TestPage
            test_key={"am7eglanaqk5"}
            student_name={"student"}
            student_password={""}
         />
      );
   }
}

export default TakeTest;
