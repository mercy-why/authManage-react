import request from "@/request";
import { message } from "antd";

export const loginReq = async (data) => {
  try {
    return await request({
      url: "/user/login",
      data,
      withFullResponse: true,
      noAuth: true,
      noHandleError: true
    });
  } catch (error) {
    message.error(error.response.data);
    return Promise.resolve(error);
  }
};

export const getCaptchaReq = async (data) => {
  return request({
    url: "/user/getCaptcha",
    data,
    noAuth: true,
  });
};
