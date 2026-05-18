import { useState, useEffect } from "react";
import { HiCheckCircle } from 'react-icons/hi';
import InputField from "../form/InputField";
import SubmitButton from "../form/ButtonSubmit";

const Update = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [flash, setFlash] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            const res = await fetch('/api/auth/me', {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
            const data = await res.json();
            setName(data.user?.name || "");
            setEmail(data.user?.email || "");
            setPassword(data.user?.password || "");
        };

        fetchUser();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const response = await fetch(`/api/auth/me`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ name, email }),
        });

        const { user: updatedUser } = await response.json();
        if (response.ok) {
            setName(updatedUser.name);
            setEmail(updatedUser.email);
            setPassword(updatedUser.password);
            localStorage.setItem('UserName', updatedUser.name);
            setFlash('Information updated successfully');
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-100px)] items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="card-cartoon p-6 sm:p-8">
                    <div className="text-center mb-6">
                        <span className="text-4xl mb-3 block">👤</span>
                        <h2 className="text-2xl font-extrabold text-[#2D3436] dark:text-white">My Profile</h2>
                        <p className="text-sm text-[#B2BEC3] mt-1">Update your information</p>
                    </div>

                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        <InputField
                            label="Name"
                            type="name"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <InputField
                            label="Email"
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <InputField
                            label="Password"
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <SubmitButton text="Update" />
                    </form>

                    {flash && (
                        <div className="mt-4 flex items-center gap-2 p-3 rounded-2xl bg-[#55EFC4]/15 text-[#00B894]">
                            <HiCheckCircle className="w-5 h-5 flex-shrink-0" />
                            <span className="text-sm font-bold">{flash}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Update;
