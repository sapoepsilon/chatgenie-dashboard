import { login, signup } from "./actions";

export default function LoginPage() {
    return (
        <form className="flex flex-col space-y-4 p-4 max-w-md mx-auto">
            <label htmlFor="email" className="text-sm font-medium">Email:</label>
            <input id="email" name="email" type="email" required className="border p-2 rounded" />
            <label htmlFor="password" className="text-sm font-medium">Password:</label>
            <input id="password" name="password" type="password" required className="border p-2 rounded" />
            <button formAction={login} className="bg-blue-500 text-white p-2 rounded">Log in</button>
            <button formAction={signup} className="bg-green-500 text-white p-2 rounded">Sign up</button>
        </form>
    );
}
