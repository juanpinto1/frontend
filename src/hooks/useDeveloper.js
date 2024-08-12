import { useState, useEffect } from 'react';
import axios from 'axios';
import { ENDPOINT } from '../config/constans';

const useDeveloper = () => {
  const [userSession, setUserSession] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = window.sessionStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get(ENDPOINT.perfil, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const user = response.data.user;
          setUserSession(user);
        } catch (error) {
          console.error('Error fetching user data:', error);
          window.sessionStorage.removeItem('token');
          setUserSession(null);
        }
      }
    };

    fetchUserData();
  }, []);

  const setDeveloper = (developer) => setUserSession(developer);

  const logOut = () => {
    setUserSession(null);
    window.sessionStorage.removeItem('token');
  };

  return { userSession, setDeveloper, logOut };
};

export default useDeveloper;