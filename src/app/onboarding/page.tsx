"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Upload, X, ChevronDown, ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { insertBusinessData, fetchBusinessData } from "./insertBusinessData";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

type DaySchedule = {
  isOpen: boolean;
  openingTime: string;
  closingTime: string;
};

type WeekSchedule = {
  [key: string]: DaySchedule;
};

const OnboardingPage = () => {
  const [businessName, setBusinessName] = useState("");
  const [weekSchedule, setWeekSchedule] = useState<WeekSchedule>(
    daysOfWeek.reduce(
      (acc, day) => ({
        ...acc,
        [day]: { isOpen: false, openingTime: "09:00", closingTime: "17:00" },
      }),
      {}
    )
  );
  const [showTeleOperatorInstructions, setShowTeleOperatorInstructions] =
    useState(false);
  const [teleOperatorInstructions, setTeleOperatorInstructions] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const loadBusinessData = async () => {
      const result = await fetchBusinessData();
      if (result.error) {
        console.error("Error fetching data:", result.error);
      } else {
        const data = result.data;
        setBusinessName(data.business_name);
        setWeekSchedule(data.week_schedule);
        setTeleOperatorInstructions(data.tele_operator_instructions);
        // Assuming uploaded_files is an array of file names
        setUploadedFiles(
          data.uploaded_files.map((fileName: string) => new File([], fileName))
        );
      }
    };

    loadBusinessData();
  }, []);

  const handleDayToggle = (day: string) => {
    setWeekSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], isOpen: !prev[day].isOpen },
    }));
  };

  const handleTimeChange = (
    day: string,
    type: "openingTime" | "closingTime",
    value: string
  ) => {
    setWeekSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], [type]: value },
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setUploadedFiles(Array.from(event.target.files));
    }
  };

  const handleSubmit = async () => {
    const result = await insertBusinessData(
      businessName,
      weekSchedule,
      teleOperatorInstructions,
      uploadedFiles.map((file) => file.name)
    );

    if (result.error) {
      console.error("Error inserting data:", result.error);
    } else {
      console.log("Data inserted successfully:", result.data);
      router.push("/dashboard");
    }
  };

  return (
    <div className="container mx-auto max-w-2xl py-10d">
      <Card className="bg-background text-foreground">
        <CardHeader>
          <CardTitle>Business Onboarding</CardTitle>
          <CardDescription>Set up your business profile.</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid gap-6">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                placeholder="e.g., CallTrack Pro"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Business Hours</h3>
              {daysOfWeek.map((day) => (
                <div key={day} className="flex items-center justify-between">
                  <Checkbox
                    checked={weekSchedule[day].isOpen}
                    onCheckedChange={() => handleDayToggle(day)}
                    id={day}
                    className="mr-4 dark:border-white dark: hover:border-gray-500"
                  />
                  <Label htmlFor={day} className="flex-grow">
                    {day}
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="time"
                      value={weekSchedule[day].openingTime}
                      onChange={(e) =>
                        handleTimeChange(day, "openingTime", e.target.value)
                      }
                      disabled={!weekSchedule[day].isOpen}
                    />
                    <span>-</span>
                    <Input
                      type="time"
                      value={weekSchedule[day].closingTime}
                      onChange={(e) =>
                        handleTimeChange(day, "closingTime", e.target.value)
                      }
                      disabled={!weekSchedule[day].isOpen}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Button
                variant="ghost"
                onClick={() => setShowTeleOperatorInstructions((prev) => !prev)}
                className="w-full flex justify-between"
              >
                Tele-Operator Instructions
                {showTeleOperatorInstructions ? <ChevronUp /> : <ChevronDown />}
              </Button>

              {showTeleOperatorInstructions && (
                <Textarea
                  placeholder="Add any special instructions for the tele-operator..."
                  value={teleOperatorInstructions}
                  onChange={(e) => setTeleOperatorInstructions(e.target.value)}
                />
              )}
            </div>

            <div className="space-y-2">
              <Label className="pr-2" htmlFor="fileUpload">
                Upload Business Documents
              </Label>
              <input
                type="file"
                id="fileUpload"
                multiple
                onChange={handleFileUpload}
                ref={fileInputRef}
                className="hidden"
              />
              <Button
                className="bg-background text-foreground px-3"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Files
              </Button>
              {uploadedFiles.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {uploadedFiles.map((file, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span>{file.name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setUploadedFiles((prev) =>
                            prev.filter((_, i) => i !== index)
                          )
                        }
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end">
          <Button onClick={handleSubmit} type="submit">
            Complete Onboarding
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OnboardingPage;
