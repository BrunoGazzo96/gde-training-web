import client from './client';
import type { Routine, RoutineDayForm, UserWithRoutines } from '../types';

interface CreateRoutinePayload {
  name: string;
  days: RoutineDayForm[];
}

export const getRoutines = () =>
  client.get<Routine[]>('/routines').then((r) => r.data);

export const getRoutine = (id: number) =>
  client.get<Routine>(`/routines/${id}`).then((r) => r.data);

export const getUserRoutines = (userId: number) =>
  client.get<Routine[]>(`/routines/user/${userId}`).then((r) => r.data);

export const getAllUsersWithRoutines = () =>
  client.get<UserWithRoutines[]>('/routines/users/all').then((r) => r.data);

export const createRoutine = (data: CreateRoutinePayload) =>
  client.post<Routine>('/routines', data).then((r) => r.data);

export const updateRoutine = (id: number, data: CreateRoutinePayload) =>
  client.put(`/routines/${id}`, data);

export const deleteRoutine = (id: number) =>
  client.delete(`/routines/${id}`);

export const assignRoutine = (routineId: number, userIds: number[]) =>
  client.post(`/routines/${routineId}/assign`, { userIds });

export const unassignRoutine = (routineId: number, userId: number) =>
  client.delete(`/routines/${routineId}/unassign/${userId}`);
