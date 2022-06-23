import { Modal, Tree, Tag, Space, Button } from "antd";
import { useState, useEffect } from "react";
import { useEffectOnce } from "@/hooks/utils";
import { distrubReq, getPermissionsByRoleId, getMenuTree } from "./services";

export default function DistrubBtnModal({ distrubState, cancelFn }) {
  const { visible, roleId } = distrubState;
  const [checkKeys, setCheckKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allKeys, setAllKeys] = useState({
    menus: [],
    menuButtons: [],
    resources: [],
  });
  const [result, setResult] = useState(null);
  const transformButtons = (buttons) => {
    if (!buttons) {
      return [];
    }
    const ids = [];
    const list = buttons.map((x) => {
      ids.push({ buttonId: x.buttonId, menuId: x.menuId });
      return {
        key: "button-" + x.buttonId + "&MenuId-" + x.menuId,
        buttonId: x.buttonId,
        menuId: x.menuId,
        title: (
          <Space>
            {x.buttonName} <Tag color="success">按钮</Tag>
          </Space>
        ),
      };
    });
    setAllKeys((r) => {
      r.menuButtons = [...r.menuButtons, ...ids];
      return r;
    });
    return list;
  };
  const transformResources = (resources) => {
    if (!resources) {
      return [];
    }
    const ids = [];
    const list = resources.map((x) => {
      ids.push({ resourceId: x.resourceId });
      return {
        key: "resource-" + x.resourceId,
        resourceId: x.resourceId,
        title: (
          <Space>
            {x.resourceName} <Tag color="processing">接口</Tag>
          </Space>
        ),
      };
    });
    setAllKeys((r) => {
      r.resources = [...r.resources, ...ids];
      return r;
    });
    return list;
  };

  const transformChildren = (children, buttons, resources, menuId) => {
    if (children?.length > 0) {
      return loopTree(children);
    } else {
      const buttonList = transformButtons(buttons);
      const resourcesList = transformResources(resources);
      const list = [];
      if (buttonList.length > 0) {
        list.push({
          title: "按钮",
          key: "button_" + menuId,
          children: buttonList,
        });
      }
      if (resourcesList.length > 0) {
        list.push({
          title: "接口",
          key: "resource_" + menuId,
          children: resourcesList,
        });
      }
      return list;
    }
  };
  const loopTree = (tree) => {
    return tree?.map(
      ({ menuId, menuName, children, buttons, resources, menuType }) => {
        setAllKeys((r) => {
          r.menus.push({ menuId });
          return r;
        });
        return {
          title: (
            <Space>
              <span>{menuName}</span>
              {menuType === "C" ? (
                <Tag color="gold">目录</Tag>
              ) : (
                <Tag color="cyan">菜单</Tag>
              )}
            </Space>
          ),
          key: "menu-" + menuId,
          menuId,
          children: transformChildren(children, buttons, resources, menuId),
        };
      }
    );
  };
  const transformIds = (nodes) => {
    const obj = {
      role: {
        roleId,
      },
      menus: [],
      menuButtons: [],
      resources: [],
    };
    nodes.forEach((item) => {
      item.includes("menu-") &&
        obj.menus.push({ menuId: item.replace("menu-", "") });
      if (item.includes("button-")) {
        const arr = item.split("&MenuId-");
        obj.menuButtons.push({
          buttonId: arr[0].replace("button-", ""),
          menuId: arr[1],
        });
      }

      item.includes("resource-") &&
        obj.resources.push({ resourceId: item.replace("resource-", "") });
    });
    return obj;
  };
  const onCheck = (checkedKeys, e) => {
    setCheckKeys(checkedKeys);
    setResult(transformIds([...checkedKeys, ...e.halfCheckedKeys]));
  };

  const [treeData, setTreeData] = useState([]);

  const initList = async () => {
    try {
      const res = await getMenuTree();
      setTreeData(loopTree(res));
    } catch (error) {
      console.log(error);
    }
  };
  const loopMenuIds = (data, menuList, menus) => {
    data.forEach((item) => {
      if (
        menus.some((x) => x.menuId === item.menuId) &&
        !item.children?.length
      ) {
        menuList.push(item.key);
      } else if (item.children?.length > 0) {
        loopMenuIds(item.children, menuList, menus);
      }
    });
    return menuList;
  };
  const initCheckList = async (roleId) => {
    try {
      const res = await getPermissionsByRoleId({ roleId });
      const { resources, menuButtons, menus } = res;
      const keys = [
        ...(menuButtons?.map(
          (x) => "button-" + x.buttonId + "&MenuId-" + x.menuId
        ) || []),
        ...loopMenuIds(treeData, [], menus),
        ...(resources?.map((x) => "resource-" + x.resourceId) || []),
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

  const chooseNull = () => {
    setCheckKeys([]);
    setResult({
      menuButtons: [],
      menus: [],
      resources: [],
      role: { roleId },
    });
  };
  const onCancel = () => {
    cancelFn();
    chooseNull();
  };
  const saveFn = async () => {
    if (!result) {
      onCancel();
      return;
    }
    setLoading(true);
    try {
      await distrubReq(result);
      setLoading(false);
      onCancel();
    } catch (error) {
      setLoading(false);
      onCancel();
    }
  };

  const chooseAll = () => {
    const { menuButtons, menus, resources } = allKeys;
    setCheckKeys([
      ...menuButtons.map((x) => "button-" + x.buttonId + "&MenuId-" + x.menuId),
      ...menus.map((x) => "menu-" + x.menuId),
      ...resources.map((x) => "resource-" + x.resourceId),
    ]);
    setResult({ ...allKeys, role: { roleId } });
  };
  return (
    <Modal
      visible={visible}
      title="分配权限"
      width={600}
      onCancel={onCancel}
      bodyStyle={{ height: "500px", overflow: "auto" }}
      onOk={saveFn}
      footer={[
        <Button key="chooseAll" onClick={chooseAll}>
          全选
        </Button>,
        <Button key="chooseNull" onClick={chooseNull}>
          清空
        </Button>,
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={saveFn} loading={loading}>
          确定
        </Button>,
      ]}
    >
      <Tree
        checkable
        defaultExpandAll
        checkedKeys={checkKeys}
        onCheck={onCheck}
        treeData={treeData}
      />
    </Modal>
  );
}
