import React, { useState, useContext, useEffect } from "react";
import { Link, Navigate, Route, useLocation } from 'react-router-dom';
import { AccountContext } from "../components/Account";

function RequireAuth({ children }) {
    const [status, setStatus] = useState(false);
    let location = useLocation();

    const { getSession } = useContext(AccountContext);

    useEffect(() => {
      getSession().then((session) => {
        console.log("Session: ", session);
        setStatus(true);
      })
    }, []);

    return status ? children : (
      <div>Unauthorized access: <Link to={"/login"}>Please login</Link></div>
    );
}

export default RequireAuth;