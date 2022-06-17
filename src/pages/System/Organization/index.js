import ProTable from "@ant-design/pro-table";
import { getOrgTreeReq } from "./services";

export default function Organization() {
  const columns = [
    {
      title: "部门名称",
      dataIndex: "orgName",
    },
    {
      title: "排序",
      dataIndex: "orgSort",
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
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
    },
    {
      title: "操作",
      dataIndex: "operation",
    },
  ];
  return (
    <ProTable
      rowKey="orgId"
      search={false}
      columns={columns}
      revalidateOnFocus={false}
      request={async () => {
        const data = await getOrgTreeReq();
        return { success: true, data };
      }}
    />
  );
}
