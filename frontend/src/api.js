import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

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
