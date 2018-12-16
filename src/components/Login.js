import React, { Component } from "react";
import { instanceOf } from "prop-types";
import PropTypes from "prop-types";
import { withCookies, Cookies } from "react-cookie";
import { CSSTransitionGroup } from "react-transition-group";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
library.add(faSpinner);

function Login(props) {
  function renderLoadingButton() {
    return (
      <div>
        <button type="submit" disabled>
          <FontAwesomeIcon icon="spinner" size="xs" spin /> Logging you in
        </button>
      </div>
    );
  }

  function renderLoginButton() {
    return (
      <div>
        <button type="submit">Log me in</button>
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
      <form onSubmit={props.onLogin}>
        <h1>Login and start playing quiz!</h1>

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

        {props.isLoading ? renderLoadingButton() : renderLoginButton()}
      </form>
    </CSSTransitionGroup>
  );
}

Login.propTypes = {
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  onInputChange: PropTypes.func.isRequired,
  onLogin: PropTypes.func.isRequired
};
export default withCookies(Login);
