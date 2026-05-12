

// Used on each page to provide user authentication data and functions to the rest of the app.
//  Fetches user profile on mount and whenever the route changes, ensuring that user data is always up-to-date across the app.


import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { API_URL } from '../config';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const location = useLocation();
    const [userData, setUserData] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    const fetchProfile = async () => {
        try {
            const response = await fetch(`${API_URL}/users/profile`, {
                method: 'GET',
                credentials: 'include',
            });

            const data = await response.json();

            if (response.ok) {
                setUserData(data.user);
            } else {
                setUserData(null);
            }
        } catch (error) {
            console.error('Failed to fetch profile:', error);
            setUserData(null);
        } finally {
            setAuthLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [location.pathname]);

    return (
        <AuthContext.Provider value={{ userData, setUserData, authLoading, fetchProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}