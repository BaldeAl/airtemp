import { useState } from "react";
import { useRouter } from 'next/router';
import Link from "next/link"

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const [message, steMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, password }),
        });
            const data = await response.json()
        if (response.ok) {
            localStorage.setItem('token', data.token);
            router.push("/");
        } else {
            // handle error
            steMessage("ce n'est pas bon du tout")
        }
    };

    return ( 
        <div className="flex min-h-[calc(100vh-100px)] flex-col max-w-7xl mx-auto px-4">
            {message && <div>{message}</div>}
        <div className="flex-1 flex-grow">
            <h2 className="text-2xl font-bold mb-4">
                Register
            </h2>

            <form className="flex flex-col gap-4" data-bitwarden-watching="1" onSubmit={handleSubmit}>
                <label className="flex flex-col gap-1">
                    Name
                    <input className="border border-gray-300 rounded-md p-2 
                    disabled:cursor-not-allowed" type="text"
                     name="name" required=""
                     value={name}
                     onChange={(e) => setName(e.target.value)} />

                </label>

                <label className="flex flex-col gap-1">
                    Email
                    <input className="border border-gray-300 rounded-md p-2
                     disabled:cursor-not-allowed" type="email" name="email" 
                     required=""
                     value={email}
                     onChange={(e) => setEmail(e.target.value)} />

                </label>

                <label className="flex flex-col gap-1">
                    Password
                    <input className="border border-gray-300 rounded-md p-2 
                    disabled:cursor-not-allowed" type="password" name="password" 
                     required=""
                     value={password}
                     onChange={(e) => setPassword(e.target.value)} />

                </label>
                <button className="bg-blue-500 text-white rounded-md p-2 disabled:opacity-50 
                disabled:cursor-not-allowed" type="submit">
                    Register
                </button>
            </form>
            <Link className="text-sm font-medium text-gray-500"
             href={`/Auth/login/`}>Already have an account? Login
            </Link>
        </div>
        </div>
     );
}
 
export default Register;
