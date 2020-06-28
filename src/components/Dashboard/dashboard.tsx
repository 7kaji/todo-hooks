import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import firebase from '../../firebase';
import { AuthContext } from '../../contexts/Auth/AuthProvider';
import TodoContextProvider from '../../contexts/Todo/TodoContextProvider';
import TodoForm from '../../components/Todo/TodoForm';
import TodoList from '../../components/Todo/TodoList';
import useFetch from 'use-http';

const Dashboard = () => {
  const { token } = useContext(AuthContext);
  const [userName, setUserName] = useState();
  const { get, response, loading, error } = useFetch();
  const history = useHistory();

  const handleClick = (event: any) => {
    event.preventDefault();

    firebase
      .auth()
      .signOut()
      .then((res) => {
        history.push('/auth/login');
      });
  };

  useEffect(() => {
    currentUser();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function currentUser() {
    const user = await get('/user');
    if (response.ok) setUserName(user.name);
  }

  return (
    <TodoContextProvider>
      <div style={{ textAlign: 'center' }}>
        <h1>Dashboard</h1>
        <h2>Welcome to Dashboard!</h2>
        {error && error.message}
        {loading && 'Loading...'}
        <h3>{userName}</h3>
        <button onClick={handleClick}>Logout</button>
        <hr />
        <h2>Todo</h2>
        <TodoForm />
        <TodoList />
      </div>
    </TodoContextProvider>
  );
};

export default Dashboard;
