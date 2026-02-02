// lib/api/resources.js
// API utility functions for Articles, Events, and Gallery

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// ==================== ARTICLES API ====================

export const articlesAPI = {
  // Get all articles with optional filters
  getAll: async (filters = {}) => {
    const { category, tag, featured, status = 'published', page = 1, limit = 12 } = filters;
    
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      status,
      ...(category && { category }),
      ...(tag && { tag }),
      ...(featured !== undefined && { featured: featured.toString() })
    });

    const response = await fetch(`${API_BASE_URL}/articles?${params}`);
    if (!response.ok) throw new Error('Failed to fetch articles');
    return response.json();
  },

  // Get single article by slug
  getBySlug: async (slug) => {
    const response = await fetch(`${API_BASE_URL}/articles/${slug}`);
    if (!response.ok) throw new Error('Article not found');
    return response.json();
  },

  // Get featured articles
  getFeatured: async (limit = 3) => {
    const response = await fetch(`${API_BASE_URL}/articles/featured?limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch featured articles');
    return response.json();
  },

  // Get related articles
  getRelated: async (articleId, limit = 3) => {
    const response = await fetch(`${API_BASE_URL}/articles/${articleId}/related?limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch related articles');
    return response.json();
  },

  // Create new article (Admin only)
  create: async (data, token) => {
    const response = await fetch(`${API_BASE_URL}/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create article');
    return response.json();
  },

  // Update article (Admin only)
  update: async (id, data, token) => {
    const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update article');
    return response.json();
  },

  // Delete article (Admin only)
  delete: async (id, token) => {
    const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to delete article');
    return response.json();
  },

  // Increment view count
  incrementViews: async (id) => {
    const response = await fetch(`${API_BASE_URL}/articles/${id}/views`, {
      method: 'POST'
    });
    if (!response.ok) throw new Error('Failed to increment views');
    return response.json();
  },

  // Get categories with article counts
  getCategories: async () => {
    const response = await fetch(`${API_BASE_URL}/articles/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  }
};

// ==================== EVENTS API ====================

export const eventsAPI = {
  // Get all events with optional filters
  getAll: async (filters = {}) => {
    const { status, eventType, featured, page = 1, limit = 12 } = filters;
    
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status }),
      ...(eventType && { eventType }),
      ...(featured !== undefined && { featured: featured.toString() })
    });

    const response = await fetch(`${API_BASE_URL}/events?${params}`);
    if (!response.ok) throw new Error('Failed to fetch events');
    return response.json();
  },

  // Get single event by slug
  getBySlug: async (slug) => {
    const response = await fetch(`${API_BASE_URL}/events/${slug}`);
    if (!response.ok) throw new Error('Event not found');
    return response.json();
  },

  // Get upcoming events
  getUpcoming: async (limit = 6) => {
    const response = await fetch(`${API_BASE_URL}/events/upcoming?limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch upcoming events');
    return response.json();
  },

  // Get past events (archive)
  getPast: async (page = 1, limit = 12) => {
    const response = await fetch(`${API_BASE_URL}/events/past?page=${page}&limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch past events');
    return response.json();
  },

  // Register for event
  register: async (eventId, registrationData) => {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(registrationData)
    });
    if (!response.ok) throw new Error('Failed to register for event');
    return response.json();
  },

  // Create new event (Admin only)
  create: async (data, token) => {
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create event');
    return response.json();
  },

  // Update event (Admin only)
  update: async (id, data, token) => {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update event');
    return response.json();
  },

  // Delete event (Admin only)
  delete: async (id, token) => {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to delete event');
    return response.json();
  }
};

// ==================== GALLERY API ====================

export const galleryAPI = {
  // Get all gallery items with optional filters
  getAll: async (filters = {}) => {
    const { category, tag, featured, page = 1, limit = 24 } = filters;
    
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(category && { category }),
      ...(tag && { tag }),
      ...(featured !== undefined && { featured: featured.toString() })
    });

    const response = await fetch(`${API_BASE_URL}/gallery?${params}`);
    if (!response.ok) throw new Error('Failed to fetch gallery items');
    return response.json();
  },

  // Get single gallery item
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/gallery/${id}`);
    if (!response.ok) throw new Error('Gallery item not found');
    return response.json();
  },

  // Get featured gallery items
  getFeatured: async (limit = 6) => {
    const response = await fetch(`${API_BASE_URL}/gallery/featured?limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch featured gallery items');
    return response.json();
  },

  // Get gallery items by event
  getByEvent: async (eventId) => {
    const response = await fetch(`${API_BASE_URL}/gallery/event/${eventId}`);
    if (!response.ok) throw new Error('Failed to fetch gallery items for event');
    return response.json();
  },

  // Upload new gallery item (Admin only)
  upload: async (formData, token) => {
    const response = await fetch(`${API_BASE_URL}/gallery/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData // FormData with image file and metadata
    });
    if (!response.ok) throw new Error('Failed to upload image');
    return response.json();
  },

  // Update gallery item metadata (Admin only)
  update: async (id, data, token) => {
    const response = await fetch(`${API_BASE_URL}/gallery/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update gallery item');
    return response.json();
  },

  // Delete gallery item (Admin only)
  delete: async (id, token) => {
    const response = await fetch(`${API_BASE_URL}/gallery/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to delete gallery item');
    return response.json();
  },

  // Get categories with image counts
  getCategories: async () => {
    const response = await fetch(`${API_BASE_URL}/gallery/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  }
};

// ==================== ADMIN AUTHENTICATION ====================

export const authAPI = {
  // Login
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  },

  // Verify token
  verifyToken: async (token) => {
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Token verification failed');
    return response.json();
  },

  // Logout
  logout: async (token) => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Logout failed');
    return response.json();
  }
};

// ==================== UTILITY FUNCTIONS ====================

// Format date helper
export const formatDate = (dateString, locale = 'id-ID') => {
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString(locale, options);
};

// Format event date range
export const formatEventDateRange = (startDate, endDate, locale = 'id-ID') => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const isSameDay = start.toDateString() === end.toDateString();
  
  if (isSameDay) {
    return formatDate(startDate, locale);
  }
  
  return `${formatDate(startDate, locale)} - ${formatDate(endDate, locale)}`;
};

// Calculate read time from content
export const calculateReadTime = (content) => {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};

// Generate slug from title
export const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};