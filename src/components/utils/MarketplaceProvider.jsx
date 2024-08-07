import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ENDPOINT } from "../../config/constans";

export const MarketplaceContext = createContext();

export const MarketplaceProvider = ({ children }) => {
  const [userSession, setUserSession] = useState(
    localStorage.getItem("session")
      ? JSON.parse(localStorage.getItem("session"))
      : {
          isLoggedIn: false,
          user_id: null,
          username: "",
          email: "",
          profile_picture: "",
          events: [],
          favs: [],
          cart: [],
          tickets: [],
        }
  );
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedSession = localStorage.getItem("session");
    if (token && !userSession.isLoggedIn && storedSession) {
      const sessionData = JSON.parse(storedSession);
      setUserSession({
        isLoggedIn: sessionData.isLoggedIn,
        user_id: sessionData.user_id,
        email: sessionData.email,
        username: sessionData.username,
        profile_picture: sessionData.profile_picture,
        events: sessionData.events,
        favs: sessionData.favs,
        cart: sessionData.cart,
        tickets: sessionData.tickets,
      });
    }
  }, [token, userSession.isLoggedIn, navigate]);

  const logIn = async (email, password) => {
    try {
      const response = await axios.post(`${ENDPOINT.login}`, { email, password });
      const { token, user_id, username, profile_picture } = response.data;

      setUserSession({
        isLoggedIn: true,
        user_id,
        email,
        username,
        profile_picture,
        events: [],
        favs: [],
        cart: [],
        tickets: [],
      });

      localStorage.setItem("token", token);
      localStorage.setItem("session", JSON.stringify({
        isLoggedIn: true,
        user_id,
        email,
        username,
        profile_picture,
        events: [],
        favs: [],
        cart: [],
        tickets: [],
      }));

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
    try {
      await axios.put(
        `${ENDPOINT.perfil}/update/${userSession.user_id}`,
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserSession({
        ...userSession,
        ...updatedData,
      });
      localStorage.setItem("session", JSON.stringify({
        ...userSession,
        ...updatedData,
      }));
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
    }
  };

  const addEvent = async (event) => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !userSession.user_id) return;

      const response = await axios.post(
        `${ENDPOINT.misEventos}/add`,
        { ...event, user_id: userSession.user_id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUserSession((prevSession) => ({
        ...prevSession,
        events: [...prevSession.events, response.data],
      }));
    } catch (error) {
      console.error("Error al agregar evento:", error);
    }
  };

  const updateEvent = async (updatedEvent) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.put(`${ENDPOINT.misEventos}/${updatedEvent.id}`, updatedEvent, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUserSession((prevSession) => ({
        ...prevSession,
        events: prevSession.events.map((event) =>
          event.id === updatedEvent.id ? response.data : event
        ),
      }));
    } catch (error) {
      console.error("Error al actualizar evento:", error);
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await axios.delete(`${ENDPOINT.misEventos}/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUserSession((prevSession) => ({
        ...prevSession,
        events: prevSession.events.filter((event) => event.id !== eventId),
      }));
    } catch (error) {
      console.error("Error al eliminar evento:", error);
    }
  };

  const addFav = (event) => {
    setUserSession((prevSession) => {
      const itemExists = prevSession.favs.find(
        (item) => item.eventId === event.eventId
      );
      if (itemExists) {
        return {
          ...prevSession,
          favs: prevSession.favs.filter(
            (item) => item.eventId !== event.eventId
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
    setUserSession((prevSession) => ({
      ...prevSession,
      tickets: [...prevSession.tickets, ...cartItems],
      cart: [],
    }));
  };

  const removeFromFavs = (eventId) => {
    setUserSession((prevSession) => ({
      ...prevSession,
      favs: prevSession.favs.filter((item) => item.eventId !== eventId),
    }));
  };

  const updateCart = (eventId, quantity) => {
    setUserSession((prevSession) => ({
      ...prevSession,
      cart: prevSession.cart.map((item) =>
        item.eventId === eventId ? { ...item, quantity } : item
      ),
    }));
  };

  const removeFromCart = (eventId) => {
    setUserSession((prevSession) => ({
      ...prevSession,
      cart: prevSession.cart.filter((item) => item.eventId !== eventId),
    }));
  };

  const addToCart = (event) => {
    const numericPrice =
      typeof event.ticketPrice === "string"
        ? parseInt(event.ticketPrice.replace(/\D/g, ""), 10)
        : event.ticketPrice;

    setUserSession((prevSession) => {
      const itemExists = prevSession.cart.find(
        (item) => item.eventId === event.eventId
      );
      if (itemExists) {
        return {
          ...prevSession,
          cart: prevSession.cart.map((item) =>
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
