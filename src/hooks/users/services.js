import request from "@/request";
import { message } from "antd";
export const loginReq = async (data) => {
  try {
    const res = await request({
      method: "post",
      data,
    });
    return res;
  } catch (error) {
    const msg = error?.response?.data?.message ?? "接口错误，请检查";
    message.error(msg);
  }
};
