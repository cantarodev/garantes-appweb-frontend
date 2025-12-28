import { getUser, createUser, me, refreshToken } from './authApi';

class AuthApi {
  async signIn(request) {
    const { email, password } = request;

    const { data } = await getUser(email, password);

    const accessToken = data.token;

    return { accessToken };
  }

  async signUp(request) {
    const { name, lastname, dni, phone, business_name, ruc, email, password } = request;
    return await createUser(name, lastname, dni, phone, business_name, ruc, email, password);
  }

  async me() {
    const { data } = await me();

    return {
      user_id: data.user_id,
      avatar: data.avatar,
      email: data.email,
      name: data.name,
      lastname: data.lastname,
      role_id: data.role_id,
    };
  }

  async refreshToken(request) {
    const { accessToken } = request;
    return await refreshToken(accessToken);
  }
}

export const authApi = new AuthApi();
