import apiClient from '../apiClient';
import { handleResponse } from 'src/utils/api-utils';

export const getUsers = () => {
  return handleResponse(apiClient.get(`/user`));
};

export const deleteUser = (email) => {
  return handleResponse(apiClient.delete(`/user/${email}`));
};

export const deletAllUsers = (userIds) => {
  return handleResponse(apiClient.delete(`/user/deleteAll/${userIds}`));
};

export const changeStatusUser = (email, status) => {
  return handleResponse(apiClient.get(`/user/changeStatus/${email}/${status}`));
};

export const changeRoleUser = (email, role) => {
  return handleResponse(apiClient.get(`/user/changeRole/${email}/${role}`));
};

export const downloadUsers = () => {
  return handleResponse(apiClient.get(`/user/downloadUsers`));
};

export const updateUser = (avatar, email, name, lastname, password) => {
  return handleResponse(
    apiClient.put('/user/', {
      avatar,
      email,
      name,
      lastname,
      password,
    })
  );
};
