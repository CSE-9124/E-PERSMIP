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
      formData.append('email', email); 
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
      
      // Ambil role langsung dari backend
      const role = user.role;
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
        full_name: name,
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

// Books API functions
export const booksAPI = {
  getAllBooks: async () => {
    try {
      const response = await api.get('/api/v1/books?limit=20');
      return response.data;
    } catch (error) {
      console.error('Get books error:', error);
      throw error;
    }
  },

  getBook: async (bookId) => {
    try {
      const response = await api.get(`/api/v1/books/${bookId}`);
      return response.data;
    } catch (error) {
      console.error('Get book error:', error);
      throw error;
    }
  },

  createBook: async (bookData) => {
    try {
      const formData = new FormData();
      formData.append('title', bookData.title);
      formData.append('description', bookData.description || '');
      formData.append('amount', bookData.amount);
      formData.append('publisher', bookData.publisher || '');
      if (bookData.image) {
        formData.append('image', bookData.image);
      }

      const response = await api.post('/api/v1/books', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Create book error:', error);
      throw error;
    }
  },

  updateBook: async (bookId, bookData) => {
    try {
      const formData = new FormData();
      if (bookData.title) formData.append('title', bookData.title);
      if (bookData.description) formData.append('description', bookData.description);
      if (bookData.amount) formData.append('amount', bookData.amount);
      if (bookData.publisher) formData.append('publisher', bookData.publisher);
      if (bookData.image) formData.append('image', bookData.image);

      const response = await api.put(`/api/v1/books/${bookId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
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

// Reviews API functions
export const reviewsAPI = {
  createReview: async (bookId, reviewData) => {
    try {
      const response = await api.post(`/api/v1/books/${bookId}/reviews`, reviewData);
      return response.data;
    } catch (error) {
      console.error('Create review error:', error);
      throw error;
    }
  },

  getReviewsForBook: async (bookId) => {
    try {
      const response = await api.get(`/api/v1/books/${bookId}/reviews`);
      return response.data;
    } catch (error) {
      console.error('Get reviews error:', error);
      throw error;
    }
  },
};

// Borrows API functions
export const borrowsAPI = {
  borrowBook: async (bookId) => {
    try {
      const response = await api.post('/api/v1/borrows', { book_id: bookId });
      return response.data;
    } catch (error) {
      console.error('Borrow book error:', error);
      throw error;
    }
  },

  returnBook: async (borrowId) => {
    try {
      const response = await api.put(`/api/v1/borrows/${borrowId}/return`);
      return response.data;
    } catch (error) {
      console.error('Return book error:', error);
      throw error;
    }
  },

  getMyBorrows: async () => {
    try {
      const response = await api.get('/api/v1/borrows/me');
      return response.data;
    } catch (error) {
      console.error('Get my borrows error:', error);
      throw error;
    }
  },

  getAllBorrows: async () => {
    try {
      const response = await api.get('/api/v1/borrows/all');
      return response.data;
    } catch (error) {
      console.error('Get all borrows error:', error);
      throw error;
    }
  },

  // Admin functions
  approveBorrow: async (borrowId) => {
    try {
      const response = await api.put(`/api/v1/borrows/${borrowId}/approve`);
      return response.data;
    } catch (error) {
      console.error('Approve borrow error:', error);
      throw error;
    }
  },

  declineBorrow: async (borrowId) => {
    try {
      const response = await api.put(`/api/v1/borrows/${borrowId}/decline`);
      return response.data;
    } catch (error) {
      console.error('Decline borrow error:', error);
      throw error;
    }
  },

  updateBorrowByAdmin: async (borrowId, data) => {
    try {
      const response = await api.put(`/api/v1/borrows/${borrowId}/admin-update`, data);
      return response.data;
    } catch (error) {
      console.error('Update borrow by admin error:', error);
      throw error;
    }
  },
};

// Users API functions (for admin)
export const usersAPI = {
  getAllUsers: async () => {
    try {
      const response = await api.get('/api/v1/auth/users');
      return response.data;
    } catch (error) {
      console.error('Get all users error:', error);
      throw error;
    }
  },

  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`/api/v1/auth/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/api/v1/auth/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    }
  },
};

// Statistics API functions (for admin)
export const statisticsAPI = {
  getSummary: async () => {
    try {
      const response = await api.get('/api/v1/statistics/summary');
      return response.data;
    } catch (error) {
      console.error('Get statistics summary error:', error);
      throw error;
    }
  },

  getBorrowsByMonth: async () => {
    try {
      const response = await api.get('/api/v1/statistics/borrows-by-month');
      return response.data;
    } catch (error) {
      console.error('Get borrows by month error:', error);
      throw error;
    }
  },

  getPopularBooks: async (limit = 5) => {
    try {
      const response = await api.get(`/api/v1/statistics/popular-books?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Get popular books error:', error);
      throw error;
    }
  },
};

export default api;
