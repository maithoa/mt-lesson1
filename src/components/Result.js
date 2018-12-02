  import React from 'react';
  import PropTypes from 'prop-types';
  import { CSSTransitionGroup } from 'react-transition-group';

  function Result(props) {
    return (
      <CSSTransitionGroup
        className="container results"
        component="div"
        transitionName="fade"
        transitionEnterTimeout={800}
        transitionLeaveTimeout={500}
        transitionAppear
        transitionAppearTimeout={500}
      >
        <div>
          You completed the quiz, Congrats! 
          You got <strong>{props.quizResult}</strong> correct answers!
        </div>
        <form onSubmit={props.restartQuiz}>
              <input type="submit" value="Restart Quiz" />
            </form>
      </CSSTransitionGroup>
    );
  }

  Result.propTypes = {
    quizResult: PropTypes.string.isRequired,
    restartQuiz: PropTypes.function.isRequired,
  };

  export default Result;