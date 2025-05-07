import { useContext, useEffect, useState } from "react";
import { getUser } from "../api";
import { Context } from "../context";

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(true);
  const csrfToken = useContext(Context);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await getUser(csrfToken);
        setIsLoggedIn(res.success);
        setData(res.data);
      } catch (error) {
        console.error("Authentication check failed:", error);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { isLoggedIn, isLoading, data };
}
