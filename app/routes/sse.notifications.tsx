import { eventStream } from "@/lib/server-sent-events/events.server";
import { requireUserId } from "@/lib/session/session.server";

export async function loader({ request }: { request: Request }) {
  const userId = await requireUserId(request);

  return eventStream(request, userId);
}
