import React, { useState, useEffect } from "react";
import { Button, Card, Row, Col } from "react-bootstrap";
import axios from "axios";
import MyNavbar from "../utils/MyNavbar";
import MyFooter from "../utils/MyFooter";
import RegisterEventForm from "../../components/utils/RegisterEventForm";
import { ENDPOINT } from "../../config/constans";
import useDeveloper from "../../hooks/useDeveloper";

const ManageEvents = () => {
  const { userSession } = useDeveloper();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [eventList, setEventList] = useState([]);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !userSession?.user_id) return;

      const response = await axios.post(
        `${ENDPOINT.eventos}/mis-eventos`,
        { email: userSession.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data && Array.isArray(response.data.data)) {
        setEventList(response.data.data);
      } else {
        console.log("Unexpected response format:", response.data);
        setEventList([]);
      }
    } catch (error) {
      console.error("Error al cargar eventos:", error);
      setEventList([]);
    }
  };

  useEffect(() => {
    if (userSession?.user_id) {
      fetchEvents();
    }
  }, [userSession?.user_id]);

  const handleCreateNewEvent = () => {
    setEditEvent(null);
    setShowCreateForm(true);
  };

  const handleEdit = (event) => {
    setEditEvent(event);
    setShowCreateForm(true);
  };

  const handleCreateEvent = async (eventData) => {
    setShowCreateForm(false);
    
    try {
      const token = localStorage.getItem('token');
      if (!token || !userSession?.user_id) return;

      const eventPayload = {
        user_id: userSession.user_id,
        title: eventData.title,
        description: eventData.description,
        date: eventData.date,
        location: eventData.location,
        ticket_price: parseInt(eventData.ticket_price, 10),
        tickets_available: parseInt(eventData.tickets_available, 10),
        img_url: eventData.img_url || "linkpruebafoto"
      };

      // Crear nuevo evento
      const response = await axios.post(`${ENDPOINT.eventos}/add`, eventPayload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setEventList(prevList => [...prevList, response.data.data]);
      setEditEvent(null);
    } catch (error) {
      console.error("Error al crear evento:", error);
    }
  };

  const handleUpdateEvent = async (eventData) => {
    setShowCreateForm(false);
    
    try {
      const token = localStorage.getItem('token');
      if (!token || !userSession?.user_id) return;

      const eventPayload = {
        user_id: userSession.user_id,
        title: eventData.title,
        description: eventData.description,
        date: eventData.date,
        location: eventData.location,
        ticket_price: parseInt(eventData.ticket_price, 10),
        tickets_available: parseInt(eventData.tickets_available, 10),
        img_url: eventData.img_url || "linkpruebafoto"
      };

      // Actualizar evento
      const response = await axios.put(`${ENDPOINT.eventos}/update/${eventData.event_id}`, eventPayload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setEventList(prevList => prevList.map(event => 
        event.event_id === eventData.event_id ? response.data.data : event
      ));
      setEditEvent(null);
    } catch (error) {
      console.error("Error al actualizar evento:", error);
    }
  };

  const handleSave = (eventData) => {
    if (eventData.event_id) {
      handleUpdateEvent(eventData);
    } else {
      handleCreateEvent(eventData);
    }
  };

  const handleDelete = async (eventId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await axios.delete(`${ENDPOINT.eventos}/delete/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setEventList(prevList => prevList.filter(event => event.event_id !== eventId));
    } catch (error) {
      console.error("Error al eliminar evento:", error);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <MyNavbar />
      
      <div className="container mt-5 flex-grow-1">
        <h1>Mis Eventos Publicados</h1>
        <h3>Ver mis eventos, publicar, editar o eliminar un evento</h3>
        {userSession && <p>ID de Usuario: {userSession.user_id}</p>}
        
        <Button variant="primary" className="mb-4" onClick={handleCreateNewEvent}>
          Agregar nuevo evento
        </Button>
        
        {showCreateForm && (
          <RegisterEventForm event={editEvent} onSave={handleSave} />
        )}
        
        {eventList.length === 0 ? (
          <p>No has creado ningún evento aún.</p>
        ) : (
          <Row>
            {eventList.map((event) => (
              <Col key={event.event_id} md={4} className="mb-4">
                <Card>
                  <Card.Img variant="top" src={event.img_url} />
                  <Card.Body>
                    <Card.Title>{event.title}</Card.Title>
                    <Card.Text>{event.description}</Card.Text>
                    <Card.Text>
                      <strong>Fecha:</strong> {new Date(event.date).toLocaleDateString()}
                    </Card.Text>
                    <Card.Text>
                      <strong>Ubicación:</strong> {event.location}
                    </Card.Text>
                    <Card.Text>
                      <strong>Precio del Boleto:</strong> {event.ticket_price} CLP
                    </Card.Text>
                    <Card.Text>
                      <strong>Boletos Disponibles:</strong> {event.tickets_available}
                    </Card.Text>
                    <Button
                      variant="primary"
                      className="me-2"
                      onClick={() => handleEdit(event)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(event.event_id)}
                    >
                      Eliminar
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
        
      </div>
      <MyFooter />
    </div>
  );
};

export default ManageEvents;
