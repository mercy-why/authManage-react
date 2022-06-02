import request from "@/request";

export const getLoginUserInfoReq = async (data) => {
  return request({
    url: "/user/getLoginUserInfo",
    data,
  });
};
