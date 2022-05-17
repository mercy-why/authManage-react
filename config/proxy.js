module.exports = {
  "/api": {
    target: "http://192.168.1.107:9000",
    changeOrign: true,
    pathRewrite: {
      "^/api": "",
    },
  },
};
