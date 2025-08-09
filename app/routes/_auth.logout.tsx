import type { ActionFunctionArgs } from "react-router";
import { redirect } from "react-router";

import { logout } from "@/lib/session/session.server";

export function action({ request }: ActionFunctionArgs) {
  return logout(request);
}

// remember that remix refetches the page after the action is run
export function loader() {
  return redirect("/login");
}
