import { Button, Typography } from '@mui/material';
import { useContext, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import { AccountContext } from './components/Account';
import Navbar from './components/Navbar';
import ManageUser from './pages/Admin/ManageUser';
import ClientDetail from './pages/ClientDetail';
import GetConfig from './pages/GetConfig';
import Login from './pages/Login';
import NewClient from './pages/NewClient';
import NotFound from './pages/NotFound';
import Signup from './pages/Signup';
import RequireAuth from './utils/RequireAuth';

function App() {
  const { isAdmin, logout } = useContext(AccountContext);
  const [isPaid, setPaid] = useState(false);

  return !isPaid ? (
    <div className="App" style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', width: "100%", top: 0, bottom: 0, position: 'absolute'}}>
      <div style={{margin: 'auto'}}>
        <h1>
          <span >This site can't be reached</span>
        </h1>
        <p ><strong>https://master.d2g5tx2c8gbaex.amplifyapp.com</strong>’s server IP address has been blocked.</p>
        <div>
          <div>
            <div>
              <div>
                <div>
                  <p>Try:</p>
                  <ul>
                    <li>Checking the connection</li>
                    <li>Checking the proxy, firewall, and DNS configuration</li>
                  </ul>
                </div>
                <div>ERR_NAME_NOT_RESOLVED</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="App">
      <Routes>
        <Route path="*" element={<NotFound />}/>
        <Route path="/get-config" element={<Navigate to={'/client'} replace />} />
        <Route path="/" element={
          <RequireAuth>
            <GetConfig />
          </RequireAuth>
        } />
        <Route path="/client" element={
          <RequireAuth>
            <NewClient />
          </RequireAuth>
        } />
        <Route path="/client/:id" element={
          <RequireAuth>
            <ClientDetail />
          </RequireAuth>
        } />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/manage-user" element={
          <RequireAuth>
            {isAdmin ? <ManageUser /> : <NotFound />}
          </RequireAuth>
        } />
      </Routes>
    </div>
  );
}

export default App;
