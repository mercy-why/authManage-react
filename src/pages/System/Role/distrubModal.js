import { Modal, Tree, Tag, Space } from "antd";
import { useState } from "react";
import { getList } from "../Menu/services";
import { useEffectOnce } from "@/hooks/utils";

const transformButtons = (buttons) => {
  if (!buttons) {
    return [];
  }
  return buttons.map((x) => ({
    key: x.buttonId,
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
      children: transformChildren(children, buttons, resources),
    };
  });
};

export default function DistrubBtnModal({ distrubState, cancelFn }) {
  const { visible, roleId } = distrubState;
  const [checkKeys, setCheckKeys] = useState([]);
  const onCheck = (checkedKeys) => {
    setCheckKeys(checkedKeys);
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
  useEffectOnce(() => {
    initList();
  });
  return (
    <Modal
      visible={visible}
      title="分配权限"
      width={600}
      onCancel={cancelFn}
      destroyOnClose
      bodyStyle={{ height: "500px", overflow: "auto" }}
    >
      <Tree
        checkable
        defaultExpandAll
        checkedKeys={checkKeys}
        onCheck={onCheck}
        treeData={treeData}
        re
      />
    </Modal>
  );
}
