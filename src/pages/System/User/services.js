import request from "@/request";

const PREFIX = "/user";

export const getList = (data) => {
  return request({
    url: PREFIX + "/getUserPage",
    data,
  });
};

export const addReq = (data) => {
  return request({
    url: PREFIX + "/addUser",
    data,
  });
};

export const editReq = (data) => {
  return request({
    url: PREFIX + "/updateUser",
    data,
  });
};

export const delReq = (data) => {
  return request({
    url: PREFIX + "/deleteUser",
    data,
  });
};

export const getRoleList = (data = {}) => {
  return request({
    url: "/role/getRoleList",
    data,
  });
};
export const getOrgTreeReq = () => {
  return request({
    url: "/org/getOrgTree",
  });
};
export const getPositionList = (data = {}) => {
  return request({
    url: "/position/getPositionList",
    data,
  });
};

export const actionUrl =  BASE_URL + "/user/uploadAvatar";
