import { data } from "autoprefixer";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const router =useRouter();
    const {setUser} =useContext(UserContext);

    const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      setUser(data.user)
      router.push("/")
    } else {  
      setMessage("Erreur de connexion. Veuillez réessayer.")
    }
  };



    return ( 
        <div className="flex min-h-[calc(100vh-100px)] flex-col max-w-7xl mx-auto px-4">
          
        <div className="flex-1 flex-grow">
            <h2 className="text-2xl font-bold mb-4">Login</h2>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

                <label className="flex flex-col gap-1">
                    Email
                    <input className="border border-gray-300 rounded-md
                     p-2 disabled:cursor-not-allowed"
                      type="email" name="email" 
                      required="" value={email}
                      onChange={(e)=> setEmail(e.target.value)}/>
                </label>

                <label className="flex flex-col gap-1">
                    Password
                    <input className="border border-gray-300 rounded-md
                     p-2 disabled:cursor-not-allowed" type="password"
                      name="password" 
                      required=""
                      value={password}
                      onChange={(e)=> setPassword(e.target.value)}/>
                </label>

                <button className="bg-blue-500 text-white rounded-md p-2
                 disabled:opacity-50 disabled:cursor-not-allowed" 
                 type="submit">
                    Login
                </button>

            </form>

                <Link className="text-sm font-medium text-gray-500" href={`/Auth/register/`}>
                  Dont have an account yet?
                  </Link>
              {message && <p>{message}</p>}
            </div>

               
        </div>
        
     );
}
 
export default Login;