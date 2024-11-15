import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const toastNotify = (
  type: "success" | "error" | "info" | "warn",
  msg: string
): void => {
  const validTypes = ["success", "error", "info", "warn"];

  if (!validTypes.includes(type)) {
    console.error(`Invalid toast type: ${type}`);
    return;
  }

  switch (type) {
    case "success":
      toast.success(msg);
      break;
    case "error":
      toast.error(msg);
      break;
    case "info":
      toast.info(msg);
      break;
    case "warn":
      toast.warn(msg);
      break;
    default:
      break;
  }
};

export default toastNotify;
