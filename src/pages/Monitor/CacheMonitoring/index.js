import ProDescriptions from "@ant-design/pro-descriptions";
import ProCard from "@ant-design/pro-card";
import { getData } from "./services";

const columns = [
  {
    title: "Redis版本",
    dataIndex: "redis_version",
  },
  {
    title: "运行模式",
    dataIndex: "connected_slaves",
    render: (t) => (t === "0" ? "单机" : "集群"),
  },
  {
    title: "端口",
    dataIndex: "tcp_port",
  },
  {
    title: "客户端数",
    dataIndex: "connected_clients",
  },
  {
    title: "运行时间",
    dataIndex: "uptime_in_days",
    render: (t) => t + "天",
  },
  {
    title: "使用内存",
    dataIndex: "used_memory_human",
  },
  {
    title: "使用CPU",
    dataIndex: "used_cpu_user_children",
    render: (t) => +t * 100 + "%",
  },
  {
    title: "内存配置",
    dataIndex: "maxmemory_human",
  },
  {
    title: "AOF是否开启",
    dataIndex: "aof_enabled",
    valueEnum: {
      0: "否",
      1: "是",
    },
  },
  {
    title: "RDB是否成功",
    dataIndex: "rdb_last_bgsave_status",
  },
  {
    title: "Key数量",
    dataIndex: "db0",
    render: (t) => t?.split(",")[0].split("=")[1],
  },
  {
    title: "网络入口/出口",
    render: (t, r) =>
      r.instantaneous_input_kbps + "kps/" + r.instantaneous_output_kbps + "kps",
  },
];

export default function CacheMonitoring() {
  return (
    <>
      <ProCard title="基本信息" headerBordered>
        <ProDescriptions
          bordered
          column={4}
          columns={columns}
          request={async () => {
            const data = await getData();
            setInfo(data);
            return {
              success: true,
              data,
            };
          }}
        ></ProDescriptions>
      </ProCard>
    </>
  );
}
