import { useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import { useEventSource } from "@/lib/server-sent-events/event-source";

export default function Notifications() {
  const [messages, setMessages] = useState<string[]>([]);

  // Listen to the specific "expense-created" event
  useEventSource("expense-created", (data: string) => {
    setMessages((prev) => [...prev, data]);
  });

  const removeMessage = (index: number) => {
    setMessages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <ToastContainer position="top-end" className="p-3">
      {messages.map((msg, i) => (
        <Toast 
          key={i} 
          show={true} 
          delay={5000} 
          autohide
          onClose={() => removeMessage(i)}
        >
          <Toast.Header>
            <strong className="me-auto">Notification</strong>
          </Toast.Header>
          <Toast.Body>{msg}</Toast.Body>
        </Toast>
      ))}
    </ToastContainer>
  );
}
