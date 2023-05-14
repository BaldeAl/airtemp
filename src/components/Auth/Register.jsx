import { useState } from "react";
import { useRouter } from 'next/router';
import Link from "next/link"
import {RiErrorWarningFill} from "react-icons/ri"
import InputField from "../form/InputField";
import SubmitButton from "../form/ButtonSubmit";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch(`/api/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, password }),
        });
            const data = await response.json()
        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('UserName', name);
            router.push("/");
        } else {
            if (response.status === 409) {
            setMessage("Email already in use");  // Display a specific error message for duplicate email
        } else {
            setMessage("An error occurred");  // Generic error message for all other errors
        }
        }
    };



    return ( 
        <div className="flex min-h-[calc(100vh-100px)] flex-col max-w-7xl mx-auto px-4">
        <div className="flex-1 flex-grow">
            <h2 className="text-2xl font-bold mb-4">
                Register
            </h2>

            <form className="flex flex-col gap-4" data-bitwarden-watching="1" onSubmit={handleSubmit}>
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

              <SubmitButton text="Register" />
            </form>
            <Link className="text-sm font-medium text-gray-500"
             href={`/Auth/login/`}>Already have an account? Login
            </Link>
            {message && 
                <div className="alert text-red-500">
                    <RiErrorWarningFill className="w-5 h-5 inline mr-3"/>
                <span className="font-medium">
                        {message}
                </span>
                </div>
                }
        </div>
        </div>
     );
}
 
export default Register;
