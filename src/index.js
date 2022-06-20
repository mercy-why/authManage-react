import { createRoot } from "react-dom/client";
import Router from "@/router";
import "@/assets/css/global.less";
import { ConfigProvider } from "antd";
import zhCN from "antd/lib/locale/zh_CN";

const root = createRoot(document.getElementById("root"));

root.render(
  <ConfigProvider locale={zhCN}>
    <Router />
  </ConfigProvider>
);
