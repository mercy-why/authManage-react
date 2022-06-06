import request from "@/request";
import { message } from "antd";
const PREFIX = "/menu";

export const getList = (data = {}) =>
  request({
    url: `${PREFIX}/getMenuTree`,
    data,
  });

const addMenu = (data) =>
  request({
    url: `${PREFIX}/addMenu`,
    data,
  });

const update = (data) =>
  request({
    url: `${PREFIX}/updateMenuById`,
    data,
  });

const del = (data) =>
  request({
    url: `${PREFIX}/deleteMenuById`,
    data,
  });

const addMenuButton = (data) =>
  request({
    url: "/menuButton/addMenuButton",
    data,
  });

const deleteMenuButtonById = (data) =>
  request({
    url: "/menuButton/deleteMenuButtonById",
    data,
  });

const updateMenuButtonById = (data) =>
  request({
    url: "/menuButton/updateMenuButtonById",
    data,
  });

const addResource = (data) =>
  request({
    url: "/resource/addResource",
    data,
  });

const deleteResourceById = (data) =>
  request({
    url: "/resource/deleteResourceById",
    data,
  });

const updateResourceById = (data) =>
  request({
    url: "/resource/updateResourceById",
    data,
  });
export const addReq = async (data) => {
  try {
    await addMenu(data);
    message.success("添加成功");
  } catch (error) {
    return Promise.reject(error);
  }
};

export const addMenuButtonReq = async (data) => {
  try {
    const res = await addMenuButton(data);
    message.success("添加成功");
    return res;
  } catch (error) {
    return Promise.reject(error);
  }
};
export const addResourceReq = async (data) => {
  try {
    const res = await addResource(data);
    message.success("添加成功");
    return res;
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

export const editBtnReq = async (data) => {
  try {
    await updateMenuButtonById(data);
    message.success("修改成功");
  } catch (error) {
    return Promise.reject(error);
  }
};
export const editResourceReq = async (data) => {
  try {
    await updateResourceById(data);
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

export const deleteBtnReq = async (data) => {
  try {
    await deleteMenuButtonById(data);
    message.success("删除成功");
  } catch (error) {
    return Promise.reject(error);
  }
};

export const deleteResourceReq = async (data) => {
  try {
    await deleteResourceById(data);
    message.success("删除成功");
  } catch (error) {
    return Promise.reject(error);
  }
};
