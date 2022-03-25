import { Button } from '@mui/material';
import { useContext } from 'react';
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

  return (
    <div className="App">
      {/* <Status /> */}
      {/* <Navbar /> */}
      {/* <div style={{ margin: 10 }}>
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
      {/* Blocked due to server payment! Sorry for the inconvenience... */}
    </div>
  );
}

export default App;
