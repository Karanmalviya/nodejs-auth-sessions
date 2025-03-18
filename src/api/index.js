import { toast } from "sonner";

export const login = async (body) => {
  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      throw new Error(res.statusText || "Something went wrong!");
    }
    const resJson = await res.json();
    toast.success(resJson.message);
    return resJson;
  } catch (error) {
    toast.error(error.message);
    return error;
  }
};

export const logout = async (body) => {
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
