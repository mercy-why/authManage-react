import { Modal, Space, Popconfirm } from "antd";
import { EditableProTable } from "@ant-design/pro-table";
import { addMenuButtonReq, deleteBtnReq, editBtnReq } from "./services";
import { useEffect, useState } from "react";
const defaultRules = [
  {
    required: true,
    message: "此项为必填项",
  },
];
export default function BtnModal({ btnState, setBtnState, reloadFn }) {
  const { visible, record = [], menuId } = btnState;
  const [dataSource, setDataSource] = useState([]);
  useEffect(() => {
    setDataSource(record);
  }, [btnState]);
  const onCancel = () => {
    setBtnState({
      visible: false,
      record: null,
    });
  };

  const deleteFn = async (id) => {
    await deleteBtnReq({ buttonId: id });
    setDataSource((data) => data.filter((x) => x.buttonId !== id));
    reloadFn();
  };
  const columns = [
    {
      title: "按钮名称",
      dataIndex: "buttonName",
      formItemProps: {
        rules: defaultRules,
      },
    },
    {
      title: "按钮编码",
      dataIndex: "buttonCode",
      formItemProps: {
        rules: defaultRules,
      },
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
      formItemProps: {
        rules: defaultRules,
      },
    },
    {
      title: "操作",
      valueType: "option",
      render: (t, record, _, action) => (
        <Space>
          <a
            key="editable"
            onClick={() => {
              action?.startEditable?.(record.buttonId);
            }}
          >
            编辑
          </a>
          <Popconfirm
            title="是否确定删除此条？"
            okText="是"
            cancelText="否"
            onConfirm={() => {
              deleteFn(record.buttonId);
            }}
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
        destroyOnClose
        footer={null}
      >
        <EditableProTable
          rowKey="buttonId"
          columns={columns}
          value={dataSource}
          editable={{
            onSave: async (rowKey, data) => {
              if (data.type === "add") {
                const { buttonCode, buttonName, statusFlag } = data;
                const res = await addMenuButtonReq({
                  menuId,
                  buttonCode,
                  buttonName,
                  statusFlag,
                });
                setDataSource([...dataSource, res]);
              } else {
                await editBtnReq(data);
                setDataSource((r) =>
                  r.map((x) => {
                    if (x.buttonId === rowKey) {
                      return data;
                    } else {
                      return x;
                    }
                  })
                );
              }
              reloadFn();
            },
          }}
          recordCreatorProps={{
            record: () => ({
              buttonId: (Math.random() * 1000000).toFixed(0),
              type: "add",
            }),
          }}
        />
      </Modal>
    </>
  );
}
