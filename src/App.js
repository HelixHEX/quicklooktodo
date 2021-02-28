import React from 'react'

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Home from './Components/Home'
import Login from './Components/Login'
import Signup from './Components/Signup'
import PageNotFound from './Components/PageNotFound'

import PrivateRoute from './PrivateRoute'

import { AuthProvider } from './Auth';

const App = () => {
  return (
    <>
      <AuthProvider>
        <Router>
          <Switch>
            {/* <Route exact path="/" render={(props) => <Home {...props} />} /> */}
            <PrivateRoute exact path='/' component={(props) => <Home {...props} />} />
            <Route exact path="/login" render={(props) => <Login {...props} />} />
            <Route exact path="/signup" render={(props) => <Signup {...props} />} />
            <Route component={PageNotFound} />
          </Switch>
        </Router>
      </AuthProvider>
    </>
  )
}

export default App