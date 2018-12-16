import React from "react";
import PropTypes from "prop-types";

function QuizResult(props) {
  return (
    <div className="result">
      <p>
        <span>{props.quizResult}</span>
      </p>
      <form onSubmit={props.onNext}>
        <input type="submit" value="Next question" />
      </form>
    </div>
  );
}

QuizResult.propTypes = {
  quizResult: PropTypes.string.isRequired,
  onNext: PropTypes.function.isRequired
};

export default QuizResult;
