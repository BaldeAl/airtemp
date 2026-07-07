import { useState } from "react";
import { useRouter } from 'next/router';
import Link from "next/link";
import { RiErrorWarningFill } from "react-icons/ri";
import InputField from "../form/InputField";
import SubmitButton from "../form/ButtonSubmit";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isHost, setIsHost] = useState(false);
    const [address, setAddress] = useState("");
    const router = useRouter();
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch(`/api/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, password, isHost, address }),
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('UserName', name);
            localStorage.setItem('role', data.user.role);
            if (isHost) {
                setMessage("Account created successfully! Your host profile is pending validation.");
                // wait 2 seconds before redirecting
                setTimeout(() => router.push("/"), 2000);
            } else {
                router.push("/");
            }
        } else {
            if (response.status === 409) {
                setMessage("Email already in use");
            } else {
                setMessage("An error occurred");
            }
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-100px)] items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="card-cartoon p-6 sm:p-8">
                    <div className="text-center mb-6">
                        <span className="text-4xl mb-3 block">🚀</span>
                        <h2 className="text-2xl font-extrabold text-[#2D3436] dark:text-white">Create an account</h2>
                        <p className="text-sm text-[#B2BEC3] mt-1">Join us and start exploring</p>
                    </div>

                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        <InputField
                            label="Name"
                            type="text"
                            value={name}
                            name="name"
                            required
                            onChange={(e) => setName(e.target.value)}
                        />

                        <InputField
                            label="Email"
                            type="email"
                            value={email}
                            name="email"
                            required
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <InputField
                            label="Password"
                            type="password"
                            value={password}
                            name="password"
                            required
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <div className="flex items-center gap-2 mt-2">
                            <input
                                type="checkbox"
                                id="isHost"
                                checked={isHost}
                                onChange={(e) => setIsHost(e.target.checked)}
                                className="w-4 h-4 rounded border-[#B2BEC3] text-[#FF6B6B] focus:ring-[#FF6B6B]"
                            />
                            <label htmlFor="isHost" className="text-sm font-bold text-[#636E72] dark:text-[#B2BEC3]">
                                Register as a Host / Gérant
                            </label>
                        </div>

                        {isHost && (
                            <div className="animate-fade-in-up">
                                <InputField
                                    label="Address"
                                    type="text"
                                    value={address}
                                    name="address"
                                    required={isHost}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </div>
                        )}

                        <SubmitButton text="Register" />
                    </form>

                    {message && (
                        <div className={`mt-4 flex items-center gap-2 p-3 rounded-2xl ${message.includes('successfully') ? 'bg-[#55EFC4]/15 text-[#00B894]' : 'bg-[#FF6B6B]/10 text-[#FF6B6B]'}`}>
                            <RiErrorWarningFill className="w-5 h-5 flex-shrink-0" />
                            <span className="text-sm font-bold">{message}</span>
                        </div>
                    )}

                    <div className="text-center mt-6">
                        <Link className="text-sm font-bold text-[#4ECDC4] hover:text-[#3BADA6] transition-colors" href="/Auth/login/">
                            Already have an account? Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
