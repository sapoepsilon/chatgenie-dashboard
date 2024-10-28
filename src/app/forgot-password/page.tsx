import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sendPasswordResetEmail } from "./actions";
import { Card } from "@/components/ui/card";

export default function ResetPasswordPage() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        action={sendPasswordResetEmail}
        className="flex flex-col space-y-6 w-96" // Set a specific width for the form
      >
        <div className="flex flex-col space-y-1.5">
          <Card className="p-4 bg-background">
            {" "}
            {/* Increased padding for the card */}
            <Label className="text-foreground text-lg font-semibold">
              Email:
            </Label>{" "}
            {/* Increased font size */}
            <Input
              id="email"
              name="email"
              type="email"
              className="text-foreground border border-gray-300 rounded-md p-2 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500" // Added focus styling
              required
              placeholder="Enter your email"
            />
            <Button
              type="submit"
              className="text-white p-2 mt-4 rounded hover:bg-blue-600"
            >
              Send Reset Link
            </Button>
          </Card>
        </div>
      </form>
    </div>
  );
}
