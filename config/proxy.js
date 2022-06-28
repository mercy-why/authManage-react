const IP = "192.168.8.150";

module.exports = {
  "/api": {
    target: "http://" + IP + ":8088",
    changeOrign: true,
    pathRewrite: {
      "^/api": "",
    },
  },
  "/files": {
    target: "http://" + IP + ":8088",
    changeOrign: true,
  },
};
