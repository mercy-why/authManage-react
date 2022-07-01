import request from "@/request";

export const getData = () => {
  return request({
    url: "/cacheMonitor/getRedisInfo",
  });
};
