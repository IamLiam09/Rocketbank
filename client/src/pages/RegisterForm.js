import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { REGISTER_USER_MUTATION } from "..../server/resolvers/users";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";

function RegisterForm() {
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
		phonenumber: "",
	});

	const [registerUser] = useMutation(REGISTER_USER_MUTATION);
	// check for mismatched password
	const [passwordMismatch, setPasswordMismatch] = useState(false);
	// make the password visible
	const [passwordVisibility, setPasswordVisibility] = useState(false);
	const [confirmPasswordVisibility, setConfirmPasswordVisibility] =
		useState(false);
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};
	const togglePasswordVisibility = () => {
		setPasswordVisibility(!passwordVisibility);
	};
	const toggleConfirmPasswordVisibility = () => {
		setConfirmPasswordVisibility(!confirmPasswordVisibility);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (formData.password !== formData.confirmPassword) {
			setPasswordMismatch(true); // Set the error state
			return; // Prevent form submission
		}
		setPasswordMismatch(false); // Reset the error state
		try {
			const { data } = await registerUser({ variables: formData });
			// console.log("User registered:", data.registerUser);
			// Handle successful registration (e.g., redirect to login page)
		} catch (error) {
			console.error("Registration error:", error);
			// Handle registration error (e.g., display error message)
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
						className="form-control"
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
						className="form-control"
						value={formData.phonenumber}
						onChange={handleChange}
						required
					/>
				</div>
				<button type="submit" className="btn btn-primary mt-4">
					Register
				</button>
				<div className="mt-3">
					Already have an account? <a href="/">Log in</a>
				</div>
			</form>
		</div>
	);
}

export default RegisterForm;
