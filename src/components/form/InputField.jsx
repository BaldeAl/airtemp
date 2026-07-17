import { HiEye, HiEyeOff } from "react-icons/hi";
import { useState } from "react";

const InputField = ({ label, type, value, onChange, name, required }) => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };
    return (
        <label className="flex flex-col gap-1.5">
            <span className="text-sm font-bold text-[#636E72] dark:text-[#B2BEC3]">
                {label}
                {required && <span className="text-[#FF6B6B] ml-0.5">*</span>}
            </span>
            <div className="relative">
                <input
                    className="input-cartoon"
                    type={passwordVisible ? "text" : type}
                    value={value}
                    onChange={onChange}
                    name={name}
                    required={required}
                />
                {type === 'password' &&
                    <button type="button" onClick={togglePasswordVisibility} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#B2BEC3] hover:text-[#636E72] transition-colors">
                        {passwordVisible ? <HiEyeOff className="text-lg" /> : <HiEye className="text-lg" />}
                    </button>
                }
            </div>
        </label>
    );
}

export default InputField;
