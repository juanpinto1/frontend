import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ENDPOINT } from "../../config/constans";

export const MarketplaceContext = createContext();

export const MarketplaceProvider = ({ children }) => {
  const [userSession, setUserSession] = useState(() => {
    const sessionData = localStorage.getItem("session");
    return sessionData ? JSON.parse(sessionData) : {
      isLoggedIn: false,
      user_id: null,
      username: "",
      email: "",
      profile_picture: "",
      events: [],
      favs: [],
      cart: [],
      tickets: [],
    };
  });

  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const navigate = useNavigate();

  useEffect(() => {
    if (token && !userSession.isLoggedIn) {
      const storedSession = localStorage.getItem("session");
      if (storedSession) {
        setUserSession(JSON.parse(storedSession));
      }
    }
    console.log(userSession)
  }, [token, userSession.isLoggedIn]);

  const isAuthenticated = () => userSession.isLoggedIn && token;

  const logIn = async (email, password) => {
    try {
      const response = await axios.post(ENDPOINT.login, { email, password });
      const { token, user_id, username, profile_picture } = response.data;

      const sessionData = {
        isLoggedIn: true,
        user_id,
        email,
        username,
        profile_picture,
        events: [],
        favs: [],
        cart: [],
        tickets: [],
      };

      setUserSession(sessionData);
      localStorage.setItem("token", token);
      localStorage.setItem("session", JSON.stringify(sessionData));

      setToken(token);
      navigate("/profile/perfil");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      window.alert("Email o contraseña incorrectos");
    }
  };

  const logOut = () => {
    setUserSession({
      isLoggedIn: false,
      user_id: null,
      username: "",
      email: "",
      profile_picture: "",
      events: [],
      favs: [],
      cart: [],
      tickets: [],
    });
    localStorage.removeItem("token");
    localStorage.removeItem("session");
    setToken(null);
    navigate("/");
  };

  const updateProfile = async (updatedData) => {
    if (!isAuthenticated()) return;

    try {
      await axios.put(
        `${ENDPOINT.perfil}/update/${userSession.user_id}`,
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserSession(prevSession => ({
        ...prevSession,
        ...updatedData,
      }));
      localStorage.setItem("session", JSON.stringify({
        ...userSession,
        ...updatedData,
      }));
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
    }
  };

  const addEvent = async (event) => {
    if (!isAuthenticated()) return;

    try {
      const response = await axios.post(
        `${ENDPOINT.eventos}/add`,
        { ...event, user_id: userSession.user_id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUserSession(prevSession => ({
        ...prevSession,
        events: [...prevSession.events, response.data],
      }));
    } catch (error) {
      console.error("Error al agregar evento:", error);
    }
  };

  const updateEvent = async (updatedEvent) => {
    if (!isAuthenticated()) return;

    try {
      const response = await axios.put(`${ENDPOINT.eventos}/update/${updatedEvent.id}`, updatedEvent, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUserSession(prevSession => ({
        ...prevSession,
        events: prevSession.events.map(event =>
          event.id === updatedEvent.id ? response.data : event
        ),
      }));
    } catch (error) {
      console.error("Error al actualizar evento:", error);
    }
  };

  const deleteEvent = async (eventId) => {
    if (!isAuthenticated()) return;

    try {
      await axios.delete(`${ENDPOINT.eventos}/delete/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUserSession(prevSession => ({
        ...prevSession,
        events: prevSession.events.filter(event => event.id !== eventId),
      }));
    } catch (error) {
      console.error("Error al eliminar evento:", error);
    }
  };

  const addFav = (event) => {
    setUserSession(prevSession => {
      const itemExists = prevSession.favs.find(
        item => item.eventId === event.eventId
      );
      if (itemExists) {
        return {
          ...prevSession,
          favs: prevSession.favs.filter(
            item => item.eventId !== event.eventId
          ),
        };
      } else {
        return {
          ...prevSession,
          favs: [...prevSession.favs, { ...event }],
        };
      }
    });
  };

  const buyTickets = (cartItems) => {
    setUserSession(prevSession => ({
      ...prevSession,
      tickets: [...prevSession.tickets, ...cartItems],
      cart: [],
    }));
  };

  const removeFromFavs = (eventId) => {
    setUserSession(prevSession => ({
      ...prevSession,
      favs: prevSession.favs.filter(item => item.eventId !== eventId),
    }));
  };

  const updateCart = (eventId, quantity) => {
    setUserSession(prevSession => ({
      ...prevSession,
      cart: prevSession.cart.map(item =>
        item.eventId === eventId ? { ...item, quantity } : item
      ),
    }));
  };

  const removeFromCart = (eventId) => {
    setUserSession(prevSession => ({
      ...prevSession,
      cart: prevSession.cart.filter(item => item.eventId !== eventId),
    }));
  };

  const addToCart = (event) => {
    const numericPrice =
      typeof event.ticketPrice === "string"
        ? parseInt(event.ticketPrice.replace(/\D/g, ""), 10)
        : event.ticketPrice;

    setUserSession(prevSession => {
      const itemExists = prevSession.cart.find(
        item => item.eventId === event.eventId
      );
      if (itemExists) {
        return {
          ...prevSession,
          cart: prevSession.cart.map(item =>
            item.eventId === event.eventId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      } else {
        return {
          ...prevSession,
          cart: [
            ...prevSession.cart,
            { ...event, ticketPrice: numericPrice, quantity: 1 },
          ],
        };
      }
    });
  };

  return (
    <MarketplaceContext.Provider
      value={{
        userSession,
        logIn,
        logOut,
        updateProfile,
        addFav,
        removeFromFavs,
        addEvent,
        updateEvent,
        deleteEvent,
        updateCart,
        removeFromCart,
        addToCart,
        buyTickets
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};
