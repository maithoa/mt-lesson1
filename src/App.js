import React, { Component } from 'react';
import logo from './svg/logo.svg';

import Question from './components/Question';
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

       counter: 0,
       questionId: 1,
       question: '',
       answerOptions: [],
       userAnswer: '',
       correctAnswer:'',
       answersTotalPoints:0,
       result: '',

       data: null,
      isLoading: false,
      error: null
    };
    this.handleAnswerSelected = this.handleAnswerSelected.bind(this);
    this.handleAnswerInputted = this.handleAnswerInputted.bind(this);
    this.handleInputChanged = this.handleInputChanged.bind(this);
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
    this.setState({
      quizQuestions: shuffledQuestions
    });

    //shuffle choices of each questions
    const shuffledAnswerOptions = this.state.quizQuestions.map((question) => this.shuffleArray(question.choices));  
    console.log("after shuffled choices: "+this.state.quizQuestions);

    //initialize for the first quiz
    this.setState({
      questionId: shuffledQuestions[0].id,
      question: shuffledQuestions[0].question,
      answerOptions: shuffledQuestions[0].choices,
      correctAnswer: shuffledQuestions[0].answer
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
    
    this.setState({userAnswer: event.target.value});
    

  }

  handleAnswerInputted(event) {
    event.preventDefault();

    this.fetchUserAnswer();

    this.moveForward();

  }

  handleAnswerSelected(event) {
    var selectedElem = event.currentTarget;
    this.state.userAnswer = selectedElem.value;

    this.fetchUserAnswer();

    this.moveForward();
    
  }

  fetchUserAnswer(){
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
         this.checkUserAnswer(d.answer)
      }, () => {
        this.setState({
          requestFailed: true
        })
      });
     
    
  }

  checkUserAnswer(correctValue)  {

    if (correctValue.toUpperCase().trim() === this.state.userAnswer.toUpperCase().trim()) {
      //do something
      this.state.answersTotalPoints +=1;
      //display result here
      return true;
    } else{
      //do something
      //display result here
      return false;
    }
  }

  moveForward(){

    if (this.state.counter < this.state.quizQuestions.length-1) {
        setTimeout(() => this.setNextQuestion(), 500);
    } else {
        setTimeout(() => this.setResults(this.getResults()), 500);
    }
  }
   
  setNextQuestion() {
    const counter = this.state.counter + 1;

    
    this.setState({
      counter: counter,
      questionId: this.state.quizQuestions[counter].id,
      question: this.state.quizQuestions[counter].question,
      answerOptions: this.state.quizQuestions[counter].choices,
      correctAnswer: this.state.quizQuestions[counter].answer,
      userAnswer: ''

    });
  }

  getResults() {

    return this.state.answersTotalPoints.toString();

  }

  setResults (result) {
    
      this.setState({ result: result});
   
  }

  renderQuiz() {
    console.log("questions:" + this.state.quizQuestions);
    return (
      <Quiz
        counter = {this.state.counter}
        userAnswer={this.state.userAnswer}
        answerOptions={this.state.answerOptions}
        questionId={this.state.questionId}
        question={this.state.question}
        correctAnswer={this.state.correctAnswer}
        questionTotal={this.state.quizQuestions.length}
        onAnswerSelected={this.handleAnswerSelected}
        onAnswerInputted={this.handleAnswerInputted}
        onInputChanged={this.handleInputChanged}
      />

    );
  }

  renderResult() {
    return (
      <Result quizResult={this.state.result} />
    );
  }

  rederResult(id){

  }

  render() {
      if (this.state.requestFailed) return <p>Failed!</p>
      if (!this.state.quizQuestions) return <p>Loading...</p>
        
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>React Quiz</h2>

        </div>
        {this.state.result ? this.renderResult() : this.renderQuiz()}

       
      </div>



    );
  }
}

export default App;
