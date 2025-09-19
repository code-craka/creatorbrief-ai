"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Sparkles, Star, Download, Play, Users, MessageCircle } from 'lucide-react';
import { User } from '@/types/brief';

// Define missing types for ResultsPage
interface GeneratedBrief {
  projectName: string;
  createdAt: string;
  videoIdeas: Array<{
    id: string;
    title: string;
    hook: string;
    concept: string;
    cta: string;
    duration: string;
    platform: string;
  }>;
  creators: Array<{
    id: string;
    profile: string;
    platform: string;
    followers: string;
    engagement: string;
    niche: string;
    why: string;
  }>;
  outreach: Array<{
    creator: string;
    subject: string;
    message: string;
  }>;
}

interface ResultsPageProps {
  user: User;
  brief: GeneratedBrief;
  credits: number;
  isPro: boolean;
  onNewCampaign: () => void;
}

type ActiveTab = 'briefs' | 'creators' | 'outreach';

const ResultsPage: React.FC<ResultsPageProps> = ({ user, brief, credits, isPro, onNewCampaign }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('briefs');

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-6 w-6 text-blue-600" />
          <span className="text-lg font-semibold">CreatorBrief AI</span>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={onNewCampaign} className="text-blue-600 hover:text-blue-700 font-medium">New Campaign</button>
          <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full">
            <Star className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">{isPro ? '∞' : credits} credits left</span>
          </div>
          <Image src={user.avatar} alt={user.name} width={32} height={32} className="rounded-full" />
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{brief.projectName}</h1>
            <p className="text-gray-600">Generated on {brief.createdAt}</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 disabled:bg-gray-300" disabled={!isPro}>
            <Download className="h-4 w-4" />
            <span>{isPro ? 'Export Campaign' : 'Upgrade to Export'}</span>
          </button>
        </div>

        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'briefs', label: 'Video Briefs', icon: Play, count: brief.videoIdeas.length },
                { id: 'creators', label: 'Creator Profiles', icon: Users, count: brief.creators.length },
                { id: 'outreach', label: 'Outreach Templates', icon: MessageCircle, count: brief.outreach.length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ActiveTab)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">{tab.count}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* --- TAB CONTENT --- */}
        {activeTab === 'briefs' && (
          <div className="space-y-6">
            {brief.videoIdeas.map((idea) => (
              <div key={idea.id} className="bg-white rounded-lg border p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{idea.title}</h3>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                    {idea.platform}
                  </span>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Hook</h4>
                    <p className="text-gray-700 italic">&quot;{idea.hook}&quot;</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Call to Action</h4>
                    <p className="text-gray-700">&quot;{idea.cta}&quot;</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Concept</h4>
                  <p className="text-gray-700">{idea.concept}</p>
                </div>
                
                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                  <span>Duration: {idea.duration}</span>
                  <span>Best for: {idea.platform}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'creators' && (
          <div className="space-y-4">
            {brief.creators.map((creator) => (
              <div key={creator.id} className="bg-white rounded-lg border p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{creator.profile}</h3>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    {creator.engagement} engagement
                  </span>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Platform</span>
                    <p className="text-gray-900">{creator.platform}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Followers</span>
                    <p className="text-gray-900">{creator.followers}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Niche</span>
                    <p className="text-gray-900">{creator.niche}</p>
                  </div>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-500">Why this creator?</span>
                  <p className="text-gray-700 mt-1">{creator.why}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'outreach' && (
           <div className="space-y-4">
            {brief.outreach.map((template, index) => (
              <div key={index} className="bg-white rounded-lg border p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Outreach Template: {template.creator}
                  </h3>
                  <div className="mb-3">
                    <span className="text-sm font-medium text-gray-500">Subject Line:</span>
                    <p className="text-gray-900 font-medium">{template.subject}</p>
                  </div>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-500">Message:</span>
                  <div className="mt-2 bg-gray-50 p-4 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                      {template.message}
                    </pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsPage;