export const URLBASE = 'http://localhost:3000';

export const ENDPOINT = {
  login: `${URLBASE}/api/profile/login`,
  users: `${URLBASE}/api/profile/registrarse`,
  perfil: `${URLBASE}/api/profile/perfil`,
  eventos: `${URLBASE}/api/events/get-all`, // Obtener todos los eventos
  misEventos: `${URLBASE}/api/profile/events`, // Crear, actualizar y eliminar eventos
};
