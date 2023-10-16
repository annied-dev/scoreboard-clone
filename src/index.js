import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import store from "./redux/store";
import { Route, BrowserRouter as Router, Switch, Redirect } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <Provider store={store}>
      <Router>
        <Switch>
          <Route
            exact path='/'
            render={props => <Redirect to='/coverage/icc_wc_2023_g10' />}
          />
          <Route
            exact path='/coverage/:match_id'
            render={props => <App props={props} />}
          />
          <div>Page not found</div>
        </Switch>
      </Router>
    </Provider>
  </>
);
