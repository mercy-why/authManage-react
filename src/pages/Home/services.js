import request from "@/request";

export const testReq = () => {
  return request({
    url: "/org/getOrgTree",
  });
};
