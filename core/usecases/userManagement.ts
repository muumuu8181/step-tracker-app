import type { User } from '../types';

export function createUser(name: string, email: string): User {
  if (!name || !email) {
    throw new Error('Name and email are required');
  }

  return {
    id: Math.random().toString(36).substr(2, 9),
    name,
    email,
    createdAt: new Date()
  };
}