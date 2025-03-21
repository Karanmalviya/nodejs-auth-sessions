import axios from "axios";
import { toast } from "sonner";

export const login = async (body) => {
  try {
    const res = await axios.post("/api/login", body);
    toast.success(res.data.message);
    return res.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Login failed");
    return error;
  }
};

export const csrfToken = async (body) => {
  try {
    const res = await axios.get("/api/csrf-token", body);
    return res.data;
  } catch (error) {
    return error;
  }
};
export const logout = async () => {
  try {
    const res = await fetch("/api/logout", {
      method: "POST",
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
