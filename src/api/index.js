import axios from "axios";
import { toast } from "sonner";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "/api/v1";

export const csrfToken = async () => {
  try {
    const res = await axios.get("/csrf-token", { withCredentials: true });
    axios.defaults.headers.common["X-CSRF-Token"] = res.data.csrfToken;
    return res.data;
  } catch (error) {
    return error;
  }
};

export const login = async (body) => {
  try {
    const res = await axios.post("/login", body);
    toast.success(res.data.message);
    return res.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Login failed");
    return error;
  }
};

export const logout = async (csrf) => {
  try {
    const res = await fetch("/logout", {
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
    const res = await fetch("/user", { method: "GET" });
    return await res.json();
  } catch (error) {
    return error;
  }
};
