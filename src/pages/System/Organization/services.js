import request from "@/request";

export const getOrgTreeReq = () => {
  return request({
    url: "/org/getOrgTree",
  });
};
