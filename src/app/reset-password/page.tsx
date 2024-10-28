import { Card } from "@/components/ui/card";
import { resetPassword } from "./actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function ResetPasswordPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        action={resetPassword}
        className="flex flex-col space-y-6 bg-white p-6 rounded-lg shadow-md max-w-md w-full"
      >
        <Card className="p-4 bg-background shadow">
          {/* <Label className="text-foreground" htmlFor="email">
            Email:
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            className="text-foreground"
            required
            placeholder="Enter your email"
          /> */}
        </Card>
        <Card className="bg-background">
          <Label className="text-foreground" htmlFor="new-password">
            New Password:
          </Label>
          <Input
            className="text-foreground"
            id="new-password"
            name="newPassword"
            type="password"
            required
            placeholder="Enter your new password"
          />
        </Card>
        <Button
          type="submit"
          className="text-white p-2 rounded hover:bg-blue-600"
        >
          Reset Password
        </Button>
      </form>
    </div>
  );
}
