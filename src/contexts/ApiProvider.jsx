import React, { useContext } from 'react';
import { Provider } from 'use-http';
import { toCamel } from 'convert-keys';
import { AuthContext } from './Auth/AuthProvider';

const ApiProvider = (props) => {
  const { token } = useContext(AuthContext);

  const globalOptions = {
    interceptors: {
      // every time we make an http request, this will run 1st before the request is made
      // url, path and route are supplied to the interceptor
      // request options can be modified and must be returned
      request: async ({ options, url, path, route }) => {
        options.headers.Authorization = `Bearer ${token}`;
        return options;
      },
      // every time we make an http request, before getting the response back, this will run
      response: async ({ response }) => {
        const res = response;
        if (res.data) res.data = toCamel(res.data);
        return res;
      },
    },
  };

  return (
    <Provider url={process.env.REACT_APP_API_HOST} options={globalOptions}>
      {props.children}
    </Provider>
  );
};

export default ApiProvider;
