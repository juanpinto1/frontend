import React, { useContext, useState, useEffect } from "react";
import { Navbar, Nav, NavDropdown, Container, Row, Col, Image, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { MarketplaceContext } from "../utils/MarketplaceProvider";
import logo from "../../assets/logo.png";
import cartIcon from "../../assets/cart-icon.png";
import axios from "axios";

const MyNavbar = () => {
  const { userSession, logOut } = useContext(MarketplaceContext);
  const cartCount = userSession?.cart?.length || 0;

  const [profileImage, setProfileImage] = useState('/default-profile.png');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfileImage = async () => {
      if (userSession?.profile_picture) {
        try {
          const response = await axios.get(userSession.profile_picture, {
            responseType: 'blob'
          });
          const imageBlob = response.data;
          const imageUrl = URL.createObjectURL(imageBlob);
          setProfileImage(imageUrl);
        } catch (error) {
          console.error('Error al cargar la imagen de perfil:', error);
          setProfileImage('/default-profile.png');
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    loadProfileImage();
  }, [userSession?.profile_picture]);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <Navbar
      bg="white"
      expand="lg"
      style={{ borderBottom: "1px solid #ccc", height: "120px" }}
    >
      <Container fluid>
        <Row className="w-100 align-items-center">
          <Col xs="auto">
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav>
                <NavDropdown title="Menú" id="basic-nav-dropdown">
                  <NavDropdown.Item as={Link} to="/">
                    Home
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/events">
                    Catálogo de eventos
                  </NavDropdown.Item>
                  {!userSession.isLoggedIn && (
                    <>
                      <NavDropdown.Item as={Link} to="/login">
                        Iniciar sesión
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/signup">
                        Registrarme
                      </NavDropdown.Item>
                    </>
                  )}
                  <NavDropdown.Item as={Link} to="/about">
                    Acerca de
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/contact">
                    Contacto
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Col>
          <Col className="text-center">
            <Navbar.Brand as={Link} to="/" className="mx-auto">
              <img
                src={logo}
                alt="Music Logo"
                style={{
                  height: "60px",
                  width: "auto",
                  marginTop: "20px",
                  marginBottom: "10px",
                }}
              />
            </Navbar.Brand>
          </Col>
          <Col
            xs="auto"
            className="d-flex align-items-center justify-content-end"
          >
            {userSession.isLoggedIn ? (
              <>
                <Link to="/cart" className="position-relative me-3">
                  <Image src={cartIcon} roundedCircle width={30} height={30} />
                  {cartCount > 0 && (
                    <Badge
                      bg="danger"
                      className="position-absolute top-0 start-100 translate-middle"
                    >
                      {cartCount}
                    </Badge>
                  )}
                </Link>
                <Image
                  src={profileImage} // Usa profileImage aquí
                  roundedCircle
                  width={40}
                  height={40}
                  className="me-2"
                  alt="Perfil"
                />
                <NavDropdown
                  title={userSession.username}
                  id="user-nav-dropdown"
                  align="end"
                >
                  <NavDropdown.Item as={Link} to="/profile/perfil">
                    Perfil
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={logOut}>
                    Cerrar sesión
                  </NavDropdown.Item>
                </NavDropdown>
                <p>{userSession.profile_picture}</p> {/* Mostrar URL aquí */}
              </>
            ) : (
              <Link to="/cart" className="position-relative me-3">
                <Image src={cartIcon} roundedCircle width={30} height={30} />
                {cartCount > 0 && (
                  <Badge
                    bg="danger"
                    className="position-absolute top-0 start-100 translate-middle"
                  >
                    {cartCount}
                  </Badge>
                )}
              </Link>
            )}
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;



