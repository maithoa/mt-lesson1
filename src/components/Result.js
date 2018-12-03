  import React from 'react';
  import PropTypes from 'prop-types';
  import { CSSTransitionGroup } from 'react-transition-group';

  function Result(props) {
    return (
      <CSSTransitionGroup
        className="results"
        component="div"
        transitionName="fade"
        transitionEnterTimeout={800}
        transitionLeaveTimeout={500}
        transitionAppear
        transitionAppearTimeout={500}
      >
        <div>
          <p>
          You completed the quiz, Congrats! 
          </p>
          <p>
          You got <span><strong>{props.quizResult}</strong></span> correct answers!
          </p>
        </div>
        <div>
        <form onSubmit={props.restartQuiz}>
          <input type="submit" value="Restart Quiz" />
        </form>
        </div>
      </CSSTransitionGroup>
    );
  }

  Result.propTypes = {
    quizResult: PropTypes.string.isRequired,
    restartQuiz: PropTypes.function.isRequired,
  };

  export default Result;