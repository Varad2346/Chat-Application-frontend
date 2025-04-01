import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [roomDataNav, setroomDataNav] = useState([]);
  const [userId, setuserId] = useState([]);

  
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
      const userInfo=decodeToken(storedToken);
      setuserId(userInfo);
    if (storedToken && !isTokenExpired(storedToken)) {
      setAuthToken(storedToken); 
      setIsLoggedIn(true); 
    } else {
      // If token is expired or not found, log out
      setIsLoggedIn(false);
      setAuthToken(null);
      localStorage.removeItem('token');
    }
  }, []);
  
  const roomData=(room)=>{
      setroomDataNav(room);
  }

  const decodeToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1])); 
      return payload;
    } catch (error) {
      console.error("Error decoding token", error);
      return null;
    }
  };
  
  const isTokenExpired = (token) => {
    const decoded = decodeToken(token);
    if (decoded && decoded.exp) {
      const currentTime = Math.floor(Date.now() / 1000); 
      return decoded.exp < currentTime;
    }
    return false;
  };
  
  
  return (
    <AuthContext.Provider value={{ userId,roomDataNav,roomData,isLoggedIn, authToken,setAuthToken,setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
