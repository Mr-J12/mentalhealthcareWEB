import React, { useState, useRef, useEffect } from 'react';
import { Send, Heart } from 'lucide-react';
import { supabase, ChatMessage } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = React.useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data.length === 0) {
        // Add welcome message for new users
        const welcomeMessage: ChatMessage = {
          id: 'welcome',
          user_id: user.id,
          content: "Hello! I'm here to listen and support you on your mental health journey. How are you feeling today?",
          is_user_message: false,
          created_at: new Date().toISOString()
        };
        setMessages([welcomeMessage]);
      } else {
        setMessages(data);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadMessages();
    }
  }, [user, loadMessages]);

  const saveMessage = async (content: string, isUserMessage: boolean) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          user_id: user.id,
          content,
          is_user_message: isUserMessage
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving message:', error);
      return null;
    }
  };

  const getAIResponse = (userMessage: string): string => {
    const responses = {
      anxiety: [
        "I understand you're feeling anxious. That's completely valid. Let's try some grounding techniques. Can you name 5 things you can see around you right now?",
        "Anxiety can feel overwhelming, but you're not alone. Would you like to try a breathing exercise together?",
        "I hear that you're struggling with anxiety. Remember, this feeling will pass. What usually helps you feel more grounded?"
      ],
      depression: [
        "I'm sorry you're going through this difficult time. Depression can make everything feel heavy, but reaching out shows incredible strength.",
        "Thank you for sharing this with me. Even small steps matter. What's one tiny thing that brought you even a moment of peace today?",
        "I want you to know that your feelings are valid, and you matter. Have you been able to maintain any routines that usually help you?"
      ],
      stress: [
        "Stress can be really overwhelming. Let's work together to find some relief. What's the biggest source of stress for you right now?",
        "I can hear that you're under a lot of pressure. Remember, you don't have to handle everything at once. What's one thing you can let go of today?",
        "Stress affects us all differently. Would you like to explore some coping strategies that might help you feel more balanced?"
      ],
      general: [
        "Thank you for sharing that with me. I'm here to listen without judgment. Tell me more about what's on your mind."
      ]
    };
    
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety') || lowerMessage.includes('worry')) {
      return responses.anxiety[Math.floor(Math.random() * responses.anxiety.length)];
    } else if (lowerMessage.includes('depressed') || lowerMessage.includes('depression') || lowerMessage.includes('sad')) {
      return responses.depression[Math.floor(Math.random() * responses.depression.length)];
    } else if (lowerMessage.includes('stress') || lowerMessage.includes('overwhelmed') || lowerMessage.includes('pressure')) {
      return responses.stress[Math.floor(Math.random() * responses.stress.length)];
    } else {
      return responses.general[Math.floor(Math.random() * responses.general.length)];
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Save user message
    const savedUserMessage = await saveMessage(inputMessage, true);
    if (savedUserMessage) {
      setMessages(prev => [...prev, savedUserMessage]);
    }

    const userMessageContent = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(async () => {
      const aiResponseContent = getAIResponse(userMessageContent);
      const savedAiMessage = await saveMessage(aiResponseContent, false);
      
      if (savedAiMessage) {
        setMessages(prev => [...prev, savedAiMessage]);
      }
      setIsTyping(false);
    }, 1500);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl">
        <div className="text-center">
          <Heart className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Sign in to start chatting</h3>
          <p className="text-gray-600">Your conversations will be saved securely</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-blue-100 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">MindfulBot</h2>
            <p className="text-sm text-gray-600">Your supportive companion</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.is_user_message ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                message.is_user_message
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                  : 'bg-white/80 backdrop-blur-sm text-gray-800 border border-blue-100'
              }`}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
              <span className={`text-xs mt-2 block ${
                message.is_user_message ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white/80 backdrop-blur-sm border border-blue-100 px-4 py-3 rounded-2xl">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-blue-100 p-4">
        <div className="flex gap-3">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Share what's on your mind..."
            className="flex-1 resize-none bg-white/70 border border-blue-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            rows={1}
          />
          <button
            onClick={handleSendMessage}
            className="bg-gradient-to-br from-blue-500 to-purple-500 text-white p-3 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;