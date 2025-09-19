"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Sparkles, Target, DollarSign, Calendar } from "lucide-react";

interface CreatorBriefFormData {
  productDescription: string;
  targetAudience: string;
  campaignGoals: string;
  budget: string;
  platforms: string[];
  timeframe: string;
}

interface CreatorBriefOutput {
  campaignTitle: string;
  objective: string;
  platforms: string[];
  contentFormats: string[];
  messagingPillars: string[];
  creativeDirection: {
    visualStyle: string;
    toneOfVoice: string;
    mustHaveElements: string[];
  };
  deliverables: {
    primaryContent: number;
    stories: number;
    timeline: string;
  };
  kpis: {
    primaryMetric: string;
    targetEngagementRate: string;
    expectedReach: string;
  };
  callToAction: string;
  complianceNotes: string[];
  hashtags: string[];
  budgetRecommendations: {
    creatorFee: string;
    adSpend: string;
  };
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

export default function CreatorBriefGenerator() {
  const [formData, setFormData] = useState<CreatorBriefFormData>({
    productDescription: "",
    targetAudience: "",
    campaignGoals: "Increase brand awareness and drive conversions",
    budget: "Not specified",
    platforms: ["Instagram", "TikTok"],
    timeframe: "30 days",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CreatorBriefOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"form" | "result">("form");

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-brief", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to generate brief");
      }

      setResult(data.data);
      setActiveTab("result");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setResult(null);
    setError(null);
    setActiveTab("form");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="h-8 w-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Creator Brief Generator
          </h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Generate comprehensive creator campaign briefs powered by AI. Perfect
          for brands, agencies, and marketing teams.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        <button
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "form"
              ? "border-purple-600 text-purple-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("form")}
        >
          Brief Generator
        </button>
        <button
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "result"
              ? "border-purple-600 text-purple-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("result")}
          disabled={!result}
        >
          Generated Brief
        </button>
      </div>

      {activeTab === "form" && (
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
                <Label htmlFor="productDescription">
                  Product Description *
                </Label>
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
                    onChange={(e) =>
                      handleInputChange("budget", e.target.value)
                    }
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
                    onChange={(e) =>
                      handleInputChange("timeframe", e.target.value)
                    }
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
              <AlertDescription className="text-red-700">
                {error}
              </AlertDescription>
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
      )}

      {activeTab === "result" && result && (
        <div className="space-y-6">
          {/* Brief Header */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl text-purple-700">
                    {result.campaignTitle}
                  </CardTitle>
                  <p className="text-gray-600 mt-2">{result.objective}</p>
                </div>
                <Button
                  onClick={resetForm}
                  variant="outline"
                  className="text-sm"
                >
                  Generate New Brief
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Campaign Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Platforms & Formats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">
                      Platforms
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {result.platforms.map((platform) => (
                        <span
                          key={platform}
                          className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-sm"
                        >
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">
                      Content Formats
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {result.contentFormats.map((format) => (
                        <span
                          key={format}
                          className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm"
                        >
                          {format}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Budget & Deliverables
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm text-gray-700">
                      Creator Fee
                    </h4>
                    <p className="text-sm text-gray-600">
                      {result.budgetRecommendations.creatorFee}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-gray-700">
                      Ad Spend
                    </h4>
                    <p className="text-sm text-gray-600">
                      {result.budgetRecommendations.adSpend}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-gray-700">
                      Primary Content
                    </h4>
                    <p className="text-sm text-gray-600">
                      {result.deliverables.primaryContent} posts
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-gray-700">
                      Stories
                    </h4>
                    <p className="text-sm text-gray-600">
                      {result.deliverables.stories} stories
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Timeline & KPIs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm text-gray-700">
                      Timeline
                    </h4>
                    <p className="text-sm text-gray-600">
                      {result.deliverables.timeline}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-gray-700">
                      Primary Metric
                    </h4>
                    <p className="text-sm text-gray-600">
                      {result.kpis.primaryMetric}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-gray-700">
                      Target Engagement
                    </h4>
                    <p className="text-sm text-gray-600">
                      {result.kpis.targetEngagementRate}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-gray-700">
                      Expected Reach
                    </h4>
                    <p className="text-sm text-gray-600">
                      {result.kpis.expectedReach}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Messaging Pillars</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {result.messagingPillars.map((pillar, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{pillar}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Creative Direction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">
                      Visual Style
                    </h4>
                    <p className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                      {result.creativeDirection.visualStyle}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">
                      Tone of Voice
                    </h4>
                    <p className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                      {result.creativeDirection.toneOfVoice}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">
                      Must-Have Elements
                    </h4>
                    <div className="space-y-2">
                      {result.creativeDirection.mustHaveElements.map(
                        (element, index) => (
                          <div
                            key={index}
                            className="p-2 bg-yellow-50 border border-yellow-200 rounded text-sm"
                          >
                            {element}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Hashtags & Call to Action</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">
                      Recommended Hashtags
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {result.hashtags.map((hashtag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm"
                        >
                          #{hashtag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">
                      Call to Action
                    </h4>
                    <p className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg font-medium">
                      {result.callToAction}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compliance Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {result.complianceNotes.map((note, index) => (
                    <div
                      key={index}
                      className="p-3 bg-red-50 border border-red-200 rounded-lg"
                    >
                      <p className="text-sm text-red-700">{note}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Export Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-4 justify-center">
                <Button
                  onClick={() => {
                    const briefText = JSON.stringify(result, null, 2);
                    navigator.clipboard.writeText(briefText);
                    // You could add a toast notification here
                  }}
                  variant="outline"
                >
                  Copy Brief JSON
                </Button>
                <Button
                  onClick={() => {
                    const element = document.createElement("a");
                    const file = new Blob([JSON.stringify(result, null, 2)], {
                      type: "application/json",
                    });
                    element.href = URL.createObjectURL(file);
                    element.download = `creator-brief-${result.campaignTitle.toLowerCase().replace(/\s+/g, "-")}.json`;
                    document.body.appendChild(element);
                    element.click();
                    document.body.removeChild(element);
                  }}
                  variant="outline"
                >
                  Download Brief
                </Button>
                <Button onClick={() => window.print()} variant="outline">
                  Print Brief
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "result" && !result && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">
              No brief generated yet. Please generate a brief first.
            </p>
            <Button
              onClick={() => setActiveTab("form")}
              className="mt-4"
              variant="outline"
            >
              Go to Generator
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
