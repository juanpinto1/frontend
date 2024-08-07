import React, { useContext, useState, useEffect } from "react";
import { Button, Card, Row, Col } from "react-bootstrap";
import axios from "axios";
import { MarketplaceContext } from "../utils/MarketplaceProvider";
import MyNavbar from "../utils/MyNavbar";
import MyFooter from "../utils/MyFooter";
import EventDetail from "./EventDetail";
import { ENDPOINT } from "../../config/constans";

const ManageEvents = () => {
  const { userSession, deleteEvent } = useContext(MarketplaceContext);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editEvent, setEditEvent] = useState({});
  const [eventList, setEventList] = useState([]);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !userSession.user_id) return;
      
      const response = await axios.get(`${ENDPOINT.eventos}?user_id=${userSession.user_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEventList(response.data);
    } catch (error) {
      console.error("Error al cargar eventos:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [userSession.user_id]);

  const handleCreateNewEvent = () => {
    setEditEvent({});
    setShowCreateForm(true);
  };

  const handleEdit = (event) => {
    setEditEvent(event);
    setShowCreateForm(true);
  };

  const handleSave = async (eventData) => {
    setShowCreateForm(false);
    setEditEvent({});

    try {
      const token = localStorage.getItem('token');
      if (!token || !userSession.user_id) return;

      const { user_id } = userSession;
      const eventPayload = { ...eventData, user_id }; // Incluye user_id en el payload

      if (eventData.event_id) {
        // Actualizar evento
        await axios.put(`${ENDPOINT.misEventos}/${eventData.event_id}`, eventPayload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // Crear nuevo evento
        await axios.post(ENDPOINT.misEventos, eventPayload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      // Refrescar la lista de eventos
      fetchEvents();
    } catch (error) {
      console.error("Error al guardar evento:", error);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <MyNavbar />
      <div className="container mt-5 flex-grow-1">
        <h1>Mis Eventos Publicados</h1>
        <h3>Ver mis eventos, publicar, editar o eliminar un evento</h3>
        {eventList.length === 0 ? (
          <>
            <p>No tienes eventos creados.</p>
            <Button variant="primary" onClick={handleCreateNewEvent}>
              Agregar nuevo evento
            </Button>
            {showCreateForm && (
              <EventDetail event={editEvent} onSave={handleSave} />
            )}
          </>
        ) : (
          <>
            <Button variant="primary" className="mb-4" onClick={handleCreateNewEvent}>
              Agregar nuevo evento
            </Button>
            {showCreateForm && (
              <EventDetail event={editEvent} onSave={handleSave} />
            )}
            <Row>
              {eventList.map((event) => (
                <Col key={event.event_id} md={4} className="mb-4">
                  <Card>
                    <Card.Img variant="top" src={event.imgUrl} />
                    <Card.Body>
                      <Card.Title>{event.title}</Card.Title>
                      <Card.Text>{event.description}</Card.Text>
                      <Card.Text>
                        <strong>Fecha:</strong> {new Date(event.dateEvent).toLocaleDateString()}
                      </Card.Text>
                      <Card.Text>
                        <strong>Ubicación:</strong> {event.location}
                      </Card.Text>
                      <Card.Text>
                        <strong>Precio del Boleto:</strong> {event.ticketPrice} CLP
                      </Card.Text>
                      <Card.Text>
                        <strong>Boletos Disponibles:</strong> {event.ticketsAvailable}
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
                        onClick={() => deleteEvent(event.event_id)}
                      >
                        Eliminar
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </>
        )}
      </div>
      <MyFooter />
    </div>
  );
};

export default ManageEvents;
