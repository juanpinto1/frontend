import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import useDeveloper from "../../hooks/useDeveloper";

const RegisterEventForm = ({ event, onSave }) => {
  const { userSession } = useDeveloper();
  const [eventData, setEventData] = useState({
    title: event?.title || "",
    description: event?.description || "",
    date: event?.date || "",
    location: event?.location || "",
    ticket_price: event?.ticket_price || "",
    tickets_available: event?.tickets_available || "",
    img_url: event?.img_url || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userSession || !userSession.user_id) {
      console.error("User ID no está disponible.");
      window.alert("No se pudo obtener el ID del usuario. Por favor, inicie sesión nuevamente.");
      return;
    }

    try {
      await onSave({
        ...eventData,
        user_id: userSession.user_id,
      });
      setEventData({
        title: "",
        description: "",
        date: "",
        location: "",
        ticket_price: "",
        tickets_available: "",
        img_url: "",
      });
    } catch (error) {
      console.error("Error al agregar evento:", error);
      window.alert("Error al agregar evento");
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
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
          as="textarea"
          name="description"
          value={eventData.description}
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
  <Form.Label>Fecha</Form.Label>
  <Form.Control
    type="datetime-local"
    name="date"
    value={eventData.date ? eventData.date.slice(0, 16) : ''} // Format for datetime-local input
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
        <Form.Label>Precio del Boleto (CLP)</Form.Label>
        <Form.Control
          type="number"
          name="ticket_price"
          value={eventData.ticket_price}
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Boletos Disponibles</Form.Label>
        <Form.Control
          type="number"
          name="tickets_available"
          value={eventData.tickets_available}
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>URL de la Imagen</Form.Label>
        <Form.Control
          type="text"
          name="img_url"
          value={eventData.img_url}
          onChange={handleChange}
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        {event?.event_id ? "Actualizar Evento" : "Agregar Evento"}
      </Button>
    </Form>
  );
};

export default RegisterEventForm;

