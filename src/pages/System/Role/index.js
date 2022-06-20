import ProTable from "@ant-design/pro-table";
import { initReq, addReq, editReq, deleteReq } from "./services";
import { Button, Space, Popconfirm } from "antd";
import { useState, useRef } from "react";
import { BetaSchemaForm } from "@ant-design/pro-form";
import { defaultModalFormSetting, defaultTableSetting } from "@/settings";
import useModal from "@/hooks/useModal";
import DistrubModal from "./distrubModal";
import Access from "@/components/Access";
const defaultRules = [
  {
    required: true,
    message: "此项为必填项",
  },
];

export default function Role() {
  const [modalState, addFn, editFn, clearFn] = useModal();
  const { formData, visible } = modalState;
  const actionRef = useRef();
  const [distrubState, setDisTrubState] = useState({
    visible: false,
    roleId: null,
  });

  const distrubFn = (id) => {
    setDisTrubState({
      visible: true,
      roleId: id,
    });
  };
  const cancelFn = () => {
    setDisTrubState({
      visible: false,
      roleId: null,
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
        2: {
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
      render: (t, record) =>
        record.roleCode === "admin" ? null : (
          <Space>
            <Access buttonCode="role-edit">
              <a key="edit" onClick={() => editFn(record)}>
                修改
              </a>
            </Access>
            <Access buttonCode="role-delete">
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
            </Access>
            <Access buttonCode="role-disturb">
              <a key="disturb" onClick={() => distrubFn(record.roleId)}>
                分配权限
              </a>
            </Access>
          </Space>
        ),
    },
  ];

  const addBtn = (
    <Access buttonCode="role-add">
      <Button key="primary" type="primary" onClick={addFn}>
        添加
      </Button>
    </Access>
  );
  return (
    <>
      <ProTable
        rowKey="roleId"
        headerTitle={addBtn}
        columns={columns}
        request={initReq}
        actionRef={actionRef}
        {...defaultTableSetting}
      />

      <BetaSchemaForm
        {...defaultModalFormSetting}
        initialValues={formData}
        layoutType="ModalForm"
        visible={visible}
        title={`${formData ? "修改" : "添加"}角色`}
        onVisibleChange={(v) => {
          if (!v) {
            clearFn();
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

      <DistrubModal distrubState={distrubState} cancelFn={cancelFn} />
    </>
  );
}
