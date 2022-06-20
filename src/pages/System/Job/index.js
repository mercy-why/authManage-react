import ProTable from "@ant-design/pro-table";
import { getPositionPage } from "./services";

function Job() {
  const columns = [
    {
      title: "岗位名称",
      dataIndex: "positionName",
    },
    {
      title: "岗位编码",
      dataIndex: "positionCode",
    },
    {
      title: "排序",
      dataIndex: "positionSort",
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
      search: false,
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      search: false,
    },
    {
      title: "操作",
      dataIndex: "operation",
    },
  ];
  return (
    <ProTable
      rowKey="positionId"
      columns={columns}
      revalidateOnFocus={false}
      request={async ({
        current: pageNo,
        pageSize,
        positionName,
        positionCode,
      }) => {
        const { list, totalCount } = await getPositionPage({
          pageNo,
          pageSize,
          positionName,
          positionCode,
        });
        return { success: true, data: list, total: totalCount };
      }}
    />
  );
}

export default Job;
