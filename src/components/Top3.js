import React, { Component } from "react";
import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";
import { CSSTransitionGroup } from "react-transition-group";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
library.add(faSpinner);

const API_URL = "https://quiz-api-v2.herokuapp.com";
const URI_TOP3 = "/api/user/top3";

class Top3 extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  constructor(props) {
    super(props);
    const { cookies } = props;
    this.state = {
      top3Users: [],
      requestFailed: false
    };
  }

  componentDidMount() {
    console.log("Top3 mounted");
    this.fetchTop3();
  }

  fetchTop3() {
    var url = API_URL + URI_TOP3;
    //fetch data base on current id
    var fetchOptions = {
      headers: { "Content-type": "application/json" }
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
          this.setTop3(d);
        },
        () => {
          this.setState({
            requestFailed: true
          });
        }
      );
  }

  setTop3(data) {
    var displayList = data.map(({ email, latestScored }) => ({
      email,
      latestScored
    }));
    this.setState({ top3Users: displayList, requestFailed: false });
  }

  render() {
    if (this.state.requestFailed) return <p>Failed to load data!</p>;
    const listItems = this.state.top3Users.map(users => (
      <li>
        {users.email} : {users.latestScored}
      </li>
    ));
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
        <h2>Our Top 3 players!</h2>

        <ul className="answerOptions">{listItems}</ul>
      </CSSTransitionGroup>
    );
  }
}
export default withCookies(Top3);
