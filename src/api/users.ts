import client from './client';
import type { User, CreateUserForm, UpdateUserForm } from '../types';

export const getUsers = () =>
  client.get<User[]>('/users').then((r) => r.data);

export const getUser = (id: number) =>
  client.get<User>(`/users/${id}`).then((r) => r.data);

export const createUser = (data: CreateUserForm) =>
  client.post<User>('/users', data).then((r) => r.data);

export const updateUser = (id: number, data: UpdateUserForm) =>
  client.put(`/users/${id}`, data);

export const deleteUser = (id: number) =>
  client.delete(`/users/${id}`);
