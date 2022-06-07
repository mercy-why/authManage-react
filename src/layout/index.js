import { useState, createElement, useRef, useEffect } from "react";
import ProLayout from "@ant-design/pro-layout";
import { Outlet, useLocation, Link, useNavigate } from "react-router-dom";
import { getLoginUserInfoReq } from "./services";
import { Avatar, Space, Select } from "antd";
import { UserOutlined } from "@ant-design/icons";
import * as Icons from "@ant-design/icons";
import { SearchOutlined } from "@ant-design/icons";

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
    const options = [];
    menus.forEach((item, i, array) => {
      const { menuId, menuName, menuRouter, menuIcon, menuParentId } = item;
      const newItem = {
        key: menuId,
        name: menuName,
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
        arr.push(newItem);
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
              style={{ minWidth: 180, marginLeft: 10 , borderBottom: '1px solid #d9d9d9'}}
              onSelect={onSelect}
              value={null}
              onBlur={() => setSearchVisible(false)}
            ></Select>
          ) : null}
        </div>

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
          try {
            const data = await getLoginUserInfoReq();
            const { menus } = uniqueList(data.permissions);
            setUserInfo(data);
            return loopMenuItem(menus);
          } catch (error) {
            return null;
          }
        },
      }}
      rightContentRender={renderHeader}
      menuItemRender={(item, dom) => <Link to={item.path}>{dom}</Link>}
    >
      <Outlet />
    </ProLayout>
  );
}
