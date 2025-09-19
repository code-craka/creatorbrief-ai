"use client";

import React from "react";
import { Loader2, Sparkles } from "lucide-react";

interface GeneratingSpinnerProps {
  message?: string;
}

export default function GeneratingSpinner({ 
  message = "Generating your creator brief..." 
}: GeneratingSpinnerProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center space-y-8">
      <div className="relative">
        <Loader2 className="h-16 w-16 animate-spin text-purple-600" />
        <Sparkles className="h-8 w-8 text-purple-400 absolute -top-2 -right-2 animate-pulse" />
      </div>
      
      <div className="text-center space-y-4 max-w-md">
        <h3 className="text-2xl font-bold text-gray-900">{message}</h3>
        <p className="text-gray-600">
          Our AI is analyzing your requirements and creating a comprehensive 
          campaign brief tailored to your needs. This usually takes 30-60 seconds.
        </p>
      </div>
      
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce"></div>
        <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  );
}