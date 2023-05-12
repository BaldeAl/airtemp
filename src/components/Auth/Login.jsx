import Link from "next/link";
import { useRouter } from "next/router";
import {useState } from "react";
import {RiErrorWarningFill} from "react-icons/ri"
import InputField from "../form/InputField";
import SubmitButton from "../form/ButtonSubmit";


const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const router =useRouter();

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
      localStorage.setItem('UserName',data.user.name )
      router.push("/")
    } else {  
      setMessage("Erreur de connexion. Veuillez réessayer.")
    }
  };



    return ( 
        <div className="flex min-h-[calc(100vh-100px)] flex-col max-w-7xl mx-auto px-4">
          
        <div className="flex-1 flex-grow">
            <h2 className="text-2xl font-bold mb-4">Login</h2>

            <form className="flex flex-col gap-4" data-bitwarden-watching="1" onSubmit={handleSubmit}>


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

                <Link className="text-sm font-medium text-gray-500" href={`/Auth/register/`}>
                  Dont have an account yet?
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
 
export default Login;