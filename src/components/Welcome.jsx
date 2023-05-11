import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const WelcomeMessage = () => {
    const [userName, setUserName] = useState("");

    useEffect(() => {
        // Récupérer le nom d'utilisateur à partir du stockage local
        const storedUserName = localStorage.getItem("UserName");

        if (storedUserName) {

            // Montrer le toast
            toast.success(`Welcome 👋 , ${storedUserName}`);
        } else {
            toast.success(`Welcome 👋`);
        }
    }, []);

    return (
        <div>
            <ToastContainer />
        </div>
    );
};

export default WelcomeMessage;
