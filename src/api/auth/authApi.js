import apiClient from '../apiClient';
import { handleResponse } from 'src/utils/api-utils';

export const getUser = (email, password) => {
  return handleResponse(
    apiClient.post(
      '/user/info',
      {
        email,
        password,
      }
      // { withCredentials: true }
    )
  );
};

export const createUser = (name, lastname, dni, phone, business_name, ruc, email, password) => {
  return handleResponse(
    apiClient.post('/user/', {
      name,
      lastname,
      dni,
      phone,
      business_name,
      ruc,
      email,
      password,
    })
  );
};

export const me = () => {
  return handleResponse(apiClient.get(`/user/me`));
};

export const refreshToken = (accessToken) => {
  return handleResponse(
    apiClient.post(`/auth/refresh-token`, {
      lastToken: accessToken,
    })
  );
};

export const verifyAccount = (user_id, token) => {
  return handleResponse(apiClient.get(`/user/verify/${user_id}/${token}`));
};

export const forgotPassword = (email, redirectUrl) => {
  return handleResponse(
    apiClient.post('/user/requestPasswordReset', {
      email,
      redirectUrl,
    })
  );
};

export const resetPassword = async (userId, resetString, newPassword) => {
  return handleResponse(
    apiClient.post('/user/resetPassword', {
      userId,
      resetString,
      newPassword,
    })
  );
};

export const verifyLink = async (userId, resetString) => {
  return handleResponse(apiClient.get(`/user/verifyLink/${userId}/${resetString}`));
};
