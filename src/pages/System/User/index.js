import ProTable from "@ant-design/pro-table";
import {
  getList,
  addReq,
  editReq,
  delReq,
  getRoleList,
  getOrgTreeReq,
  getPositionList,
} from "./services";
import Access from "@/components/Access";
import { Button, message, Space, Popconfirm } from "antd";
import { defaultTableSetting } from "@/settings";
import useModal from "@/hooks/useModal";
import {
  ModalForm,
  Group,
  ProFormText,
  ProFormTextArea,
  ProFormSelect,
  ProFormTreeSelect,
  ProFormRadio,
} from "@ant-design/pro-form";
import { useRef, useState, useEffect } from "react";

const defaultRules = [
  {
    required: true,
    message: "此项为必填项",
  },
];

function User() {
  const ROWKEY = "user";
  const ROWKEYID = "userId";
  const ROWKEYNAME = "用户";
  const initState = {
    statusFlag: "1",
    password: 123456,
  };
  const [modalState, addFn, editFn, clearFn] = useModal();
  const actionRef = useRef();
  const formRef = useRef();
  const { formData, visible } = modalState;
  const [modalOptions, setModalOptions] = useState({
    positionOptions: [],
    orgOptions: [],
    roleOptions: [],
  });
  const initOptions = async () => {
    const [positionOptions, orgOptions, roleOptions] = await Promise.all([
      getPositionList(),
      getOrgTreeReq(),
      getRoleList(),
    ]);
    setModalOptions({
      positionOptions: positionOptions.map((x) => ({
        label: x.positionName,
        value: x.positionId,
      })),
      orgOptions,
      roleOptions: roleOptions.map((x) => ({
        label: x.roleName,
        value: x.roleId,
      })),
    });
  };
  useEffect(() => {
    if (visible && !modalOptions.roleOptions.length) {
      initOptions();
    }
  }, [visible]);
  const columns = [
    {
      title: "用户名称",
      dataIndex: "realName",
      formItemProps: {
        rules: defaultRules,
      },
      search: false,
    },
    {
      title: "用户账号",
      dataIndex: "account",
      formItemProps: {
        rules: defaultRules,
      },
    },
    {
      title: "部门",
      dataIndex: "orgs",
      formItemProps: {
        rules: defaultRules,
      },
      search: false,
      render: (t) => t?.map((x) => x.orgName).join(),
    },
    {
      title: "岗位",
      dataIndex: "positions",
      formItemProps: {
        rules: defaultRules,
      },
      search: false,
      render: (t) => t?.map((x) => x.positionName).join(),
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
      search: false,
      formItemProps: {
        rules: defaultRules,
      },
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      search: false,
      hideInForm: true,
    },
    {
      title: "操作",
      dataIndex: "operation",
      hideInForm: true,
      search: false,
      render: (t, record) => (
        <Space>
          <Access buttonCode={`${ROWKEY}-edit`}>
            <a
              key="edit"
              onClick={() => {
                const value = {
                  ...record,
                  orgIds: record.orgs.map((item) => item.orgId),
                  positionIds: record.positions.map((item) => item.positionId),
                  roleIds: record.roles.map((item) => item.roleId),
                };
                editFn(value);
              }}
            >
              修改
            </a>
          </Access>
          <Access buttonCode={`${ROWKEY}-delete`}>
            <Popconfirm
              title="是否确定删除此条？"
              okText="是"
              cancelText="否"
              onConfirm={async () => {
                await delReq({ [ROWKEYID]: record[ROWKEYID] });
                actionRef?.current.reload();
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
    <Access buttonCode={`${ROWKEY}-add`}>
      <Button key="primary" type="primary" onClick={addFn}>
        添加
      </Button>
    </Access>
  );
  return (
    <>
      <ProTable
        rowKey={ROWKEYID}
        {...defaultTableSetting}
        columns={columns}
        headerTitle={addBtn}
        actionRef={actionRef}
        request={async ({ current: pageNum, pageSize, realName, account }) => {
          const { list, totalCount } = await getList({
            pageNum,
            pageSize,
            realName,
            account,
          });
          return { success: true, data: list, total: totalCount };
        }}
      />
      <ModalForm
        formRef={formRef}
        modalProps={{
          maskClosable: false,
          destroyOnClose: true,
        }}
        initialValues={formData || initState}
        visible={visible}
        title={`${formData ? "修改" : "添加"}${ROWKEYNAME}`}
        onVisibleChange={(v) => {
          if (!v) {
            clearFn();
          }
        }}
        onFinish={async (data) => {
          if (formData) {
            data[ROWKEYID] = formData[ROWKEYID];
            await editReq(data);
            actionRef?.current.reload();
          } else {
            await addReq(data);
            actionRef?.current.reload(true);
          }
          message.success("提交成功");
          return true;
        }}
      >
        <Group>
          <ProFormText
            width="md"
            name="realName"
            label="用户名称"
            placeholder="请输入用户名称"
            rules={defaultRules}
          />

          <ProFormTreeSelect
            width="md"
            name="orgIds"
            label="归属部门"
            placeholder="请选择归属部门"
            fieldProps={{
              treeDefaultExpandAll: true,
              options: modalOptions.orgOptions,
              fieldNames: {
                label: "orgName",
                value: "orgId",
              },
              filterTreeNode: (input, node) => {
                console.log(input,node);
                return node.orgName.includes(input);
              },
              multiple: true,
            }}
            rules={defaultRules}
          />
        </Group>
        <Group>
          <ProFormText
            width="md"
            name="account"
            label="用户账号"
            placeholder="请输入用户账号"
            rules={defaultRules}
          />
          <ProFormText.Password
            width="md"
            name="password"
            label="用户密码"
            placeholder="请输入用户密码"
          />
        </Group>
        <Group>
          <ProFormText
            width="md"
            name="phone"
            label="手机号码"
            placeholder="请输入手机号码"
            rules={[
              ...defaultRules,
              {
                pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/,
                message: "请输入正确的手机号码",
              },
            ]}
          />
          <ProFormRadio.Group
            width="md"
            name="statusFlag"
            rules={defaultRules}
            label="状态"
            options={[
              {
                label: "正常",
                value: "1",
              },
              {
                label: "禁用",
                value: "2",
              },
            ]}
          />
        </Group>
        <Group>
          <ProFormSelect
            width="md"
            name="positionIds"
            label="岗位"
            placeholder="请选择岗位"
            rules={defaultRules}
            fieldProps={{
              mode: "multiple",
            }}
            options={modalOptions.positionOptions}
          />
          <ProFormSelect
            width="md"
            name="roleIds"
            label="角色"
            placeholder="请选择角色"
            fieldProps={{
              mode: "multiple",
            }}
            options={modalOptions.roleOptions}
            rules={defaultRules}
          />
        </Group>
        <ProFormTextArea name="remark" label="备注" placeholder="请输入备注" />
      </ModalForm>
    </>
  );
}

export default User;
