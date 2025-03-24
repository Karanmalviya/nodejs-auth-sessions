import React, { useEffect, useState } from "react";
import { createContext } from "react";
import { csrfToken } from "./api";

export const Context = createContext("");

export default function CSRFContext({ children }) {
  const [csrf, setCsrf] = useState("");

  useEffect(() => {
    const getCSRFToken = async () => {
      const token = await csrfToken();
      setCsrf(token.csrfToken);
    };
    getCSRFToken();
  }, []);

  return <Context.Provider value={csrf}>{children}</Context.Provider>;
}
