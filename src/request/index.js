import axios from "axios";
import { message } from "antd";
import codeMessage from "./codeMessage";

const service = axios.create({
  baseURL: "/api",
  timeout: 1000 * 60 * 5,
  method: "post",
});

service.interceptors.request.use(
  (config) => {
    if (!config.noAuth) {
      const Authorization = localStorage.getItem("Authorization");
      if (Authorization) {
        config.headers.Authorization = Authorization;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
service.interceptors.response.use(
  (response) => {
    const { withFullResponse } = response.config;
    return withFullResponse ? response : response.data;
  },
  (error) => {
    const { status } = error?.response || {};
    const msg = error?.response.data || codeMessage[status];
    message.destroy();
    message.error(msg || "请求错误");
    if (status === 401) {
      localStorage.clear();
      const pathname = window.location.pathname;
      window.location.replace(pathname + "#/login");
    }
    return Promise.reject(error);
  }
);
export default service;
