import { InMemoryCache, makeVar } from "@apollo/client";

export const isLoggedInSignupVar = makeVar(false);
export const isLoggedInVar = makeVar(false);

const token = localStorage.getItem("accessToken");
isLoggedInVar(!!token);

export const cache = new InMemoryCache({
  typePolicies: {
    // Type policy map
    Query: {
      fields: {
        isLoggedIn: {
          read() {
            return isLoggedInVar();
          },
        },
      },
    },
  },
});
