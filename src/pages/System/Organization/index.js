import ProTable from "@ant-design/pro-table";
import { getOrgTreeReq, addReq, editReq, deleteReq } from "./services";
import { Button, message, Space, Popconfirm } from "antd";
import { defaultModalFormSetting } from "@/settings";
import useModal from "@/hooks/useModal";
import { useRef, useState } from "react";
import Access from "@/components/Access";
import { BetaSchemaForm } from "@ant-design/pro-form";
const defaultRules = [
  {
    required: true,
    message: "此项为必填项",
  },
];

export default function Organization() {
  const [modalState, addFn, editFn, clearFn] = useModal();
  const actionRef = useRef();
  const [orgTree, setOrgTree] = useState([]);
  const { formData, visible } = modalState;

  const columns = [
    {
      title: "上级部门",
      dataIndex: "orgParentId",
      hideInTable: true,
      valueType: "treeSelect",
      search: false,
      fieldProps: {
        options: orgTree,
        allowClear: true,
        treeDefaultExpandAll: true,
        defaultValue: "0",
        fieldNames: {
          label: "orgName",
          value: "orgId",
        },
      },
      formItemProps: {
        rules: defaultRules,
      },
    },
    {
      title: "部门名称",
      dataIndex: "orgName",
      formItemProps: {
        rules: defaultRules,
      },
    },
    {
      title: "部门编码",
      dataIndex: "orgCode",
      formItemProps: {
        rules: defaultRules,
      },
    },
    {
      title: "排序",
      dataIndex: "orgSort",
      formItemProps: {
        rules: defaultRules,
      },
    },
    {
      title: "状态",
      dataIndex: "statusFlag",
      valueType: "radio",
      formItemProps: {
        rules: defaultRules,
      },
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
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      hideInForm: true,
    },
    {
      title: "操作",
      dataIndex: "operation",
      hideInForm: true,
      render: (t, record) => (
        <Space>
          <Access menuButton="org-edit">
            <a key="edit" onClick={() => editFn(record)}>
              修改
            </a>
          </Access>
          <Access menuButton="org-delete">
            <Popconfirm
              title="是否确定删除此条？"
              okText="是"
              cancelText="否"
              onConfirm={async () => {
                await deleteReq({ orgId: record.orgId });
                actionRef?.current.reload(true);
              }}
            >
              <a key="del">删除</a>
            </Popconfirm>
          </Access>
        </Space>
      ),
    },
  ];

  const addBtn = (
    <Access buttonCode="job-add">
      <Button key="primary" type="primary" onClick={addFn}>
        添加
      </Button>
    </Access>
  );
  return (
    <>
      <ProTable
        rowKey="orgId"
        headerTitle={addBtn}
        search={false}
        columns={columns}
        actionRef={actionRef}
        pagination={false}
        revalidateOnFocus={false}
        request={async () => {
          const data = await getOrgTreeReq();
          setOrgTree([
            {
              orgId: "0",
              orgName: "顶级",
              children: data,
            },
          ]);

          return { success: true, data };
        }}
      />
      <BetaSchemaForm
        {...defaultModalFormSetting}
        initialValues={formData || { orgParentId: "0" }}
        layoutType="ModalForm"
        visible={visible}
        title={`${formData ? "修改" : "添加"}部门`}
        onVisibleChange={(v) => {
          if (!v) {
            clearFn();
          }
        }}
        onFinish={async (data) => {
          if (formData) {
            data.orgId = formData.orgId;
            await editReq(data);
            actionRef?.current.reload();
          } else {
            await addReq(data);
            actionRef?.current.reload(true);
          }
          message.success("提交成功");
          return true;
        }}
        columns={columns}
      />
    </>
  );
}
