"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Sparkles, Target, Calendar } from "lucide-react";

import { CreatorBriefFormData } from '@/types/brief';

interface BriefGeneratorFormProps {
  onSubmit: (data: CreatorBriefFormData) => void;
  loading: boolean;
  error: string | null;
}

const PLATFORM_OPTIONS = [
  "Instagram",
  "TikTok", 
  "YouTube",
  "Twitter/X",
  "LinkedIn",
  "Snapchat",
  "Pinterest",
];

const BUDGET_OPTIONS = [
  "Under $1,000",
  "$1,000 - $5,000", 
  "$5,000 - $10,000",
  "$10,000 - $25,000",
  "$25,000 - $50,000",
  "Over $50,000",
];

export default function BriefGeneratorForm({ onSubmit, loading, error }: BriefGeneratorFormProps) {
  const [formData, setFormData] = useState<CreatorBriefFormData>({
    productDescription: "",
    targetAudience: "",
    campaignGoals: "Increase brand awareness and drive conversions",
    budget: "Not specified",
    platforms: ["Instagram", "TikTok"],
    timeframe: "30 days",
  });

  const handleInputChange = (
    field: keyof CreatorBriefFormData,
    value: string | string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePlatformToggle = (platform: string) => {
    setFormData((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Product Description */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Product Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="productDescription">Product Description *</Label>
            <Textarea
              id="productDescription"
              placeholder="Describe your product, service, or brand. Include key features, benefits, and unique selling points..."
              value={formData.productDescription}
              onChange={(e) =>
                handleInputChange("productDescription", e.target.value)
              }
              className="min-h-[100px]"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              {formData.productDescription.length}/1000 characters
            </p>
          </div>

          <div>
            <Label htmlFor="targetAudience">Target Audience *</Label>
            <Textarea
              id="targetAudience"
              placeholder="Describe your ideal customers. Include demographics, interests, behaviors, and pain points..."
              value={formData.targetAudience}
              onChange={(e) =>
                handleInputChange("targetAudience", e.target.value)
              }
              className="min-h-[80px]"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              {formData.targetAudience.length}/500 characters
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Campaign Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Campaign Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="campaignGoals">Campaign Goals</Label>
            <Input
              id="campaignGoals"
              placeholder="e.g., Increase brand awareness and drive conversions"
              value={formData.campaignGoals}
              onChange={(e) =>
                handleInputChange("campaignGoals", e.target.value)
              }
            />
          </div>

          <div>
            <Label>Platforms *</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
              {PLATFORM_OPTIONS.map((platform) => (
                <button
                  key={platform}
                  type="button"
                  onClick={() => handlePlatformToggle(platform)}
                  className={`p-2 text-sm rounded-lg border transition-colors ${
                    formData.platforms.includes(platform)
                      ? "bg-purple-100 border-purple-600 text-purple-700"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {platform}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="budget">Budget Range</Label>
              <select
                id="budget"
                value={formData.budget}
                onChange={(e) => handleInputChange("budget", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="Not specified">Not specified</option>
                {BUDGET_OPTIONS.map((budget) => (
                  <option key={budget} value={budget}>
                    {budget}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="timeframe">Campaign Duration</Label>
              <select
                id="timeframe"
                value={formData.timeframe}
                onChange={(e) => handleInputChange("timeframe", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="7 days">1 week</option>
                <option value="14 days">2 weeks</option>
                <option value="30 days">1 month</option>
                <option value="60 days">2 months</option>
                <option value="90 days">3 months</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      {/* Submit Button */}
      <div className="flex justify-center">
        <Button
          type="submit"
          disabled={
            loading ||
            !formData.productDescription.trim() ||
            !formData.targetAudience.trim() ||
            formData.platforms.length === 0
          }
          className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Generating Brief...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              Generate Creator Brief
            </>
          )}
        </Button>
      </div>
    </form>
  );
}