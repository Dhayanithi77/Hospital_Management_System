import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User, Loader2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { doctors, staff, attendance, workloadData, departmentActivity } from '../../data/mockData';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function ChatBot({ variant = 'floating' }: { variant?: 'floating' | 'inline' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', content: string }[]>([
    { role: 'bot', content: 'Hello! I am your MedPro Assistant. How can I help you identify hospital activities today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const hospitalContext = `
    You are a hospital management assistant. Your goal is to provide QUICK, ACTIONABLE answers to hospital staff.
    
    CURRENT HOSPITAL STATE:
    - ESSENTIALS: 
      * Water Supply: 75% (Status: Optimal. Level: 15,000 Liters)
      * Oxygen Level: 92% (Status: Optimal. Cylinders: 145 Available, 12 in Use)
      * Power Backup: 100% (Status: Main Grid Active. Generators: Standby)
      * Medical Gas: 85% (Status: Optimal. Pressure: 55 PSI)
    - PHARMACY (Critical Alerts):
      * Paracetamol: 1200 units (Stable)
      * Amoxicillin: 450 units (Low Stock - Action: Reorder 500 units immediately)
      * Insulin: 50 units (CRITICAL - Action: Emergency restock required. Contact supplier now.)
    - VEHICLES & EQUIPMENT:
      * ALS Ambulances: 8 total, 3 available (Status: High Demand. Action: Prioritize critical calls)
      * BLS Ambulances: 12 total, 7 available (Status: Stable)
      * Patient Transport: 5 total, 2 available
      * Stretchers: 45 total, 12 available (Status: Limited. Action: Check ER for idle units)
    - STAFFING:
      * Doctors: ${doctors.map(d => `${d.name} (${d.department}, ${d.status})`).join(', ')}
      * Staff: ${staff.map(s => `${s.name} (${s.role}, ${s.department})`).join(', ')}
      * Attendance: ${attendance.length} records today.
    - CAPACITY:
      * Department Activity: ${departmentActivity.map(d => `${d.name}: ${d.current}% capacity`).join(', ')}
    - BLOOD BANK:
      * O Positive: 12 units (Low - Action: Request donors)
      * A Negative: 4 units (CRITICAL - Action: Urgent reorder)
      * B Positive: 28 units (Optimal)
      * AB Negative: 2 units (CRITICAL - Action: Emergency supply check)

    INSTRUCTIONS:
    1. For resource queries (water, oxygen, beds, etc.), start with the EXACT number/percentage.
    2. ALWAYS include a "Status" and a "Recommended Action" if the level is not optimal.
    3. If a level is CRITICAL, use all caps for the action.
    4. Keep responses under 2 sentences for simple queries.
    5. Use bold text for key metrics and actions.
  `;

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { role: 'user', parts: [{ text: hospitalContext + "\n\nUser: " + userMessage }] }
        ],
      });

      const botResponse = response.text || "I'm sorry, I couldn't process that request.";
      setMessages(prev => [...prev, { role: 'bot', content: botResponse }]);
    } catch (error) {
      console.error("ChatBot Error:", error);
      setMessages(prev => [...prev, { role: 'bot', content: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerButton = (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className={cn(
        "transition-all duration-300 flex items-center gap-2 group relative",
        variant === 'floating' 
          ? cn("p-4 rounded-2xl shadow-lg", isOpen ? "bg-secondary text-white" : "bg-primary text-secondary hover:scale-105")
          : cn("px-4 py-2 rounded-xl text-sm font-semibold", isOpen ? "bg-secondary text-white shadow-lg" : "text-slate-500 hover:bg-slate-50")
      )}
    >
      {isOpen ? <X className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      <span className={cn("font-bold", variant === 'floating' ? "text-sm hidden md:inline" : "")}>
        {variant === 'floating' ? 'Hospital AI' : 'AI Assistant'}
      </span>
      {!isOpen && variant === 'floating' && (
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-white animate-pulse"></span>
      )}
    </button>
  );

  return (
    <>
      {variant === 'floating' ? (
        <div className="fixed bottom-8 left-8 z-[60]">
          {triggerButton}
        </div>
      ) : triggerButton}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-5xl h-full max-h-[85vh] rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="bg-secondary p-6 text-white flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3">
                    <Bot className="w-7 h-7 text-secondary" />
                  </div>
                  <div>
                    <h2 className="font-bold text-xl tracking-tight">MedPro AI Assistant</h2>
                    <p className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                      Real-time Hospital Intelligence Active
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="p-3 hover:bg-white/10 rounded-2xl transition-colors group"
                >
                  <X className="w-6 h-6 text-slate-300 group-hover:text-white transition-colors" />
                </button>
              </div>

              {/* Messages Area */}
              <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/30"
              >
                <div className="max-w-3xl mx-auto space-y-6">
                  {messages.map((msg, i) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={i} 
                      className={cn(
                        "flex gap-4",
                        msg.role === 'user' ? "flex-row-reverse" : ""
                      )}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm",
                        msg.role === 'user' ? "bg-slate-200" : "bg-primary/20"
                      )}>
                        {msg.role === 'user' ? <User className="w-5 h-5 text-slate-600" /> : <Bot className="w-5 h-5 text-primary" />}
                      </div>
                      <div className={cn(
                        "p-4 rounded-2xl text-base leading-relaxed shadow-sm max-w-[80%]",
                        msg.role === 'user' 
                          ? "bg-secondary text-white rounded-tr-none" 
                          : "bg-white border border-slate-100 text-slate-700 rounded-tl-none"
                      )}>
                        {msg.content}
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shadow-sm">
                        <Loader2 className="w-5 h-5 text-primary animate-spin" />
                      </div>
                      <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm">
                        <div className="flex gap-1.5">
                          <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></span>
                          <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                          <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Prominent Search/Input Area */}
              <div className="p-8 bg-white border-t border-slate-100">
                <div className="max-w-3xl mx-auto">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-primary/5 rounded-[2rem] blur-xl group-focus-within:bg-primary/10 transition-all"></div>
                    <div className="relative flex items-center bg-slate-50 rounded-[2rem] p-2 border-2 border-transparent focus-within:border-primary/20 focus-within:bg-white transition-all shadow-inner">
                      <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Search hospital activity, resources, or staff status..."
                        className="flex-1 bg-transparent border-none py-4 px-6 text-lg focus:ring-0 outline-none placeholder:text-slate-400"
                        autoFocus
                      />
                      <button 
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="p-4 bg-primary text-secondary rounded-[1.5rem] disabled:opacity-50 disabled:hover:scale-100 transition-all hover:scale-105 hover:shadow-lg active:scale-95 ml-2"
                      >
                        <Send className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3 mt-6">
                    {['Water levels', 'Oxygen availability', 'Doctor shifts', 'Pharmacy stock'].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => setInput(suggestion)}
                        className="px-4 py-2 rounded-full bg-slate-100 text-slate-600 text-xs font-bold hover:bg-primary hover:text-secondary transition-all"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-400 text-center mt-6 font-medium uppercase tracking-widest">
                    Powered by Gemini AI • Enterprise Medical Intelligence
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
