import CSRFContext from "./context";
import Routes from "./routes";

export default function App() {
  return (
    <CSRFContext>
      <Routes />
    </CSRFContext>
  );
}
