import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Search } from "lucide-react";

interface PhoneNumberOption {
  friendlyName: string;
  phoneNumber: string;
  locality: string;
  region: string;
}

export function PurchaseNumberDialog({
  onNumberPurchased,
}: {
  onNumberPurchased: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [areaCode, setAreaCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [availableNumbers, setAvailableNumbers] = useState<PhoneNumberOption[]>(
    []
  );
  const [selectedNumber, setSelectedNumber] = useState<string | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const { toast } = useToast();

  const searchNumbers = async () => {
    if (!areaCode || areaCode.length !== 3) {
      toast({
        variant: "destructive",
        title: "Invalid area code",
        description: "Please enter a valid 3-digit area code",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/twilio/phone-numbers/purchase?areaCode=${areaCode}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch numbers");
      }

      if (data.length === 0) {
        toast({
          variant: "default",
          title: "No numbers available",
          description: `No phone numbers found for area code ${areaCode}`,
        });
        return;
      }

      setAvailableNumbers(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to fetch available numbers",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAreaCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 3);
    setAreaCode(value);
  };

  const purchaseNumber = async (phoneNumber: string) => {
    setIsPurchasing(true);
    try {
      const response = await fetch("/api/twilio/phone-numbers/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to purchase number");
      }

      toast({
        title: "Success",
        description: "Phone number purchased successfully",
      });
      onNumberPurchased();
      setIsOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to purchase phone number",
      });
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add New Number
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Purchase Phone Number</DialogTitle>
          <DialogDescription>
            Search for available phone numbers by area code
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center space-x-2">
            <div className="flex-1">
              <Label htmlFor="areaCode" className="mb-2">
                Area Code
              </Label>
              <Input
                id="areaCode"
                placeholder="e.g., 801"
                value={areaCode}
                onChange={handleAreaCodeChange}
                maxLength={3}
                className="text-center text-lg"
              />
            </div>
            <Button
              onClick={searchNumbers}
              disabled={isLoading || areaCode.length !== 3}
              className="mt-7"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>

          {availableNumbers.length > 0 && (
            <div className="space-y-2">
              <Label>Available Numbers</Label>
              <div className="max-h-[300px] overflow-y-auto space-y-2">
                {availableNumbers.map((number) => (
                  <div
                    key={number.phoneNumber}
                    className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${
                      selectedNumber === number.phoneNumber
                        ? "bg-accent"
                        : "hover:bg-accent/50"
                    }`}
                    onClick={() => setSelectedNumber(number.phoneNumber)}
                  >
                    <div>
                      <div className="font-medium">{number.friendlyName}</div>
                      <div className="text-sm text-muted-foreground">
                        {number.locality}, {number.region}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      disabled={isPurchasing}
                      onClick={() => purchaseNumber(number.phoneNumber)}
                    >
                      {isPurchasing && selectedNumber === number.phoneNumber ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Purchase"
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
