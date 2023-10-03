import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { REGISTER_USER_MUTATION } from "../GraphQL/RegisterMutation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Link, Redirect } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import zxcvbn from "zxcvbn";
import { useHistory } from "react-router-dom";
import Alert from "react-bootstrap/Alert";

function RegisterForm() {
	const history = useHistory();
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
		phonenumber: "",
	});

	const [registerUser, { data, loading, error }] = useMutation(
		REGISTER_USER_MUTATION
	);
	const [passwordVisibility, setPasswordVisibility] = useState(false);
	const [confirmPasswordVisibility, setConfirmPasswordVisibility] =
		useState(false);
	const [emailError, setEmailError] = useState(false);
	const [phoneNumberError, setPhoneNumberError] = useState(false);
	const [passwordStrength, setPasswordStrength] = useState(0);
	const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
	const [passwordMismatch, setPasswordMismatch] = useState(false);
	const [registrationSuccess, setRegistrationSuccess] = useState(false);

	const togglePasswordVisibility = () => {
		setPasswordVisibility(!passwordVisibility);
	};
	const toggleConfirmPasswordVisibility = () => {
		setConfirmPasswordVisibility(!confirmPasswordVisibility);
	};
	const passwordStrengthLabel = (strength) => {
		switch (strength) {
			case 0:
				return "Password strength: Very Weak";
			case 1:
				return "Password strength: Weak";
			case 2:
				return "Password strength: Fair";
			case 3:
				return "Password strength: Good";
			case 4:
				return "Password strength: Strong";
			default:
				return "";
		}
	};

	const getStrengthClass = (strength) => {
		switch (strength) {
			case 0:
				return "danger";
			case 1:
				return "danger";
			case 2:
				return "warning";
			case 3:
				return "info";
			case 4:
				return "success";
			default:
				return "";
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		if (name === "email") {
			// Check if the input matches a basic email format
			if (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
				setEmailError(false);
				setFormData({ ...formData, [name]: value });
			} else {
				setEmailError(true);
			}
			setFormData({ ...formData, [name]: value });
		}
		if (name === "phonenumber") {
			// Check if the input contains only digits and is 11 characters long
			if (/^\d{11}$/.test(value)) {
				setPhoneNumberError(false);
				setFormData({ ...formData, [name]: value });
			} else {
				setPhoneNumberError(true);
			}
			setFormData({ ...formData, [name]: value });
		}
		if (name === "password") {
			// Check password strength using zxcvbn
			const result = zxcvbn(value);

			// Set the password strength and error message
			setPasswordStrength(result.score);
			setPasswordErrorMessage(result.feedback.suggestions.join(" "));

			setFormData({ ...formData, [name]: value });
		} else {
			setFormData({ ...formData, [name]: value });
		}
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (formData.password !== formData.confirmPassword) {
			setPasswordMismatch(true); // Set the error state
			return; // Prevent form submission
		}
		setPasswordMismatch(false); // Reset the error state
		const { confirmPassword, ...registerInput } = formData;
		try {
			const { data } = await registerUser({
				variables: { registerInput },
			});
			if (!data || !data.registerUser) {
				console.error("Registration failed.");
				return;
			}
			// console.log("User registered:", data.registerUser);
			setRegistrationSuccess(true);
			setTimeout(() => {
				setRegistrationSuccess(true);
				history.push("/login");
			  }, 1500);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="container">
			<h2 className="mt-5">Register</h2>
			<form onSubmit={handleSubmit}>
				<div className="form-group mt-4">
					<input
						type="text"
						name="username"
						placeholder="Username"
						className="form-control"
						value={formData.username}
						onChange={handleChange}
						required
					/>
				</div>
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
					{emailError && (
						<div className="invalid-feedback">
							Input the correct format for email
						</div>
					)}
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
					{passwordStrength > 0 && (
						<div
							className={`password-strength text-${getStrengthClass(
								passwordStrength
							)}`}
						>
							{passwordStrengthLabel(passwordStrength)}
						</div>
					)}
					{passwordErrorMessage && (
						<div className="invalid-feedback">{passwordErrorMessage}</div>
					)}
				</div>
				<div className="form-group mt-4">
					<div className="input-group">
						<input
							type={confirmPasswordVisibility ? "text" : "password"}
							name="confirmPassword"
							placeholder="Confirm Password"
							className={`form-control ${passwordMismatch ? "is-invalid" : ""}`}
							value={formData.confirmPassword}
							onChange={handleChange}
							required
						/>
						<div className="input-group-append">
							<span
								className="input-group-text"
								onClick={toggleConfirmPasswordVisibility}
								style={{
									cursor: "pointer",
									border: "1px solid #ced4da",
									height: "40px",
									borderTopLeftRadius: 0,
									borderBottomLeftRadius: 0,
								}}
							>
								<FontAwesomeIcon
									icon={confirmPasswordVisibility ? faEyeSlash : faEye}
								/>
							</span>
						</div>
						{passwordMismatch && (
							<div className="invalid-feedback">Passwords do not match.</div>
						)}
					</div>
				</div>
				<div className="form-group mt-4">
					<input
						type="tel"
						name="phonenumber"
						placeholder="Phonenumber"
						className={`form-control ${phoneNumberError ? "is-invalid" : ""}`}
						value={formData.phonenumber}
						onChange={handleChange}
						required
					/>
					{phoneNumberError && (
						<div className="invalid-feedback">
							Phone number must be 11 digits long and be numbers.
						</div>
					)}
				</div>
				<button type="submit" className="btn btn-primary mt-4">
					Register
				</button>
				<div className="mt-3">
					Already have an account? <Link to="/login">Log in</Link>
				</div>
			</form>
			{registrationSuccess && (
				<Alert variant="success" className="mt-3">
					Registration successful! You can now <Link to="/login">log in</Link>.
				</Alert>
			)}
			{loading && (
				// Display a loading spinner while fetching data
				<div className="spinner-border text-primary" role="status">
					<span className="sr-only">Loading...</span>
				</div>
			)}
		</div>
	);
}

export default RegisterForm;
