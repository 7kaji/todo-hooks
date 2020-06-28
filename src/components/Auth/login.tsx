import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import firebase from '../../firebase';
import 'firebase/auth';
import { AuthContext } from '../../contexts/Auth/AuthProvider';

interface UserData {
  email: string;
  password: string;
}

const Login = () => {
  const authContext = useContext(AuthContext);
  const { loadingAuthState } = useContext(AuthContext);
  const history = useHistory();
  const [values, setValues] = useState({
    email: '',
    password: '',
  } as UserData);

  useEffect(() => {
    firebase
      .auth()
      .getRedirectResult()
      .then((result) => {
        if (!result || !result.user || !firebase.auth().currentUser) {
          return;
        }

        redirectToTargetPage();
      })
      .catch((error) => {
        console.log(error, 'error');
      });

    // eslint-disable-next-line
  }, []);

  const redirectToTargetPage = () => {
    history.push('/dashboard');
  };

  const handleClick = () => {
    history.push('/auth/signup');
  };

  const handleChange = (event: any) => {
    event.persist();
    setValues((values) => ({
      ...values,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();

    firebase
      .auth()
      .signInWithEmailAndPassword(values.email, values.password)
      .then((res) => {
        authContext.setUser(res);
        console.log(res, 'res');
        history.push('/dashboard');
      })
      .catch((error) => {
        console.log(error.message);
        alert(error.message);
      });
  };

  const handleSocialClick = (sns: any) => {
    console.log(sns, 'sns');

    let provider: firebase.auth.AuthProvider;
    switch (sns) {
      case 'Facebook':
        provider = new firebase.auth.FacebookAuthProvider();
        console.log(provider, 'fbprovider');
        break;

      case 'Google':
        provider = new firebase.auth.GoogleAuthProvider();
        console.log(provider, 'gprovider');
        break;

      case 'Twitter':
        provider = new firebase.auth.TwitterAuthProvider();
        break;

      default:
        throw new Error('Unsupported SNS' + sns);
    }

    firebase.auth().signInWithRedirect(provider).catch(handleAuthError);
  };

  const handleAuthError = (error: firebase.auth.Error) => {
    console.log(error);
  };

  if (loadingAuthState) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="email"
          value={values.email}
          placeholder="Enter your Email"
          onChange={handleChange}
        />
        <br />
        <br />
        <input
          type="password"
          name="password"
          value={values.password}
          placeholder="Enter your Password"
          onChange={handleChange}
        />
        <br />
        <br />
        <button>Login</button>
        <p>Not logged in yet?</p>
        <button onClick={handleClick}>SignUp</button> <br />
        <br />
      </form>

      <p>Social SignUp</p>
      <button onClick={() => handleSocialClick('Facebook')}>
        SignIn with Facebook
      </button>
      <br />
      <br />
      <button onClick={() => handleSocialClick('Google')}>
        SignIn with Google
      </button>
      <br />
      <br />
      <button onClick={() => handleSocialClick('Twitter')}>
        SignIn with Twitter
      </button>
      <br />
      <br />
    </div>
  );
};

export default Login;
