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

export const initReq = async ({
  current,
  pageSize: size,
  roleName,
  roleCode,
}) => {
  try {
    const { records, total } = await getList({
      current,
      size,
      roleName,
      roleCode,
    });
    return {
      success: true,
      data: records,
      total,
    };
  } catch (error) {
    return {
      success: false,
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
