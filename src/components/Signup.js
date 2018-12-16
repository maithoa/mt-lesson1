import React, { Component } from "react";
import { instanceOf } from "prop-types";
import PropTypes from "prop-types";
import { withCookies, Cookies } from "react-cookie";
import { CSSTransitionGroup } from "react-transition-group";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
library.add(faSpinner);

function Signup(props) {
  function renderLoadingButton() {
    return (
      <div>
        <button type="submit" disabled>
          <FontAwesomeIcon icon="spinner" size="xs" spin /> Signing you up
        </button>
      </div>
    );
  }

  function renderSignupButton() {
    return (
      <div>
        <button type="submit">Sign me up</button>
      </div>
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
      <form onSubmit={props.onSignup}>
        <h1>Sign up and start!</h1>

        <input
          type="email"
          name="email"
          placeholder="Enter email"
          onChange={props.onInputChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Enter password"
          onChange={props.onInputChange}
          required
        />

        {props.isLoading ? renderLoadingButton() : renderSignupButton()}
      </form>
    </CSSTransitionGroup>
  );
}

Signup.propTypes = {
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  onInputChange: PropTypes.func.isRequired,
  onSignup: PropTypes.func.isRequired
};
export default withCookies(Signup);
