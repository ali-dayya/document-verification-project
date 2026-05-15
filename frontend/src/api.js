import axios from "axios";

const RENDER_API_URL = "https://document-verification-backend-s0w2.onrender.com/api";
const envApiUrl = import.meta.env.VITE_API_URL;
const API_URL =
  !envApiUrl || envApiUrl.includes("document-verification-project.onrender.com")
    ? RENDER_API_URL
    : envApiUrl;

export const api = axios.create({
  baseURL: API_URL,
});

export function saveUser(data) {
  localStorage.setItem("token", data.token);
  localStorage.setItem("userId", data.user_id);
  localStorage.setItem("userName", data.full_name);
  localStorage.setItem("email", data.email);
  localStorage.setItem("role", data.role);
}

export function clearUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("userName");
  localStorage.removeItem("email");
  localStorage.removeItem("role");
  localStorage.removeItem("factoryId");
}

export function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Token ${token}` } : {};
}

export function getMessage(error, fallback = "Something went wrong.") {
  const data = error?.response?.data;
  if (typeof data?.message === "string") return data.message;
  if (data?.message && typeof data.message === "object") {
    const firstKey = Object.keys(data.message)[0];
    const firstValue = data.message[firstKey];
    if (Array.isArray(firstValue)) return `${firstKey}: ${firstValue[0]}`;
  }
  return fallback;
}
