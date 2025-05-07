import axios from "axios";
import { toast } from "sonner";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_API_URL + "/api/v1";
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;

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

export const logout = async () => {
  try {
    const res = await axios.post("/logout");
    return res;
  } catch (error) {
    return error;
  }
};

export const getUser = async () => {
  try {
    const res = await axios.get("/user");
    return res.data;
  } catch (error) {
    return error;
  }
};
