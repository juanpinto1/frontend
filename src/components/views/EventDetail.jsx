import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import { ENDPOINT } from "../../config/constans";

const EventDetail = ({ event, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    ticketPrice: "",
    ticketsAvailable: "",
    imgUrl: "",
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || "",
        description: event.description || "",
        date: event.dateEvent ? new Date(event.dateEvent).toISOString().split('T')[0] : "",
        location: event.location || "",
        ticketPrice: event.ticketPrice || "",
        ticketsAvailable: event.ticketsAvailable || "",
        imgUrl: event.imgUrl || "",
      });
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData); // Pasar datos del formulario a la función onSave
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formTitle">
        <Form.Label>Título</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group controlId="formDescription">
        <Form.Label>Descripción</Form.Label>
        <Form.Control
          as="textarea"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group controlId="formDateEvent">
        <Form.Label>Fecha</Form.Label>
        <Form.Control
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group controlId="formLocation">
        <Form.Label>Ubicación</Form.Label>
        <Form.Control
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group controlId="formTicketPrice">
        <Form.Label>Precio del Boleto</Form.Label>
        <Form.Control
          type="number"
          name="ticketPrice"
          value={formData.ticketPrice}
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group controlId="formTicketsAvailable">
        <Form.Label>Boletos Disponibles</Form.Label>
        <Form.Control
          type="number"
          name="ticketsAvailable"
          value={formData.ticketsAvailable}
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group controlId="formImgUrl">
        <Form.Label>URL de la Imagen</Form.Label>
        <Form.Control
          type="text"
          name="imgUrl"
          value={formData.imgUrl}
          onChange={handleChange}
        />
      </Form.Group>
      <Button variant="primary" type="submit" className="mt-3">
        Guardar Evento
      </Button>
    </Form>
  );
};

export default EventDetail;
