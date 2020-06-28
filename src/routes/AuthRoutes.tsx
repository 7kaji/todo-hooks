import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import SignUp from '../components/Auth/signup';
import Login from '../components/Auth/login';

export const AuthRoutes = () => {
  return (
    <Switch>
      <Route path="/auth/login" component={Login} />
      <Route path="/auth/signup" component={SignUp} />
      <Redirect to="/auth/login" from="/auth" />
    </Switch>
  );
};
