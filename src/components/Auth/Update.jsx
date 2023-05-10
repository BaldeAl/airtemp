import { useState, useEffect, useContext } from "react";
import { UserContext } from '../context/UserContext'

const Update = () => {
    const { user, setUser } = useContext(UserContext);
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
     const [flash, setFlash] = useState(null);


    useEffect(() => {
        setName(user?.name || "");
        setEmail(user?.email || "");
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch("/api/auth/me", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email }),
        });

        const { user: updatedUser } = await response.json();
        if (response.ok) {
            setUser(updatedUser);
            setFlash('Information updated successfully');
            setTimeout(() => setFlash(null), 3000);
        } else {
            // Handle error...
        }
    };

    return ( 
        <>
            <h2 class="text-2xl font-bold mb-4">My Profile</h2>
            {flash && <div className="alert alert-success">{flash}</div>}

            <form class="flex flex-col gap-4" onSubmit={handleSubmit}>
                <label class="flex flex-col gap-1">
                    Name
                    <input 
                        class="border border-gray-300 rounded-md p-2"
                        type="text"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </label>

                <label class="flex flex-col gap-1">
                    Email
                    <input 
                        class="border border-gray-300 rounded-md p-2"
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </label>
                <button class="bg-blue-500 text-white rounded-md p-2" type="submit">
                    Update
                </button>
            </form>
        </>
    );
}
 
export default Update;
