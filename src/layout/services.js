import request from "@/request";

export const getLoginUserInfoReq = async (data) => {
  return request({
    url: "/user/getLoginUserInfo",
    data,
  });
};

export const logoutReq = async (data) => {
  return request({
    url: "/user/logout",
    data,
  });
};
