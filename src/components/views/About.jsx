import React from "react";
import BackButton from "./backButton"; // Importar el botón de navegación hacia atrás
import MyNavbar from "../utils/MyNavbar";
import MyFooter from "../utils/MyFooter";

export const About = () => {
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
        <h2>Acerca de Nosotros:</h2>
        <p>
          ¡Bienvenidos a Musicalizate! Nuestra misión es unir a los amantes de
          la música organizando y promoviendo eventos musicales. Tanto si eres
          un artista que busca mostrar su talento como si eres un fan ansioso
          por descubrir nueva música, estamos aquí para conectarte con el
          vibrante mundo de la música.
        </p>
        <p>
          En Musicalizate, creemos en el poder de la música para inspirar,
          conectar y transformar. Nuestra plataforma ofrece una manera fácil de
          registrarse para los próximos eventos, explorar nuevos artistas y
          mantenerse actualizado con las últimas tendencias musicales.
        </p>
        <p>
          Únete a nosotros para celebrar la alegría de la música. ¡Vamos a crear
          cultura musical con eventos y momentos inolvidables juntos!
        </p>
        <p>
          <strong>¡TE ESPERAMOS!</strong>
        </p>
        <BackButton /> {/* Agregar el botón de ir hacia atrás */}
      </div>
      <MyFooter />
    </div>
  );
};

export default About;
