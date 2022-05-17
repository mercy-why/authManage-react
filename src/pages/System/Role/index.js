import ProTable from "@ant-design/pro-table";
import {
  getRolePage,
  addRole,
  updateRoleById,
  deleteRoleById,
} from "./services";
import { Button, message, Space, Popconfirm } from "antd";
import { useReducer, useRef } from "react";
import { BetaSchemaForm } from "@ant-design/pro-form";
import { defaultModalFormSetting } from "@/settings";

const initList = async ({ current, pageSize: size, roleName, roleCode }) => {
  try {
    const { records, total } = await getRolePage({
      current,
      size,
      roleName,
      roleCode,
    });
    return {
      success: true,
      data: records,
      total,
    };
  } catch (error) {
    return {
      success: false,
    };
  }
};

const addReq = async (data) => {
  try {
    await addRole(data);
    message.success("添加成功");
  } catch (error) {
    console.log(error);
  }
};

const editReq = async (data) => {
  try {
    await updateRoleById(data);
    message.success("修改成功");
  } catch (error) {
    console.log(error);
  }
};

const deleteReq = async (data) => {
  try {
    await deleteRoleById(data);
    message.success("删除成功");
  } catch (error) {
    console.log(error);
  }
};

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
    console.log(record);
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
              actionRef?.current.reload()
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
        request={initList}
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
