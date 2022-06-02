import { useState, createElement } from "react";
import ProLayout from "@ant-design/pro-layout";
import { Outlet } from "react-router-dom";
import { getLoginUserInfoReq } from "./services";
import { Avatar, Space } from "antd";
import { UserOutlined } from "@ant-design/icons";
import * as Icons from "@ant-design/icons";

export default function Layout() {
  const defaultProps = {
    fixSiderbar: true,
    navTheme: "light",
    layout: "side",
    contentWidth: "Fluid",
    headerHeight: 48,
    // splitMenus: false,
    fixedHeader: true,
    title: "权限管理系统",
  };

  const uniqueList = (arr) => {
    for (const item of arr) {
      const uniButtonObj = {};
      for (const value of item.menuButtons) {
        if (!uniButtonObj[value.buttonId]) {
          uniButtonObj[value.buttonId] = value;
        }
      }
      const uniMenusObj = {};
      for (const value of item.menus) {
        if (!uniMenusObj[value.menuId]) {
          uniMenusObj[value.menuId] = value;
        }
      }
      const uniResourcesObj = {};
      for (const value of item.resources) {
        if (!uniResourcesObj[value.roleId]) {
          uniResourcesObj[value.roleId] = value;
        }
      }

      return {
        buttons: Object.values(uniButtonObj),
        menus: Object.values(uniMenusObj),
        resources: Object.values(uniResourcesObj),
      };
    }
  };

  const loopMenuItem = (menus) =>
    menus.map(({ menuId, menuName, menuRouter, icon, children }) => ({
      key: menuId,
      name: menuName,
      path: menuRouter,
      icon: icon && createElement(Icons[icon], {}),
      routes: children && loopMenuItem(children),
    }));

  const renderHeader = () => {
    return (
      <Space>
        <Avatar shape="square" size="small" icon={<UserOutlined />} />
        <span>{userInfo.nickName}</span>
      </Space>
    );
  };

  const [userInfo, setUserInfo] = useState({});
  return (
    <ProLayout
      {...defaultProps}
      menu={{
        request: async () => {
          const data = await getLoginUserInfoReq();
          const { menus } = uniqueList(data.permissions);
          setUserInfo(data);
          return loopMenuItem(menus);
        },
      }}
      rightContentRender={renderHeader}
    >
      <Outlet />
    </ProLayout>
  );
}
