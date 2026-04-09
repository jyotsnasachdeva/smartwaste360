import { useEffect, useState } from "react";
import { Send } from "lucide-react";
import { apiClient } from "../../api";

const quickPrompts = ["Pizza box recyclable?", "Battery disposal", "Medicine disposal", "Bubble wrap?", "Old phone?"];

export default function WasteBot() {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      content:
        "Hi! I'm WasteBot 🌱 I can help you with recycling questions, bin identification, and sustainability tips. What would you like to know?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const ask = async (prompt) => {
    if (!prompt.trim()) return;
    const userMessage = { role: "user", content: prompt, timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setTyping(true);
    const reply = await apiClient.chatbot({ message: prompt, history: messages });
    let visible = "";
    setMessages((prev) => [...prev, { role: "bot", content: "", timestamp: new Date().toISOString() }]);
    const chars = reply.response.split("");
    chars.forEach((char, index) => {
      setTimeout(() => {
        visible += char;
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { ...next[next.length - 1], content: visible };
          return next;
        });
        if (index === chars.length - 1) setTyping(false);
      }, 12 * index);
    });
  };

  useEffect(() => {
    const area = document.getElementById("wastebot-scroll");
    if (area) area.scrollTop = area.scrollHeight;
  }, [messages, typing]);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-panel dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4">
        <h3 className="text-xl font-semibold">WasteBot 🤖</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">Powered by Gemini AI</p>
      </div>
      <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => ask(prompt)}
            className="whitespace-nowrap rounded-full border border-slate-200 px-3 py-2 text-sm dark:border-slate-700"
          >
            {prompt}
          </button>
        ))}
      </div>
      <div id="wastebot-scroll" className="scrollbar-thin mb-4 h-[400px] space-y-3 overflow-y-auto rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
        {messages.map((message, index) => (
          <div key={`${message.timestamp}-${index}`} className={message.role === "bot" ? "max-w-[85%]" : "ml-auto max-w-[85%]"}>
            <div className={`rounded-2xl px-4 py-3 text-sm ${message.role === "bot" ? "bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-100" : "bg-emerald-600 text-white"}`}>
              {message.content}
            </div>
            <p className="mt-1 px-1 text-xs text-slate-400">{message.role === "bot" ? `WasteBot • ${new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "You"}</p>
          </div>
        ))}
        {typing ? <div className="w-fit rounded-2xl bg-white px-4 py-3 text-sm dark:bg-slate-800">...</div> : null}
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          ask(input);
        }}
        className="flex gap-2"
      >
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask about recycling..."
          className="flex-1 rounded-2xl border border-slate-200 bg-transparent px-4 py-3 outline-none ring-0 dark:border-slate-700"
        />
        <button type="submit" className="rounded-2xl bg-emerald-600 px-4 text-white">
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
