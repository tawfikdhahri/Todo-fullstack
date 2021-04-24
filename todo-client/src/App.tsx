import React, { useMemo } from "react";
import { cache } from "./cache";

import { setContext } from "@apollo/client/link/context";

import "./styles/_layout.scss";

import Header from "./components/Header";

import { ApolloClient, ApolloProvider, createHttpLink } from "@apollo/client";
import Routes from "./Routes";

function App() {
  const httpLink = createHttpLink({
    uri: "http://localhost:4000/graphql",
  });
  const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = localStorage.getItem("accessToken");
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token,
      },
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache,
  });

  const isLoggedIn = useMemo(() => {
    const token = localStorage.getItem("accesstoken");
    if (token) {
      return true;
    } else return false;
  }, []);

  return (
    <ApolloProvider client={client}>
      <main className="main">
        <Header />
        <Routes />
      </main>
    </ApolloProvider>
  );
}

export default App;
