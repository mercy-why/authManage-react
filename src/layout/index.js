import { useState, useRef, useEffect, useContext } from "react";
import ProLayout from "@ant-design/pro-layout";
import { Outlet, useLocation, Link, useNavigate } from "react-router-dom";
import { logoutReq } from "./services";
import { Avatar, Space, Select, Menu, Dropdown } from "antd";
import { UserOutlined } from "@ant-design/icons";
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
  const [searchVisible, setSearchVisible] = useState(false);
  const { user, setUser } = useContext(UserContext);
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
    }
  };

  const menuDom = (
    <Menu
      onClick={menuFn}
      items={[
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
              options={user.searchOptions}
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
            <Avatar shape="square" size="small" icon={<UserOutlined />} />
            <span>{user?.nickName}</span>
            <CaretDownOutlined className="dp-icon" />
          </Space>
        </Dropdown>
      </Space>
    );
  };

  const location = useLocation();
  return (
    <ProLayout
      {...defaultProps}
      location={location}
      menuDataRender={() => user.routes}
      rightContentRender={renderHeader}
      menuItemRender={(item, dom) => <Link to={item.path}>{dom}</Link>}
    >
      <Outlet />
    </ProLayout>
  );
}
