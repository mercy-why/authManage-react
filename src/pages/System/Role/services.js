import request from "@/request";

const PREFIX = "/role";

export const getRolePage = (data) =>
  request({
    url: `${PREFIX}/getRolePage`,
    data,
  });

export const addRole = (data) =>
  request({
    url: `${PREFIX}/addRole`,
    data,
  });

export const updateRoleById = (data) =>
  request({
    url: `${PREFIX}/updateRoleById`,
    data,
  });

export const deleteRoleById = (data) =>
  request({
    url: `${PREFIX}/deleteRoleById`,
    data,
  });
