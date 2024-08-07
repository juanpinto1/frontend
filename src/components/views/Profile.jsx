import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import MyNavbar from "../utils/MyNavbar";
import MyFooter from "../utils/MyFooter";
import { MarketplaceContext } from "../utils/MarketplaceProvider";
import axios from "axios";
import { ENDPOINT } from "../../config/constans";
import useDeveloper from "../../hooks/useDeveloper";



const Profile = () => {
  const { userSession, setDeveloper } = useDeveloper();
  const { updateProfile, logOut } = useContext(MarketplaceContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    profile_picture: "",
  });
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getDeveloperData = async () => {
      const token = window.sessionStorage.getItem('token');

      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(ENDPOINT.perfil, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const user = response.data.user;
        setDeveloper(user);
        setFormData({
          email: user.email,
          username: user.username,
          profile_picture: user.profile_picture
        });
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching developer data:', error);
        window.sessionStorage.removeItem('token');
        setDeveloper(null);
        navigate('/');
      }
    };

    if (isLoading) {
      getDeveloperData();
    }
  }, [navigate, setDeveloper, isLoading]);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!userSession?.user_id) {
      console.error("user_id is not defined");
      window.alert("No se pudo encontrar el ID del usuario.");
      return;
    }

    try {
      const updatedData = { ...formData };
      if (password) {
        updatedData.password = password;
      }

      const response = await axios.put(
        `${ENDPOINT.perfil}/update/${userSession.user_id}`,
        updatedData,
        { headers: { Authorization: `Bearer ${window.sessionStorage.getItem('token')}` } }
      );

      console.log("Usuario modificado:", response.data);

      updateProfile(response.data);
      setDeveloper({
        ...response.data,
        is_admin: true // Asegura que is_admin siempre sea true
      });
      setIsEditing(false);
      window.alert("Usuario actualizado con éxito 😀.");
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      window.alert("Hubo un problema al actualizar el perfil 🙁.");
    }
  };

  if (!userSession) {
    return <div>Cargando...</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <MyNavbar />
      <div className="container mt-5" style={{ flex: 1 }}>
        <h1>Perfil de Usuario</h1>
        <div className="card mb-4">
          <div className="card-body">
            <div className="row mb-3 align-items-center">
              <div className="col-md-3 text-center">
                <img
                  src={formData.profile_picture}
                  alt="profile"
                  className="img-fluid rounded-circle"
                  style={{ maxWidth: "150px", maxHeight: "150px" }}
                />
              </div>
              <div className="col-md-9">
                {isEditing ? (
                  <div className="container">
                    <div className="row justify-content-center">
                      <div className="col-md-8">
                        <form onSubmit={handleSave}>
                          <div className="form-group">
                            <label htmlFor="username">Nombre de Usuario</label>
                            <input
                              type="text"
                              className="form-control"
                              id="username"
                              name="username"
                              value={formData.username}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div className="form-group mt-3">
                            <label htmlFor="email">Correo Electrónico</label>
                            <input
                              type="email"
                              className="form-control"
                              id="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div className="form-group mt-3">
                            <label htmlFor="password">Nueva Contraseña (opcional)</label>
                            <input
                              type="password"
                              className="form-control"
                              id="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                          </div>
                          <div className="form-group mt-3">
                            <label htmlFor="profile_picture">URL de la Foto de Perfil</label>
                            <input
                              type="text"
                              className="form-control"
                              id="profile_picture"
                              name="profile_picture"
                              value={formData.profile_picture}
                              onChange={handleChange}
                            />
                          </div>
                          <button type="submit" className="btn btn-primary mt-3">Guardar Cambios</button>
                          <button type="button" className="btn btn-secondary mt-3 ms-2" onClick={handleEdit}>Cancelar</button>
                        </form>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className='py-5'>
                      <h1>
                        Bienvenido <span className='fw-bold'>{userSession.username}</span>
                      </h1>
                    </div>
                    <p>{userSession.email}</p>
                    <button className="btn btn-secondary" onClick={handleEdit}>
                      Editar Perfil
                    </button>
                    <button className="btn btn-danger ms-3" onClick={logOut}>
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            </div>
            <nav className="nav flex-column">
            <Link to="/profile/events" className="nav-link">crear nuevo</Link>
              <Link to="/events" className="nav-link">Eventos Disponibles</Link>
              <Link to="/profile/favorites" className="nav-link">Favoritos</Link>
              <Link to="/cart" className="nav-link">Carrito</Link>
              <Link to="/profile/tickets" className="nav-link">Tickets Comprados</Link>
            </nav>
          </div>
        </div>
      </div>
      <MyFooter />
    </div>
  );
};

export default Profile;
