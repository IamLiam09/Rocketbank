import { BrowserRouter, Route, Switch } from "react-router-dom";
import RegisterForm from "./pages/RegisterForm.js";
import LoginForm from "./pages/LoginForm.js";
import HomePage from "./pages/Home.js";
import React, { useState } from "react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { useLocation } from "react-router-dom";
import NotFound from "./pages/NotFound";

const client = new ApolloClient({
	uri: "http://localhost:5000/graphql",
	cache: new InMemoryCache(),
});
function App() {
	const location = useLocation();
	console.log("Current route:", location.pathname);
	const [userData, setUserData] = useState(null);
	const handleLogin = (user) => {
		// Callback function to receive user data from LoginPage
		setUserData(user);
	};
	return (
		<ApolloProvider client={client}>
			<BrowserRouter>
				<div>
					<Switch>
						<Route exact path="/" component={RegisterForm} />
						<Route
							path="/login"
							render={(props) => <LoginForm onLogin={handleLogin} {...props} />}
						/>
						<Route
							path="/home"
							render={(props) => <HomePage user={userData} {...props} />}
						/>
						<Route path="*" component={NotFound} />
					</Switch>
				</div>
			</BrowserRouter>
		</ApolloProvider>
	);
}

export default App;
