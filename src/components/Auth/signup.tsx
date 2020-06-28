import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import firebase from '../../firebase';
import 'firebase/auth';
import { AuthContext } from '../../contexts/Auth/AuthProvider';
import axios from 'axios';

interface FormItems {
  username: string;
  email: string;
  password: string;
}

const SignUp = () => {
  const authContext = useContext(AuthContext);
  const [values, setValues] = useState({
    username: '',
    email: '',
    password: '',
  } as FormItems);

  const history = useHistory();

  const handleClick = () => {
    history.push('/auth/login');
  };

  const handleChange = (event: any) => {
    event.persist();
    setValues((values) => ({
      ...values,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event: any) => {
    event?.preventDefault();
    console.log(values, 'values');
    await firebase
      .auth()
      .createUserWithEmailAndPassword(values.email, values.password)
      .then((userCredential: firebase.auth.UserCredential) => {
        authContext.setUser(userCredential);
      });

    const token = await firebase.auth().currentUser?.getIdToken();
    const res = await axios
      .post(
        `${process.env.REACT_APP_API_HOST}/users`,
        {
          name: values.username,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .catch((err: any) => {
        return err.response;
      });
    console.log(res);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
        />
        <br />
        <br />
        <input
          type="text"
          name="email"
          placeholder="Enter your Email"
          onChange={handleChange}
        />
        <br />
        <br />
        <input
          type="password"
          name="password"
          placeholder="Enter your Password"
          onChange={handleChange}
        />
        <br />
        <br />
        <button type="submit">Sign Up</button>
        <p>Already have account?</p>
        <button onClick={handleClick}>Login</button>
      </form>
    </div>
  );
};

export default SignUp;
