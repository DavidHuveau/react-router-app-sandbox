import { useRevalidator } from "react-router";
import { useEffect } from "react";

export function useEventSource(
  eventName: string,
  callback: (data: string) => void, 
  shouldRevalidate: boolean = false
) {
  const { revalidate } = useRevalidator();

  useEffect(() => {
    function handler(event: MessageEvent) {
      console.log(`Received server event [${new Date().toLocaleTimeString()}] - userId: `, event.data);

      callback(event.data);

      if (shouldRevalidate) {
        revalidate();
      }
    }

    const eventSource = new EventSource("/sse-notifications");
    eventSource.addEventListener(eventName, handler);

    return () => {
      eventSource.removeEventListener(eventName, handler);
      eventSource.close();
    };
  }, [revalidate, callback, shouldRevalidate, eventName]);
}
