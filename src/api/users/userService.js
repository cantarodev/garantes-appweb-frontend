import { applyPagination } from 'src/utils/apply-pagination';
import { applySort } from 'src/utils/apply-sort';
import { wait } from 'src/utils/wait';

import {
  getUsers,
  deleteUser,
  deletAllUsers,
  changeStatusUser,
  changeRoleUser,
  downloadUsers,
  updateUser,
} from './userApi';

class UsersApi {
  async getUsers(request = {}) {
    const { filters, page, rowsPerPage, sortBy, sortDir } = request;

    let { data } = await getUsers();
    let count = data.length;

    if (filters) {
      data = data.filter((user) => {
        if (typeof filters.query !== 'undefined' && filters.query !== '') {
          let queryMatched = false;
          const properties = ['email', 'businessName'];

          properties.forEach((property) => {
            if (user[property].toLowerCase().includes(filters.query.toLowerCase())) {
              queryMatched = true;
            }
          });

          if (!queryMatched) {
            return false;
          }
        }

        if (typeof filters.active !== 'undefined') {
          if (user.status !== filters.active) {
            return false;
          }
        }

        if (typeof filters.inactive !== 'undefined') {
          if (user.status !== filters.inactive) {
            return false;
          }
        }

        if (typeof filters.pending !== 'undefined') {
          if (user.status !== filters.pending) {
            return false;
          }
        }

        return true;
      });
      count = data.length;
    }

    if (sortBy && sortDir) {
      data = applySort(data, sortBy, sortDir);
    }

    if (page && rowsPerPage) {
      data = applyPagination(data, page, rowsPerPage);
    }

    return { data, count };
  }

  async deleteUser(request) {
    const { email } = request;
    return deleteUser(email);
  }

  async deletAllUsers(request) {
    const { userIds } = request;
    return deletAllUsers(userIds);
  }

  async changeStatusUser(request) {
    const { email, status } = request;
    return changeStatusUser(email, status);
  }

  async changeRoleUser(request) {
    const { email, role } = request;
    return changeRoleUser(email, role);
  }

  async downloadUsers() {
    await wait(500);
    return downloadUsers();
  }

  async updateUser(request) {
    const { avatar, email, name, lastname, password } = request;
    return await updateUser(avatar, email, name, lastname, password);
  }
}

export const usersApi = new UsersApi();
