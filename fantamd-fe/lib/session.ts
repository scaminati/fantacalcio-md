"use client";

const TOKEN_KEY = 'jwt_token';

interface JwtPayload {
  exp?: number;
  [key: string]: any;
}

export function saveToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function deleteToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function decodeToken(token: string): JwtPayload | null {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Invalid token format', error);
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded || typeof decoded.exp !== 'number') return true;

  const expiry = decoded.exp * 1000;
  return Date.now() > expiry;
}

export function isTokenValid(): boolean {
  const token = getToken();
  if (!token) return false;

  return !isTokenExpired(token);
}

export function isAuthenticated(): boolean {
  return isTokenValid();
}

export function getUserInfo(): JwtPayload | null {
  const token = getToken();
  if (!token) return null;

  return decodeToken(token);
}