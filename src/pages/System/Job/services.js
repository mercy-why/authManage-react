import request from "@/request";

export const getPositionPage = (data) => {
  return request({
    url: "/position/getPositionPage",
    data,
  });
};
