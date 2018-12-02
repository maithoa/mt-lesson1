  import React from 'react';
  import PropTypes from 'prop-types';
  import { CSSTransitionGroup } from 'react-transition-group';

  import Question from '../components/Question';
  import QuestionCount from '../components/QuestionCount';
  import AnswerOption from '../components/AnswerOption';
  import AnswerInput from '../components/AnswerInput';
  import QuizResult from './QuizResult';
  import Countdown from 'react-countdown-now';


  function Quiz(props) {
  	function renderAnswerInput(){
 		return (
	      <AnswerInput
	      	result = {props.result}
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

	function showResultSection() {

			return (
		     	<QuizResult quizResult={props.result} 
	 						onNext = {props.onNext}
	 			/>
	    	);
	    
	    
	    }

	function showCountDown() {
		return (

		     	<Countdown
					date={Date.now() + 5000}
					onComplete={props.onTimeOut}
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
	       
			{(props.countdown === 'start')? showCountDown(): null}
 			
 			{(typeof props.answerOptions === "undefined") ? renderAnswerInput() : rendeAnwersChoices() }

	 		{(!(props.result === '') )? showResultSection(): null}
 			


	      </div>
	    </CSSTransitionGroup>

	  );
  }

  Quiz.propTypes = {
  	questionId: PropTypes.number.isRequired,
  	counter: PropTypes.number.isRequired,
  	questionTotal: PropTypes.number.isRequired,
  	question: PropTypes.string.isRequired,
    answerOptions: PropTypes.array.isRequired,
    userAnswer: PropTypes.string.isRequired,
    correctAnswer: PropTypes.string.isRequired,
    result:  PropTypes.string.isRequired,
    onAnswerSelected: PropTypes.func.isRequired,
    onAnswerInputted: PropTypes.func.isRequired,
    onInputChanged: PropTypes.func.isRequired,
    onNext : PropTypes.func.isRequired,
    onTimeOut: PropTypes.func.isRequired,
    countdown:PropTypes.string.isRequired

  };

  export default Quiz;