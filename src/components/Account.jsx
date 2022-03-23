import React, { useState, createContext } from "react";
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import Pool from "../utils/UserPool";
import { useNavigate } from "react-router-dom";

const AccountContext = createContext();

const nameToValueMap = list => list?.reduce((a,c) => ({...a, [c?.Name]: c?.Value}), {})

const Account = (props) => {
  const navigate = useNavigate()
  const [userData, setUserData] = useState({});
  const [idToken, setIdToken] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [clientList, setClientList] = useState({});
  const [isAdmin, setAdmin] = useState(false);

  const getSession = async () => {
    return await new Promise((resolve, reject) => {
      const user = Pool.getCurrentUser();
      if (user) {
        user.getSession((err, session) => {
          if (err) {
            reject();
          } else {
                // if(localStorage.getItem('securityKey')){
                    resolve(session);
                    if((session?.accessToken?.payload?.['cognito:groups'] || []).includes('Admin')){
                        setAdmin(true);
                    }else{
                        setAdmin(false);
                    }
                    setIdToken(session?.idToken?.jwtToken || null);
                    setAccessToken(session?.accessToken?.jwtToken || null)
                    user.getUserData((err, data) => {
                        if (err) {
                            reject();
                        } else {
                            setUserData(nameToValueMap(data?.['UserAttributes'] || {}));
                        }
                    });
                // }else{
                //     reject()
                // }
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

      const authDetails = new AuthenticationDetails({
        Username,
        Password,
        // ValidationData: {
        //   'securityKey': localStorage.getItem('securityKey'),
        // }
      });

      user.authenticateUser(authDetails, {
        onSuccess: (data) => {
          // console.log("onSuccess: ", data);
          resolve(data);
        },
        onFailure: (err) => {
          // console.error("onFailure: ", err);
          reject(err);
        },
        newPasswordRequired: (data) => {
          // console.log("newPasswordRequired: ", data);
          resolve(data);
        },
      });
    });
  };

  const logout = () => {
    const user = Pool.getCurrentUser();
    if (user) {
      user.signOut();
      navigate('/login');
    }
  };

  return (
    <AccountContext.Provider value={{
        authenticate,
        getSession,
        logout,
        isAdmin,
        user: userData,
        idToken,
        accessToken,
        clientList,
        setClientList: newObj => setClientList(prev => ({...prev, ...newObj})),
    }}>
      {props.children}
    </AccountContext.Provider>
  );
};
export { Account, AccountContext };