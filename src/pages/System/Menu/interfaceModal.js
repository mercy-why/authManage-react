import { Modal, Space, Popconfirm } from "antd";
import { EditableProTable } from "@ant-design/pro-table";
import { addResourceReq, deleteResourceReq, editResourceReq } from "./services";
import { useEffect, useState } from "react";
const defaultRules = [
  {
    required: true,
    message: "此项为必填项",
  },
];
export default function InterfaceModal({
  interfaceState,
  setInterfaceState,
  reloadFn,
}) {
  const { visible, record = [], menuId } = interfaceState;
  const [dataSource, setDataSource] = useState([]);
  useEffect(() => {
    setDataSource(record);
  }, [interfaceState]);
  const onCancel = () => {
    setInterfaceState({
      visible: false,
      record: null,
    });
  };

  const deleteFn = async (id) => {
    await deleteResourceReq({ resourceId: id, menuId });
    setDataSource((data) => data.filter((x) => x.resourceId !== id));
    reloadFn();
  };
  const columns = [
    {
      title: "接口名称",
      dataIndex: "resourceName",
      formItemProps: {
        rules: defaultRules,
      },
    },
    {
      title: "接口地址",
      dataIndex: "requestUrl",
      ellipsis: true,
      formItemProps: {
        rules: defaultRules,
      },
    },
    {
      title: "接口状态",
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
      title: "需要登录",
      dataIndex: "requiredLoginFlag",
      valueEnum: {
        Y: {
          text: "是",
        },
        N: {
          text: "否",
        },
      },
      formItemProps: {
        rules: defaultRules,
      },
    },
    {
      title: "需要权限验证",
      dataIndex: "requiredPermissionFlag",
      valueEnum: {
        Y: {
          text: "是",
        },
        N: {
          text: "否",
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
              action?.startEditable?.(record.resourceId);
            }}
          >
            编辑
          </a>
          <Popconfirm
            title="是否确定删除此条？"
            okText="是"
            cancelText="否"
            onConfirm={() => {
              deleteFn(record.resourceId);
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
        title="菜单接口管理"
        width={1000}
        bodyStyle={{ maxHeight: 600, overflow: 'auto' }}
        onCancel={onCancel}
        destroyOnClose
        footer={null}
      >
        <EditableProTable
          rowKey="resourceId"
          columns={columns}
          value={dataSource}
          editable={{
            onSave: async (rowKey, data) => {
              if (data.type === "add") {
                const {
                  resourceName,
                  requestUrl,
                  statusFlag,
                  requiredLoginFlag,
                  requiredPermissionFlag,
                } = data;
                const res = await addResourceReq({
                  menuId,
                  resourceName,
                  requestUrl,
                  statusFlag,
                  requiredLoginFlag,
                  requiredPermissionFlag,
                });
                setDataSource([...dataSource, res]);
              } else {
                await editResourceReq(data);
                setDataSource((r) =>
                  r.map((x) => {
                    if (x.resourceId === rowKey) {
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
              resourceId: (Math.random() * 1000000).toFixed(0),
              type: "add",
            }),
          }}
        />
      </Modal>
    </>
  );
}
