import { BrowserRouter, Route, Switch } from "react-router-dom";
import RegisterForm from "./pages/RegisterForm.js";
import LoginForm from "./pages/LoginForm.js";
import HomePage from "./pages/Home.js";
import React, { useState } from "react";
import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider,
	createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import NotFound from "./pages/NotFound";
import AuthMiddleware from "./middleware/AuthMiddleware.js";
import WithdrawalForm from "./pages/WithdrawForm.js";
import DepositForm from "./pages/DepositPage.js";
import TransferForm from "./pages/TransferPage.js";

const httpLink = createHttpLink({
	uri: "http://localhost:5000/graphql",
});
const authLink = setContext((_, { headers }) => {
	// Get the authentication token from wherever you've stored it
	const token = localStorage.getItem("authToken"); 
	// Return the headers to the context so HTTP link can read them
	const enhancedHeaders = token
		? {
				...headers,
				authorization: `Bearer ${token}`,
		  }
		: headers;

	return {
		headers: enhancedHeaders,
	};
});
const client = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache(),
});
function App() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [userData, setUserData] = useState(null);
	const handleLogin = (user) => {
		setUserData(user);
	};
	const updateUserBalance = (newBalance) => {
		if (userData) {
			const updatedUser = {
			  ...userData,
			  balance: newBalance,
			};
			setUserData(updatedUser);
		  }
	};
	return (
		<ApolloProvider client={client}>
			<BrowserRouter>
				<div>
					<Switch>
						<Route exact path="/" component={RegisterForm} />
						<Route path="/login" render={(props) => <LoginForm onLogin={handleLogin} {...props} />} />
						<Route
							exact
							path="/home"
							render={(props) => (
								<AuthMiddleware>
									<HomePage client={client} {...props} />
								</AuthMiddleware>
							)}
						/>
						<Route
							path="/home/deposit"
							render={(props) => <DepositForm user={userData} {...props} />}
						/>
						<Route
							path="/home/transfer"
							render={(props) => <TransferForm user={userData} {...props} />}
						/>
						<Route
							path="/home/withdraw"
							render={(props) => <WithdrawalForm user={userData} {...props} />}
						/>
						<Route component={NotFound} />
					</Switch>
				</div>
			</BrowserRouter>
		</ApolloProvider>
	);
}

export default App;
