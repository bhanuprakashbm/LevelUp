import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const location = useLocation();
  const isDashboard = location.pathname === '/';

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex">
        {!isDashboard && <Sidebar />}
        <main className={`flex-1 ${!isDashboard ? 'ml-64' : ''} pt-16`}>
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;