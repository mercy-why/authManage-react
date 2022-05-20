import { Modal, Tree, Tag, Space } from "antd";
import { useState, useEffect } from "react";
import { getList } from "../Menu/services";
import { useEffectOnce } from "@/hooks/utils";
import { distrubReq, getPermissionsByRoleId } from "./services";

const transformButtons = (buttons) => {
  if (!buttons) {
    return [];
  }
  return buttons.map((x) => ({
    key: x.buttonId,
    buttonId: x.buttonId,
    menuId: x.menuId,
    title: (
      <Space>
        {x.buttonName} <Tag color="success">按钮</Tag>
      </Space>
    ),
  }));
};
const transformResources = (resources) => {
  if (!resources) {
    return [];
  }
  return resources.map((x) => ({
    key: x.resourceId,
    resourceId: x.resourceId,
    title: (
      <Space>
        {x.resourceName} <Tag color="processing">接口</Tag>
      </Space>
    ),
  }));
};

const transformChildren = (children, buttons, resources) => {
  if (children) {
    return loopTree(children);
  } else {
    return [...transformButtons(buttons), ...transformResources(resources)];
  }
};
const loopTree = (tree) => {
  return tree.map(({ menuId, menuName, children, buttons, resources }) => {
    return {
      title: menuName,
      key: menuId,
      menuId,
      children: transformChildren(children, buttons, resources),
    };
  });
};
export default function DistrubBtnModal({ distrubState, cancelFn }) {
  const { visible, roleId } = distrubState;
  const [checkKeys, setCheckKeys] = useState([]);
  const [result, setResult] = useState({});
  const transformIds = (nodes) => {
    if (!nodes) {
      return {};
    }
    const obj = {
      role: {
        roleId,
      },
      menus: [],
      menuButtons: [],
      resources: [],
    };
    nodes.forEach((item) => {
      item.menuId && obj.menus.push({ menuId: item.menuId });
      item.buttonId &&
        obj.menuButtons.push({ buttonId: item.buttonId, menuId: item.menuId });
      item.resourceId && obj.resources.push({ resourceId: item.resourceId });
    });
    return obj;
  };
  const onCheck = (checkedKeys, e) => {
    setCheckKeys(checkedKeys);
    setResult(transformIds(e.checkedNodes));
  };

  const [treeData, setTreeData] = useState([]);

  const initList = async () => {
    try {
      const res = await getList();
      setTreeData(loopTree(res));
    } catch (error) {
      console.log(error);
    }
  };

  const initCheckList = async (roleId) => {
    try {
      const res = await getPermissionsByRoleId({ roleId });
      const buttonIds = res.buttonIds || "";
      const menuIds = res.menuIds || "";
      const resourceIds = res.resourceIds || "";
      const keys = [
        ...buttonIds.split(","),
        ...menuIds.split(","),
        ...resourceIds.split(","),
      ];
      setCheckKeys(keys);
    } catch (error) {
      console.log(error);
    }
  };
  useEffectOnce(() => {
    initList();
  });

  useEffect(() => {
    if (roleId) {
      initCheckList(roleId);
    }
  }, [roleId]);
  const onCancel = () => {
    cancelFn();
    setCheckKeys([]);
    setResult({});
  };
  const saveFn = async () => {
    await distrubReq(result);
    onCancel();
  };
  return (
    <Modal
      visible={visible}
      title="分配权限"
      width={600}
      onCancel={onCancel}
      bodyStyle={{ height: "500px", overflow: "auto" }}
      onOk={saveFn}
    >
      <Tree
        checkStrictly
        checkable
        defaultExpandAll
        checkedKeys={checkKeys}
        onCheck={onCheck}
        treeData={treeData}
      />
    </Modal>
  );
}
