import { HashRouter, Routes, Route } from "react-router-dom";
import Layout from "@/layout";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Role from "@/pages/System/Role";
import Menu from "@/pages/System/Menu";

export default () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="system">
            <Route path="role" element={<Role />}></Route>
            <Route path="menu" element={<Menu />}></Route>
          </Route>
        </Route>
        <Route path="/login" element={<Login />}></Route>
      </Routes>
    </HashRouter>
  );
};
