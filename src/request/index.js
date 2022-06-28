import axios from "axios";
import { message } from "antd";
import codeMessage from "./codeMessage";

const service = axios.create({
  baseURL: process.env.BASE_URL,
  timeout: 1000 * 60 * 5,
  method: "post",
  validateStatus: function (status) {
    return status < 400; // Resolve only if the status code is less than 400
  },
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
    if (!error.config.noHandleError) {
      const { status } = error.response || {};
      const msg = codeMessage[status];
      message.destroy();
      message.error(msg || "请求错误");
      if (status === 401) {
        localStorage.clear();
        const pathname = window.location.pathname;
        window.location.replace(pathname + "#/login");
      }
    }
    return Promise.reject(error);
  }
);
export default service;
