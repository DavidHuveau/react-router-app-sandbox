// Store clients by userId - simpler and more direct
let clients: Record<string, ((eventName: string, data: string) => void)[]> = {};

export function eventStream(request: Request, userId: string) {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      
      const write = (eventName: string, data: string) => {
        controller.enqueue(encoder.encode(`event: ${eventName}\ndata: ${data}\n\n`));
      };

      // Store the write function in memory for this userId
      if (!clients[userId]) clients[userId] = [];
      clients[userId].push(write);

      // Welcome message
      write("connected", "✅");

      // Cleanup when client closes the connection
      request.signal.addEventListener("abort", () => {
        clients[userId] = clients[userId].filter((w) => w !== write);
        if (clients[userId].length === 0) {
          delete clients[userId];
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-store, no-transform",
      Connection: "keep-alive",
    },
  });
}

export function notifyUserWithEvent(userId: string, eventName: string, data: string) {
  if (clients[userId]) {
    clients[userId].forEach((write) => {
      try {
        write(eventName, data);
      } catch (error) {
        console.error(`Error sending event to user ${userId}:`, error);
      }
    });
  }
}
