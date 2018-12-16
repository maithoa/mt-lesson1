import React, { Component } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { Link, Route, Switch } from "react-router-dom";
import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";

function NavComponent(props) {
	function renderSignup() {
		if (props.isAuthenticated) return null;
		return (
			<a href="/" onClick={props.onSignup}>
				{" "}
				Sign in{" "}
			</a>
		);
	}

	function renderLogout() {
		if (!props.isAuthenticated) return null;
		return (
			<a href="/" onClick={props.onLogout}>
				{" "}
				Logout{" "}
			</a>
		);
	}
	function burgerToggle() {
		var x = document.getElementById("myTopnav");
		if (x.className === "topnav") {
			x.className += " responsive";
		} else {
			x.className = "topnav";
		}
	}

	return (
		<div class="topnav" id="myTopnav">
			<a href="/quiz" class="active">
				Quiz
			</a>
			<a href="/top3">Top 3</a>
			{renderSignup()}

			{renderLogout()}
			<a href="javascript:void(0);" class="icon" onClick={burgerToggle}>
				<FontAwesomeIcon icon={faBars} />
			</a>
		</div>
	);
}
NavComponent.propTypes = {
	isAuthenticated: PropTypes.bool.isRequired,
	onLogout: PropTypes.func.isRequired,
	onSignup: PropTypes.func.isRequired
};

export default withCookies(NavComponent);
