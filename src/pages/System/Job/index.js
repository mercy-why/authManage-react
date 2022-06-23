import ProTable from "@ant-design/pro-table";
import { getPositionPage, addReq, editReq, delReq } from "./services";
import Access from "@/components/Access";
import { Button, message, Space, Popconfirm } from "antd";
import { defaultModalFormSetting, defaultTableSetting } from "@/settings";
import useModal from "@/hooks/useModal";
import { BetaSchemaForm } from "@ant-design/pro-form";
import { useRef } from "react";

const defaultRules = [
  {
    required: true,
    message: "此项为必填项",
  },
];

function Job() {
  const [modalState, addFn, editFn, clearFn] = useModal();
  const actionRef = useRef();

  const { formData, visible } = modalState;

  const columns = [
    {
      title: "岗位名称",
      dataIndex: "positionName",
      formItemProps: {
        rules: defaultRules,
      },
    },
    {
      title: "岗位编码",
      dataIndex: "positionCode",
      formItemProps: {
        rules: defaultRules,
      },
    },
    {
      title: "排序",
      dataIndex: "positionSort",
      search: false,
      formItemProps: {
        rules: defaultRules,
      },
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
          <Access buttonCode="job-edit">
            <a key="edit" onClick={() => editFn(record)}>
              修改
            </a>
          </Access>
          <Access buttonCode="job-delete">
            <Popconfirm
              title="是否确定删除此条？"
              okText="是"
              cancelText="否"
              onConfirm={async () => {
                await delReq({ positionId: record.positionId });
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
    <Access buttonCode="job-add">
      <Button key="primary" type="primary" onClick={addFn}>
        添加
      </Button>
    </Access>
  );
  return (
    <>
      <ProTable
        rowKey="positionId"
        {...defaultTableSetting}
        columns={columns}
        headerTitle={addBtn}
        actionRef={actionRef}
        request={async ({
          current: pageNum,
          pageSize,
          positionName,
          positionCode,
        }) => {
          const { list, totalCount } = await getPositionPage({
            pageNum,
            pageSize,
            positionName,
            positionCode,
          });
          return { success: true, data: list, total: totalCount };
        }}
      />
      <BetaSchemaForm
        {...defaultModalFormSetting}
        initialValues={formData}
        layoutType="ModalForm"
        visible={visible}
        title={`${formData ? "修改" : "添加"}岗位`}
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

export default Job;
