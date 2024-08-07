import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import MyNavbar from "../utils/MyNavbar";
import MyFooter from "../utils/MyFooter";
import axios from "axios";
import { ENDPOINT } from "../../config/constans";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(false); // Agregado para mostrar estado de carga
  const navigate = useNavigate();

  useEffect(() => {
    if (isRegistered) {
      navigate("/login");
    }
  }, [isRegistered, navigate]);

  const handleRegister = (e) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      window.alert("Por favor, complete todos los campos obligatorios.");
      return;
    }

    setLoading(true); // Activar el estado de carga

    const userData = {
      username: name,
      email: email,
      password: password,
      profile_picture: photoUrl,
      is_admin: true,
    };

    axios.post(ENDPOINT.users, userData)
      .then(({ data }) => {
        window.alert("Usuario registrado con éxito 😀.");
        console.log("Usuario creado:", data);
        setIsRegistered(true);
        setLoading(false); // Desactivar el estado de carga
      })
      .catch(({ response: { data } }) => {
        console.error(data);
        window.alert(`${data.message} 🙁.`);
        setLoading(false); // Desactivar el estado de carga
      });
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
        <h2>Registrar nuevo usuario</h2>
        <Form onSubmit={handleRegister}>
          <Form.Group controlId="formName">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nombre completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formEmail" className="mt-3">
            <Form.Label>Correo</Form.Label>
            <Form.Control
              type="email"
              placeholder="Ingresar email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formPassword" className="mt-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Ingresar contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formPhoto" className="mt-3">
            <Form.Label>Foto (URL)</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese la URL de su foto"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="mt-4" disabled={loading}>
            {loading ? "Registrando..." : "Registrar"}
          </Button>
        </Form>
      </div>
      <MyFooter />
    </div>
  );
};

export default SignUp;
