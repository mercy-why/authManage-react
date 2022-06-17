import { useContext } from "react";
import { UserContext } from "@/layout";
export default function Access({ children, buttonCode }) {
  const { user } = useContext(UserContext);
  const { hasAccess } = user;
  return hasAccess && hasAccess(buttonCode) ? children : null;
}
