import React, { createContext, useEffect, useState } from 'react';
import UseAxiosPublic from '../hooks/UseAxiosPublic';
import { jwtDecode } from 'jwt-decode'

export const AuthContext = createContext(null);
const AuthProvider = ({ children }) => {
    const [user, setuser] = useState(null);
    const [loading, setloading] = useState(true);
    const [isAuthenticated, setisAuthenticated] = useState(false);
    const [error, seterror] = useState(null);
    const axiosPublic = UseAxiosPublic()


    const loginUser = async (email, password) => {
        try {
            const res = await axiosPublic.post('login', { email, password });
            if (res.data.success) {
                const token = res.data.jwtToken;
                localStorage.setItem('token', token);
                const decodeUser = jwtDecode(token);
                setuser(decodeUser);
                setisAuthenticated(true);

            }
            return res.data;
        } catch (error) {
            seterror(error);
        } finally {
            setloading(false);
        }
    }
    useEffect(() => {
        const token = localStorage.getItem('token');
        try {
            if (token) {
                const decodeUser = jwtDecode(token);
                setuser(decodeUser);
                setisAuthenticated(true);
            } else {
                localStorage.removeItem('token');
                setuser(null);
                setisAuthenticated(false);

            }
        } catch (error) {
            seterror(error);
        }finally {
            setloading(false);
        }
    }, [])

    const logOutUser = () => {
        localStorage.removeItem('token');
        setuser(null);
        setisAuthenticated(false);
    }
    const authInfo = {
        user,
        loading,
        isAuthenticated,
        error,
        loginUser,
        logOutUser
    }

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;