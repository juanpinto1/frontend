import React from 'react';
import useDeveloper from './path/to/useDeveloper';
import ManageEvents from './path/to/ManageEvents';

const App = () => {
  const { userSession, setDeveloper, logOut } = useDeveloper();

  // Simulación de iniciar sesión para propósitos de ejemplo
  const login = () => {
    const mockUserSession = { user_id: '12345', email: 'example@example.com' };
    setDeveloper(mockUserSession);
    window.sessionStorage.setItem('token', 'your-token');
  };

  // Llamar login cuando se necesite, por ejemplo, en un botón de login
  // login();

  return (
    <div>
      <ManageEvents userSession={userSession} />
    </div>
  );
};