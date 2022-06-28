import { useState, createElement, useRef, useEffect } from "react";
import ProLayout from "@ant-design/pro-layout";
import {
  Outlet,
  useLocation,
  Link,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { getLoginUserInfoReq, logoutReq } from "./services";
import { Avatar, Space, Select, Menu, Dropdown } from "antd";
import { UserOutlined } from "@ant-design/icons";
import * as Icons from "@ant-design/icons";
import { SearchOutlined, CaretDownOutlined } from "@ant-design/icons";
import { UserContext } from "@/context";

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
  const selectRef = useRef();
  const [searchOptions, setOptions] = useState([]);
  const [searchVisible, setSearchVisible] = useState(false);
  const [user, setUser] = useState({});
  const [canAccess, setCanAccess] = useState(true);
  const uniqueList = (arr) => {
    if (arr?.length === 0) {
      return [];
    }
    const uniButtonObj = {};
    const uniMenusObj = {};
    const uniResourcesObj = {};
    const roles = [];
    for (const item of arr) {
      const { menuButtons, menus, resources, role } = item;
      if (menuButtons) {
        for (const value of menuButtons) {
          if (!uniButtonObj[value.buttonId]) {
            uniButtonObj[value.buttonId] = value;
          }
        }
      }
      if (menus) {
        for (const value of menus) {
          if (!uniMenusObj[value.menuId]) {
            uniMenusObj[value.menuId] = value;
          }
        }
      }
      if (resources) {
        for (const value of resources) {
          if (!uniResourcesObj[value.resourceId]) {
            uniResourcesObj[value.resourceId] = value;
          }
        }
      }

      roles.push(role);
    }
    return {
      buttons: Object.values(uniButtonObj),
      menus: Object.values(uniMenusObj),
      resources: Object.values(uniResourcesObj),
      roles,
    };
  };

  const loopMenuItem = (menus) => {
    const arr = [];
    const options = [];
    menus.forEach((item, i, array) => {
      const { menuId, menuName, menuRouter, menuIcon, menuParentId, hide } =
        item;
      const newItem = {
        key: menuId,
        name: menuName,
        path: menuRouter,
        hide,
        icon: Icons[menuIcon] && createElement(Icons[menuIcon], {}),
        routes: [],
      };
      if (menuParentId === "0" && hide === "0") {
        array.forEach((x) => {
          if (x.menuParentId === menuId && x.hide === "0") {
            newItem.routes.push({
              key: x.menuId,
              name: x.menuName,
              path: x.menuRouter,
              icon: Icons[x.menuIcon] && createElement(Icons[x.menuIcon], {}),
            });
            options.push({
              key: x.menuId,
              value: x.menuRouter,
              label: menuName + " > " + x.menuName,
            });
          }
        });
        if (hide === "0") {
          arr.push(newItem);
        }
      }
    });
    setOptions(options);
    return arr;
  };

  const onSelect = (value) => {
    setSearchVisible(false);
    navigate(value);
  };
  const focusSearch = () => {
    setSearchVisible(true);
  };
  useEffect(() => {
    if (searchVisible) {
      selectRef.current?.focus();
    }
  }, [searchVisible]);

  const menuFn = ({ key }) => {
    if (key === "logout") {
      logoutReq();
      setUser(null);
      navigate("login");
    } else if (key === "editProfile") {
      navigate("profile");
    }
  };

  const menuDom = (
    <Menu
      onClick={menuFn}
      items={[
        {
          key: "editProfile",
          label: "修改个人信息",
        },
        {
          key: "logout",
          label: "退出登录",
        },
      ]}
    />
  );

  const renderHeader = () => {
    return (
      <Space>
        <div className="tools-x">
          <SearchOutlined onClick={focusSearch} />
          {searchVisible ? (
            <Select
              ref={selectRef}
              showSearch
              bordered={false}
              showArrow={false}
              placeholder="Search"
              options={searchOptions}
              optionFilterProp="label"
              style={{
                minWidth: 180,
                marginLeft: 10,
                borderBottom: "1px solid #d9d9d9",
              }}
              onSelect={onSelect}
              value={null}
              onBlur={() => setSearchVisible(false)}
            ></Select>
          ) : null}
        </div>
        <Dropdown overlay={menuDom}>
          <Space className="cur">
            <Avatar
              shape="square"
              size="small"
              src={
                user.info?.avatar
                  ? BASE_URL + user.info?.avatar
                  : null
              }
              icon={<UserOutlined />}
            />
            <span>{user.info?.realName}</span>
            <CaretDownOutlined className="dp-icon" />
          </Space>
        </Dropdown>
      </Space>
    );
  };

  const location = useLocation();
  useEffect(() => {
    const menus = user.menus;
    const pathname = location.pathname.replace("/", "");
    if (menus) {
      setCanAccess(
        menus?.some((x) => pathname === x.menuRouter.replace("/", "")) ||
          pathname === ""
      );
    }
  }, [location, user]);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <ProLayout
        {...defaultProps}
        location={location}
        menu={{
          request: async () => {
            try {
              const data = await getLoginUserInfoReq();
              const { permissions, ...info } = data;
              const { menus, buttons, resources, roles } = uniqueList(permissions);
              setUser({
                menus,
                buttons,
                resources,
                info,
                hasAccess: (code) => {
                  const isAdmin = roles.some((x) => x.roleCode === "admin");
                  return isAdmin || buttons?.some((x) => x.buttonCode === code);
                },
              });
              return loopMenuItem(menus);
            } catch (error) {
              throw error;
            }
          },
        }}
        rightContentRender={renderHeader}
        menuItemRender={(item, dom) => {
          return (
            <Link to={item.path}>
              {item.pro_layout_parentKeys.length ? item.icon : null}
              {dom}
            </Link>
          );
        }}
      >
        {canAccess ? <Outlet /> : <Navigate to="403" />}
      </ProLayout>
    </UserContext.Provider>
  );
}
