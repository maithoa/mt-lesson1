import React, { Component } from 'react';
import logo from './svg/logo.svg';

import Quiz from './components/Quiz';
import Result from './components/Result';



const API_URL = 'https://futu-quiz-api.now.sh';
const QUERY_DEFAULT = "/questions";
const QUERY_ANSWER = "/answer/";

class App extends Component {
   constructor(props) {
    super(props);

    this.state = {
      requestFailed: false,
      quizQuestions: null,

      counter: 1,
      questionId: 1,
      question: '',
      answerOptions: [],
      userAnswer: '',
      correctAnswer:'',
      answersTotalPoints:0,
      result: '',

      finalResult:''
    };
    this.handleAnswerSelected = this.handleAnswerSelected.bind(this);
    this.handleAnswerInputted = this.handleAnswerInputted.bind(this);
    this.handleInputChanged = this.handleInputChanged.bind(this);
    this.moveForward= this.moveForward.bind(this);
    this.restartQuiz = this.restartQuiz.bind(this);
    this.handleTimeOut = this.handleTimeOut.bind(this);

  }

  componentDidMount() {
    fetch(API_URL+QUERY_DEFAULT)
     .then(response => {
        if (!response.ok) {
          throw Error("Network request failed")
        }

        return response
      })
      .then(d => d.json())
      .then(d => {
        this.initializeQuiz(d)
      }, () => {
        this.setState({
          requestFailed: true
        })
      });
     
    }
      
 
  componentWillMount() {
    
  }

  initializeQuiz (data){
    //shuffle questions
    const shuffledQuestions = this.shuffleArray(data);

    //shuffle choices of each questions
    shuffledQuestions.map((question) => this.shuffleArray(question.choices));  

    //initialize for the first quiz
    this.setState({
      counter: 1,
      quizQuestions: shuffledQuestions,

      questionId: shuffledQuestions[0].id,
      question: shuffledQuestions[0].question,
      answerOptions: shuffledQuestions[0].choices,


      userAnswer: '',
      correctAnswer:'',
      answersTotalPoints:0,
      result: '',

      finalResult:'',

      countdown:'start'
    });

  }


  shuffleArray(array) {
    console.log("array in:" + array);
    if (array) {
      var currentIndex = array.length, temporaryValue, randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }
    }
    
    console.log("array out:" + array);
    return array;
  };

  
  
  handleInputChanged(event) {
    //won't update value until form submitted
    //this.setState({userAnswer: event.target.value});
    
  }

  handleAnswerInputted(event) {

    event.preventDefault();
    this.stopCountDown();

        
    var currentElem = event.target;

    var userInput = currentElem.elements["userAnswer"].value;


    var allInputItems = currentElem.getElementsByTagName("input");
    for(var i = 0 ; i < allInputItems.length; i++)
      allInputItems[i].disabled = true;

    this.setState({userAnswer: userInput});
    this.fetchCurrentAnswer();

  }

  stopCountDown(){
    this.setState ({countdown:'stop'})
  }

  handleAnswerSelected(event) {
    var userAnswer = event.currentTarget.value;
    this.setState({userAnswer: event.currentTarget.value});

    this.stopCountDown();

    //event.currentTarget.parentNode.disabled = true;

    this.fetchCurrentAnswer();


  }

  fetchCurrentAnswer(){
    //fetch data base on current id
    var url = API_URL+QUERY_ANSWER+this.state.questionId.toString();
    fetch(url)
     .then(response => {
        if (!response.ok) {
          throw Error("Network request failed")
        }

        return response
      })
      .then(d => d.json())
      .then(d => {
         this.setUserAnswer(d.answer)
      }, () => {
        this.setState({
          requestFailed: true
        })
      });
     
    
  }

  setUserAnswer(correctValue)  {

    if (correctValue.toUpperCase().trim() === this.state.userAnswer.toUpperCase().trim()) {
      var increasedPoint = this.state.answersTotalPoints + 1;
      //do something
      this.setState({
        answersTotalPoints: increasedPoint,
        correctAnswer:correctValue, 
        result: 'Correct!'
      });


    } else{
      this.setState({
        correctAnswer: correctValue,
        result: 'Try again next time!'  
      });

    }
  }

  

  moveForward(event){
    event.preventDefault();
    this.setForward();
    
  }

  handleTimeOut(event){
    this.setForward();
  }

  setForward(){
    if (this.state.counter < this.state.quizQuestions.length) {
        setTimeout(() => this.setNextQuestion(), 500);
    } else {
        setTimeout(() => this.setResults(this.getResults()), 500);
    }
  }


   
  setNextQuestion() {
    const counter = this.state.counter + 1;   
    console.log(counter) ;
    this.setState({
      counter: counter,
      questionId: this.state.quizQuestions[counter - 1].id,
      question: this.state.quizQuestions[counter - 1].question,
      answerOptions: this.state.quizQuestions[counter -1].choices,
      correctAnswer: null,
      userAnswer: '',
      result: '',
      countdown: 'start'
    });
  }

  getResults() {

    return this.state.answersTotalPoints.toString();

  }

  setResults (result) {
    
      this.setState({ finalResult: result});
   
  }
 
  renderQuiz() {
    return (
      <Quiz
        counter = {this.state.counter}
        userAnswer = {this.state.userAnswer}
        answerOptions = {this.state.answerOptions}
        questionId = {this.state.questionId}
        question = {this.state.question}
        correctAnswer = {this.state.correctAnswer}
        questionTotal = {this.state.quizQuestions.length}
        result = {this.state.result}
        onAnswerSelected = {this.handleAnswerSelected}
        onAnswerInputted = {this.handleAnswerInputted}
        onInputChanged = {this.handleInputChanged}
        onNext = {this.moveForward}
        onTimeOut = {this.handleTimeOut}
        countdown = {this.state.countdown}

      />  

    );
  }

  renderResult() {
    return (
      <Result quizResult={this.state.finalResult} 
              restartQuiz={this.restartQuiz} />
    );
  }

  restartQuiz(event){
    event.preventDefault();
    this.initializeQuiz(this.state.quizQuestions);

  }

  render() {
    if (this.state.requestFailed) return <p>Failed to load questions!</p>;
    if (!this.state.quizQuestions) return <p>Loading...</p>;
        
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>React Quiz</h2>
        </div>
        {this.state.finalResult ? this.renderResult() : this.renderQuiz()}
       
      </div>
    );
  }
}

export default App;
