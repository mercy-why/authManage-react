import { useState, createElement } from "react";
import ProLayout from "@ant-design/pro-layout";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
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
    fixedHeader: true,
    title: "权限管理系统",
  };
  const navigate = useNavigate();
  const uniqueList = (arr) => {
    if (arr?.length === 0) {
      return [];
    }
    const uniButtonObj = {};
    const uniMenusObj = {};
    const uniResourcesObj = {};
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
        if (!uniResourcesObj[value.roleId]) {
          uniResourcesObj[value.roleId] = value;
        }
      }
    }
    return {
      buttons: Object.values(uniButtonObj),
      menus: Object.values(uniMenusObj),
      resources: Object.values(uniResourcesObj),
    };
  };

  const loopMenuItem = (menus) => {
    const arr = [];
    menus.forEach((item, i, array) => {
      const { menuId, menuName, menuRouter, icon, menuParentId } = item;
      const newItem = {
        key: menuId,
        name: menuName,
        path: menuRouter,
        icon: icon && createElement(Icons[icon], {}),
        routes: [],
      };
      if (menuParentId === "0") {
        array.forEach((x) => {
          if (x.menuParentId === menuId) {
            newItem.routes.push({
              key: x.menuId,
              name: x.menuName,
              path: x.menuRouter,
              icon: x.icon && createElement(Icons[x.icon], {}),
            });
          }
        });
        arr.push(newItem);
      }
    });
    return arr;
  };
  const renderHeader = () => {
    return (
      <Space>
        <Avatar shape="square" size="small" icon={<UserOutlined />} />
        <span>{userInfo?.nickName}</span>
      </Space>
    );
  };

  const [userInfo, setUserInfo] = useState(null);
  const location = useLocation();
  return (
    <ProLayout
      {...defaultProps}
      location={location}
      menu={{
        request: async () => {
          const data = await getLoginUserInfoReq();
          const { menus } = uniqueList(data.permissions);
          setUserInfo(data);
          return loopMenuItem(menus);
        },
      }}
      rightContentRender={renderHeader}
      menuItemRender={(item, dom) => <Link to={item.path}>{dom}</Link>}
    >
      <Outlet />
    </ProLayout>
  );
}
