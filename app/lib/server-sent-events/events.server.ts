// Store clients by userId - simpler and more direct
let clients: Record<string, ((msg: string) => void)[]> = {};

export function eventStream(request: Request, userId: string) {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      
      const write = (msg: string) =>
        controller.enqueue(encoder.encode(`data: ${msg}\n\n`));

      // Store the write function in memory for this userId
      if (!clients[userId]) clients[userId] = [];
      clients[userId].push(write);

      // Welcome message
      write("connected ✅");

      // Cleanup when client closes the connection
      request.signal.addEventListener("abort", () => {
        clients[userId] = clients[userId].filter((w) => w !== write);
        // Clean up empty array
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

export function notifyUser(userId: string, message: string) {
  if (clients[userId]) {
    clients[userId].forEach((write) => {
      try {
        write(message);
      } catch (error) {
        console.error(`Error sending to user ${userId}:`, error);
      }
    });
  }
}

export function notifyAll(message: string) {
  Object.keys(clients).forEach((userId) => {
    notifyUser(userId, message);
  });
}

// Export to use in actions
export { clients };
