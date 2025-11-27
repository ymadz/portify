// Authentication Utilities
// Simple session-based authentication with bcrypt

import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

// In-memory session store (for development)
// In production, use Redis or database-backed sessions
const sessions = new Map();

const SESSION_COOKIE_NAME = 'portfolio_session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Hash a password using bcrypt
 * @param {string} password - Plain text password
 * @returns {Promise<string>} - Hashed password
 */
export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Verify a password against a hash
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {Promise<boolean>}
 */
export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

/**
 * Generate a random session token
 * @returns {string}
 */
function generateSessionToken() {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Create a new session for a user
 * @param {number} userId - User ID
 * @param {string} email - User email
 * @param {string} fullName - User full name
 * @returns {string} - Session token
 */
export function createSession(userId, email, fullName) {
  const token = generateSessionToken();
  const expiresAt = Date.now() + SESSION_DURATION;
  
  sessions.set(token, {
    userId,
    email,
    fullName,
    expiresAt,
    createdAt: Date.now(),
  });
  
  return token;
}

/**
 * Get session data from token
 * @param {string} token - Session token
 * @returns {Object|null} - Session data or null if invalid/expired
 */
export function getSession(token) {
  const session = sessions.get(token);
  
  if (!session) {
    return null;
  }
  
  // Check if session has expired
  if (Date.now() > session.expiresAt) {
    sessions.delete(token);
    return null;
  }
  
  return session;
}

/**
 * Delete a session
 * @param {string} token - Session token
 */
export function deleteSession(token) {
  sessions.delete(token);
}

/**
 * Get current user from request cookies
 * @returns {Promise<Object|null>} - User session data or null
 */
export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  
  if (!token) {
    return null;
  }
  
  return getSession(token);
}

/**
 * Set session cookie
 * @param {string} token - Session token
 */
export async function setSessionCookie(token) {
  const cookieStore = await cookies();
  
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION / 1000, // in seconds
    path: '/',
  });
}

/**
 * Clear session cookie
 */
export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Require authentication middleware helper
 * Throws error if user is not authenticated
 * @returns {Promise<Object>} - User session data
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error('Unauthorized');
  }
  
  return user;
}

// Clean up expired sessions periodically (every hour)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [token, session] of sessions.entries()) {
      if (now > session.expiresAt) {
        sessions.delete(token);
      }
    }
  }, 60 * 60 * 1000);
}
