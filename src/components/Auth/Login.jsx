import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { RiErrorWarningFill } from "react-icons/ri";
import InputField from "../form/InputField";
import SubmitButton from "../form/ButtonSubmit";
import { useTranslation } from "../../lib/i18n/LanguageContext";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const router = useRouter();
    const { t } = useTranslation();

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
            localStorage.setItem('UserName', data.user.name);
            localStorage.setItem('role', data.user.role);
            router.push("/");
        } else {
            setMessage(t("auth.loginFailed"));
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-100px)] items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="card-cartoon p-6 sm:p-8">
                    <div className="text-center mb-6">
                        <span className="text-4xl mb-3 block">👋</span>
                        <h2 className="text-2xl font-extrabold text-[#2D3436] dark:text-white">{t("auth.welcomeBack")}</h2>
                        <p className="text-sm text-[#B2BEC3] mt-1">{t("auth.signInToAccount")}</p>
                    </div>

                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        <InputField
                            label={t("auth.email")}
                            type="email"
                            value={email}
                            required
                            name="email"
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <InputField
                            label={t("auth.password")}
                            type="password"
                            value={password}
                            required
                            name="password"
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <SubmitButton text={t("auth.loginBtn")} />
                    </form>

                    {message && (
                        <div className="mt-4 flex items-center gap-2 p-3 rounded-2xl bg-[#FF6B6B]/10 text-[#FF6B6B]">
                            <RiErrorWarningFill className="w-5 h-5 flex-shrink-0" />
                            <span className="text-sm font-bold">{message}</span>
                        </div>
                    )}

                    <div className="text-center mt-6">
                        <Link className="text-sm font-bold text-[#4ECDC4] hover:text-[#3BADA6] transition-colors" href="/Auth/register/">
                            {t("auth.noAccountYet")}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;