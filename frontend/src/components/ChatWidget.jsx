import { useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { TextWidget } from '@livechat/widget-react';
import { Bot, MessageSquare, Send, X } from 'lucide-react';

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: 'bot',
    text: 'Hello! I am the BrainCare AI Medical Assistant. How can I assist you with brain MRI scans, tumor classifications, or report generation today?',
  },
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    const prompt = input.trim();
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = 'BrainCare AI processes brain MRI scans using a 4-block Conv2D Keras model and generates Grad-CAM spatial activation heatmaps for Glioma, Meningioma, Pituitary, and No Tumor classes.';

      const lower = prompt.toLowerCase();
      if (lower.includes('glioma') || lower.includes('meningioma') || lower.includes('pituitary') || lower.includes('tumor')) {
        botResponse = 'Our model classifies 4 categories: Glioma, Meningioma, Pituitary tumor, and Normal brain tissue (No Tumor) with 94.0% - 98.8% accuracy.';
      } else if (lower.includes('gradcam') || lower.includes('grad-cam') || lower.includes('heatmap') || lower.includes('visual')) {
        botResponse = 'Grad-CAM (Gradient-weighted Class Activation Mapping) visualizes which focal regions of the MRI image influenced the neural network prediction.';
      } else if (lower.includes('pdf') || lower.includes('report') || lower.includes('download')) {
        botResponse = 'You can download an official PDF Medical Report containing side-by-side MRI scans, Grad-CAM overlays, and confidence tables from the Results or Reports page.';
      } else if (lower.includes('upload') || lower.includes('scan') || lower.includes('mri')) {
        botResponse = 'To analyze a scan, click "Analyze a New MRI" on the top navigation bar, upload a JPG or PNG image, and click "Run Diagnostic Analysis".';
      }

      setMessages((prev) => [...prev, { id: Date.now() + 1, sender: 'bot', text: botResponse }]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <>
      {/* Hidden LiveChat Background Listener */}
      <div className="hidden">
        <TextWidget organizationId="1d25eda1-02af-45fd-95d4-db7bcc330671" />
      </div>

      {/* Floating Chatbot Lottie Trigger Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {isOpen ? (
          <div className="mb-4 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
            {/* Header */}
            <div className="flex items-center justify-between bg-slate-900 p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-indigo-600/30 p-1 flex items-center justify-center border border-indigo-400/40 overflow-hidden">
                  <DotLottieReact
                    src="https://lottie.host/26c57f02-cace-42ba-9b34-c4aab94d5257/zbxBLgAX3V.lottie"
                    loop
                    autoplay
                    className="h-full w-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">BrainCare AI Assistant</h3>
                  <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="h-80 overflow-y-auto p-4 space-y-3 bg-slate-50/50 text-sm">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-primary-500 text-white rounded-br-none shadow-sm'
                        : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-4 py-2 text-xs text-slate-400 flex items-center gap-1.5">
                    <Bot className="h-3.5 w-3.5 animate-spin text-indigo-500" /> Thinking...
                  </div>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="border-t border-slate-200 bg-white p-3 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about MRI scans or diagnosis..."
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-primary-500"
              />
              <button
                type="submit"
                className="rounded-xl bg-primary-500 p-2 text-white hover:bg-primary-600 shadow-sm"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        ) : null}

        {/* Lottie Floating Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 p-1.5 text-white shadow-xl ring-4 ring-indigo-500/20 transition-all hover:scale-105 hover:bg-slate-800 active:scale-95"
          title="Chat with BrainCare AI Assistant"
        >
          <div className="h-full w-full overflow-hidden rounded-full flex items-center justify-center">
            <DotLottieReact
              src="https://lottie.host/26c57f02-cace-42ba-9b34-c4aab94d5257/zbxBLgAX3V.lottie"
              loop
              autoplay
              className="h-full w-full object-contain"
            />
          </div>
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-indigo-500"></span>
          </span>
        </button>
      </div>
    </>
  );
}
