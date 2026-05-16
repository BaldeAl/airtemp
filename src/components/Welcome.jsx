import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

const WelcomeMessage = () => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const storedUserName = localStorage.getItem("UserName");

    if (storedUserName) {
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
