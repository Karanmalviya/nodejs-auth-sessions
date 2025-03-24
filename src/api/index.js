import axios from "axios";
import { toast } from "sonner";

export const csrfToken = async () => {
  try {
    const res = await axios.get("/api/csrf-token", { withCredentials: true });
    return res.data;
  } catch (error) {
    return error;
  }
};

export const login = async (body, csrf) => {
  try {
    const res = await axios.post("/api/login", body, {
      headers: { "X-CSRF-Token": csrf },
      withCredentials: true,
    });
    toast.success(res.data.message);
    return res.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Login failed");
    return error;
  }
};

export const logout = async (csrf) => {
  try {
    const res = await fetch("/api/logout", {
      method: "POST",
      headers: { "X-CSRF-Token": csrf },
      withCredentials: true,
    });
    return await res.json();
  } catch (error) {
    return error;
  }
};

export const getUser = async () => {
  try {
    const res = await fetch("/api/user", { method: "GET" });
    return await res.json();
  } catch (error) {
    return error;
  }
};
