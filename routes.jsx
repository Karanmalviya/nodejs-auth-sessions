import React from "react";
import { BrowserRouter, Routes as Routers, Route } from "react-router";
import ProtectedRoute from "./src/protectedRoute";
import Login from "./src/pages/login";
import Registration from "./src/pages/registration";
import Home from "./src/pages/home";
export default function Routes() {
  return (
    <BrowserRouter>
      <Routers>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
      </Routers>
    </BrowserRouter>
  );
}
