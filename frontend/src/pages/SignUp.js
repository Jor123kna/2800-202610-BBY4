import React, { useState } from 'react';

function Signup() {
  return (
    <div style={{ padding: '50px', fontFamily: 'sans-serif' }}>
      <h2>Sign Up</h2>
      <form style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
        <input type="email" placeholder="Email" style={{ marginBottom: '10px', padding: '8px' }} />
        <input type="password" placeholder="Password" style={{ marginBottom: '10px', padding: '8px' }} />
        
        <button type="submit" style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default Signup;