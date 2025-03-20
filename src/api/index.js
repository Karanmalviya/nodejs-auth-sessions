import axios from "axios";
import { toast } from "sonner";

export const login = async (body) => {
  try {
    const res = await axios("/api/login", body);
    if (!res.ok) {
      throw new Error(res.statusText || "Something went wrong!");
    }
    const resJson = await res.json();
    toast.success(resJson.message);
    return resJson;
  } catch (error) {
    console.log(error, "llllllllllll");
    toast.error(error.response.data.message);
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
