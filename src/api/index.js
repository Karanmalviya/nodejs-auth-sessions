import axios from "axios";
import { toast } from "sonner";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_API_URL + "/api/v1";

export const csrfToken = async () => {
  try {
    const res = await axios.get("/csrf-token", { withCredentials: true });
    axios.defaults.headers.common["X-CSRF-Token"] = res.data.csrfToken;
    return res.data;
  } catch (error) {
    return error;
  }
};
await csrfToken();
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

export const updatetUser = async (body) => {
  try {
    const res = await axios.put("/user", body);
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getUsers = async () => {
  try {
    const res = await axios.get("/users");
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getFCMToken = async () => {
  try {
    const res = await axios.put("/fcm-token");
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getMessages = async (query) => {
  const { from, to, page, pageSize } = query;
  try {
    const res = await axios.get(
      `/message?from=${from}&to=${to}&page=${page ?? 1}&pageSize=${
        pageSize ?? 10
      }`
    );
    return res.data;
  } catch (error) {
    return error;
  }
};
