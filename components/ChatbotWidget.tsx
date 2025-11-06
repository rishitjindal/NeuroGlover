import React, { useState, useRef, useEffect } from 'react';
import { BotIcon, SendIcon, XIcon, LinkIcon } from './icons';
import { getChatResponse } from '../services/geminiService';
import type { ChatMessage, SensorDataPoint } from '../types';
import { MessageRole, BluetoothConnectionStatus } from '../types';

interface ChatbotWidgetProps {
  sensorData: SensorDataPoint[];
  historicalData: SensorDataPoint[];
  bluetoothStatus: BluetoothConnectionStatus;
  latestValue: number | null;
}

const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({ sensorData, historicalData, bluetoothStatus, latestValue }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: MessageRole.MODEL, text: "Hello! I'm your AI assistant, connected to this dashboard. I can see your device status and sensor data. How can I help?" },
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    const newMessages: ChatMessage[] = [...messages, { role: MessageRole.USER, text: userInput }];
    setMessages(newMessages);
    setUserInput('');
    setIsLoading(true);

    try {
      const contextSummary = `
      - Bluetooth connection: ${bluetoothStatus}
      - Latest sensor value: ${latestValue ?? 'N/A'}
      - Live data points shown (last 50): ${sensorData.length}
      - Total historical data points stored: ${historicalData.length}
      `;
      const { text, sources } = await getChatResponse(newMessages, contextSummary);
      setMessages([...newMessages, { role: MessageRole.MODEL, text, sources }]);
    } catch (error) {
      console.error(error);
      setMessages([...newMessages, { role: MessageRole.MODEL, text: "I'm having trouble connecting. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-accent text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent focus:ring-offset-primary"
        aria-label="Toggle Chat"
      >
        {isOpen ? <XIcon className="w-8 h-8"/> : <BotIcon className="w-8 h-8" />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-full max-w-sm h-[60vh] bg-secondary rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-highlight animate-fade-in-up">
          <header className="p-4 bg-highlight flex items-center justify-between">
            <h3 className="text-lg font-semibold text-text-primary">AI Assistant</h3>
          </header>
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex items-start gap-3 ${msg.role === MessageRole.USER ? 'justify-end' : ''}`}>
                  {msg.role === MessageRole.MODEL && <BotIcon className="w-6 h-6 text-accent flex-shrink-0 mt-1" />}
                  <div className={`max-w-xs md:max-w-sm px-4 py-2 rounded-xl ${msg.role === MessageRole.USER ? 'bg-accent text-white rounded-br-none' : 'bg-primary text-text-primary rounded-bl-none'}`}>
                    <p className="text-sm break-words whitespace-pre-wrap">{msg.text}</p>
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-highlight/50">
                        <h4 className="text-xs font-semibold text-text-secondary mb-1 flex items-center gap-1">
                            <LinkIcon className="w-3 h-3"/> Sources:
                        </h4>
                        <ul className="space-y-1">
                          {msg.sources.map((source, i) => (
                            <li key={i}>
                              <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline truncate block">
                                {source.title}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-3">
                  <BotIcon className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div className="px-4 py-3 rounded-xl bg-primary text-text-primary rounded-bl-none">
                    <div className="flex items-center space-x-1">
                        <span className="w-2 h-2 bg-accent rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                        <span className="w-2 h-2 bg-accent rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                        <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
          <form onSubmit={handleSendMessage} className="p-4 bg-primary border-t border-highlight">
            <div className="flex items-center bg-secondary rounded-lg">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Ask anything..."
                className="flex-1 bg-transparent px-4 py-2 text-text-primary placeholder-text-secondary focus:outline-none"
                disabled={isLoading}
              />
              <button type="submit" className="p-2 text-accent disabled:text-text-secondary hover:text-blue-400 transition-colors" disabled={isLoading || !userInput.trim()}>
                <SendIcon className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(1rem); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default ChatbotWidget;