import request from "@/request";

export const loginReq = async (data) => {
  return request({
    url: "/user/login",
    data,
    withFullResponse: true,
    noAuth: true,
  });
};

export const getCaptchaReq = async (data) => {
  return request({
    url: "/user/getCaptcha",
    data,
    noAuth: true,
  });
};
