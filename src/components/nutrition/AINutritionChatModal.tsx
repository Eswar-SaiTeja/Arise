import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Bot, 
  Send, 
  Sparkles, 
  X, 
  User, 
  Trash2, 
  AlertCircle,
  HelpCircle,
  ShieldAlert
} from 'lucide-react';
import { AINutritionMessage } from '../../types/nutrition';
import { NUTRITION_ENGINE } from '../../services/nutritionEngine';
import { nutritionStorage } from '../../services/nutritionStorage';
import { useBrand } from '../../context/BrandContext';

interface AINutritionChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AINutritionChatModal: React.FC<AINutritionChatModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentTheme } = useBrand();
  const [messages, setMessages] = useState<AINutritionMessage[]>(() => nutritionStorage.getAIChatHistory());
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const profile = nutritionStorage.getBodyProfile();
  const energy = NUTRITION_ENGINE.calculateEnergyTargets(profile);
  const macros = NUTRITION_ENGINE.calculateMacroTargets(profile, energy.dailyCalorieTarget);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const quickPrompts = [
    'What should I eat before my workout?',
    'What should I eat after exercising?',
    'Suggest high-protein vegetarian Indian meals',
    'How much protein do I need?',
    'Replace paneer with lower-fat option',
    'Affordable student budget foods'
  ];

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: AINutritionMessage = {
      id: 'msg-user-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    nutritionStorage.addAIChatMessage(userMsg);
    setMessages(nutritionStorage.getAIChatHistory());
    setInputText('');
    setIsTyping(true);

    // Simulate natural AI thinking delay
    setTimeout(() => {
      const aiReply = NUTRITION_ENGINE.processAIQuery(text, profile, energy, macros);
      nutritionStorage.addAIChatMessage(aiReply);
      setMessages(nutritionStorage.getAIChatHistory());
      setIsTyping(false);
    }, 600);
  };

  const handleClearHistory = () => {
    nutritionStorage.clearAIChatHistory();
    setMessages(nutritionStorage.getAIChatHistory());
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-hidden"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-[#121624] border border-[#252E42] rounded-3xl flex flex-col shadow-2xl h-[88vh] overflow-hidden my-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#252E42] flex items-center justify-between bg-[#0E121E]">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                backgroundColor: `${currentTheme.accentColor}20`,
                color: currentTheme.accentColor,
                border: `1px solid ${currentTheme.accentColor}40`
              }}
            >
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white font-display">AI Nutrition Advisor</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
                  Online
                </span>
              </div>
              <p className="text-[11px] text-gray-400 font-mono">
                Context: {profile.currentWeightKg}kg • Goal: {profile.fitnessGoal.replace('_', ' ')} • Diet: {profile.dietaryPreference}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClearHistory}
              title="Clear chat history"
              className="p-1.5 rounded-xl text-gray-400 hover:text-red-400 hover:bg-white/5 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Messages Log */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div 
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${currentTheme.accentColor}20`, color: currentTheme.accentColor }}
                  >
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed space-y-2 ${
                    isUser
                      ? 'bg-lime-accent text-black font-medium font-sans'
                      : 'bg-[#181F2E] border border-[#28354E] text-gray-200'
                  }`}
                >
                  <div className="whitespace-pre-line prose prose-invert prose-xs">
                    {msg.text}
                  </div>
                  <div className={`text-[10px] font-mono ${isUser ? 'text-black/60 text-right' : 'text-gray-400'}`}>
                    {msg.timestamp}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${currentTheme.accentColor}20`, color: currentTheme.accentColor }}
              >
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-[#181F2E] border border-[#28354E] rounded-2xl px-4 py-3 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-[#0E121E] border-t border-[#1F2636] flex items-center gap-2 overflow-x-auto text-[11px] font-mono">
          <Sparkles className="w-3.5 h-3.5 text-lime-accent shrink-0" />
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p)}
              className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 whitespace-nowrap transition-all"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar & Clinical Disclaimer */}
        <div className="p-4 bg-[#0A0D15] border-t border-[#252E42] space-y-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about pre-workout meals, protein requirements, Indian recipe substitutes..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-[#141A28] border border-[#252E42] rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-lime-accent font-sans"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              style={{
                backgroundColor: inputText.trim() ? currentTheme.accentColor : '#374151',
                boxShadow: inputText.trim() ? `0 0 10px ${currentTheme.glowColor}` : 'none'
              }}
              className="p-2.5 rounded-xl text-black font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4 fill-current" />
            </button>
          </form>

          <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-mono">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Educational guidance only. Not medical diagnosis or therapeutic prescription.</span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
