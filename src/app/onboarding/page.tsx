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
import {
  insertBusinessData,
  fetchBusinessData,
  uploadPhoneNumber,
  fetchBusinessPhoneNumber,
} from "./insertBusinessData";
import { motion } from "framer-motion";

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
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isBusinessInfoUploaded, setIsBusinessInfoUploaded] = useState(false);
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
        setUploadedFiles(
          data.uploaded_files.map((fileName: string) => new File([], fileName))
        );
        setIsBusinessInfoUploaded(true);
      }

      // Fetch the business phone number
      const phoneResult = await fetchBusinessPhoneNumber();
      if (phoneResult.error) {
        console.error("Error fetching phone number:", phoneResult.error);
      } else {
        setPhoneNumber(phoneResult.data);
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

  const handleBusinessInfo = async () => {
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
      setIsBusinessInfoUploaded(true);
    }
  };

  const handleSubmit = async () => {
    router.push("/dashboard");
  };

  const getRandomPhoneNumber = async () => {
    const randomPhoneNumber = `+1 (${Math.floor(
      Math.random() * 900 + 100
    )}) ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(
      Math.random() * 9000 + 1000
    )}`;
    setPhoneNumber(randomPhoneNumber);

    // Upload the phone number immediately after generating it
    const uploadResult = await uploadPhoneNumber(
      randomPhoneNumber,
      businessName
    );
    if (uploadResult.error) {
      console.error("Error uploading phone number:", uploadResult.error);
    } else {
      console.log("Phone number uploaded successfully");
    }
  };

  return (
    <div className="container mx-auto max-w-2xl py-10d">
      <Card className="bg-background text-foreground mb-6">
        <CardHeader>
          <CardTitle>
            <h1 className="text-2xl font-bold">Business Info</h1>
          </CardTitle>
          <CardDescription>Set up your business profile.</CardDescription>
        </CardHeader>

        <CardContent>
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
                  <li key={index} className="flex items-center justify-between">
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
          <div className="mt-4">
            <Button className="pt-1" onClick={handleBusinessInfo}>
              {" "}
              Submit business info
            </Button>
          </div>
        </CardContent>
      </Card>

      {isBusinessInfoUploaded && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-background text-foreground">
            <CardHeader>
              <CardTitle>
                <h1 className="text-2xl font-bold">
                  Let&apos;s Get You a Phone Number
                </h1>
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p>
                <ul>
                  <li>
                    The AI agent will have its own phone number. Your business
                    phone number should be directed to this number. Here are
                    instructions on how to do that on iOS and Android. and enter
                    the AI agent&apos;s number.
                  </li>
                </ul>
              </p>
              <Button
                disabled={phoneNumber !== ""}
                onClick={getRandomPhoneNumber}
                className={`mt-4 ${phoneNumber !== "" ? "disabled" : ""}`}
              >
                Get Phone Number
              </Button>

              {phoneNumber && (
                <div className="mt-4">
                  <p>
                    Your phone number is:
                    <a
                      href={`tel:${phoneNumber}`}
                      className="text-large font-bold  rounded-lg px-1 py-1 inline-block hover:bg-foreground hover:text-background"
                    >
                      {phoneNumber}
                    </a>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      <CardFooter className="flex justify-end mt-6">
        <Button onClick={handleSubmit} type="submit">
          Complete Onboarding
        </Button>
      </CardFooter>
    </div>
  );
};

export default OnboardingPage;
