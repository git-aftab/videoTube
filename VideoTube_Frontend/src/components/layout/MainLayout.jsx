import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const MainLayout = () => {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[var(--color-background-dark)]">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-black/20 p-6 relative">
          {/* Subtle gradient background element for aesthetic */}
          <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-purple-900/10 to-transparent pointer-events-none -z-10" />
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
