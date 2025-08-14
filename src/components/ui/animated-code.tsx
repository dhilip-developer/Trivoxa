import { useEffect, useState, useRef } from "react";

type AnimatedCodeProps = {
  codeSnippets: string[];
  language?: string;
  speed?: number;
};

export function AnimatedCode({ 
  codeSnippets, 
  language = "typescript", 
  speed = 40 
}: AnimatedCodeProps) {
  const [currentCodeIndex, setCurrentCodeIndex] = useState(0);
  const [displayedCode, setDisplayedCode] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const timeoutRef = useRef<number | null>(null);
  
  useEffect(() => {
    const typeCode = () => {
      const currentSnippet = codeSnippets[currentCodeIndex];
      
      if (isTyping) {
        if (displayedCode.length < currentSnippet.length) {
          setDisplayedCode(currentSnippet.slice(0, displayedCode.length + 1));
        } else {
          setIsTyping(false);
          timeoutRef.current = window.setTimeout(() => {
            setIsTyping(true);
            setDisplayedCode("");
            setCurrentCodeIndex((prevIndex) => 
              (prevIndex + 1) % codeSnippets.length
            );
          }, 2000);
        }
      }
    };
    
    const timerId = window.setTimeout(typeCode, speed);
    
    return () => {
      window.clearTimeout(timerId);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [displayedCode, currentCodeIndex, codeSnippets, isTyping, speed]);

  return (
    <div className="p-4 bg-black/50 backdrop-blur-sm rounded-lg border border-gray-800 overflow-hidden">
      <div className="flex items-center mb-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="text-xs text-gray-400 ml-3 uppercase tracking-wide">
          {language}.{language === "typescript" ? "tsx" : language === "javascript" ? "js" : "code"}
        </div>
      </div>
      
      <pre className="text-xs md:text-sm font-mono overflow-x-auto">
        <code className="text-gray-200">
          {displayedCode}
          <span className="animate-pulse">|</span>
        </code>
      </pre>
    </div>
  );
}

export const codeExamples = {
  typescript: [
`// Mobile app development
interface AppConfig {
  platform: 'iOS' | 'Android' | 'Cross-Platform';
  features: string[];
  version: string;
}

const createApp = (config: AppConfig) => {
  console.log(\`Building \${config.platform} app v\${config.version}\`);
  return new AppBuilder(config);
};

// Start your custom app project now!`,

`// Web application with real-time features
import { useState, useEffect } from 'react';

function RealTimeApp() {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    // Connect to WebSocket
    const socket = new WebSocket('wss://api.example.com');
    
    socket.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      setData(prev => [...prev, newData]);
    };
    
    return () => socket.close();
  }, []);
  
  // Fast, secure, and responsive!
}`,

`// AI Integration Service
class AIService {
  private apiKey: string;
  private model: string = 'gpt-4';
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  async generateContent(prompt: string): Promise<string> {
    const response = await fetch('https://api.ai.example.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${this.apiKey}\`
      },
      body: JSON.stringify({ prompt, model: this.model })
    });
    
    const data = await response.json();
    return data.content;
  }
}

// Enhance your app with AI capabilities!`,

`// Blockchain Integration
import { ethers } from 'ethers';

async function connectToWallet() {
  if (window.ethereum) {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      
      console.log('Connected wallet:', address);
      return signer;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  }
}

// Web3 integration made easy`,
  ],
};