import { useEffect, useState } from "react";

export default function Notifications() {
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const evtSource = new EventSource(`/sse/notifications`);

    evtSource.onmessage = (event) => {
      setMessage(event.data);
    };

    // Handle errors
    evtSource.onerror = (error) => {
      console.error("SSE error:", error);
      evtSource.close();
    };

    return () => {
      evtSource.close();
    };
  }, []);

  return (
    <div className="notifications">
      <p className="text-red-600">{message}</p>
    </div>
  );
}
