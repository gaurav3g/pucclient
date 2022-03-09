import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import { Account } from './components/Account';
import ClientDetail from './pages/ClientDetail';
import GetConfig from './pages/GetConfig';
import Home from './pages/Home';
import Login from './pages/Login';
import NewClient from './pages/NewClient';
import NotFound from './pages/NotFound';
import Signup from './pages/Signup';
import Status from './pages/Status';
import RequireAuth from './utils/RequireAuth';

function App() {
  return (
    <div className="App">
      <Account>
        {/* <Status /> */}
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
        </Routes>
      </Account>
    </div>
  );
}

export default App;
