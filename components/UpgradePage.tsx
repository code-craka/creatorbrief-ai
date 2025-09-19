"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Check, Sparkles, Crown, Zap } from "lucide-react";

interface UpgradePageProps {
  onUpgrade: () => void;
  onBack: () => void;
}

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out CreatorBrief AI",
    features: [
      "5 briefs per month",
      "Basic AI insights",
      "Standard templates",
      "Email support",
    ],
    limitations: [
      "Limited customization",
      "Basic analytics",
    ],
    buttonText: "Current Plan",
    buttonVariant: "outline" as const,
    popular: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "per month",
    description: "For growing brands and agencies",
    features: [
      "Unlimited briefs",
      "Advanced AI insights",
      "Custom templates",
      "Priority support",
      "Team collaboration",
      "Advanced analytics",
      "Creator database access",
    ],
    buttonText: "Upgrade to Pro",
    buttonVariant: "default" as const,
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "pricing",
    description: "For large organizations with custom needs",
    features: [
      "Everything in Pro",
      "Custom AI training",
      "White-label solution",
      "Dedicated account manager",
      "Custom integrations",
      "SLA guarantees",
      "Advanced security",
    ],
    buttonText: "Contact Sales",
    buttonVariant: "outline" as const,
    popular: false,
  },
];

export default function UpgradePage({ onUpgrade, onBack }: UpgradePageProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Crown className="h-8 w-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Upgrade Your Plan
          </h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Unlock the full potential of CreatorBrief AI with advanced features, 
          unlimited briefs, and priority support.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative ${
              plan.popular
                ? "border-purple-600 shadow-lg scale-105"
                : "border-gray-200"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Most Popular
                </span>
              </div>
            )}

            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900">
                {plan.name}
              </CardTitle>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-purple-600">
                  {plan.price}
                </div>
                <div className="text-sm text-gray-500">{plan.period}</div>
                <p className="text-sm text-gray-600">{plan.description}</p>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-3">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
                {plan.limitations?.map((limitation, index) => (
                  <div key={index} className="flex items-center gap-2 opacity-60">
                    <div className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm text-gray-500 line-through">
                      {limitation}
                    </span>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => plan.name !== "Free" && onUpgrade()}
                variant={plan.buttonVariant}
                className={`w-full ${
                  plan.popular
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : ""
                }`}
                disabled={plan.name === "Free"}
              >
                {plan.buttonText}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Features Comparison */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Why Upgrade to Pro?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Zap className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">
                Unlimited Briefs
              </h3>
              <p className="text-sm text-gray-600">
                Generate as many campaign briefs as you need without limits
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <Sparkles className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">
                Advanced AI
              </h3>
              <p className="text-sm text-gray-600">
                Access to our most sophisticated AI models and insights
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <Check className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">
                Team Collaboration
              </h3>
              <p className="text-sm text-gray-600">
                Work together with your team on campaigns and briefs
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <Crown className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">
                Priority Support
              </h3>
              <p className="text-sm text-gray-600">
                Get help when you need it with priority customer support
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Back Button */}
      <div className="text-center">
        <Button onClick={onBack} variant="outline">
          Back to Generator
        </Button>
        </div>
      </div>
    </div>
  );
}