import React from "react";
import ProLayout from "@ant-design/pro-layout";
import { Outlet } from "react-router-dom";

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
    title: "demo",
  };
  return (
    <ProLayout {...defaultProps}>
      <Outlet />
    </ProLayout>
  );
}
