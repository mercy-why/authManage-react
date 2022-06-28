import request from "@/request";

const PREFIX = "/user";

export const editReq = (data) => {
  return request({
    url: PREFIX + "/updateSelf",
    data,
  });
};

export const getLoginUserInfoReq = async (data) => {
  return request({
    url: "/user/getLoginUserInfo",
    data,
  });
};

export const actionUrl = BASE_URL + "/user/uploadAvatar";
