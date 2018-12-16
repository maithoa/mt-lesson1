import React, { Component } from "react";
import { Link, Route, Switch } from "react-router-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";

import Quiz from "./components/Quiz";
import Result from "./components/Result";

library.add(faSpinner);

//api_url can be configured in environment vars as well
const API_URL = "https://quiz-api-v2.herokuapp.com";
const QUERY_DEFAULT = "/api/quiz";
const QUERY_ANSWER = "/api/quiz/answer/";
const URI_CHECK_TOKEN = "/api/auth/me";
const URI_UPDATE_SCORE = "/api/user/updatescore/";

class QuizApp extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };
  constructor(props) {
    super(props);
    const { cookies } = props;
    this.state = {
      requestFailed: false,
      quizQuestions: null,
      counter: 1,
      questionId: 1,
      question: "",
      answerOptions: [],
      userAnswer: "",
      correctAnswer: "",
      answersTotalPoints: 0,
      result: "",
      finalResult: "",

      token: cookies.get("quizapitoken"),
      userId: "",
      userName: "",
      userEmail: "",
      myLatestScore: 0
    };

    this.handleAnswerSelected = this.handleAnswerSelected.bind(this);
    this.handleAnswerInputted = this.handleAnswerInputted.bind(this);
    this.handleInputChanged = this.handleInputChanged.bind(this);
    this.moveForward = this.moveForward.bind(this);
    this.restartQuiz = this.restartQuiz.bind(this);
    this.handleTimeOut = this.handleTimeOut.bind(this);
    this.handleSubmitScores = this.handleSubmitScores.bind(this);
  }

  componentDidMount() {
    this.fetchQuestions();
  }

  componentWillMount() {
    this.fetchMe();
  }

  fetchMe() {
    var authToken = this.state.token;
    var myHeaders = new Headers({
      "Content-type": "application/json",
      "x-access-token": authToken
    });

    var fetchOptions = {
      headers: myHeaders
    };

    var url = API_URL + URI_CHECK_TOKEN;

    fetch(url, fetchOptions)
      .then(response => {
        if (!response.ok) {
          throw Error("Network request failed");
        }
        return response;
      })
      .then(d => d.json())
      .then(
        d => {
          //token is still valid, move on.
          this.setState({
            userName: d.name,
            userEmail: d.email,
            userId: d._id,
            myLatestScore: d.latestScored
          });
        },
        () => {
          //token is no longer valid
          //do nothing for now
        }
      );
  }

  initializeQuiz(data) {
    //shuffle questions
    const shuffledQuestions = this.shuffleArray(data);

    //shuffle choices of each questions
    shuffledQuestions.map(question => this.shuffleArray(question.choices));

    //initialize for the first quiz
    this.setState({
      counter: 1,
      quizQuestions: shuffledQuestions,

      questionId: shuffledQuestions[0].id,
      question: shuffledQuestions[0].question,
      answerOptions: shuffledQuestions[0].choices,

      userAnswer: "",
      correctAnswer: "",
      answersTotalPoints: 0,
      result: "",

      finalResult: "",

      countdown: "start"
    });
  }

  shuffleArray(array) {
    if (array) {
      var currentIndex = array.length,
        temporaryValue,
        randomIndex;

      // While there remain elements to shuffle
      while (0 !== currentIndex) {
        // Pick a remaining element
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }
    }

    return array;
  }

  fetchQuestions() {
    var authToken = this.state.token;
    var myHeaders = new Headers({
      "Content-type": "application/json",
      "x-access-token": authToken
    });

    var fetchOptions = {
      headers: myHeaders
    };
    fetch(API_URL + QUERY_DEFAULT, fetchOptions)
      .then(response => {
        if (!response.ok) {
          throw Error("Network request failed");
        }
        return response;
      })
      .then(d => d.json())
      .then(
        d => {
          this.initializeQuiz(d);
        },
        () => {
          this.setState({
            requestFailed: true
          });
        }
      );
  }

  handleTimeOut(event) {
    this.setForward();
  }

  handleInputChanged(event) {
    //won't update value until form submitted - event changed causes pause of count down :(
    //this.setState({userAnswer: event.target.value});
  }

  handleAnswerInputted(event) {
    event.preventDefault();
    this.stopCountDown();

    var currentElem = event.target;
    var userInput = currentElem.elements["userAnswer"].value;
    var allInputItems = currentElem.getElementsByTagName("input");

    for (var i = 0; i < allInputItems.length; i++)
      allInputItems[i].disabled = true;

    this.setState({ userAnswer: userInput });
    this.fetchCurrentAnswer();
  }

  handleAnswerSelected(event) {
    this.stopCountDown();

    var userAnswer = event.currentTarget.value;

    this.setState({ userAnswer: event.currentTarget.value });
    this.fetchCurrentAnswer();
  }

  fetchCurrentAnswer() {
    //fetch data base on current id
    var url = API_URL + QUERY_ANSWER + this.state.questionId.toString();
    var authToken = this.state.token;
    var myHeaders = new Headers({
      "Content-type": "application/json",
      "x-access-token": authToken
    });

    var fetchOptions = {
      headers: myHeaders
    };
    fetch(url, fetchOptions)
      .then(response => {
        if (!response.ok) {
          throw Error("Network request failed");
        }

        return response;
      })
      .then(d => d.json())
      .then(
        d => {
          this.setUserAnswer(d.answer);
        },
        () => {
          this.setState({
            requestFailed: true
          });
        }
      );
  }

  setUserAnswer(correctValue) {
    if (
      correctValue.toUpperCase().trim() ===
      this.state.userAnswer.toUpperCase().trim()
    ) {
      var increasedPoint = this.state.answersTotalPoints + 1;

      //do something
      this.setState({
        answersTotalPoints: increasedPoint,
        correctAnswer: correctValue,
        result: "Correct!"
      });
    } else {
      this.setState({
        correctAnswer: correctValue,
        result: "Try again next time!"
      });
    }
  }

  stopCountDown() {
    this.setState({ countdown: "stop" });
  }

  moveForward(event) {
    event.preventDefault();
    this.setForward();
  }

  setForward() {
    if (this.state.counter < this.state.quizQuestions.length) {
      setTimeout(() => this.setNextQuestion(), 500);
    } else {
      setTimeout(() => this.setResults(this.getResults()), 500);
    }
  }

  handleSubmitScores(event) {
    event.preventDefault();
    this.putResultForCurrentUser(this.state.answersTotalPoints);
  }

  putResultForCurrentUser(myScore) {
    //fetch data base on current id
    var url = API_URL + URI_UPDATE_SCORE + this.state.userId;
    var authToken = this.state.token;
    var myHeaders = new Headers({
      "Content-type": "application/json",
      "x-access-token": authToken
    });

    var data = {
      newScore: myScore
    };

    var fetchOptions = {
      method: "PUT",
      body: JSON.stringify(data),
      headers: myHeaders
    };
    fetch(url, fetchOptions)
      .then(response => {
        if (!response.ok) {
          throw Error("Network request failed");
        }

        return response;
      })
      .then(d => d.json())
      .then(
        d => {
          this.setState({
            myLatestScore: d.latestScored
          });
        },
        () => {
          this.setState({
            requestFailed: true
          });
        }
      );
  }

  setNextQuestion() {
    const counter = this.state.counter + 1;

    this.setState({
      counter: counter,
      questionId: this.state.quizQuestions[counter - 1].id,
      question: this.state.quizQuestions[counter - 1].question,
      answerOptions: this.state.quizQuestions[counter - 1].choices,
      correctAnswer: null,
      userAnswer: "",
      result: "",
      countdown: "start"
    });
  }

  getResults() {
    return this.state.answersTotalPoints.toString();
  }

  setResults(result) {
    this.setState({ finalResult: result });
  }

  renderQuiz() {
    return (
      <Quiz
        counter={this.state.counter}
        userAnswer={this.state.userAnswer}
        answerOptions={this.state.answerOptions}
        questionId={this.state.questionId}
        question={this.state.question}
        correctAnswer={this.state.correctAnswer}
        questionTotal={this.state.quizQuestions.length}
        result={this.state.result}
        onAnswerSelected={this.handleAnswerSelected}
        onAnswerInputted={this.handleAnswerInputted}
        onInputChanged={this.handleInputChanged}
        onNext={this.moveForward}
        onTimeOut={this.handleTimeOut}
        countdown={this.state.countdown}
      />
    );
  }

  renderResult() {
    return (
      <Result
        quizResult={this.state.finalResult}
        restartQuiz={this.restartQuiz}
        submitScore={this.handleSubmitScores}
      />
    );
  }

  restartQuiz(event) {
    event.preventDefault();
    this.initializeQuiz(this.state.quizQuestions);
  }

  renderLoading() {
    return (
      <p>
        <FontAwesomeIcon icon="spinner" size="xs" spin /> Loading questions...
      </p>
    );
  }

  renderLoadFailed() {
    return <p>Failed to load questions!</p>;
  }

  renderPlayerInfo() {
    return (
      <p>
        {this.state.userEmail} : {this.state.myLatestScore}
      </p>
    );
  }
  render() {
    if (this.state.requestFailed) return this.renderLoadFailed();

    if (!this.state.quizQuestions) return this.renderLoading();

    return (
      <div>
        {this.renderPlayerInfo()}
        {this.state.finalResult ? this.renderResult() : this.renderQuiz()}
      </div>
    );
  }
}

export default withCookies(QuizApp);
