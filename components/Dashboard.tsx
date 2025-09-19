"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Sparkles, Star } from 'lucide-react';
import { User, CreatorBriefFormData } from '@/types/brief';
import BriefGeneratorForm from './BriefGeneratorForm';

interface DashboardProps {
  user: User;
  credits: number;
  isPro: boolean;
  onSubmit: (formData: CreatorBriefFormData) => void;
  onUpgradeClick: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, credits, isPro, onSubmit, onUpgradeClick }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: CreatorBriefFormData) => {
    if (credits === 0 && !isPro) {
      onUpgradeClick();
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-6 w-6 text-purple-600" />
          <span className="text-lg font-semibold">CreatorBrief AI</span>
        </div>
        <div className="flex items-center space-x-4">
          {!isPro && (
            <button onClick={onUpgradeClick} className="text-purple-600 hover:text-purple-700 text-sm font-medium">
              Upgrade to Pro
            </button>
          )}
          <div className="flex items-center space-x-2 bg-purple-50 px-3 py-1 rounded-full">
            <Star className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">
              {isPro ? '∞' : credits} credits left
            </span>
          </div>
          <Image src={user.avatar} alt={user.name} width={32} height={32} className="rounded-full" />
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Generate Comprehensive Creator Briefs
          </h1>
          <p className="text-gray-600">
            Generate comprehensive creator campaign briefs powered by AI. Perfect for brands, agencies, and marketing teams.
          </p>
        </div>

        <BriefGeneratorForm
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
};

export default Dashboard;