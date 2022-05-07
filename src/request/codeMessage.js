interface code {
  [key: number]: string;
}

const codeMessage: code = {
  400: "错误的请求",
  401: "请重新登录",
  403: "无权访问",
  404: "发出的请求针对的是不存在的记录，服务器没有进行操作。",
  405: "请求方式错误",
  500: "服务器发生错误，请检查服务器。",
  502: "网关错误。",
  503: "服务不可用，服务器暂时过载或维护。",
  504: "网关超时。",
};

export default codeMessage;
