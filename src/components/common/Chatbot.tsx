import { useEffect, useState, useRef } from "react";
import { useTenant } from "../../context/TenantContext";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import "./Chatbot.css";

const SESSION_KEY = "chatbot_history";
const TWO_HOURS_IN_MS =  5* 60 * 1000;

export default function Chatbot() {
  // Initialize state from sessionStorage or default welcome message
  const [messages, setMessages] = useState(() => {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved) {
      const { data, timestamp } = JSON.parse(saved);
      // Check if the data is older than 2 hours
      if (Date.now() - timestamp < TWO_HOURS_IN_MS) {
        return data;
      }
    }
    return [{ sender: "bot", text: "Hello! which mobile phone are you interested in?" }];
  });

  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { tenant } = useTenant();
  const scrollRef = useRef<HTMLDivElement>(null);

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  // Save to Session Storage whenever messages change
  useEffect(() => {
    const sessionData = {
      data: messages,
      timestamp: Date.now(),
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));

    // Scroll to bottom
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-chatbot", handleOpen as EventListener);
    return () => window.removeEventListener("open-chatbot", handleOpen as EventListener);
  }, []);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    setIsSending(true);
    const newMessages = [...messages, { sender: "user", text: trimmed }];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await fetch(`${supabaseUrl}/functions/v1/whatsapp-chatbot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${supabaseAnonKey}`
        },
        body: JSON.stringify({ message: trimmed, tenantId: tenant?.tenant_id ?? null })
      });

      const data = await res.json();
      setMessages((prev: any) => [...prev, { sender: "bot", text: data.reply }]);
    } catch (error) {
      setMessages((prev: any) => [...prev, { sender: "bot", text: "Error connecting to server." }]);
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className="chatbot-launcher">
        <MessageCircle size={24} />
        <span>Chat</span>
      </button>
    );
  }

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <div className="flex-center gap-2">
          <Bot size={20} />
          <span className="chatbot-title">Assistant</span>
        </div>
        <button onClick={() => setIsOpen(false)} className="chatbot-close-btn">
          <X size={20} />
        </button>
      </div>

      <div className="chatbot-messages" ref={scrollRef}>
        {messages.map((msg: any, i: number) => (
          <div key={i} className={`message-wrapper ${msg.sender}`}>
            <div className="message-bubble">{msg.text}</div>
          </div>
        ))}
      </div>

      <div className="chatbot-footer">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask something..."
          className="chatbot-input"
          disabled={isSending}
        />
        <button onClick={sendMessage} disabled={isSending || !input.trim()} className="chatbot-send-btn">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}