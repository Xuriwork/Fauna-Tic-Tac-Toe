import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const PrivateRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated, user } = useAuth();
  return (
    <Route {...rest} render={props => isAuthenticated
      ? <Component isAuthenticated={isAuthenticated} user={user} {...props} />
      : <Redirect to={{ pathname: '/' }} />
    }
    />
  )
};

export const PublicRoute = ({ component: Component, restricted, ...rest }) => {
  const { isAuthenticated } = useAuth();
    return (
        <Route {...rest} render={props => (
            isAuthenticated && restricted ? <Redirect to='/home' /> : <Component {...props} />
        )} />
    );
};