import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/layout";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Role from "@/pages/System/Role";
import Menu from "@/pages/System/Menu";
import User from "@/pages/System/User";
import Organization from "@/pages/System/Organization";
import NotFound from "@/pages/Others/notFound";
import NoAuth from "@/pages/Others/noAuth";
import Job from "@/pages/System/Job";
import OnlineUser from "@/pages/Monitor/OnlineUser";

export default () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="" element={<Navigate to="home" />} />
          <Route element={<Home />} index path="home" />

          <Route path="role" element={<Role />}></Route>
          <Route path="menu" element={<Menu />}></Route>
          <Route path="user" element={<User />}></Route>
          <Route path="organization" element={<Organization />}></Route>
          <Route path="job" element={<Job />}></Route>

          <Route path="onlineUser" element={<OnlineUser />}></Route>
        </Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="403" element={<NoAuth />}></Route>
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </HashRouter>
  );
};
