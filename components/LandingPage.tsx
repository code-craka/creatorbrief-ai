"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Sparkles, Target, Users, BarChart3, Zap, Shield } from "lucide-react";

interface LandingPageProps {
  onSignIn: () => void;
}

export default function LandingPage({ onSignIn }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="h-10 w-10 text-purple-600" />
              <h1 className="text-5xl font-bold text-gray-900">
                CreatorBrief AI
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Generate comprehensive creator campaign briefs powered by AI. 
              Perfect for brands, agencies, and marketing teams to create 
              data-driven influencer marketing campaigns.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={onSignIn}
              className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg flex items-center gap-2 text-lg"
            >
              <Sparkles className="h-5 w-5" />
              Generate Your First Brief
            </Button>
            <Button
              variant="outline"
              className="px-8 py-4 border-purple-600 text-purple-600 hover:bg-purple-50 font-medium rounded-lg text-lg"
            >
              View Demo
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          <Card className="border-purple-100 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <Target className="h-6 w-6" />
                AI-Powered Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Advanced AI analyzes your product and audience to generate 
                targeted campaign strategies with platform-specific optimizations.
              </p>
            </CardContent>
          </Card>

          <Card className="border-blue-100 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Users className="h-6 w-6" />
                Creator Matching
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Get intelligent creator recommendations based on audience 
                alignment, engagement rates, and campaign objectives.
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-100 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <BarChart3 className="h-6 w-6" />
                Performance Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Comprehensive analytics and reporting to measure campaign 
                success and optimize future collaborations.
              </p>
            </CardContent>
          </Card>

          <Card className="border-orange-100 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700">
                <Zap className="h-6 w-6" />
                Multi-Platform Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Optimized strategies for Instagram, TikTok, YouTube, LinkedIn, 
                and other major social media platforms.
              </p>
            </CardContent>
          </Card>

          <Card className="border-red-100 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <Shield className="h-6 w-6" />
                Compliance Ready
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Built-in compliance guidelines and FTC requirements to ensure 
                your campaigns meet all legal standards.
              </p>
            </CardContent>
          </Card>

          <Card className="border-indigo-100 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-indigo-700">
                <Sparkles className="h-6 w-6" />
                Smart Automation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Automated brief generation, content calendars, and campaign 
                optimization suggestions powered by machine learning.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">
            Ready to Transform Your Creator Campaigns?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of brands and agencies using CreatorBrief AI to 
            create more effective influencer marketing campaigns.
          </p>
          <Button
            onClick={onSignIn}
            className="px-12 py-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg flex items-center gap-2 text-lg mx-auto"
          >
            <Sparkles className="h-5 w-5" />
            Start Creating Briefs
          </Button>
        </div>
      </div>
    </div>
  );
}