export const defaultModalFormSetting = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
  grid: true,
  width: 500,
  layout: "horizontal",
  modalProps: {
    destroyOnClose: true,
    maskClosable: false,
  },
};

export const defaultTableSetting = {
  revalidateOnFocus: false,
  pagination: {
    pageSize: 10,
    showSizeChanger: true,
  },
};
