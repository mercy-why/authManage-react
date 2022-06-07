import {
  LoginFormPage,
  ProFormCheckbox,
  ProFormText,
} from "@ant-design/pro-form";
import { LockOutlined, UserOutlined, WalletOutlined } from "@ant-design/icons";
import style from "./index.module.less";
import { useNavigate } from "react-router-dom";
import { Space } from "antd";
import { getCaptchaReq, loginReq } from "./services";
import { useState } from "react";
import { useEffectOnce } from "@/hooks/utils";

export default function Login() {
  const navigate = useNavigate();
  const loginFn = async (values) => {
    try {
      const { captchaId } = captch;
      const params = { rememberMe: "0", ...values, captchaId };
      const res = await loginReq(params);
      localStorage.setItem("Authorization", res.headers.authorization);
      navigate("/");
    } catch (error) {
      initCatch();
    }
  };
  const [captch, setÇaptch] = useState({});
  const initCatch = async () => {
    const data = await getCaptchaReq();
    setÇaptch(data);
  };
  useEffectOnce(() => {
    initCatch();
  });

  const transformValue = (value) => {
    return {
      rememberMe: value ? "1" : "0",
    };
  };
  return (
    <div className={style.loginX}>
      <LoginFormPage
        title="Github"
        subTitle="全球最大同性交友网站"
        onFinish={loginFn}
        backgroundImageUrl="https://gw.alipayobjects.com/zos/rmsportal/FfdJeJRQWjEeGTpqgBKj.png"
        logo="https://github.githubassets.com/images/modules/logos_page/Octocat.png"
      >
        <ProFormText
          name="account"
          fieldProps={{
            size: "large",
            prefix: <UserOutlined />,
          }}
          placeholder={"用户名: admin or user"}
          rules={[
            {
              required: true,
              message: "请输入用户名!",
            },
          ]}
        />
        <ProFormText.Password
          name="password"
          fieldProps={{
            size: "large",
            prefix: <LockOutlined />,
          }}
          placeholder={"密码: 123456"}
          rules={[
            {
              required: true,
              message: "请输入密码！",
            },
          ]}
        />
        <Space className="form-space" align="top">
          <ProFormText
            name="captcha"
            fieldProps={{
              size: "large",
              prefix: <WalletOutlined />,
            }}
            placeholder={"验证码"}
            rules={[
              {
                required: true,
                message: "请输入验证码!",
              },
            ]}
          />
          <img
            src={captch.captcha}
            alt="验证码"
            height={40}
            className={style.captch}
            onClick={initCatch}
          />
        </Space>
        <div className={style.remember}>
          <ProFormCheckbox transform={transformValue} name="rememberMe">
            记住我
          </ProFormCheckbox>
        </div>
      </LoginFormPage>
    </div>
  );
}
