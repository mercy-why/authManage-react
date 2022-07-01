import axios from "axios";
import { message } from "antd";
import codeMessage from "./codeMessage";

const service = axios.create({
  baseURL: BASE_URL,
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
    if (response) {
      if (response.status === 200 || response.status === 201) {
        return withFullResponse ? response : response.data;
      }
    }
    return Promise.reject(response);
  },
  (error) => {
    if (!error?.config.noHandleError) {
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
