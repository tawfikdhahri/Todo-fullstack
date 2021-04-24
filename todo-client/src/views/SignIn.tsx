import { gql, useMutation } from "@apollo/client";
import React, { ReactElement, useCallback, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import { isLoggedInVar } from "../cache";

interface Props {}

const SIGN_IN = gql`
  mutation Signin($email: String, $password: String) {
    signIn(email: $email, password: $password) {
      accessToken
    }
  }
`;

const SignIn: React.FC<Props> = ({}): JSX.Element => {
  const [values, setValues] = useState({
    email: "test@gmail.com",
    password: "test",
  });

  const [loading, setLoading] = useState(false);

  const [login] = useMutation(SIGN_IN);
  const history = useHistory();

  const handleChange = useCallback(({ target: { value, name } }) => {
    setValues((p: { email: string; password: string }) => {
      return {
        ...p,
        [name]: value,
      };
    });
  }, []);

  const signIn = useCallback(() => {
    setLoading(true);
    login &&
      login({
        variables: {
          email: values.email.trim(),
          password: values.password.trim(),
        },
      })
        .then(({ data }) => {
          setLoading(false);
          localStorage.setItem("accessToken", data.signIn.accessToken);
          isLoggedInVar(true);
          history.push("/");
          console.log(data);
        })
        .catch((e) => {
          setLoading(false);
          console.log(e);
        });
  }, []);

  return (
    <div className="signin">
      <div className="signin__card">
        <input
          name="email"
          placeholder="email"
          onChange={handleChange}
          value={values.email}
        />
        <input
          name="password"
          placeholder="password"
          onChange={handleChange}
          value={values.password}
        />
        <button onClick={signIn}>
          {loading ? <span className="loader" /> : <span>Login</span>}
        </button>
      </div>
    </div>
  );
};

export default SignIn;
