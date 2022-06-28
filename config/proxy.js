const IP = "124.223.71.100";

module.exports = {
  "/api": {
    target: "http://" + IP,
    changeOrign: true,
    pathRewrite: {
      "^/api": "",
    },
  },
  "/files": {
    target: "http://" + IP,
    changeOrign: true,
  },
};
