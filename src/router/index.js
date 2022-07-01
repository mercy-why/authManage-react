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
import Profile from "@/pages/System/Profile";
import OnlineUser from "@/pages/Monitor/OnlineUser";
import CacheMonitoring from "@/pages/Monitor/CacheMonitoring";

export default () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route element={<Home />} index path="home" />

          <Route path="role" element={<Role />}></Route>
          <Route path="menu" element={<Menu />}></Route>
          <Route path="user" element={<User />}></Route>
          <Route path="organization" element={<Organization />}></Route>
          <Route path="job" element={<Job />}></Route>
          <Route path="profile" element={<Profile />}></Route>

          <Route path="onlineUser" element={<OnlineUser />}></Route>
          <Route path="cacheMonitoring" element={<CacheMonitoring />}></Route>
        </Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="403" element={<NoAuth />}></Route>
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </HashRouter>
  );
};
