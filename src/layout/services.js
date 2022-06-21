import request from "@/request";

export const logoutReq = async (data) => {
  return request({
    url: "/user/logout",
    data,
  });
};
