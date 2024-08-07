import React, { useState, useContext } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import { MarketplaceContext } from "../utils/MarketplaceProvider";
import { ENDPOINT } from "../../config/constans";

const RegisterEventForm = ({ onSave }) => {
  const { userSession } = useContext(MarketplaceContext);
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    dateEvent: "",
    location: "",
    ticketPrice: 0,
    imgUrl: "",
    ticketsAvailable: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({
      ...eventData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Hacer una llamada a la API para registrar el evento
    axios.post(`${ENDPOINT}/api/profile/events/add`, eventData, {
      headers: { Authorization: `Bearer ${userSession.token}` }
    })
    .then(response => {
      // Actualizar el estado global si la llamada a la API es exitosa
      onSave(response.data);
      setEventData({
        title: "",
        description: "",
        dateEvent: "",
        location: "",
        ticketPrice: 0,
        imgUrl: "",
        ticketsAvailable: 0,
      });
    })
    .catch(error => {
      console.error("Error al registrar el evento:", error);
      // Puedes manejar el error mostrando un mensaje al usuario
    });
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-4">
      <h3>Registrar Nuevo Evento</h3>
      <Form.Group className="mb-3">
        <Form.Label>Título</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={eventData.title}
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Descripción</Form.Label>
        <Form.Control
          type="text"
          name="description"
          value={eventData.description}
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Fecha del Evento</Form.Label>
        <Form.Control
          type="date"
          name="dateEvent"
          value={eventData.dateEvent}
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Ubicación</Form.Label>
        <Form.Control
          type="text"
          name="location"
          value={eventData.location}
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Precio del Boleto</Form.Label>
        <Form.Control
          type="number"
          name="ticketPrice"
          value={eventData.ticketPrice}
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>URL de la Imadasdagen</Form.Label>
        <Form.Control
          type="text"
          name="imgUrl"
          value={eventData.imgUrl}
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Boletos Disponibles</Form.Label>
        <Form.Control
          type="number"
          name="ticketsAvailable"
          value={eventData.ticketsAvailable}
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Guardar Evento
      </Button>
    </Form>
  );
};

export default RegisterEventForm;