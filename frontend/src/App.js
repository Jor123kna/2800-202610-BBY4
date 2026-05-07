import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Layout from './components/Layout';

// Pages
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Community from './pages/Community';
import Post from './pages/Post';
import Map from './pages/Map';
import Info from './pages/Info';
import DisasterDetail from './pages/DisasterDetail';
import Profile from './pages/Profile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main app routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/community" element={<Community />} />
          <Route path="/post" element={<Post />} />
          <Route path="/map" element={<Map />} />
          <Route path="/info" element={<Info />} />
          <Route path="/info/:disasterId" element={<DisasterDetail />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Redirect unknown URLs to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;