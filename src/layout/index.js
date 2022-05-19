import React from "react";
import ProLayout from "@ant-design/pro-layout";
import { Outlet } from "react-router-dom";
import { getList } from "@/pages/System/Menu/services";

export default function Layout() {
  const defaultProps = {
    fixSiderbar: true,
    navTheme: "light",
    layout: "side",
    contentWidth: "Fluid",
    headerHeight: 48,
    primaryColor: "red",
    splitMenus: false,
    fixedHeader: true,
    title: "权限管理系统",
  };

  const loopMenuItem = (menus) =>
    menus.map(({ menuName, menuRouter, icon, children }) => ({
      name: menuName,
      path: menuRouter,
      routes: children && loopMenuItem(children),
    }));
  return (
    <ProLayout
      {...defaultProps}
      menu={{
        request: async () => {
          const data = await getList();
          return loopMenuItem(data);
        },
      }}
    >
      <Outlet />
    </ProLayout>
  );
}
