import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import Login from "./pages/login";
import Registration from "./pages/registration";
import Routes from "../routes";

function App() {
  const [count, setCount] = useState(0);

  return <Routes />;
}

export default App;
