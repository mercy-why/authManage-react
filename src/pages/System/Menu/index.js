import ProTable, { TableDropdown } from "@ant-design/pro-table";
import { getList, addReq, editReq, deleteReq } from "./services";
import { Button, Space, Popconfirm } from "antd";
import { useRef, useState } from "react";
import { BetaSchemaForm } from "@ant-design/pro-form";
import { defaultModalFormSetting } from "@/settings";
import BtnModal from "./btnModal";
import InterfaceModal from "./interfaceModal";
import useModal from "@/hooks/useModal";

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
    }else{
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
        defaultValue: "0",
        fieldNames: {
          label: "menuName",
          value: "menuId",
        },
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
      formItemProps: {
        rules: defaultRules,
      },
      search: false,
    },
    {
      title: "图标",
      dataIndex: "menuIcon",
      formItemProps: {
        rules: defaultRules,
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
        0: {
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
          <a key="edit" onClick={() => editFn(record)}>
            修改
          </a>
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
          {record.menuType === "M" ? (
            <TableDropdown
              key="actionGroup"
              onSelect={(key) => actionFn(key, record)}
              menus={[
                { key: "btn", name: "按钮管理" },
                { key: "interface", name: "接口管理" },
              ]}
            ></TableDropdown>
          ) : null}
        </Space>
      ),
    },
  ];

  const addBtn = (
    <Button key="primary" type="primary" onClick={addFn}>
      添加
    </Button>
  );
  return (
    <>
      <ProTable
        rowKey="menuId"
        headerTitle={addBtn}
        columns={columns}
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
        initialValues={formData}
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
