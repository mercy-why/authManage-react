import ProTable, { TableDropdown } from "@ant-design/pro-table";
import { getList, addReq, editReq, deleteReq } from "./services";
import { Button, Space, Popconfirm } from "antd";
import { useRef, useState, createElement, useContext } from "react";
import { BetaSchemaForm } from "@ant-design/pro-form";
import { defaultModalFormSetting } from "@/settings";
import BtnModal from "./btnModal";
import InterfaceModal from "./interfaceModal";
import useModal from "@/hooks/useModal";
import * as Icons from "@ant-design/icons";
import Access from "@/components/Access";
import { UserContext } from "@/context";

const defaultRules = [
  {
    required: true,
    message: "此项为必填项",
  },
];
const statusMap = {
  C: {
    text: "目录",
  },
  M: {
    text: "菜单",
  },
};
export default function Menu() {
  const [modalState, addFn, editFn, clearFn] = useModal();
  const [menuTree, setMenuTree] = useState([]);
  const { formData, visible } = modalState;
  const { user } = useContext(UserContext);
  const { hasAccess } = user;
  const actionRef = useRef();
  const [btnState, setBtnState] = useState({
    visible: false,
    record: null,
    menuId: null,
  });
  const [interfaceState, setInterfaceState] = useState({
    visible: false,
    record: null,
    menuId: null,
  });
  const reloadFn = () => {
    actionRef?.current.reload();
  };
  const actionFn = (key, record) => {
    if (key === "btn") {
      setBtnState({
        visible: true,
        record: record.buttons,
        menuId: record.menuId,
      });
    } else {
      setInterfaceState({
        visible: true,
        record: record.resources,
        menuId: record.menuId,
      });
    }
  };
  const columns = [
    {
      title: "上级菜单",
      dataIndex: "menuParentId",
      hideInTable: true,
      valueType: "treeSelect",
      search: false,
      fieldProps: {
        options: menuTree,
        allowClear: true,
        treeDefaultExpandAll: true,
        fieldNames: {
          label: "menuName",
          value: "menuId",
        },
      },
      formItemProps: {
        rules: defaultRules,
      },
    },
    {
      title: "菜单名称",
      dataIndex: "menuName",
      formItemProps: {
        rules: defaultRules,
      },
    },
    {
      title: "菜单类型",
      dataIndex: "menuType",
      valueEnum: statusMap,
      formItemProps: {
        rules: defaultRules,
      },
      valueType: "radio",
      search: false,
    },

    {
      title: "路由地址",
      dataIndex: "menuRouter",
      formItemProps: {
        rules: defaultRules,
      },
      search: false,
    },
    {
      title: "组件路径",
      dataIndex: "menuComponent",
      search: false,
    },
    {
      title: "图标",
      dataIndex: "menuIcon",
      valueType: "select",
      fieldProps: {
        virtual: false,
        options: Object.keys(Icons).map((item, index) => {
          if (
            typeof Icons[item] === "object" &&
            item !== "default" &&
            item !== "IconProvider" &&
            item.endsWith("Outlined")
          ) {
            return {
              value: item,
              label: createElement(Icons[item], {}),
            };
          } else {
            return null;
          }
        }),
        dropdownClassName: "ico-x",
      },
      search: false,
    },
    {
      title: "排序",
      dataIndex: "menuSort",
      valueType: "digit",
      formItemProps: {
        rules: defaultRules,
      },
      search: false,
    },
    {
      title: "状态",
      dataIndex: "statusFlag",
      valueType: "radio",
      valueEnum: {
        1: {
          text: "正常",
          status: "Success",
        },
        2: {
          text: "停用",
          status: "Error",
        },
      },
      formItemProps: {
        rules: defaultRules,
      },
      search: false,
    },
    {
      title: "操作",
      hideInSearch: true,
      hideInForm: true,
      render: (t, record) => (
        <Space>
          <Access menuButton="role-edit">
            <a key="edit" onClick={() => editFn(record)}>
              修改
            </a>
          </Access>
          <Access menuButton="role-delete">
            <Popconfirm
              title="是否确定删除此条？"
              okText="是"
              cancelText="否"
              onConfirm={async () => {
                await deleteReq({ menuId: record.menuId });
                reloadFn();
              }}
            >
              <a key="del">删除</a>
            </Popconfirm>
          </Access>
          {record.menuType === "M" ? (
            <TableDropdown
              key="actionGroup"
              onSelect={(key) => actionFn(key, record)}
              menus={[
                hasAccess("menu-btn") && { key: "btn", name: "按钮管理" },
                hasAccess("menu-resource") && {
                  key: "interface",
                  name: "接口管理",
                },
              ]}
            ></TableDropdown>
          ) : null}
        </Space>
      ),
    },
  ];

  const addBtn = (
    <Access menuButton="role-add">
      <Button key="primary" type="primary" onClick={addFn}>
        添加
      </Button>
    </Access>
  );
  return (
    <>
      <ProTable
        rowKey="menuId"
        headerTitle={addBtn}
        search={false}
        columns={columns}
        revalidateOnFocus={false}
        pagination={false}
        request={async ({ menuName }) => {
          try {
            const data = await getList({ menuName });
            if (!menuName) {
              setMenuTree([
                {
                  menuId: "0",
                  menuName: "顶级",
                  children: data,
                },
              ]);
            }
            return {
              success: true,
              data,
            };
          } catch (error) {
            return {
              success: false,
            };
          }
        }}
        actionRef={actionRef}
      />

      <BetaSchemaForm
        {...defaultModalFormSetting}
        initialValues={formData || { menuParentId: "0" }}
        layoutType="ModalForm"
        visible={visible}
        title={`${formData ? "修改" : "添加"}菜单`}
        onVisibleChange={(v) => {
          if (!v) {
            clearFn();
          }
        }}
        onFinish={async (data) => {
          if (formData) {
            data.menuId = formData.menuId;
            data.menuIcon = data.menuIcon || "";
            await editReq(data);
          } else {
            await addReq(data);
          }
          reloadFn();
          return true;
        }}
        columns={columns}
      />

      <BtnModal
        btnState={btnState}
        setBtnState={setBtnState}
        reloadFn={reloadFn}
      />
      <InterfaceModal
        interfaceState={interfaceState}
        setInterfaceState={setInterfaceState}
        reloadFn={reloadFn}
      />
    </>
  );
}
