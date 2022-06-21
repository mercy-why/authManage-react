import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/layout";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Role from "@/pages/System/Role";
import Menu from "@/pages/System/Menu";
import User from "@/pages/System/User";
import Organization from "@/pages/System/Organization";
import NotFound from "@/pages/Others/notFound";
import Job from "@/pages/System/Job";
import { UserContext } from "@/context";
import request from "@/request";
import { useState, useEffect, createElement, lazy } from "react";
import * as Icons from "@ant-design/icons";

const uniqueList = (arr) => {
  if (arr?.length === 0) {
    return [];
  }
  const uniButtonObj = {};
  const uniMenusObj = {};
  const uniResourcesObj = {};
  const roles = [];
  for (const item of arr) {
    for (const value of item.menuButtons) {
      if (!uniButtonObj[value.buttonId]) {
        uniButtonObj[value.buttonId] = value;
      }
    }
    for (const value of item.menus) {
      if (!uniMenusObj[value.menuId]) {
        uniMenusObj[value.menuId] = value;
      }
    }
    for (const value of item.resources) {
      if (!uniResourcesObj[value.resourceId]) {
        uniResourcesObj[value.resourceId] = value;
      }
    }
    roles.push(item.role);
  }
  return {
    buttons: Object.values(uniButtonObj),
    menus: Object.values(uniMenusObj),
    resources: Object.values(uniResourcesObj),
    roles,
  };
};

const getLoginUserInfoReq = async (data) => {
  return request({
    url: "/user/getLoginUserInfo",
    data,
  });
};
const loopMenuItem = (menus) => {
  const arr = [];
  const searchOptions = [];
  menus?.forEach((item, i, array) => {
    const {
      menuId,
      menuName,
      menuRouter,
      menuIcon,
      menuParentId,
      menuComponent,
    } = item;
    const newItem = {
      key: menuId,
      name: menuName,
      menuComponent,
      path: menuRouter,
      icon: Icons[menuIcon] && createElement(Icons[menuIcon], {}),
      routes: [],
    };
    if (menuParentId === "0") {
      array.forEach((x) => {
        if (x.menuParentId === menuId) {
          newItem.routes.push({
            key: x.menuId,
            name: x.menuName,
            menuComponent: x.menuComponent,
            path: x.menuRouter,
            icon: Icons[x.menuIcon] && createElement(Icons[x.menuIcon], {}),
          });
          searchOptions.push({
            key: x.menuId,
            value: x.menuRouter,
            label: menuName + " > " + x.menuName,
          });
        }
      });
      arr.push(newItem);
    }
  });
  return {
    routes: arr,
    searchOptions,
  };
};
export default () => {
  const [user, setUser] = useState({});
  const initData = async () => {
    const data = await getLoginUserInfoReq();
    const { menus, buttons, resources, roles } = uniqueList(data.permissions);
    const { routes, searchOptions } = loopMenuItem(menus);
    setUser({
      routes,
      searchOptions,
      buttons,
      resources,
      nickName: data.nickName,
      hasAccess: (code) => {
        const isAdmin = roles.some((x) => x.roleCode === "admin");
        return isAdmin || buttons?.some((x) => x.buttonCode === code);
      },
    });
  };
  useEffect(() => {
    initData();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* <Route path="" element={<Navigate to="home" />} /> */}

            {/* {user.routes?.map((x) => (
              <Route
                key={x.key}
                element={
                  x.menuComponent ? lazy(() => import(x.menuComponent)) : null
                }
                path={x.path}
              >
                {x.routes?.map((item) => (
                  <Route
                    key={item.key}
                    element={
                      item.menuComponent
                        ? lazy(() => import("@/pages/" + item.menuComponent))
                        : null
                    }
                    path={item.path}
                  />
                ))}
              </Route>
            ))} */}
            <Route path="system">
              <Route path="role" element={<Role />}></Route>
              <Route path="menu" element={<Menu />}></Route>
              <Route path="user" element={<User />}></Route>
              <Route path="organization" element={<Organization />}></Route>
              <Route path="job" element={<Job />}></Route>
            </Route>
          </Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </HashRouter>
    </UserContext.Provider>
  );
};
