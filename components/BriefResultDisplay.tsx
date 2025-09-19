"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, DollarSign, Calendar } from "lucide-react";
import { CreatorBriefOutput } from "@/types/brief";

interface BriefResultDisplayProps {
  result: CreatorBriefOutput;
  onReset: () => void;
}

export default function BriefResultDisplay({ result, onReset }: BriefResultDisplayProps) {
  return (
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
            <Button onClick={onReset} variant="outline" className="text-sm">
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
                <h4 className="font-medium text-sm text-gray-700">Creator Fee</h4>
                <p className="text-sm text-gray-600">
                  {result.budgetRecommendations.creatorFee}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-gray-700">Ad Spend</h4>
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
                <h4 className="font-medium text-sm text-gray-700">Stories</h4>
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
                <h4 className="font-medium text-sm text-gray-700">Timeline</h4>
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
                element.download = `creator-brief-${result.campaignTitle
                  .toLowerCase()
                  .replace(/\s+/g, "-")}.json`;
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
  );
}