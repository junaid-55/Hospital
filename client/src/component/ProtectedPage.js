import { Fragment } from 'react';
import { Navigate,Route,Routes } from 'react-router-dom';

function ProtectedPage({ children, isAuthenticated }) {
    if (!isAuthenticated) {
      return <Navigate to={window.location.pathname} replace />;
    }
  
    return children;
  }

export default ProtectedPage;