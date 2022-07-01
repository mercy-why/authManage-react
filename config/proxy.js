const IP = "192.168.8.150:8088";

module.exports = {
  "/cms": {
    target: "http://" + IP,
    changeOrign: true,
  },
  "/files": {
    target: "http://" + IP,
    changeOrign: true,
  },
};
