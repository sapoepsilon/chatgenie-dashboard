import { login, signup } from "./actions";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-[400px] bg-background text-foreground">
        <CardHeader>
          <CardTitle>Welcome to ChatGenie</CardTitle>
          <CardDescription>
            Please log in or sign up to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2 bg-background">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sing up</TabsTrigger>
            </TabsList>{" "}
            {/* Login Form */}
            <TabsContent value="login">
              <form className="flex flex-col space-y-4" action={login}>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="login-email">Email:</Label>
                  <Input
                    id="login-email"
                    name="email"
                    type="email"
                    required
                    placeholder="Enter your email"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="login-password">Password:</Label>
                  <Input
                    id="login-password"
                    name="password"
                    type="password"
                    required
                    placeholder="Enter your password"
                  />
                </div>
                <Button
                  type="submit"
                  className=" text-white p-2 rounded hover:bg-blue-600"
                >
                  Log in
                </Button>
              </form>
            </TabsContent>
            {/* Signup Form */}
            <TabsContent value="signup">
              <form className="flex flex-col space-y-4" action={signup}>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="signup-email">Email:</Label>
                  <Input
                    id="signup-email"
                    name="email"
                    type="email"
                    required
                    placeholder="Enter your email"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="signup-password">Password:</Label>
                  <Input
                    id="signup-password"
                    name="password"
                    type="password"
                    required
                    placeholder="Enter your password"
                  />
                </div>
                <Button
                  type="submit"
                  className=" text-white p-2 rounded hover:bg-green-600"
                >
                  Sign up
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
