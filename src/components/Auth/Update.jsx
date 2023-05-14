import { useState, useEffect} from "react";
import {HiCheckCircle, HiEye, HiEyeOff} from 'react-icons/hi'
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
            
        } else {
            
        }
    };


    return ( 
        <div className="flex min-h-[calc(100vh-100px)] flex-col max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-4">My Profile</h2>
            

            <form className="flex flex-col gap-4" data-bitwarden-watching="1" onSubmit={handleSubmit}>
                
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
            {flash &&  <div className="alert  alert-success rounded-lg  p-4 text-green-400">
                <HiCheckCircle className="w-5 h-5 inline mr-3"/>
                <span className="font-medium">

                    {flash}     
                </span>
                
                </div>}
            
        </div>
    );
}
 
export default Update;
