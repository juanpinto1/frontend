import React, { useContext } from "react";
import { Button, Form, Image, Alert } from "react-bootstrap";
import { MarketplaceContext } from "../utils/MarketplaceProvider";
import { useNavigate } from "react-router-dom";
import MyNavbar from "../utils/MyNavbar";
import MyFooter from "../utils/MyFooter";
import { useState } from "react";

const Cart = ({ showCart = true }) => {
  const { userSession, updateCart, removeFromCart, buyTickets } =
    useContext(MarketplaceContext);
  const { cart } = userSession;
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);

  const handleQuantityChange = (event, eventId) => {
    const newQuantity = parseInt(event.target.value, 10);
    if (newQuantity >= 1) {
      updateCart(eventId, newQuantity);
    }
  };

  //Función para alertar si se intenta comprar más de 4 tickets de un evento.
  const handleBuyTickets = () => {
    const hasInvalidQuantity = cart.some((item) => item.quantity > 4);
    if (hasInvalidQuantity) {
      setShowAlert(true);
    } else {
      buyTickets(cart);
      navigate("/profile/tickets");
    }
  };

  const total = cart.reduce((acc, item) => {
    const itemTotal = item.ticket_price * item.quantity;
    return acc + itemTotal;
  }, 0);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {showCart && <MyNavbar />}
      <div className="container mt-5" style={{ flex: 1 }}>
        <h1>Carrito de Compras</h1>
        {showAlert && (
          <Alert
            variant="danger"
            onClose={() => setShowAlert(false)}
            dismissible
          >
            No puedes comprar más de cuatro entradas para un mismo evento.
          </Alert>
        )}
        {cart.length === 0 ? (
          <p>No tienes eventos en el carrito.</p>
        ) : (
          cart.map((item, index) => (
            <div key={index} className="d-flex align-items-center mb-3">
              <Image
                src={item.img_url}
                rounded
                width={50}
                height={50}
                className="me-3"
              />
              <div className="flex-grow-1">
                <h5 className="mb-1">{item.title}</h5>
                <p className="mb-1">{item.date_event}</p>
                <p className="mb-1">Precio: {item.ticket_price} CLP</p>
                <Form.Control
                  type="number"
                  min="1"
                  max="10"
                  value={item.quantity}
                  onChange={(event) =>
                    handleQuantityChange(event, item.eventId)
                  }
                  className="w-auto"
                />
              </div>
              <Button
                variant="danger"
                onClick={() => removeFromCart(item.eventId)}
              >
                Eliminar
              </Button>
            </div>
          ))
        )}
        {cart.length > 0 && (
          <>
            <h3>Total: {total} CLP</h3>
            <Button variant="success" onClick={handleBuyTickets}>
              Comprar Tickets
            </Button>
          </>
        )}
      </div>
      {showCart && <MyFooter />}
    </div>
  );
};

export default Cart;
