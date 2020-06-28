import React from 'react';
import './App.css';
import ApplicationRoutes from './routes/ApplicationRoutes';
import ApiProvider from './contexts/ApiProvider';

function App() {
  return (
    <ApiProvider>
      <ApplicationRoutes />
    </ApiProvider>
  );
}

export default App;
