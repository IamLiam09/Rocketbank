import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_USER_MUTATION } from "../GraphQL/LoginMutation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
function LoginForm({ onLogin }) {
	const history = useHistory();
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const [loginUser, { data, loading, error }] =
		useMutation(LOGIN_USER_MUTATION);
	const [passwordVisibility, setPasswordVisibility] = useState(false);

	const [emailError, setEmailError] = useState(false);
	const togglePasswordVisibility = () => {
		setPasswordVisibility(!passwordVisibility);
	};
	const [errorMessage, setErrorMessage] = useState("");

	const handleChange = (e) => {
		const { name, value } = e.target;

		if (name === "email") {
			// Check if the input matches a basic email format
			if (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
				setEmailError(false);
			} else {
				setEmailError(true);
			}
		}

		// Update the formData with the new value
		setFormData({ ...formData, [name]: value });
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const { data } = await loginUser({
				variables: { loginInput: formData },
			});
			if (!data || !data.loginUser) {
				console.error("Login failed.");
				setErrorMessage("Invalid email or password");
				return;
			}
			// Extract the token from the login response
			const token = data.loginUser.token;

			// Save the token to localStorage
			localStorage.setItem("authToken", token);
			// console.log("Login:", data.loginUser);
			onLogin(data.loginUser);
			history.push("/home", { user: data.loginUser });
			// Handle successful registration (e.g., redirect to login page)
		} catch (error) {
			console.error("Login error:", error);
			setErrorMessage("Invalid email or password");
		}
	};

	return (
		<div className="container">
			<h2 className="mt-5">Login</h2>
			<form onSubmit={handleSubmit}>
				{errorMessage && (
					<div className="alert alert-danger">{errorMessage}</div>
				)}
				<div className="form-group mt-4">
					<input
						type="email"
						name="email"
						placeholder="Email"
						className={`form-control ${emailError ? "is-invalid" : ""}`}
						value={formData.email}
						onChange={handleChange}
						required
					/>
				</div>
				<div className="form-group mt-4">
					<div className="input-group">
						<input
							type={passwordVisibility ? "text" : "password"}
							name="password"
							placeholder="Password"
							className="form-control"
							value={formData.password}
							onChange={handleChange}
							required
						/>
						<div className="input-group-append">
							<span
								className="input-group-text"
								onClick={togglePasswordVisibility}
								style={{
									cursor: "pointer",
									border: "1px solid #ced4da",
									height: "40px",
									borderTopLeftRadius: 0,
									borderBottomLeftRadius: 0,
								}}
							>
								<FontAwesomeIcon
									icon={passwordVisibility ? faEyeSlash : faEye}
								/>
							</span>
						</div>
					</div>
				</div>
				<button type="submit" className="btn btn-primary mt-4">
					Login
				</button>
				<div className="mt-3">
					Don't have an account? <Link to="/">Register</Link>
				</div>
			</form>
			{loading && (
				// Display a loading spinner while fetching data
				<div className="spinner-border text-primary" role="status">
					<span className="sr-only">Loading...</span>
				</div>
			)}
		</div>
	);
}

export default LoginForm;
