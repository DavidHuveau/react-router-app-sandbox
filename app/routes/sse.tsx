import { emitter, eventStream, type OnSetup, type SendEvent } from "@/lib/server-sent-events/events.server";
import { requireUserId } from "@/lib/session/session.server";
import type { SSERoute } from "@/types/routes-types";

export async function loader({ request }: SSERoute.LoaderArgs) {
  const userId = await requireUserId(request);

  const onSetup: OnSetup = (send: SendEvent) => {
    function handler() {
      send("server-change", `Data change for ${userId}`);
    }
    emitter.addListener(userId, handler);
    return () => {
      emitter.removeListener(userId, handler);
    };
  };

  return eventStream(request, onSetup);
}
