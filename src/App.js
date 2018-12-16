import React, { Component } from "react";
import { Link, Route, Switch, IndexRoute } from "react-router-dom";
import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";

import Login from "./components/Login";
import Signup from "./components/Signup";
import NavComponent from "./components/NavComponent";
import QuizApp from "./QuizApp";
import Top3 from "./components/Top3";
import withAuth from "./components/withAuth";

const API_URL = "https://quiz-api-v2.herokuapp.com";
const URI_LOGIN = "/api/auth/login";
const URI_SIGNUP = "/api/auth/register";

class App extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };
  constructor(props) {
    super(props);

    const { cookies } = props;
    this.state = {
      isAuthenticated: false,
      token: "",
      name: cookies.get("name") || "Ben",
      message: "",
      isLoading: false,
      isSignUp: false
    };
    this.handleLogin = this.handleLogin.bind(this);
    this.handleSignMeUp = this.handleSignMeUp.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.onSignupClicked = this.onSignupClicked.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }
  componentWillMount() {
    const { cookies } = this.props;
    var localToken = cookies.get("quizapitoken");
    if (typeof localToken === "undefined" || localToken.length === 0) {
      this.setState({
        isAuthenticated: false,
        token: ""
      });
    } else {
      this.setState({
        isAuthenticated: true,
        token: localToken
      });
    }
  }

  authenticate(option) {
    var url = API_URL;

    if (option === "login") url = url + URI_LOGIN;
    else {
      url = url + URI_SIGNUP;
    }
    console.log(url);
    //fetch data base on current id
    var data = {
      email: this.state.email,
      password: this.state.password
    };
    var fetchData = {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-type": "application/json" }
    };

    fetch(url, fetchData)
      .then(response => {
        if (!response.ok) {
          throw Error("Network request failed");
        }
        return response;
      })
      .then(d => d.json())
      .then(
        d => {
          this.setAuthenticated(d);
        },
        () => {
          this.setState({
            requestFailed: true,
            isAuthenticated: false,
            message: "Please check if email and password is correct."
          });
        }
      );
  }
  setAuthenticated(authData) {
    if (authData.auth) {
      const { cookies } = this.props;
      cookies.set("quizapitoken", authData.token, { path: "/" });

      this.setState({
        isLoading: false,
        token: authData.token,
        isAuthenticated: true,
        isSignUp: false,
        message: ""
      });
    } else {
      this.setState({
        isLoading: false,
        token: "",
        isAuthenticated: false,
        message: "Invalid email or password."
      });
    }
  }

  handleLogin(event) {
    event.preventDefault();
    this.setState({
      isLoading: true
    });
    this.authenticate("login");
  }

  handleSignMeUp(event) {
    event.preventDefault();

    this.setState({
      isLoading: true
    });
    this.authenticate("signup");
  }

  handleInputChange(event) {
    event.preventDefault();
    const { value, name } = event.target;
    this.setState({
      [name]: value
    });
  }

  onSignupClicked(event) {
    console.log("Signup clicked");
    event.preventDefault();
    this.handleLogout();
    this.setState({
      isSignUp: true
    });
  }

  handleLogout() {
    const { cookies } = this.props;
    cookies.remove("name");
    cookies.remove("quizapitoken");
    this.setState({
      isAuthenticated: false,
      token: ""
    });

    console.log("logged out");
  }

  renderLogin() {
    console.log("Render Login");
    if (!this.state.isSignUp)
      return (
        <div class="container">
          <Login
            email=""
            password=""
            onInputChange={this.handleInputChange}
            onLogin={this.handleLogin}
          />
        </div>
      );
  }
  renderSignUp() {
    console.log("Render SignUp");

    return (
      <div class="container">
        <Signup
          email=""
          password=""
          onInputChange={this.handleInputChange}
          onSignup={this.handleSignMeUp}
        />
      </div>
    );
  }
  renderRoutes() {
    if (!this.state.isSignUp)
      return (
        <Switch>
          <Route
            exact
            path={"/"}
            component={withAuth(QuizApp, this.state.token)}
          />
          <Route path="/quiz" component={withAuth(QuizApp, this.state.token)} />
        </Switch>
      );
  }
  render() {
    return (
      <div className="App">
        <navbar>
          <NavComponent
            isAuthenticated={this.state.isAuthenticated}
            onLogout={this.handleLogout}
            onSignup={this.onSignupClicked}
          />
        </navbar>
        <Route path="/top3" component={Top3} />
        {this.state.message}
        {this.state.isSignUp ? this.renderSignUp() : null}
        {this.state.isAuthenticated ? this.renderRoutes() : this.renderLogin()}
      </div>
    );
  }
}

export default withCookies(App);
