module.exports = {
  "/api": {
    target: "http://192.168.8.150:8088",
    changeOrign: true,
    pathRewrite: {
      "^/api": "",
    },
  },
};
