import { useQuery } from "@apollo/client";
import React, { ReactElement, useCallback } from "react";
import { isLoggedInVar } from "../cache";
import { IS_LOGGED_IN } from "../queries.local";

interface Props {}

const Header: React.FC<Props> = ({}): JSX.Element => {
  const { data } = useQuery(IS_LOGGED_IN);

  const logout = useCallback(() => {
    localStorage.clear();
    isLoggedInVar(false);
  }, []);

  return (
    <div className="header">
      <div className="header-content">
        <div className="header-content__title">My Todo</div>
        <div className="header-content__profile">
          <div className="header-content__profile__avatar">TS</div>
          {data.isLoggedIn && <button onClick={logout}>Log out</button>}
        </div>
      </div>
    </div>
  );
};

export default React.memo(Header);
