export const login = async (body) => {
  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return await res.json();
  } catch (error) {
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
