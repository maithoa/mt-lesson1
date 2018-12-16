import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";

const API_URL = "https://quiz-api-v2.herokuapp.com";
const QUERY_DEFAULT = "/api/quiz";
const QUERY_ANSWER = "/api/quiz/answer/";
const URI_LOGIN = "/api/auth/login";
const URI_SIGNUP = "/api/auth/register";
const URI_CHECK_TOKEN = "/api/auth/me";

export default function withAuth(ComponentToProtect, local_token) {
	return class extends Component {
		constructor() {
			super();

			this.state = {
				loading: true,
				redirect: false,
				username: "",
				token: local_token
			};
		}
		componentDidMount() {
			var toCheckToken = this.state.token;
			var myHeaders = new Headers({
				"Content-type": "application/json",
				"x-access-token": toCheckToken
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
							loading: false,
							username: d.name
						});
					},
					() => {
						//token is no longer valid
						this.setState({ loading: false, redirect: true });
					}
				);
		}

		render() {
			const { loading, redirect } = this.state;
			let view = <h1>Loading...</h1>;
			if (!loading) {
				if (redirect) {
					view = <Redirect to="/login" />;
				} else {
					view = (
						<ComponentToProtect
							token={this.state.token}
							{...this.props}
						/>
					);
				}
			}
			return <React.Fragment>{view}</React.Fragment>;
		}
	};
}
