import { cookies } from "next/headers";
import { proxyServerApi } from "./api";
import { AxiosResponse } from "axios";
import { FetchNotesParams, NotesResponse, Note, } from "../../types/note";
import { User } from "../../types/user";

export const fetchNotes = async ({
  page,
  perPage = 12,
  search = '',
  tag,
}: FetchNotesParams): Promise<NotesResponse> => {
  const cookieStore = await cookies();
  const response = await proxyServerApi.get('/notes', {
    params: {
      page,
      perPage,
      ...(search.trim() && { search: search.trim() }),
      ...(tag && { tag }),
    },
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const cookieStore = await cookies();
  const response = await proxyServerApi.get(`/notes/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
   },
  });

  return response.data;
};

export const getMe = async (): Promise<User> => {
  const cookieStore = await cookies();
  const response = await proxyServerApi.get('/users/me', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
   console.log(response.data);
  return response.data;
};

export const checkSession = async (): Promise<AxiosResponse> => {
    const cookieStore = await cookies();
    const response = await proxyServerApi.get("/auth/session", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response;
};