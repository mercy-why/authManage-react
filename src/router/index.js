import { HashRouter, Routes, Route } from "react-router-dom";
import Layout from "@/layout";
import Home from "@/pages/Home";
import Login from "@/pages/Login";

export default () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index  element={<Home />} />
        </Route>
        <Route path="/login" element={<Login />}>
        </Route>
      </Routes>
    </HashRouter>
  );
};
