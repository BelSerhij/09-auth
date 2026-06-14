import axios from "axios";

export const proxyServerApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + "/api",
  withCredentials: true, 
});