import React, { useState, useEffect, createContext } from "react";
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import Pool from "../utils/UserPool";

const AccountContext = createContext();

const nameToValurMap = list => list?.reduce((a,c) => ({...a, [c?.Name]: c?.Value}), {})

const Account = (props) => {
  const [userData, setUserData] = useState({});
  const getSession = async () => {
    return await new Promise((resolve, reject) => {
      const user = Pool.getCurrentUser();
      if (user) {
        user.getSession((err, session) => {
          if (err) {
            reject();
          } else {
            resolve(session);
            user.getUserData((err, data) => {
                if (err) {
                    reject();
                } else {
                    setUserData(nameToValurMap(data?.['UserAttributes'] || {}));
                }
            });
          }
        });
      } else {
        reject();
      }
    });
  };

  const authenticate = async (Username, Password) => {
    return await new Promise((resolve, reject) => {
      const user = new CognitoUser({ Username, Pool });

      const authDetails = new AuthenticationDetails({ Username, Password });

      user.authenticateUser(authDetails, {
        onSuccess: (data) => {
          console.log("onSuccess: ", data);
          resolve(data);
        },
        onFailure: (err) => {
          console.error("onFailure: ", err);
          reject(err);
        },
        newPasswordRequired: (data) => {
          console.log("newPasswordRequired: ", data);
          resolve(data);
        },
      });
    });
  };

  const logout = () => {
    const user = Pool.getCurrentUser();
    if (user) {
      user.signOut();
    }
  };

  return (
    <AccountContext.Provider value={{ authenticate, getSession, logout, user: userData }}>
      {props.children}
    </AccountContext.Provider>
  );
};
export { Account, AccountContext };