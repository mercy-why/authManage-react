import { useReducer } from "react";

function useModal() {
  const defaultData = {
    visible: false,
    formData: null,
  };
  const reducer = (_, { type, record }) => {
    switch (type) {
      case "add":
        return { visible: true, formData: null };
      case "edit":
        return { visible: true, formData: record };
      default:
        return defaultData;
    }
  };
  const [modalState, dispatch] = useReducer(reducer, defaultData);

  const addFn = () => {
    dispatch({
      type: "add",
    });
  };

  const editFn = (record) => {
    dispatch({
      type: "edit",
      record,
    });
  };
  const clearFn = () =>
    dispatch({
      type: "clear",
    });

  return [modalState, addFn, editFn, clearFn];
}

export default useModal;
