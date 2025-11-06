import axios from "axios";

// create axios instance
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_SERVER_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});