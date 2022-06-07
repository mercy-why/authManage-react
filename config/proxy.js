module.exports = {
  "/api": {
    target: "http://192.168.1.118:8088",
    changeOrign: true,
    pathRewrite: {
      "^/api": "",
    },
  },
};
