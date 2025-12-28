export const handleResponse = async (promise) => {
  try {
    const response = await promise;
    return response.data || response;
  } catch (error) {
    if (error?.response?.data) {
      console.error('API Error:', error);
      throw new Error(error?.response.data.message || error?.message);
    }
  }
};
