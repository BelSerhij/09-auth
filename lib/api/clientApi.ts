import type { Note, NoteTag } from '../../types/note';
import { proxyServerApi } from "./api";
import { FetchNotesParams } from '../../types/note';
import type { User } from '@/types/user';


export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
  page: number;
  perPage: number;
  totalItems?: number;
}

export interface DeleteNoteResponse {
  note: Note;
  message?: string;
}

interface RawFetchNotesResponse {
  notes?: Note[];
  data?: Note[];
  page?: number;
  perPage?: number;
  totalPages?: number;
  total?: number;
  totalItems?: number;
}

const normalizeFetchNotes = (data: RawFetchNotesResponse): FetchNotesResponse => {
  const notes = data.notes ?? data.data ?? [];

  return {
    notes,
    totalPages: data.totalPages ?? 1,
    page: data.page ?? 1,
    perPage: data.perPage ?? 12,
    totalItems: data.totalItems ?? data.total,
  };
};

export const fetchNotes = async ({
  page,
  perPage = 12,
  search = '',
  tag,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const response = await proxyServerApi.get('/notes', {
    params: {
      page,
      perPage,
      ...(search.trim() && { search: search.trim() }),
      ...(tag && { tag }),
    },
  });

  return normalizeFetchNotes(response.data);
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const res = await proxyServerApi.get(`/notes/${id}`);
  return res.data;
};

export const createNote = async (newTitle: string, newContent: string, newTag: NoteTag): Promise<Note>  => {
  const response = await proxyServerApi.post<Note>('/notes', {
    title: newTitle,
    content: newContent,
    tag: newTag
  });
  return response.data;
};

export const deleteNote = async (id: string): Promise<DeleteNoteResponse> => {
  const response = await proxyServerApi.delete(`/notes/${id}`);
  return response.data;
};

export type RegisterRequest = {
  email: string;
  password: string;
};

export const register = async (data: RegisterRequest) => {
  const response = await proxyServerApi.post<User>('/auth/register', data);
  return response.data;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export const login = async (data: LoginRequest) => {
  const response = await proxyServerApi.post<User>('/auth/login', data);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await proxyServerApi.post('/auth/logout');
};

export const checkSession = async (): Promise<boolean> => {
  try {
    await proxyServerApi.get('/auth/session');
    return true;
  } catch {
    return false;
  }
};

export const getMe = async (): Promise<User> => {
  const response = await proxyServerApi.get('/users/me');
  return response.data;
};  

export const updateMe = async (data: Partial<User>): Promise<User> => {
  const response = await proxyServerApi.patch('/auth/me', data);
  return response.data;
};

export type EditProfileRequest = {
  username: string;
};
export async function editProfile(data: EditProfileRequest) {
  const res = await proxyServerApi.patch<User>("/users/me", data);
  return res.data;
}
