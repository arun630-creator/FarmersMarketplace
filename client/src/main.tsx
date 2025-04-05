import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add inter font to body
document.body.classList.add("font-body", "text-neutral-700");

createRoot(document.getElementById("root")!).render(<App />);
