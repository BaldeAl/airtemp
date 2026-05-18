import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { RiErrorWarningFill } from "react-icons/ri";
import InputField from "../form/InputField";
import SubmitButton from "../form/ButtonSubmit";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch(`/api/auth/login`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('UserName', data.user.name);
            router.push("/");
        } else {
            setMessage("Erreur de connexion. Veuillez réessayer.");
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-100px)] items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="card-cartoon p-6 sm:p-8">
                    <div className="text-center mb-6">
                        <span className="text-4xl mb-3 block">👋</span>
                        <h2 className="text-2xl font-extrabold text-[#2D3436] dark:text-white">Welcome back</h2>
                        <p className="text-sm text-[#B2BEC3] mt-1">Sign in to your account</p>
                    </div>

                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        <InputField
                            label="Email"
                            type="email"
                            value={email}
                            required
                            name="email"
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <InputField
                            label="Password"
                            type="password"
                            value={password}
                            required
                            name="password"
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <SubmitButton text="Login" />
                    </form>

                    {message && (
                        <div className="mt-4 flex items-center gap-2 p-3 rounded-2xl bg-[#FF6B6B]/10 text-[#FF6B6B]">
                            <RiErrorWarningFill className="w-5 h-5 flex-shrink-0" />
                            <span className="text-sm font-bold">{message}</span>
                        </div>
                    )}

                    <div className="text-center mt-6">
                        <Link className="text-sm font-bold text-[#4ECDC4] hover:text-[#3BADA6] transition-colors" href="/Auth/register/">
                            Don't have an account yet? Register
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;