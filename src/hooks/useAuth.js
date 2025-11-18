// src/hooks/useAuth.js
import { useContext, useEffect } from 'react';
import AuthContext from '../context/AuthProvider';
import axios from '../api/axios';

const useAuth = () => {
    const { auth, setAuth } = useContext(AuthContext);

    const login = (data) => {
        setAuth({ ...data, isAuthenticated: true, isReady: true });
    };

    const logout = async () => {
        try {
            await axios.post('/auth/logout', {
                method: 'POST',
                credentials: 'include', // sends refreshToken cookie
            });
        } catch (err) {
            console.warn('Logout failed', err);
        } finally {
            setAuth({isAuthenticated: false, isReady: true});
            localStorage.removeItem('accessToken');
        }
    };

    return { auth, login, logout };
};

export default useAuth;