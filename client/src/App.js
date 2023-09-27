import { BrowserRouter, Route, Switch } from "react-router-dom";
// import RegisterForm from "./pages/RegisterForm.js";
import SignupForm from "./pages/SignupForm.js"

function App() {
	return (
		<BrowserRouter>
			<div>
				<Switch>
					{/* <Route exact path="/" component={RegisterForm} /> */}
					<Route path="/signup" component={SignupForm} />
				</Switch>
			</div>
		</BrowserRouter>
	);
}

export default App;
