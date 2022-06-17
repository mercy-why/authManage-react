import request from "@/request";
import { message } from "antd";

const PREFIX = "/role";

const getList = (data) =>
  request({
    url: `${PREFIX}/getRolePage`,
    data,
  });

const add = (data) =>
  request({
    url: `${PREFIX}/addRole`,
    data,
  });

const update = (data) =>
  request({
    url: `${PREFIX}/updateRoleById`,
    data,
  });

const del = (data) =>
  request({
    url: `${PREFIX}/deleteRoleById`,
    data,
  });

const assignPermissions = (data) =>
  request({
    url: `${PREFIX}/assignPermissions`,
    data,
  });

export const getPermissionsByRoleId = (data) =>
  request({
    url: `${PREFIX}/getPermissionsByRoleId`,
    data,
  });

export const initReq = async ({
  current: pageNo,
  pageSize,
  roleName,
  roleCode,
}) => {
  try {
    const { list, totalCount } = await getList({
      pageNo,
      pageSize,
      roleName,
      roleCode,
    });
    return {
      success: true,
      data: list,
      total: totalCount,
    };
  } catch (error) {
    return {
      success: false,
      data: [],
    };
  }
};

export const addReq = async (data) => {
  try {
    await add(data);
    message.success("添加成功");
  } catch (error) {
    return Promise.reject(error);
  }
};

export const editReq = async (data) => {
  try {
    await update(data);
    message.success("修改成功");
  } catch (error) {
    return Promise.reject(error);
  }
};

export const deleteReq = async (data) => {
  try {
    await del(data);
    message.success("删除成功");
  } catch (error) {
    return Promise.reject(error);
  }
};

export const distrubReq = async (data) => {
  try {
    await assignPermissions(data);
    message.success("分配成功");
  } catch (error) {
    return Promise.reject(error);
  }
};
