import { useState } from 'react';

const useDeveloper = () => {
  const [userSession, setUserSession] = useState(null);

  const setDeveloper = (developer) => setUserSession(developer);

  const logOut = () => {
    setUserSession(null);
    window.sessionStorage.removeItem('token');
  };

  return { userSession, setDeveloper, logOut };
};

export default useDeveloper;
