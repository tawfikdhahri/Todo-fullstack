import { useQuery } from "@apollo/client";
import React, { ReactElement } from "react";
import {
  Redirect,
  Route,
  BrowserRouter as Router,
  useHistory,
  useLocation,
} from "react-router-dom";
import { IS_LOGGED_IN } from "./queries.local";
import Home from "./views/Home";
import SignIn from "./views/SignIn";

interface Props {}

function Routes({}: Props): JSX.Element {
  const {
    data: { isLoggedIn },
  } = useQuery(IS_LOGGED_IN);

  console.log({ isLoggedIn });

  return (
    <Router>
      <Route path="/signin" component={SignIn} exact />
      {!isLoggedIn ? (
        <Redirect to="/signin" />
      ) : (
        <Route path="/" component={Home} exact />
      )}
    </Router>
  );
}

export default Routes;
