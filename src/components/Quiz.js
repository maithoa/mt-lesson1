  import React from 'react';
  import PropTypes from 'prop-types';
  import { CSSTransitionGroup } from 'react-transition-group';

  import Question from '../components/Question';
  import QuestionCount from '../components/QuestionCount';
  import AnswerOption from '../components/AnswerOption';
  import AnswerInput from '../components/AnswerInput';


  function Quiz(props) {
  	function renderAnswerInput(){
		return (
	      <AnswerInput
	     	questionId={props.questionId}
	        userAnswer={props.userAnswer}
	        onAnswerInputted={props.onAnswerInputted}
	        onInputChanged={props.onInputChanged}
	      />
	    );


  	}
  	function rendeAnwersChoices(){
  		return(
  			 <ul className="answerOptions">
	          {props.answerOptions.map(renderAnswerOption)}
	       	 </ul>
  		);

  	}

  	function renderAnswerOption(key) {
	    return (
	      <AnswerOption
	        key={key}
	        answerContent={key}
	        userAnswer={props.userAnswer}
	        correctAnswer = {props.correctAnswer}
	        questionId={props.questionId}
	        onAnswerSelected={props.onAnswerSelected}
	      />
	    );
	  }

    return (
	    <CSSTransitionGroup
	      className="container"
	      component="div"
	      transitionName="fade"
	      transitionEnterTimeout={800}
	      transitionLeaveTimeout={500}
	      transitionAppear
	      transitionAppearTimeout={500}
	    >
	      <div key={props.questionId}>
	        <QuestionCount
	          counter={props.counter}
	          total={props.questionTotal}
	        />
	        <Question content={props.question} />
	        
 			{(typeof props.answerOptions === "undefined") ? renderAnswerInput() : rendeAnwersChoices() }

	      </div>
	    </CSSTransitionGroup>

	  );
  }

  Quiz.propTypes = {
    userAnswer: PropTypes.string.isRequired,
    answerOptions: PropTypes.array.isRequired,
    correctAnswer: PropTypes.string.isRequired,
    counter: PropTypes.number.isRequired,
    question: PropTypes.string.isRequired,
    questionId: PropTypes.number.isRequired,
    questionTotal: PropTypes.number.isRequired,
    onAnswerSelected: PropTypes.func.isRequired,
    onAnswerInputted: PropTypes.func.isRequired,
    onInputChanged: PropTypes.func.isRequired

  };

  export default Quiz;