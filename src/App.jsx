import React, { useContext, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/views/Home';
import Events from './components/views/Events';
import EventDetail from './components/views/EventDetail';
import SignUp from './components/views/SignUp';
import LogIn from './components/views/LogIn';
import About from './components/views/About';
import Contact from './components/views/Contact';
import Profile from './components/views/Profile';
import ManageEvents from './components/views/ManageEvents';
import Tickets from './components/views/Tickets';
import TicketDetail from './components/views/TicketDetail';
import Favorites from './components/views/Favorites';
import Cart from './components/views/Cart';
import { MarketplaceContext } from './components/utils/MarketplaceProvider';
import { RouterGuard } from './components/utils/RouterGuard';

    function App() {
        const { userSession, logIn } = useContext(MarketplaceContext);

        useEffect(() => {
          const token = localStorage.getItem("token");
          if (token && !userSession.isLoggedIn) {
            // Llama a logIn con el token para autenticar al usuario.
            logIn(userSession.email, 'dummyPassword'); // Ajusta según el flujo real
          }
        }, [userSession.isLoggedIn, logIn]);
    return (
        <>
            <Routes>
                {/* Seccion Publica */}
                <Route path="/" element={<Home />} />
                <Route path="/events" element={<Events />} />{/*Catalogo de Eventos*/}
                <Route path="/events/:eventId" element={<EventDetail />} />{/*Detalle de un Evento*/}
                <Route path="/signup" element={<SignUp/>} />{/*Registrarse*/}
                <Route path="/login" element={<LogIn/>} />{/*Iniciar Sesion*/}
                <Route path="/about" element={<About />} />{/*Acerca de*/}
                <Route path="/contact" element={<Contact />} />{/*Contacto*/}
                <Route path="/cart" element={<Cart />} />{/*Ver mi carrito y da posibilidad de eliminar un evento del carrito*/}

                {/* Seccion Privada */}
                <Route path="/profile/perfil" element={<RouterGuard isAllowed={userSession.isLoggedIn}><Profile /></RouterGuard>} />
                <Route path="/profile/events" element={<RouterGuard isAllowed={userSession.isLoggedIn}><ManageEvents /></RouterGuard>} />{/*Ver mis eventos, publicar, editar o eliminar un evento*/}
                <Route path="/profile/tickets" element={<RouterGuard isAllowed={userSession.isLoggedIn}><Tickets /></RouterGuard>} />{/*Ver mis tickets comprados*/}
                <Route path="/profile/tickets/:ticketId" element={<RouterGuard isAllowed={userSession.isLoggedIn}><TicketDetail /></RouterGuard>} />{/*Ver el detalle de un ticket comprado*/}
                <Route path="/profile/favorites" element={<RouterGuard isAllowed={userSession.isLoggedIn}><Favorites /></RouterGuard>} />{/*Ver mis favoritos y da posibilidad de eliminar un evento de favoritos*/}
                
            </Routes>
        </>
    );
}

export default App;
