import gql from "graphql-tag";

export const IS_LOGGED_IN = gql`
  query IsloggedInSignUp {
    isLoggedIn @client
  }
`;
