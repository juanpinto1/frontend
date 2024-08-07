import React, { useContext } from "react";
import { Button, Image } from "react-bootstrap";
import { MarketplaceContext } from "../utils/MarketplaceProvider";
import MyNavbar from "../utils/MyNavbar";
import MyFooter from "../utils/MyFooter";

const Favorites = () => {
  const { userSession, removeFromFavs } = useContext(MarketplaceContext);
  const { favs } = userSession;

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
        <h1>Mis Favoritos</h1>
        {favs.length === 0 ? (
          <p>No tienes eventos en favoritos.</p>
        ) : (
          favs.map((item, index) => (
            <div key={index} className="d-flex align-items-center mb-3">
              <Image
                src={item.img_url}
                rounded
                width={50}
                height={50}
                className="me-3"
              />
              <div className="flex-grow-1">
                <h5>{item.title}</h5>
                <p>{item.description}</p>
              </div>
              <Button
                variant="danger"
                className="ms-3"
                onClick={() => removeFromFavs(item.eventId)}
              >
                Eliminar
              </Button>
            </div>
          ))
        )}
      </div>
      <MyFooter />
    </div>
  );
};

export default Favorites;
