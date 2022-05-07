import { LoginForm, ProFormText } from "@ant-design/pro-form";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import style from "./index.module.less";
import { useNavigate } from "react-router-dom";
export default function Login() {
  const navigate = useNavigate();
  const loginFn = async () => {
    navigate("/");
  };
  return (
    <div className={style.loginX}>
      <LoginForm
        title="Github"
        subTitle="全球最大同性交友网站"
        onFinish={loginFn}
      >
        <ProFormText
          name="username"
          fieldProps={{
            size: "large",
            prefix: <UserOutlined className={"prefixIcon"} />,
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
            prefix: <LockOutlined className={"prefixIcon"} />,
          }}
          placeholder={"密码: ant.design"}
          rules={[
            {
              required: true,
              message: "请输入密码！",
            },
          ]}
        />
      </LoginForm>
    </div>
  );
}
