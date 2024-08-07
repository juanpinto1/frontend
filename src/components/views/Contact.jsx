import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import MyNavbar from "../utils/MyNavbar";
import MyFooter from "../utils/MyFooter";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Name:", name, "Email:", email, "Message:", message);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <MyNavbar />
      <div className="container mt-5" style={{ flex: 1 }}>
        <h2>Solicitud de contacto</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formName">
            <Form.Label>Nombre completo</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingresar nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formEmail">
            <Form.Label>Correo </Form.Label>
            <Form.Control
              type="email"
              placeholder="Ingresar email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formMessage">
            <Form.Label>Mensaje</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="mt-3">
            Enviar
          </Button>
        </Form>
      </div>
      <MyFooter />
    </div>
  );
};

export default Contact;
