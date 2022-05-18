import ProTable from "@ant-design/pro-table";
import { initReq, addReq, editReq, deleteReq } from "./services";
import { Button, Space, Popconfirm } from "antd";
import { useReducer, useRef } from "react";
import { BetaSchemaForm } from "@ant-design/pro-form";
import { defaultModalFormSetting } from "@/settings";

const defaultRules = [
  {
    required: true,
    message: "此项为必填项",
  },
];

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
  const { formData, visible } = state;
  const actionRef = useRef();

  const editFn = (record) => {
    dispatch({
      type: "edit",
      record,
    });
  };
  const columns = [
    {
      title: "角色名称",
      dataIndex: "roleName",
      formItemProps: {
        rules: defaultRules,
      },
    },
    {
      title: "权限字符",
      dataIndex: "roleCode",
      formItemProps: {
        rules: defaultRules,
      },
    },
    {
      title: "显示顺序",
      dataIndex: "roleSort",
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
          text: "禁用",
          status: "Error",
        },
      },
      formItemProps: {
        rules: defaultRules,
      },
      search: false,
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      formItemProps: {
        rules: defaultRules,
      },
      hideInSearch: true,
      hideInForm: true,
      valueType: "dateTime",
    },
    {
      title: "描述",
      dataIndex: "remark",
      hideInSearch: true,
      ellipsis: true,
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
              await deleteReq({ roleId: record.roleId });
              actionRef?.current.reload();
            }}
          >
            <a key="del">删除</a>
          </Popconfirm>
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
        rowKey="roleId"
        headerTitle={addBtn}
        columns={columns}
        request={initReq}
        actionRef={actionRef}
      />

      <BetaSchemaForm
        {...defaultModalFormSetting}
        initialValues={formData}
        layoutType="ModalForm"
        visible={visible}
        title={`${formData ? "修改" : "添加"}角色`}
        onVisibleChange={(v) => {
          if (!v) {
            dispatch({ type: "close" });
          }
        }}
        onFinish={async (data) => {
          if (formData) {
            data.roleId = formData.roleId;
            await editReq(data);
          } else {
            await addReq(data);
          }
          actionRef?.current.reload();
          return true;
        }}
        columns={columns}
      />
    </>
  );
}
