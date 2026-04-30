import React, { useState } from 'react';
import SignIn from './pages/SignIn';
import Signup from './pages/SignUp';

function App() {
  const [showSignIn, setShowSignIn] = useState(true);

  return (
    <div>
      {/* Temporary Navigation */}
      <div style={{ padding: '20px', backgroundColor: '#f0f0f0' }}>
        <button onClick={() => setShowSignIn(true)} style={{ marginRight: '10px', cursor: 'pointer' }}>
          Sign In
        </button>
        <button onClick={() => setShowSignIn(false)} style={{ cursor: 'pointer' }}>
          Sign Up
        </button>
      </div>
      <hr style={{ margin: 0 }} />

      {/* Render selected page*/}
      {showSignIn ? <SignIn /> : <Signup />}
    </div>
  );
}

export default App;