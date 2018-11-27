  import React from 'react';
  import PropTypes from 'prop-types';

  function AnswerInput(props) {
    return (
      <div className="answerInput">
        <form onSubmit={props.onAnswerInputted}>
          <input placeholder = 'Input your answer here' type='text' name='userAnswer' onChange = {props.onInputChanged}  />
          <input type="submit" value="Submit answer" />
        </form>
      </div>  
    );
  }

  AnswerInput.propTypes = {
    userAnswer: PropTypes.string.isRequired,
    onAnswerInputted: PropTypes.func.isRequired,
    onInputChanged: PropTypes.func.isRequired,
    questionId: PropTypes.number.isRequired
  };

  export default AnswerInput;