// lib/auth.js
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

/**
 * Generate JWT token for user
 * @param {Object} user - User object from database
 * @param {string} expiresIn - Token expiration time (default: '1d')
 * @returns {string} JWT token
 */
export function generateToken(user, expiresIn = '1d') {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    username: user.username
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object|null} Decoded token payload or null if invalid
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return null;
  }
}

/**
 * Get token from request headers
 * @param {Request} request - Next.js request object
 * @returns {string|null} Token or null
 */
export function getTokenFromRequest(request) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  return authHeader.substring(7); // Remove 'Bearer ' prefix
}

/**
 * Get current user from request
 * @param {Request} request - Next.js request object
 * @returns {Object|null} User data or null
 */
export function getCurrentUser(request) {
  const token = getTokenFromRequest(request);
  
  if (!token) {
    return null;
  }

  return verifyToken(token);
}

/**
 * Check if user has required role
 * @param {Object} user - User object with role property
 * @param {string|string[]} requiredRole - Required role(s)
 * @returns {boolean} True if user has required role
 */
export function hasRole(user, requiredRole) {
  if (!user || !user.role) {
    return false;
  }

  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(user.role);
  }

  return user.role === requiredRole;
}

/**
 * Middleware to protect API routes
 * @param {Request} request - Next.js request object
 * @param {string|string[]} requiredRole - Required role(s), default: any authenticated user
 * @returns {Object} { user, error } - User object or error response
 */
export function requireAuth(request, requiredRole = null) {
  const user = getCurrentUser(request);

  // Check if user is authenticated
  if (!user) {
    return {
      error: NextResponse.json(
        { error: 'Unauthorized. Please login first.' },
        { status: 401 }
      )
    };
  }

  // Check if user has required role
  if (requiredRole && !hasRole(user, requiredRole)) {
    return {
      error: NextResponse.json(
        { error: 'Forbidden. You do not have permission to access this resource.' },
        { status: 403 }
      )
    };
  }

  return { user };
}

/**
 * Middleware specifically for Super Admin
 * @param {Request} request - Next.js request object
 * @returns {Object} { user, error } - User object or error response
 */
export function requireSuperAdmin(request) {
  return requireAuth(request, 'SUPER_ADMIN');
}

/**
 * Check if user is Super Admin
 * @param {Object} user - User object
 * @returns {boolean} True if user is Super Admin
 */
export function isSuperAdmin(user) {
  return hasRole(user, 'SUPER_ADMIN');
}

/**
 * Hash password using bcrypt
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
export async function hashPassword(password) {
  const bcrypt = require('bcryptjs');
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Verify password against hash
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {Promise<boolean>} True if password matches
 */
export async function verifyPassword(password, hash) {
  const bcrypt = require('bcryptjs');
  return bcrypt.compare(password, hash);
}