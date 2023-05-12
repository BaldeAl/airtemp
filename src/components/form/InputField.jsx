import { HiEye, HiEyeOff } from "react-icons/hi";
import PropTypes from 'prop-types';
import { useState } from "react";

const InputField = ({ label, type, value, onChange, name, required}) => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };
    return (
        <label className="flex flex-col gap-1">
            {label}
            <>
                <input 
                    className={"border border-gray-300 rounded-md p-2"}
                    type={passwordVisible ? "text" : type}
                    value={value}
                    onChange={onChange}
                    name={name}
                    required={required}
                />
                {type === 'password' && 
                    <button type="button" onClick={togglePasswordVisibility} className="absolute right-2  transform -translate-y-0 text-gray-500">
                        {passwordVisible ? <HiEyeOff /> : <HiEye />}
                    </button>
                }
            </> 
        </label>
    );
}

InputField.propTypes = {
    label: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    required: PropTypes.bool,
};

export default InputField;
