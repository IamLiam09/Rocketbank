import { BrowserRouter, Route, Switch } from "react-router-dom";
import RegisterForm from "./pages/RegisterForm.js";
import LoginForm from "./pages/LoginForm.js";
import React from "react";
import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider,
} from "@apollo/client";

const client = new ApolloClient({
	uri: "http://localhost:5000/graphql", 
	cache: new InMemoryCache(),
});
function App() {
	return (
		<ApolloProvider client={client}>
			<BrowserRouter>
				<div>
					<Switch>
						<Route exact path="/" component={RegisterForm} />
						<Route path="/login" component={LoginForm} />
					</Switch>
				</div>
			</BrowserRouter>
		</ApolloProvider>
	);
}

export default App;
