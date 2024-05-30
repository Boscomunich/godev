import {BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/Homepage'
import createStore from 'react-auth-kit/createStore';
import AuthProvider from 'react-auth-kit/AuthProvider';
import Dashboard from './pages/Dashboard';
import AuthOutlet from '@auth-kit/react-router/AuthOutlet'
import Main from './components/Main';
import CodingPage from './pages/CodingPage';

function App() {
  const store = createStore({
  authName:'_auth',
  authType:'cookie',
  cookieDomain: window.location.hostname,
  cookieSecure: window.location.protocol === 'http:',
});

  return (
    <AuthProvider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage/>}/>
          <Route element={<AuthOutlet fallbackPath='/' />}>
            <Route path='/dashboard' element={<Dashboard/>}>
              <Route index element={<Main/>}/>
              <Route path='/dashboard/:project' element={<CodingPage/>}/>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
