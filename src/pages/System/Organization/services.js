import request from "@/request";

export const getOrgTreeReq = () => {
  return request({
    url: "/org/getOrgTree",
  });
};

export const addReq = (data) => {
  return request({
    url: "/org/addOrg",
    data
  });
};

export const editReq = (data) => {
  return request({
    url: "/org/updateOrgByOrgId",
    data
  });
};

export const deleteReq = (data) => {
  return request({
    url: "/org/deleteOrgByOrgId",
    data
  });
};