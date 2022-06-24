import request from "@/request";
const PREFIX = "/onlineUser";

export const getList = (data) => {
  return request({
    url: `${PREFIX}/getOnlineUserPage`,
    data,
  });
};

export const addReq = (data) => {
  return request({
    url: "/position/addPosition",
    data,
  });
};

export const editReq = (data) => {
  return request({
    url: "/position/updatePositionById",
    data,
  });
};

export const delReq = (data) => {
  return request({
    url: "/position/deletePositionById",
    data,
  });
};

export const retreat = (data) => {
  return request({
    url: `${PREFIX}/retreat`,
    data,
  });
};