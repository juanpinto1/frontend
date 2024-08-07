import React, { useContext } from "react";
import MyNavbar from "../utils/MyNavbar";
import MyFooter from "../utils/MyFooter";
import EventCardPublic from "../utils/EventCardPublic";
import { MarketplaceContext } from "../utils/MarketplaceProvider";
import { useNavigate } from "react-router-dom";

export const simulatedEvents = [
  {
    eventId: 1,
    title: "Concierto de rock",
    description: "Un concierto de rock increíble que no te puedes perder.",
    date_event: "2024-08-15",
    location: "Auditorio Nacional",
    ticket_price: 50000,
    img_url:
      "https://weezevent.com/wp-content/uploads/2018/08/27184514/organiser-un-concert-en-7-etapes.jpg",
    tickets_available: 2,
  },
  {
    eventId: 2,
    title: "Festival de jazz",
    description: "Disfruta de una noche llena de jazz y buena música.",
    date_event: "2024-09-20",
    location: "Teatro Municipal",
    ticket_price: 30000,
    img_url:
      "https://d10j3mvrs1suex.cloudfront.net/s:bzglfiles/u/334566/a827ec7e50074a961e3e84f2272817f59a31fdf7/original/fest-2025-gallery-cover-w.jpg/!!/b%3AW1sicmVzaXplIiw4NTBdLFsibWF4Il0sWyJ3ZSJdXQ%3D%3D/meta%3AeyJzcmNCdWNrZXQiOiJiemdsZmlsZXMifQ%3D%3D.jpg",
    tickets_available: 19,
  },
  {
    eventId: 3,
    title: "Recital de piano",
    description: "Recital de piano con obras clásicas y contemporáneas.",
    date_event: "2024-10-05",
    location: "Sala de Conciertos XYZ",
    ticket_price: 40000,
    img_url:
      "https://c8.alamy.com/comp/2A10G8P/art-logo-of-classical-music-in-the-form-of-an-eye-with-a-piano-and-musician-2A10G8P.jpg",
    tickets_available: 24,
  },
  {
    eventId: 4,
    title: "Concierto de música latina",
    description: "¡No te pierdas este vibrante concierto de música latina!",
    date_event: "2024-11-15",
    location: "Estadio Central",
    ticket_price: 60000,
    img_url:
      "https://downtownlafayette.org/wp-content/uploads/latin-music-fest.jpg",
    tickets_available: 22,
  },
];

const Events = () => {
  const { userSession, addToCart, addFav, removeFromFavs } =
    useContext(MarketplaceContext);
  const navigate = useNavigate();

  const publicEvents = simulatedEvents.filter(
    (event) =>
      !userSession.events.some(
        (userEvent) => userEvent.eventId === event.eventId
      )
  );

  const handleAddToCart = (eventId) => {
    addToCart(eventId);
    navigate("/cart");
  };

  const handleViewDetails = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  const handleToggleFavorite = (event) => {
    const isFavorite = userSession.favs.some(
      (fav) => fav.eventId === event.eventId
    );
    if (isFavorite) {
      removeFromFavs(event.eventId);
    } else {
      addFav(event);
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column">
      <MyNavbar />
      <h1 className="container mt-5">EVENTOS DISPONIBLES</h1>
      <div className="flex-grow-1 d-flex justify-content-center">
        <div className="container my-4">
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
            {publicEvents.map((event) => (
              <div className="col mb-4" key={event.eventId}>
                <EventCardPublic
                  title={event.title}
                  description={event.description}
                  date_event={event.date_event}
                  location={event.location}
                  ticket_price={event.ticket_price}
                  img_url={event.img_url}
                  tickets_available={event.tickets_available}
                  eventId={event.eventId}
                  isFavorite={userSession.favs.some(
                    (fav) => fav.eventId === event.eventId
                  )}
                  onAddToCart={() => handleAddToCart(event)}
                  onToggleFavorite={() => handleToggleFavorite(event)}
                  onViewDetails={() => handleViewDetails(event.eventId)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <MyFooter />
    </div>
  );
};

export default Events;
