import { HiEye, HiEyeOff } from "react-icons/hi";
import { useState } from "react";

const InputField = ({ label, type, value, onChange, name, required}) => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };
    return (
        <label className="flex flex-col gap-1">
            {label}
            <div className="relative">
                <input 
                    className={"border border-gray-300 rounded-md p-2 w-full"}
                    type={passwordVisible ? "text" : type}
                    value={value}
                    onChange={onChange}
                    name={name}
                    required={required}
                />
                {type === 'password' && 
                    <button type="button" onClick={togglePasswordVisibility} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                        {passwordVisible ? <HiEyeOff /> : <HiEye />}
                    </button>
                }
            </div>
        </label>
    );
}

export default InputField;
