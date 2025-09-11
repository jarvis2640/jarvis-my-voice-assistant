import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { MobileServices } from "./services/mobileServices";

// Initialize mobile services
MobileServices.initialize();

createRoot(document.getElementById("root")!).render(<App />);
