  import React from 'react';
  import PropTypes from 'prop-types';

  function AnswerOption(props) {
    return (
      <li className="answerOption">
        <input
          type="radio"
          className="radioCustomButton"
          name="radioGroup"
          id={props.answerContent}
          value={props.answerContent}
          disabled={props.userAnswer}
          onChange={props.onAnswerSelected}
        />
        <label className="radioCustomLabel" htmlFor={props.answerContent}>
          {props.answerContent}
        </label>
      </li>
    );
  }

  AnswerOption.propTypes = {
    answerContent: PropTypes.string.isRequired,
    userAnswer: PropTypes.string.isRequired,
    onAnswerSelected: PropTypes.func.isRequired,
    questionId: PropTypes.number.isRequired
  };

  export default AnswerOption;