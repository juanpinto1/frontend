import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const BackButton = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Navega a la página anterior en la historia de navegación
  };

  return (
    <Button variant="secondary" onClick={handleGoBack} className="mt-3">
      Volver
    </Button>
  );
};

export default BackButton;