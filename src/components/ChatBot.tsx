

// import React, { useState, useRef, useEffect } from 'react';
// import { MessageCircle, X, Send, Bot, User } from 'lucide-react';


// interface Message {
//   id: number;
//   text: string;
//   sender: 'bot' | 'user';
//   timestamp: Date;
// }


// interface ApiResponse {
//   success: boolean;
//   response?: string;
//   error?: string;
//   timestamp?: string;
// }


// interface AIChatbotProps {
//   apiEndpoint?: string;
// }

// const API_URL = process.env.NEXT_PUBLIC_API_URL;

// const AIChatbot: React.FC<AIChatbotProps> = ({ 
//   apiEndpoint = `${API_URL}/chat`
// }) => {
//   const [isOpen, setIsOpen] = useState<boolean>(false);
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       id: 1,
//       text: "Hello! I'm here to help you with any questions about our services. How can I assist you today?",
//       sender: 'bot',
//       timestamp: new Date()
//     }
//   ]);
//   const [inputMessage, setInputMessage] = useState<string>('');
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   const scrollToBottom = (): void => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const sendMessage = async (): Promise<void> => {
//     if (!inputMessage.trim() || isLoading) return;

//     const userMessage: Message = {
//       id: Date.now(),
//       text: inputMessage,
//       sender: 'user',
//       timestamp: new Date()
//     };

//     setMessages(prev => [...prev, userMessage]);
//     setInputMessage('');
//     setIsLoading(true);

//     try {
//       const response = await fetch(apiEndpoint, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ message: inputMessage }),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data: ApiResponse = await response.json();
      
//       const botMessage: Message = {
//         id: Date.now() + 1,
//         text: data.response || 'Sorry, I encountered an error. Please try again.',
//         sender: 'bot',
//         timestamp: new Date()
//       };

//       setMessages(prev => [...prev, botMessage]);
//     } catch (error) {
//       console.error('Chat error:', error);
      
//       const errorMessage: Message = {
//         id: Date.now() + 1,
//         text: 'Sorry, I\'m having trouble connecting right now. Please try again later.',
//         sender: 'bot',
//         timestamp: new Date()
//       };
//       setMessages(prev => [...prev, errorMessage]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   const toggleChat = (): void => {
//     setIsOpen(!isOpen);
//   };

//   const resetChat = (): void => {
//     setMessages([
//       {
//         id: 1,
//         text: "Hello! I'm here to help you with any questions about our website and services. How can I assist you today?",
//         sender: 'bot',
//         timestamp: new Date()
//       }
//     ]);
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
//     setInputMessage(e.target.value);
//   };

//   return (
//     <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      
//       {isOpen && (
//         <div className="mb-4 w-[calc(100vw-2rem)] max-w-sm h-[70vh] max-h-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col animate-in slide-in-from-bottom-5 duration-300 sm:w-80 sm:h-96 sm:max-w-none">
         
//           <div className="bg-gradient-to-r from-yellow-500 via-orange-400 to-orange-500 text-white p-3 sm:p-4 rounded-t-lg flex justify-between items-center">
//             <div className="flex items-center space-x-2">
//               <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
//               <h3 className="font-semibold text-sm sm:text-base">AI Support</h3>
//             </div>
//             <div className="flex items-center space-x-2">
//               <button
//                 onClick={resetChat}
//                 className="text-white hover:text-gray-200 text-xs sm:text-sm px-2 py-1 rounded hover:bg-white hover:bg-opacity-20 transition-colors"
//                 title="New Chat"
//                 type="button"
//               >
//                 Reset
//               </button>
//               <button
//                 onClick={toggleChat}
//                 className="text-white hover:text-gray-200 p-1 rounded hover:bg-white hover:bg-opacity-20 transition-colors"
//                 type="button"
//                 aria-label="Close chat"
//               >
//                 <X className="w-4 h-4 sm:w-5 sm:h-5" />
//               </button>
//             </div>
//           </div>

          
//           <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 sm:space-y-3 min-h-0">
//             {messages.map((message: Message) => (
//               <div
//                 key={message.id}
//                 className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
//               >
//                 <div
//                   className={`max-w-[85%] sm:max-w-xs lg:max-w-md px-3 py-2 rounded-lg flex items-start space-x-2 text-sm ${
//                     message.sender === 'user'
//                       ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
//                       : 'bg-gray-100 text-gray-800'
//                   }`}
//                 >
//                   {message.sender === 'bot' && (
//                     <Bot className="w-4 h-4 mt-0.5 flex-shrink-0 text-orange-600" />
//                   )}
//                   <div className="text-xs sm:text-sm leading-relaxed">
//                     {message.text}
//                   </div>
//                   {message.sender === 'user' && (
//                     <User className="w-4 h-4 mt-0.5 flex-shrink-0" />
//                   )}
//                 </div>
//               </div>
//             ))}
            
//             {isLoading && (
//               <div className="flex justify-start">
//                 <div className="bg-gray-100 text-gray-800 px-3 py-2 rounded-lg flex items-center space-x-2">
//                   <Bot className="w-4 h-4 text-orange-600" />
//                   <div className="flex space-x-1">
//                     <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
//                     <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
//                     <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
//                   </div>
//                 </div>
//               </div>
//             )}
//             <div ref={messagesEndRef} />
//           </div>

//           {/* Input */}
//           <div className="border-t border-gray-200 p-3 sm:p-4">
//             <div className="flex space-x-2">
//               <input
//                 type="text"
//                 value={inputMessage}
//                 onChange={handleInputChange}
//                 onKeyPress={handleKeyPress}
//                 placeholder="Type your message..."
//                 className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm resize-none"
//                 disabled={isLoading}
//                 aria-label="Type your message"
//               />
//               <button
//                 onClick={sendMessage}
//                 disabled={!inputMessage.trim() || isLoading}
//                 className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-2 rounded-lg hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
//                 type="button"
//                 aria-label="Send message"
//               >
//                 <Send className="w-4 h-4" />
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Floating Button */}
//       <button
//         onClick={toggleChat}
//         className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-3 sm:p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 pulse-yellow hover:from-yellow-600 hover:to-orange-600"
//         type="button"
//         aria-label={isOpen ? "Close chat" : "Open chat"}
//       >
//         {isOpen ? (
//           <X className="w-5 h-5 sm:w-6 sm:h-6" />
//         ) : (
//           <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
//         )}
//       </button>

//       {/* Pulse animation styles */}
//       <style jsx>{`
//         @keyframes pulse-yellow {
//           0%, 100% {
//             box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7);
//           }
//           70% {
//             box-shadow: 0 0 0 10px rgba(245, 158, 11, 0);
//           }
//         }
        
//         .pulse-yellow {
//           animation: pulse-yellow 2s infinite;
//         }
        
//         @keyframes animate-in {
//           from {
//             opacity: 0;
//             transform: translateY(10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
        
//         .animate-in {
//           animation: animate-in 0.3s ease-out;
//         }

//         @media (max-width: 640px) {
//           .pulse-yellow {
//             animation: pulse-yellow 3s infinite;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default AIChatbot;











import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { Button, IconButton } from '@mui/material';
import axios from 'axios';

// Interface for message structure
interface Message {
  id: number;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
}

// Interface for API response
interface ApiResponse {
  success: boolean;
  response?: string;
  error?: string;
  timestamp?: string;
}

// Props interface for the component
interface AIChatbotProps {
  apiEndpoint?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const AIChatbot: React.FC<AIChatbotProps> = ({ 
  apiEndpoint = `${API_URL}/chat`
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm here to help you with any questions about our services. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (): Promise<void> => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post<ApiResponse>(apiEndpoint, {
        message: inputMessage
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;
      
      const botMessage: Message = {
        id: Date.now() + 1,
        text: data.response || 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: 'Sorry, I\'m having trouble connecting right now. Please try again later.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleChat = (): void => {
    setIsOpen(!isOpen);
  };

  const resetChat = (): void => {
    setMessages([
      {
        id: 1,
        text: "Hello! I'm here to help you with any questions about our website and services. How can I assist you today?",
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputMessage(e.target.value);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[calc(100vw-2rem)] max-w-sm h-[70vh] max-h-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col animate-in slide-in-from-bottom-5 duration-300 sm:w-80 sm:h-96 sm:max-w-none">
          {/* Header */}
          <div className="bg-gradient-to-r from-yellow-500 via-orange-400 to-orange-500 text-white p-3 sm:p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
              <h3 className="font-semibold text-sm sm:text-base">AI Support</h3>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={resetChat}
                size="small"
                sx={{ 
                  color: 'white', 
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  minWidth: 'auto',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)'
                  }
                }}
                title="New Chat"
              >
                Reset
              </Button>
              <IconButton
                onClick={toggleChat}
                size="small"
                sx={{ 
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)'
                  }
                }}
                aria-label="Close chat"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </IconButton>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 sm:space-y-3 min-h-0">
            {messages.map((message: Message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-xs lg:max-w-md px-3 py-2 rounded-lg flex items-start space-x-2 text-sm ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.sender === 'bot' && (
                    <Bot className="w-4 h-4 mt-0.5 flex-shrink-0 text-orange-600" />
                  )}
                  <div className="text-xs sm:text-sm leading-relaxed">
                    {message.text}
                  </div>
                  {message.sender === 'user' && (
                    <User className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 px-3 py-2 rounded-lg flex items-center space-x-2">
                  <Bot className="w-4 h-4 text-orange-600" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-3 sm:p-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm resize-none"
                disabled={isLoading}
                aria-label="Type your message"
              />
              <IconButton
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                sx={{
                  background: 'linear-gradient(45deg, #F59E0B 30%, #F97316 90%)',
                  color: 'white',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #D97706 30%, #EA580C 90%)',
                    boxShadow: '0 4px 20px 0 rgba(245, 158, 11, 0.4)'
                  },
                  '&:disabled': {
                    opacity: 0.5
                  },
                  transition: 'all 0.2s',
                  boxShadow: '0 2px 10px 0 rgba(245, 158, 11, 0.3)'
                }}
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </IconButton>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={toggleChat}
        className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-3 sm:p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 pulse hover:from-yellow-600 hover:to-orange-600"
        type="button"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        ) : (
          <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
        )}
      </button>

      {/* Pulse animation styles */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(245, 158, 11, 0);
          }
        }
        
        .pulse {
          animation: pulse 2s infinite;
        }
        
        @keyframes animate-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-in {
          animation: animate-in 0.3s ease-out;
        }

        @media (max-width: 640px) {
          .pulse {
            animation: pulse 3s infinite;
          }
        }
      `}</style>
    </div>
  );
};

export default AIChatbot;