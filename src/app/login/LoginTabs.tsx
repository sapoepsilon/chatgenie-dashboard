import { login, signup } from "./actions";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto p-4">
      <Tabs defaultValue="login">
        <TabsList className="flex space-x-4 mb-4">
          <TabsTrigger value="login" className="p-2 rounded bg-gray-200">
            Log In
          </TabsTrigger>
          <TabsTrigger value="signup" className="p-2 rounded bg-gray-200">
            Sign Up
          </TabsTrigger>
        </TabsList>

        {/* Login Form */}
        <TabsContent value="login">
          <form className="flex flex-col space-y-4" action={login}>
            <label htmlFor="login-email" className="text-sm font-medium">Email:</label>
            <input id="login-email" name="email" type="email" required className="border p-2 rounded" />

            <label htmlFor="login-password" className="text-sm font-medium">Password:</label>
            <input id="login-password" name="password" type="password" required className="border p-2 rounded" />

            <button type="submit" className="bg-blue-500 text-white p-2 rounded">
              Log in
            </button>
          </form>
        </TabsContent>

        {/* Signup Form */}
        <TabsContent value="signup">
          <form className="flex flex-col space-y-4" action={signup}>
            <label htmlFor="signup-email" className="text-sm font-medium">Email:</label>
            <input id="signup-email" name="email" type="email" required className="border p-2 rounded" />

            <label htmlFor="signup-password" className="text-sm font-medium">Password:</label>
            <input id="signup-password" name="password" type="password" required className="border p-2 rounded" />

            <button type="submit" className="bg-green-500 text-white p-2 rounded">
              Sign up
            </button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
