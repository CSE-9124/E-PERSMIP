import axios from 'axios';

// Base URL untuk backend API
const BASE_URL = 'http://localhost:8000';

// Membuat instance axios dengan konfigurasi default
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk menambahkan token ke setiap request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor untuk handle response errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired atau tidak valid
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_role');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  // Login function
  login: async (email, password) => {
    try {
      // FastAPI OAuth2PasswordRequestForm expects form data
      const formData = new URLSearchParams();
      formData.append('username', email); // OAuth2PasswordRequestForm uses 'username' field
      formData.append('password', password);

      const response = await api.post('/api/v1/auth/token', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      // Simpan token dan ambil info user
      const { access_token } = response.data;
      localStorage.setItem('access_token', access_token);

      // Get user info
      const userResponse = await api.get('/api/v1/auth/users/me');
      const user = userResponse.data;
      
      // Determine role (you might want to add role field to your User model)
      const role = user.email.toLowerCase().includes('admin') ? 'admin' : 'user';
      localStorage.setItem('user_role', role);

      return { user, role, token: access_token };
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.detail || 'Login failed');
    }
  },

  // Register function
  register: async (name, email, password) => {
    try {
      const response = await api.post('/api/v1/auth/register', {
        name,
        email,
        password,
      });
      return response.data;
    } catch (error) {
      console.error('Register error:', error);
      throw new Error(error.response?.data?.detail || 'Registration failed');
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await api.get('/api/v1/auth/users/me');
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  },

  // Logout function
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_role');
  },
};

// Books API functions (untuk nanti)
export const booksAPI = {
  getAllBooks: async () => {
    try {
      const response = await api.get('/api/v1/books');
      return response.data;
    } catch (error) {
      console.error('Get books error:', error);
      throw error;
    }
  },

  createBook: async (bookData) => {
    try {
      const response = await api.post('/api/v1/books', bookData);
      return response.data;
    } catch (error) {
      console.error('Create book error:', error);
      throw error;
    }
  },

  updateBook: async (bookId, bookData) => {
    try {
      const response = await api.put(`/api/v1/books/${bookId}`, bookData);
      return response.data;
    } catch (error) {
      console.error('Update book error:', error);
      throw error;
    }
  },

  deleteBook: async (bookId) => {
    try {
      const response = await api.delete(`/api/v1/books/${bookId}`);
      return response.data;
    } catch (error) {
      console.error('Delete book error:', error);
      throw error;
    }
  },
};

export default api;
