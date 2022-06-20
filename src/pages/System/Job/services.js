import request from "@/request";

export const getPositionPage = (data) => {
  return request({
    url: "/position/getPositionPage",
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