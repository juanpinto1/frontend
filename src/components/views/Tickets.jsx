import React, { useContext } from "react";
import { Card } from "react-bootstrap";
import MyNavbar from "../utils/MyNavbar";
import MyFooter from "../utils/MyFooter";
import { MarketplaceContext } from "../utils/MarketplaceProvider";

export const Tickets = () => {
  const { userSession } = useContext(MarketplaceContext);
  const { tickets } = userSession;

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <MyNavbar />
      <div className="container mt-5" style={{ flex: 1 }}>
        <h2>Mis tickets</h2>
        {tickets.length === 0 ? (
          <p>No tienes tickets comprados.</p>
        ) : (
          tickets.map((ticket, index) => (
            <Card key={index} className="mb-3">
              <Card.Body>
                <Card.Title>{ticket.title}</Card.Title>
                <Card.Text>{ticket.description}</Card.Text>
                <Card.Text>
                  <strong>Fecha:</strong> {ticket.date_event}
                </Card.Text>
                <Card.Text>
                  <strong>Ubicación:</strong> {ticket.location}
                </Card.Text>
                <Card.Text>
                  <strong>Precio del Boleto:</strong> {ticket.ticket_price} CLP
                </Card.Text>
                <Card.Text>
                  <strong>Cantidad:</strong> {ticket.quantity}
                </Card.Text>
              </Card.Body>
            </Card>
          ))
        )}
      </div>
      <MyFooter />
    </div>
  );
};

export default Tickets;
