import React from "react";
import { BrowserRouter, Routes as Routers, Route } from "react-router";
import ProtectedRoute from "./components/protectedRoute";
import Login from "./pages/login";
import Registration from "./pages/registration";
import Home from "./pages/home";
import { PublicRoute } from "./components/PublicRoute";
import Chat from "./pages/chat";

export default function Routes() {
  return (
    <BrowserRouter>
      <Routers>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Registration />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/:id" element={<Chat />} />
        </Route>
      </Routers>
    </BrowserRouter>
  );
}
