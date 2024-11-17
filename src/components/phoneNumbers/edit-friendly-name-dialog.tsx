import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface EditFriendlyNameDialogProps {
  phoneNumber: string;
  sid: string;
  currentFriendlyName: string;
  onUpdate: () => void;
}

export function EditFriendlyNameDialog({
  phoneNumber,
  sid,
  currentFriendlyName,
  onUpdate,
}: EditFriendlyNameDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [friendlyName, setFriendlyName] = useState(currentFriendlyName);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/twilio/phone-numbers/${sid}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ friendlyName }),
      });

      if (!response.ok) {
        throw new Error("Failed to update friendly name");
      }

      toast({
        title: "Success",
        description: "Friendly name updated successfully",
      });

      onUpdate();
      setIsOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Failed to update friendly name: ${error}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setFriendlyName(currentFriendlyName);
          }}
        >
          <Edit2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Friendly Name</DialogTitle>
          <DialogDescription>
            Update the friendly name for phone number {phoneNumber}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="friendlyName">Friendly Name</Label>
            <Input
              id="friendlyName"
              value={friendlyName}
              onChange={(e) => setFriendlyName(e.target.value)}
              placeholder="Enter friendly name"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
