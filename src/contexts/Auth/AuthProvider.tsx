import React, { useEffect, useState } from 'react';
import firebase from '../../firebase';

type ContextProps = {
  user: firebase.User | null;
  authenticated: boolean;
  setUser: any;
  loadingAuthState: boolean;
  token: string;
};

export const AuthContext = React.createContext<Partial<ContextProps>>({});

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState(null as firebase.User | null);
  const [loadingAuthState, setLoadingAuthState] = useState(true);
  const [token, setToken] = useState('');

  useEffect(() => {
    firebase.auth().onAuthStateChanged(async (user: any) => {
      setUser(user);
      if (user) {
        const token = await user.getIdToken();
        setToken(token);
      } else {
        setToken('');
      }
      setLoadingAuthState(false);
      console.log(user, 'ap user');
      console.log(user !== null, 'ap authenticated');
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        authenticated: user !== null,
        setUser,
        loadingAuthState,
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
