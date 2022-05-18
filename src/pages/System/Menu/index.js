import ProTable, { TableDropdown } from "@ant-design/pro-table";
import { getList, addReq, editReq, deleteReq } from "./services";
import { Button, Space, Popconfirm } from "antd";
import { useReducer, useRef, useState } from "react";
import { BetaSchemaForm } from "@ant-design/pro-form";
import { defaultModalFormSetting } from "@/settings";
import BtnModal from "./btnModal";

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
export default function Role() {
  const defaultData = {
    visible: false,
    formData: null,
  };
  const reducer = (_, { type, record }) => {
    switch (type) {
      case "add":
        return { visible: true, formData: null };
      case "edit":
        return { visible: true, formData: record };
      default:
        return defaultData;
    }
  };
  const [state, dispatch] = useReducer(reducer, defaultData);
  const [menuTree, setMenuTree] = useState([]);
  const { formData, visible } = state;
  const actionRef = useRef();
  const [btnState, setBtnState] = useState({
    visible: false,
    record: null,
  });

  const editFn = (record) => {
    dispatch({
      type: "edit",
      record,
    });
  };

  const actionFn = (key, record) => {
    if (key === "btn") {
      console.log(record);
      setBtnState({
        visible: true,
        record: record.buttons,
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
        defaultValue: '0',
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
              actionRef?.current.reload();
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
                { key: "delete", name: "删除" },
              ]}
            ></TableDropdown>
          ) : null}
        </Space>
      ),
    },
  ];

  const addBtn = (
    <Button
      key="primary"
      type="primary"
      onClick={() => {
        dispatch({ type: "add" });
      }}
    >
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
              setMenuTree([{
                menuId: "0",
                menuName: "顶级",
                children: data,
              }]);
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
            dispatch({ type: "close" });
          }
        }}
        onFinish={async (data) => {
          if (formData) {
            data.menuId = formData.menuId;
            await editReq(data);
          } else {
            await addReq(data);
          }
          actionRef?.current.reload();
          return true;
        }}
        columns={columns}
      />

      <BtnModal btnState={btnState} setBtnState={setBtnState} />
    </>
  );
}
