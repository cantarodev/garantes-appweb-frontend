import toast from 'react-hot-toast';

// Función para manejar el error 429 (demasiadas peticiones)
export const handleRateLimitError = (error) => {
  localStorage.removeItem('accessToken');
  window.location.href = '/';
  toast.error(error.response.data.message, { duration: 5000 });
};

// Función para manejar el error 401 (token expirado o inválido)
export const handleUnauthorizedError = () => {
  localStorage.removeItem('accessToken');
  window.location.href = '/';
  toast.error('Token expirado o no válido. Redirigiendo a login...', {
    duration: 5000,
  });
};

// Función para manejar otros errores del servidor
export const handleServerError = (error) => {
  toast.error(error.response.data.message || 'Error desconocido', {
    duration: 5000,
  });
};

// Función para manejar errores de red
export const handleNetworkError = (error) => {
  toast.error('Error de red o del servidor: ' + error.message, {
    duration: 5000,
  });
};
