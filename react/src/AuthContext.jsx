import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({ isAuthenticated: false, token: null });

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            setAuth({ isAuthenticated: true, token: token });
        }
    }, []);
    
    useEffect(() => {
        if (auth.token) {
            localStorage.setItem('jwtToken', auth.token);
        }
    }, [auth]);

    const login = (token) => {
        setAuth({ isAuthenticated: true, token });
    };

    const logout = () => {
        localStorage.removeItem('jwtToken');
        setAuth({ isAuthenticated: false, token: null });
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};