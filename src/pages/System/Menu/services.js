import request from "@/request";
import { message } from "antd";
const PREFIX = "/menu";

export const getList = (data) =>
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

export const addReq = async (data) => {
  try {
    await addMenu(data);
    message.success("添加成功");
  } catch (error) {
    console.log(error);
  }
};

export const editReq = async (data) => {
  try {
    await update(data);
    message.success("修改成功");
  } catch (error) {
    console.log(error);
  }
};

export const deleteReq = async (data) => {
  try {
    await del(data);
    message.success("删除成功");
  } catch (error) {
    console.log(error);
  }
};
