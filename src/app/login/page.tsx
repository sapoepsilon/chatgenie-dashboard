import { login, signup } from "./actions";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export default function LoginPage() {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <Card className="w-[400px]">
                <CardHeader>
                    <CardTitle>Welcome Back</CardTitle>
                    <CardDescription>Please log in or sign up to continue.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="login">
                        <TabsList className="flex justify-center">
                            <TabsTrigger value="login" className="rounded bg-gray-200 hover:bg-gray-300">
                                Log In
                            </TabsTrigger>
                            <TabsTrigger value="signup" className=" rounded bg-gray-200 hover:bg-gray-300">
                                Sign Up
                            </TabsTrigger>
                        </TabsList>

                        {/* Login Form */}
                        <TabsContent value="login">
                            <form className="flex flex-col space-y-4" action={login}>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="login-email">Email:</Label>
                                    <Input id="login-email" name="email" type="email" required placeholder="Enter your email" />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="login-password">Password:</Label>
                                    <Input id="login-password" name="password" type="password" required placeholder="Enter your password" />
                                </div>
                                <Button type="submit" className=" text-white p-2 rounded hover:bg-blue-600">
                                    Log in
                                </Button>
                            </form>
                        </TabsContent>

                        {/* Signup Form */}
                        <TabsContent value="signup">
                            <form className="flex flex-col space-y-4" action={signup}>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="signup-email">Email:</Label>
                                    <Input id="signup-email" name="email" type="email" required placeholder="Enter your email" />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="signup-password">Password:</Label>
                                    <Input id="signup-password" name="password" type="password" required placeholder="Enter your password" />
                                </div>
                                <Button type="submit" className=" text-white p-2 rounded hover:bg-green-600">
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
