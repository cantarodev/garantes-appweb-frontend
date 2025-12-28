export const handleApiError = (error) => {
  console.error('[API Error]: ', error);
  return error.response ? error.response.data : { error: 'Internal server error' };
};
