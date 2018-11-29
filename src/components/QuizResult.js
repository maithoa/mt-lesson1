  import React from 'react';
  import PropTypes from 'prop-types';

  function QuizResult(props) {
      return (

          <div  className="container result">
            <strong>{props.quizResult}</strong>

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