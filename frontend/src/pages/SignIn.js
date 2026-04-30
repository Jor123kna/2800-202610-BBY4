import React from 'react';

function SignIn() {
  return (
    <div style={{ padding: '50px', fontFamily: 'sans-serif' }}>
      <h2>Sign In</h2>
      <form style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
        <input type="email" placeholder="Email" style={{ marginBottom: '10px', padding: '8px' }} />
        <input type="password" placeholder="Password" style={{ marginBottom: '10px', padding: '8px' }} />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#007BFF', color: 'white', border: 'none', cursor: 'pointer' }}>
          Sign In
        </button>
      </form>
    </div>
  );
}

export default SignIn;