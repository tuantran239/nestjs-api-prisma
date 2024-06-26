interface BaseRouter {
  ROOT: string;
  CREATE: string;
  UPDATE: string;
  DELETE: string;
  LIST: string;
  RETRIEVE: string;
}

export const API_URL = '/api';

const USER: BaseRouter = {
  ROOT: `${API_URL}/user`,
  CREATE: '/',
  UPDATE: '/:id',
  LIST: '/',
  RETRIEVE: '/:id',
  DELETE: '/:id',
};

const AUTH = {
  ROOT: `${API_URL}/auth`,
  ME: '/me',
  LOGIN: '/signin',
  REGISTER: '/signup',
  LOGOUT: 'logout',
};

const RouterUrl = {
  USER,
  AUTH,
};

export default RouterUrl;
