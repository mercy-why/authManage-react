import { Modal, Button, Space, Popconfirm } from "antd";
import  { EditableProTable } from "@ant-design/pro-table";

export default function BtnModal({ btnState, setBtnState }) {
  const { visible, record: dataSource } = btnState;
  const onCancel = () => {
    setBtnState({
      visible: false,
      record: null,
    });
  };
  const columns = [
    {
      title: "按钮名称",
      dataIndex: "buttonName",
    },
    {
      title: "按钮编码",
      dataIndex: "buttonCode",
    },
    {
      title: "按钮状态",
      dataIndex: "statusFlag",
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
    },
    {
      title: "操作",
      hideInSearch: true,
      hideInForm: true,
      render: (t, record) => (
        <Space>
          <a key="edit" onClick={() => {}}>
            修改
          </a>
          <Popconfirm
            title="是否确定删除此条？"
            okText="是"
            cancelText="否"
            onConfirm={async () => {}}
          >
            <a key="del">删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  return (
    <>
      <Modal
        visible={visible}
        title="菜单按钮管理"
        width={800}
        onCancel={onCancel}
      >
        <EditableProTable
          rowKey="buttonId"
          columns={columns}
          value={dataSource}
        />
      </Modal>
    </>
  );
}
