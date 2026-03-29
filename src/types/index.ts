export type Role = 'admin' | 'athlete';

export interface User {
  id: number;
  role: Role;
  fullName: string;
  email: string;
  birthdate: string;
  isActive: boolean;
  weight: number;
  height: number;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  role: Role;
  username: string;
  userId: number;
}

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface RoutineDay {
  id: number;
  day: DayOfWeek;
  isRest: boolean;
  activityType: string | null;
  description: string | null;
  durationMinutes: number | null;
  notes: string | null;
  videoUrl: string | null;
}

export interface Routine {
  id: number;
  name: string;
  createdAt: string;
  days: RoutineDay[];
}

export interface RoutineDayForm {
  day: DayOfWeek;
  isRest: boolean;
  activityType: string | null;
  description: string | null;
  durationMinutes: number | null;
  notes: string | null;
  videoUrl: string | null;
}

export interface CreateUserForm {
  email: string;
  password: string;
  fullName: string;
  role: Role;
  birthdate: string;
}

export interface UpdateUserForm {
  password: string;
  isActive: boolean;
  weight: number;
  height: number;
  role: Role;
  birthdate: string;
}

export interface UserWithRoutines {
  id: number;
  email: string;
  fullName: string;
  role: Role;
  routines: Routine[];
}
