import axios from "axios";
import { message } from "antd";
import codeMessage from "./codeMessage";

const service = axios.create({
  baseURL: "/api",
  timeout: 1000 * 60 * 5,
  auth: {
    username: "janedoe",
    password: "s00pers3cret",
  },
});

service.interceptors.request.use((config) => {
  const authorization = localStorage.getItem("authorization");

  return config;
});
service.interceptors.response.use(
  (response) => {
    const code = response.data.code;
    // 请求成功：可以做全局的 toast 展示，或者对 response 做一些格式化
    if (code === 401) {
      //   history?.replace({
      //     pathname: "/login",
      //     search: `redirect=${history?.location.pathname}`,
      //   });
    }
    return response.data;
  },
  (error) => {
    const { status } = error?.response || {};
    const msg = status ? codeMessage[status] : "请求错误";
    message.destroy();
    message.error(msg || "请求错误");
    return Promise.reject(error);
  }
);
export default service;
