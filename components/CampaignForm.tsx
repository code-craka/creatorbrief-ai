"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Campaign, Project } from "@/types/project";
import {
  createCampaignSchema,
  updateCampaignSchema,
} from "@/lib/validations/project";

interface CampaignFormProps {
  campaign?: Campaign;
  projects?: Project[];
  onSuccess: (campaign: Campaign) => void;
  onCancel: () => void;
}

const PLATFORM_OPTIONS = [
  "Instagram",
  "TikTok",
  "YouTube",
  "LinkedIn",
  "Twitter",
  "Facebook",
  "Snapchat",
  "Pinterest",
];

const BUDGET_RANGES = [
  "$1,000 - $5,000",
  "$5,000 - $10,000",
  "$10,000 - $25,000",
  "$25,000 - $50,000",
  "$50,000 - $100,000",
  "$100,000+",
];

export function CampaignForm({
  campaign,
  projects = [],
  onSuccess,
  onCancel,
}: CampaignFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!campaign;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(
      isEditing ? updateCampaignSchema : createCampaignSchema
    ),
    defaultValues: {
      title: campaign?.title || "",
      project_id: campaign?.project_id || undefined,
      objectives: campaign?.objectives || [],
      target_audience: campaign?.target_audience || "",
      budget_range: campaign?.budget_range || "",
      platforms: campaign?.platforms || [],
      start_date: campaign?.start_date
        ? new Date(campaign.start_date).toISOString().split("T")[0]
        : "",
      end_date: campaign?.end_date
        ? new Date(campaign.end_date).toISOString().split("T")[0]
        : "",
      status: campaign?.status || "draft",
    },
  });

  const {
    fields: objectiveFields,
    append: appendObjective,
    remove: removeObjective,
  } = useFieldArray({
    control,
    name: "objectives",
  });

  const watchedPlatforms = watch("platforms");
  const watchedProjectId = watch("project_id");
  const watchedStatus = watch("status");

  const handlePlatformChange = (platform: string, checked: boolean) => {
    const currentPlatforms = watchedPlatforms || [];
    if (checked) {
      setValue("platforms", [...currentPlatforms, platform]);
    } else {
      setValue(
        "platforms",
        currentPlatforms.filter((p: string) => p !== platform)
      );
    }
  };

  const addObjective = () => {
    appendObjective({
      id: Date.now().toString(),
      title: "",
      description: "",
      priority: "medium",
    });
  };

  const onSubmit = async (data: Record<string, unknown>) => {
    setIsSubmitting(true);
    try {
      // Convert date strings to ISO format if provided
      const submitData = {
        ...data,
        start_date: data.start_date
          ? new Date(data.start_date as string).toISOString()
          : undefined,
        end_date: data.end_date
          ? new Date(data.end_date as string).toISOString()
          : undefined,
      };

      const url = isEditing
        ? `/api/campaigns/${campaign.id}`
        : "/api/campaigns";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        const result = await response.json();
        onSuccess(result);
      } else {
        const error = await response.json();
        alert(
          `Failed to ${isEditing ? "update" : "create"} campaign: ${error.error}`
        );
      }
    } catch (error) {
      console.error(
        `Error ${isEditing ? "updating" : "creating"} campaign:`,
        error
      );
      alert(`Failed to ${isEditing ? "update" : "create"} campaign`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                {isEditing ? "Edit Campaign" : "Create New Campaign"}
              </CardTitle>
              <CardDescription>
                {isEditing
                  ? "Update your campaign details"
                  : "Create a new campaign to manage your creator collaborations"}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>

              <div className="space-y-2">
                <Label htmlFor="title">Campaign Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter campaign title"
                  {...register("title")}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">
                    {errors.title.message as string}
                  </p>
                )}
              </div>

              {projects.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="project_id">Project</Label>
                  <Select
                    value={watchedProjectId?.toString() || ""}
                    onValueChange={(value) =>
                      setValue(
                        "project_id",
                        value ? parseInt(value) : undefined
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a project (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No project</SelectItem>
                      {projects.map((project) => (
                        <SelectItem
                          key={project.id}
                          value={project.id.toString()}
                        >
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="target_audience">Target Audience</Label>
                <Textarea
                  id="target_audience"
                  placeholder="Describe your target audience"
                  rows={3}
                  {...register("target_audience")}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    {...register("start_date")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input id="end_date" type="date" {...register("end_date")} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budget_range">Budget Range</Label>
                  <Select
                    value={watch("budget_range") || ""}
                    onValueChange={(value) => setValue("budget_range", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      {BUDGET_RANGES.map((range) => (
                        <SelectItem key={range} value={range}>
                          {range}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={watchedStatus}
                    onValueChange={(value) => setValue("status", value as "draft" | "active" | "paused" | "completed")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Platforms */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Platforms</h3>
              <div className="grid grid-cols-2 gap-2">
                {PLATFORM_OPTIONS.map((platform) => (
                  <div key={platform} className="flex items-center space-x-2">
                    <Checkbox
                      id={platform}
                      checked={watchedPlatforms?.includes(platform) || false}
                      onCheckedChange={(checked) =>
                        handlePlatformChange(platform, checked as boolean)
                      }
                    />
                    <Label htmlFor={platform} className="text-sm">
                      {platform}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Objectives */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Campaign Objectives</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addObjective}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Objective
                </Button>
              </div>

              {objectiveFields.map((field, index) => (
                <div key={field.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Objective {index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeObjective(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor={`objectives.${index}.title`}>Title</Label>
                      <Input
                        placeholder="Objective title"
                        {...register(`objectives.${index}.title` as const)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`objectives.${index}.priority`}>
                        Priority
                      </Label>
                      <Select
                        value={watch(`objectives.${index}.priority`)}
                        onValueChange={(value) =>
                          setValue(`objectives.${index}.priority`, value as "high" | "medium" | "low")
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`objectives.${index}.description`}>
                      Description
                    </Label>
                    <Textarea
                      placeholder="Describe this objective"
                      rows={2}
                      {...register(`objectives.${index}.description` as const)}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting
                  ? isEditing
                    ? "Updating..."
                    : "Creating..."
                  : isEditing
                    ? "Update Campaign"
                    : "Create Campaign"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
