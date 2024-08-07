import React, { useContext } from "react";
import { Card, Button } from "react-bootstrap";
import { Heart, HeartFill } from 'react-bootstrap-icons';
import { MarketplaceContext } from '../utils/MarketplaceProvider';

const EventCardPublic = ({ 
  title, 
  description, 
  date_event, 
  location, 
  ticket_price, 
  img_url, 
  tickets_available, 
  event_id, 
  isFavorite,
  onAddToCart,
  onToggleFavorite,
  onViewDetails 
}) => {
  const { userSession } = useContext(MarketplaceContext);

  return (
    <Card className="h-100">
      <div className="position-relative">
        <Card.Img variant="top" src={img_url} />
        {userSession.isLoggedIn && (
          <div className="position-absolute top-0 end-0 p-2">
            {isFavorite ? (
              <HeartFill size={30} color="red" onClick={onToggleFavorite} style={{ cursor: 'pointer' }} />
            ) : (
              <Heart size={30} onClick={onToggleFavorite} style={{ cursor: 'pointer' }} />
            )}
          </div>
        )}
      </div>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{description}</Card.Text>
        <Card.Text><strong>Fecha:</strong> {date_event}</Card.Text>
        <Card.Text><strong>Ubicación:</strong> {location}</Card.Text>
        <Card.Text><strong>Precio del Boleto:</strong> {ticket_price} CLP</Card.Text>
        <Card.Text><strong>Boletos Disponibles:</strong> {tickets_available}</Card.Text>
      </Card.Body>
      <Card.Footer className="d-flex justify-content-between">
        <Button variant="primary" onClick={onViewDetails}>Detalles</Button>
        <Button variant="success" onClick={onAddToCart}>Agregar al Carrito</Button>
      </Card.Footer>
    </Card>
  );
};

export default EventCardPublic;
