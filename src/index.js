import { createRoot } from "react-dom/client";
import Router from "@/router";
import "@/assets/css/global.less";

const root = createRoot(document.getElementById("root"));

root.render(<Router />);
