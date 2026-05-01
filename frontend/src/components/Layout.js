import React from 'react';
import { Outlet } from 'react-router-dom';
import TopHeader from './TopHeader';
import BottomNav from './BottomNav';

function Layout({ showBack = false, hideBottomNav = false }) {
  return (
    <div className="app-container">
      <TopHeader showBack={showBack} />

      <main>
        <Outlet />
      </main>

      {!hideBottomNav && <BottomNav />}
    </div>
  );
}

export default Layout;