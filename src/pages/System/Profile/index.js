import ProForm, {
  Group,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton,
} from "@ant-design/pro-form";
import { message } from "antd";
import { useContext } from "react";
import { editReq, getLoginUserInfoReq, actionUrl } from "./services";
import { UserContext } from "@/context";

const defaultRules = [
  {
    required: true,
    message: "此项为必填项",
  },
];

const uniqueList = (arr) => {
  if (arr?.length === 0) {
    return [];
  }
  const uniButtonObj = {};
  const uniMenusObj = {};
  const uniResourcesObj = {};
  const roles = [];
  for (const item of arr) {
    const { menuButtons, menus, resources, role } = item;
    if (menuButtons) {
      for (const value of menuButtons) {
        if (!uniButtonObj[value.buttonId]) {
          uniButtonObj[value.buttonId] = value;
        }
      }
    }
    if (menus) {
      for (const value of menus) {
        if (!uniMenusObj[value.menuId]) {
          uniMenusObj[value.menuId] = value;
        }
      }
    }
    if (resources) {
      for (const value of resources) {
        if (!uniResourcesObj[value.resourceId]) {
          uniResourcesObj[value.resourceId] = value;
        }
      }
    }

    roles.push(role);
  }
  return {
    buttons: Object.values(uniButtonObj),
    menus: Object.values(uniMenusObj),
    resources: Object.values(uniResourcesObj),
    roles,
  };
};
function Profile() {
  const { user, setUser } = useContext(UserContext);
  const { info } = user;

  const initUserInfo = async () => {
    const data = await getLoginUserInfoReq();
    const { permissions, ...info } = data;
    const { menus, buttons, resources, roles } = uniqueList(permissions);
    setUser({
      menus,
      buttons,
      resources,
      info,
      hasAccess: (code) => {
        const isAdmin = roles.some((x) => x.roleCode === "admin");
        return isAdmin || buttons?.some((x) => x.buttonCode === code);
      },
    });
  };

  return (
    <div className="card-x">
      {info ? (
        <ProForm
          initialValues={{
            ...info,
            avatar: [{ url: info?.avatar }],
            orgIds: info?.orgs?.map((item) => item.orgName).join(),
            positionIds: info?.positions
              .map((item) => item.positionName)
              .join(),
            roleIds: info?.roles.map((item) => item.roleName).join(),
          }}
          onFinish={async (data) => {
            const { avatar, realName, account, password, phone, remark } = data;
            const value = {
              avatar: avatar[0].response,
              realName,
              account,
              password,
              phone,
              remark,
              userId: info.userId,
            };
            await editReq(value);
            initUserInfo();
            message.success("提交成功");
          }}
        >
          <Group>
            <ProFormText
              width="lg"
              name="realName"
              label="用户名称"
              placeholder="请输入用户名称"
              rules={defaultRules}
            />
            <ProFormUploadButton
              width="lg"
              name="avatar"
              label="用户头像"
              listType="picture-card"
              showUploadList={false}
              action={actionUrl}
              fieldProps={{
                headers: {
                  Authorization: localStorage.getItem("Authorization"),
                },
                data: (file) => {
                  return {
                    fieldName: file.name,
                  };
                },
                maxCount: 1,
              }}
            />
          </Group>
          <Group>
            <ProFormText
              width="lg"
              name="account"
              label="用户账号"
              placeholder="请输入用户账号"
              rules={defaultRules}
            />
            <ProFormText.Password
              width="lg"
              name="password"
              label="用户密码"
              placeholder="请输入用户密码"
            />
          </Group>
          <Group>
            <ProFormText
              width="lg"
              name="phone"
              label="手机号码"
              placeholder="请输入手机号码"
              rules={[
                ...defaultRules,
                {
                  pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/,
                  message: "请输入正确的手机号码",
                },
              ]}
            />
            <ProFormText width="lg" name="roleIds" label="角色" disabled />
          </Group>
          <Group>
            <ProFormText width="lg" name="positionIds" label="岗位" disabled />
            <ProFormText width="lg" name="orgIds" label="归属部门" disabled />
          </Group>
          <ProFormTextArea
            name="remark"
            label="备注"
            placeholder="请输入备注"
          />
        </ProForm>
      ) : null}
    </div>
  );
}

export default Profile;
