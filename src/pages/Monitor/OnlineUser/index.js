import ProTable from "@ant-design/pro-table";
import { getList, addReq, editReq, delReq, retreat } from "./services";
import Access from "@/components/Access";
import { Button, message, Space, Popconfirm } from "antd";
import { defaultTableSetting, defaultModalFormSetting } from "@/settings";
import useModal from "@/hooks/useModal";
import { BetaSchemaForm } from "@ant-design/pro-form";
import { useRef } from "react";

const defaultRules = [
  {
    required: true,
    message: "此项为必填项",
  },
];

function OnlineUser() {
  const ROWKEY = "onlineUser";
  const ROWKEYID = "id";
  const ROWKEYNAME = "在线用户";
  const initState = {
    statusFlag: "1",
    password: 123456,
  };
  const [modalState, addFn, editFn, clearFn] = useModal();
  const actionRef = useRef();
  const { formData, visible } = modalState;

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
      search: false,
    },
    {
      title: "登录地址",
      dataIndex: "loginAddr",
      search: false,
    },
    {
      title: "登录IP",
      dataIndex: "loginIp",
      search: false,
    },
    {
      title: "操作系统",
      dataIndex: "operSys",
      search: false,
    },
    {
      title: "浏览器",
      dataIndex: "browser",
      search: false,
    },
    {
      title: "登录时间",
      dataIndex: "loginTime",
      valueType: "dateTime",
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
          <Access buttonCode={`${ROWKEY}-retreat`}>
            <a
              key="retreat"
              onClick={() => {
                retreatFn(record);
              }}
            >
              下线
            </a>
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

  async function retreatFn(record) {
    await retreat({
      jwtId: record.jwtId,
    });
    message.success("下线成功");
    actionRef?.current.reload()
  }
  return (
    <>
      <ProTable
        search={false}
        rowKey={ROWKEYID}
        {...defaultTableSetting}
        columns={columns}
        headerTitle={addBtn}
        actionRef={actionRef}
        request={async ({ current: pageNum, pageSize }) => {
          const { list, totalCount } = await getList({
            pageNum,
            pageSize,
          });
          return { success: true, data: list, total: totalCount };
        }}
      />
      <BetaSchemaForm
        {...defaultModalFormSetting}
        initialValues={formData || initState}
        layoutType="ModalForm"
        visible={visible}
        title={`${formData ? "修改" : "添加"}${ROWKEYNAME}`}
        onVisibleChange={(v) => {
          if (!v) {
            clearFn();
          }
        }}
        onFinish={async (data) => {
          if (formData) {
            data.positionId = formData.positionId;
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

export default OnlineUser;
