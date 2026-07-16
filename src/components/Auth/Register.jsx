import { useState } from "react";
import { useRouter } from 'next/router';
import Link from "next/link";
import { RiErrorWarningFill } from "react-icons/ri";
import { HiPhone, HiIdentification, HiInformationCircle } from "react-icons/hi";
import InputField from "../form/InputField";
import SubmitButton from "../form/ButtonSubmit";

const COUNTRY_CODES = [
    { code: "+93", country: "Afghanistan", flag: "🇦🇫" },
    { code: "+355", country: "Albania", flag: "🇦🇱" },
    { code: "+213", country: "Algeria", flag: "🇩🇿" },
    { code: "+376", country: "Andorra", flag: "🇦🇩" },
    { code: "+244", country: "Angola", flag: "🇦🇴" },
    { code: "+1268", country: "Antigua & Barbuda", flag: "🇦🇬" },
    { code: "+54", country: "Argentina", flag: "🇦🇷" },
    { code: "+374", country: "Armenia", flag: "🇦🇲" },
    { code: "+61", country: "Australia", flag: "🇦🇺" },
    { code: "+43", country: "Austria", flag: "🇦🇹" },
    { code: "+994", country: "Azerbaijan", flag: "🇦🇿" },
    { code: "+1242", country: "Bahamas", flag: "🇧🇸" },
    { code: "+973", country: "Bahrain", flag: "🇧🇭" },
    { code: "+880", country: "Bangladesh", flag: "🇧🇩" },
    { code: "+1246", country: "Barbados", flag: "🇧🇧" },
    { code: "+375", country: "Belarus", flag: "🇧🇾" },
    { code: "+32", country: "Belgium", flag: "🇧🇪" },
    { code: "+501", country: "Belize", flag: "🇧🇿" },
    { code: "+229", country: "Benin", flag: "🇧🇯" },
    { code: "+975", country: "Bhutan", flag: "🇧🇹" },
    { code: "+591", country: "Bolivia", flag: "🇧🇴" },
    { code: "+387", country: "Bosnia & Herzegovina", flag: "🇧🇦" },
    { code: "+267", country: "Botswana", flag: "🇧🇼" },
    { code: "+55", country: "Brazil", flag: "🇧🇷" },
    { code: "+673", country: "Brunei", flag: "🇧🇳" },
    { code: "+359", country: "Bulgaria", flag: "🇧🇬" },
    { code: "+226", country: "Burkina Faso", flag: "🇧🇫" },
    { code: "+257", country: "Burundi", flag: "🇧🇮" },
    { code: "+855", country: "Cambodia", flag: "🇰🇭" },
    { code: "+237", country: "Cameroon", flag: "🇨🇲" },
    { code: "+1", country: "Canada", flag: "🇨🇦" },
    { code: "+238", country: "Cape Verde", flag: "🇨🇻" },
    { code: "+236", country: "Central African Rep.", flag: "🇨🇫" },
    { code: "+235", country: "Chad", flag: "🇹🇩" },
    { code: "+56", country: "Chile", flag: "🇨🇱" },
    { code: "+86", country: "China", flag: "🇨🇳" },
    { code: "+57", country: "Colombia", flag: "🇨🇴" },
    { code: "+269", country: "Comoros", flag: "🇰🇲" },
    { code: "+242", country: "Congo", flag: "🇨🇬" },
    { code: "+243", country: "Congo (DRC)", flag: "🇨🇩" },
    { code: "+506", country: "Costa Rica", flag: "🇨🇷" },
    { code: "+225", country: "Côte d'Ivoire", flag: "🇨🇮" },
    { code: "+385", country: "Croatia", flag: "🇭🇷" },
    { code: "+53", country: "Cuba", flag: "🇨🇺" },
    { code: "+357", country: "Cyprus", flag: "🇨🇾" },
    { code: "+420", country: "Czech Republic", flag: "🇨🇿" },
    { code: "+45", country: "Denmark", flag: "🇩🇰" },
    { code: "+253", country: "Djibouti", flag: "🇩🇯" },
    { code: "+1767", country: "Dominica", flag: "🇩🇲" },
    { code: "+1809", country: "Dominican Republic", flag: "🇩🇴" },
    { code: "+670", country: "East Timor", flag: "🇹🇱" },
    { code: "+593", country: "Ecuador", flag: "🇪🇨" },
    { code: "+20", country: "Egypt", flag: "🇪🇬" },
    { code: "+503", country: "El Salvador", flag: "🇸🇻" },
    { code: "+240", country: "Equatorial Guinea", flag: "🇬🇶" },
    { code: "+291", country: "Eritrea", flag: "🇪🇷" },
    { code: "+372", country: "Estonia", flag: "🇪🇪" },
    { code: "+268", country: "Eswatini", flag: "🇸🇿" },
    { code: "+251", country: "Ethiopia", flag: "🇪🇹" },
    { code: "+679", country: "Fiji", flag: "🇫🇯" },
    { code: "+358", country: "Finland", flag: "🇫🇮" },
    { code: "+33", country: "France", flag: "🇫🇷" },
    { code: "+241", country: "Gabon", flag: "🇬🇦" },
    { code: "+220", country: "Gambia", flag: "🇬🇲" },
    { code: "+995", country: "Georgia", flag: "🇬🇪" },
    { code: "+49", country: "Germany", flag: "🇩🇪" },
    { code: "+233", country: "Ghana", flag: "🇬🇭" },
    { code: "+30", country: "Greece", flag: "🇬🇷" },
    { code: "+1473", country: "Grenada", flag: "🇬🇩" },
    { code: "+502", country: "Guatemala", flag: "🇬🇹" },
    { code: "+224", country: "Guinea", flag: "🇬🇳" },
    { code: "+245", country: "Guinea-Bissau", flag: "🇬🇼" },
    { code: "+592", country: "Guyana", flag: "🇬🇾" },
    { code: "+509", country: "Haiti", flag: "🇭🇹" },
    { code: "+504", country: "Honduras", flag: "🇭🇳" },
    { code: "+36", country: "Hungary", flag: "🇭🇺" },
    { code: "+354", country: "Iceland", flag: "🇮🇸" },
    { code: "+91", country: "India", flag: "🇮🇳" },
    { code: "+62", country: "Indonesia", flag: "🇮🇩" },
    { code: "+98", country: "Iran", flag: "🇮🇷" },
    { code: "+964", country: "Iraq", flag: "🇮🇶" },
    { code: "+353", country: "Ireland", flag: "🇮🇪" },
    { code: "+972", country: "Israel", flag: "🇮🇱" },
    { code: "+39", country: "Italy", flag: "🇮🇹" },
    { code: "+1876", country: "Jamaica", flag: "🇯🇲" },
    { code: "+81", country: "Japan", flag: "🇯🇵" },
    { code: "+962", country: "Jordan", flag: "🇯🇴" },
    { code: "+7", country: "Kazakhstan", flag: "🇰🇿" },
    { code: "+254", country: "Kenya", flag: "🇰🇪" },
    { code: "+686", country: "Kiribati", flag: "🇰🇮" },
    { code: "+383", country: "Kosovo", flag: "🇽🇰" },
    { code: "+965", country: "Kuwait", flag: "🇰🇼" },
    { code: "+996", country: "Kyrgyzstan", flag: "🇰🇬" },
    { code: "+856", country: "Laos", flag: "🇱🇦" },
    { code: "+371", country: "Latvia", flag: "🇱🇻" },
    { code: "+961", country: "Lebanon", flag: "🇱🇧" },
    { code: "+266", country: "Lesotho", flag: "🇱🇸" },
    { code: "+231", country: "Liberia", flag: "🇱🇷" },
    { code: "+218", country: "Libya", flag: "🇱🇾" },
    { code: "+423", country: "Liechtenstein", flag: "🇱🇮" },
    { code: "+370", country: "Lithuania", flag: "🇱🇹" },
    { code: "+352", country: "Luxembourg", flag: "🇱🇺" },
    { code: "+261", country: "Madagascar", flag: "🇲🇬" },
    { code: "+265", country: "Malawi", flag: "🇲🇼" },
    { code: "+60", country: "Malaysia", flag: "🇲🇾" },
    { code: "+960", country: "Maldives", flag: "🇲🇻" },
    { code: "+223", country: "Mali", flag: "🇲🇱" },
    { code: "+356", country: "Malta", flag: "🇲🇹" },
    { code: "+692", country: "Marshall Islands", flag: "🇲🇭" },
    { code: "+222", country: "Mauritania", flag: "🇲🇷" },
    { code: "+230", country: "Mauritius", flag: "🇲🇺" },
    { code: "+52", country: "Mexico", flag: "🇲🇽" },
    { code: "+691", country: "Micronesia", flag: "🇫🇲" },
    { code: "+373", country: "Moldova", flag: "🇲🇩" },
    { code: "+377", country: "Monaco", flag: "🇲🇨" },
    { code: "+976", country: "Mongolia", flag: "🇲🇳" },
    { code: "+382", country: "Montenegro", flag: "🇲🇪" },
    { code: "+212", country: "Morocco", flag: "🇲🇦" },
    { code: "+258", country: "Mozambique", flag: "🇲🇿" },
    { code: "+95", country: "Myanmar", flag: "🇲🇲" },
    { code: "+264", country: "Namibia", flag: "🇳🇦" },
    { code: "+674", country: "Nauru", flag: "🇳🇷" },
    { code: "+977", country: "Nepal", flag: "🇳🇵" },
    { code: "+31", country: "Netherlands", flag: "🇳🇱" },
    { code: "+64", country: "New Zealand", flag: "🇳🇿" },
    { code: "+505", country: "Nicaragua", flag: "🇳🇮" },
    { code: "+227", country: "Niger", flag: "🇳🇪" },
    { code: "+234", country: "Nigeria", flag: "🇳🇬" },
    { code: "+850", country: "North Korea", flag: "🇰🇵" },
    { code: "+389", country: "North Macedonia", flag: "🇲🇰" },
    { code: "+47", country: "Norway", flag: "🇳🇴" },
    { code: "+968", country: "Oman", flag: "🇴🇲" },
    { code: "+92", country: "Pakistan", flag: "🇵🇰" },
    { code: "+680", country: "Palau", flag: "🇵🇼" },
    { code: "+970", country: "Palestine", flag: "🇵🇸" },
    { code: "+507", country: "Panama", flag: "🇵🇦" },
    { code: "+675", country: "Papua New Guinea", flag: "🇵🇬" },
    { code: "+595", country: "Paraguay", flag: "🇵🇾" },
    { code: "+51", country: "Peru", flag: "🇵🇪" },
    { code: "+63", country: "Philippines", flag: "🇵🇭" },
    { code: "+48", country: "Poland", flag: "🇵🇱" },
    { code: "+351", country: "Portugal", flag: "🇵🇹" },
    { code: "+974", country: "Qatar", flag: "🇶🇦" },
    { code: "+40", country: "Romania", flag: "🇷🇴" },
    { code: "+7", country: "Russia", flag: "🇷🇺" },
    { code: "+250", country: "Rwanda", flag: "🇷🇼" },
    { code: "+1869", country: "Saint Kitts & Nevis", flag: "🇰🇳" },
    { code: "+1758", country: "Saint Lucia", flag: "🇱🇨" },
    { code: "+1784", country: "Saint Vincent", flag: "🇻🇨" },
    { code: "+685", country: "Samoa", flag: "🇼🇸" },
    { code: "+378", country: "San Marino", flag: "🇸🇲" },
    { code: "+239", country: "São Tomé & Príncipe", flag: "🇸🇹" },
    { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
    { code: "+221", country: "Senegal", flag: "🇸🇳" },
    { code: "+381", country: "Serbia", flag: "🇷🇸" },
    { code: "+248", country: "Seychelles", flag: "🇸🇨" },
    { code: "+232", country: "Sierra Leone", flag: "🇸🇱" },
    { code: "+65", country: "Singapore", flag: "🇸🇬" },
    { code: "+421", country: "Slovakia", flag: "🇸🇰" },
    { code: "+386", country: "Slovenia", flag: "🇸🇮" },
    { code: "+677", country: "Solomon Islands", flag: "🇸🇧" },
    { code: "+252", country: "Somalia", flag: "🇸🇴" },
    { code: "+27", country: "South Africa", flag: "🇿🇦" },
    { code: "+82", country: "South Korea", flag: "🇰🇷" },
    { code: "+211", country: "South Sudan", flag: "🇸🇸" },
    { code: "+34", country: "Spain", flag: "🇪🇸" },
    { code: "+94", country: "Sri Lanka", flag: "🇱🇰" },
    { code: "+249", country: "Sudan", flag: "🇸🇩" },
    { code: "+597", country: "Suriname", flag: "🇸🇷" },
    { code: "+46", country: "Sweden", flag: "🇸🇪" },
    { code: "+41", country: "Switzerland", flag: "🇨🇭" },
    { code: "+963", country: "Syria", flag: "🇸🇾" },
    { code: "+886", country: "Taiwan", flag: "🇹🇼" },
    { code: "+992", country: "Tajikistan", flag: "🇹🇯" },
    { code: "+255", country: "Tanzania", flag: "🇹🇿" },
    { code: "+66", country: "Thailand", flag: "🇹🇭" },
    { code: "+228", country: "Togo", flag: "🇹🇬" },
    { code: "+676", country: "Tonga", flag: "🇹🇴" },
    { code: "+1868", country: "Trinidad & Tobago", flag: "🇹🇹" },
    { code: "+216", country: "Tunisia", flag: "🇹🇳" },
    { code: "+90", country: "Turkey", flag: "🇹🇷" },
    { code: "+993", country: "Turkmenistan", flag: "🇹🇲" },
    { code: "+688", country: "Tuvalu", flag: "🇹🇻" },
    { code: "+256", country: "Uganda", flag: "🇺🇬" },
    { code: "+380", country: "Ukraine", flag: "🇺🇦" },
    { code: "+971", country: "United Arab Emirates", flag: "🇦🇪" },
    { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
    { code: "+1", country: "United States", flag: "🇺🇸" },
    { code: "+598", country: "Uruguay", flag: "🇺🇾" },
    { code: "+998", country: "Uzbekistan", flag: "🇺🇿" },
    { code: "+678", country: "Vanuatu", flag: "🇻🇺" },
    { code: "+379", country: "Vatican City", flag: "🇻🇦" },
    { code: "+58", country: "Venezuela", flag: "🇻🇪" },
    { code: "+84", country: "Vietnam", flag: "🇻🇳" },
    { code: "+967", country: "Yemen", flag: "🇾🇪" },
    { code: "+260", country: "Zambia", flag: "🇿🇲" },
    { code: "+263", country: "Zimbabwe", flag: "🇿🇼" },
];

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isHost, setIsHost] = useState(false);
    const [address, setAddress] = useState("");
    const [phoneCountryCode, setPhoneCountryCode] = useState("+33");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [identityDocument, setIdentityDocument] = useState(null);
    const [identityFileName, setIdentityFileName] = useState("");
    const router = useRouter();
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
        if (!validTypes.includes(file.type)) {
            setMessage("Format non supporté. Utilisez JPG, PNG, WebP ou PDF.");
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setMessage("Le fichier est trop volumineux. Taille max : 5 Mo.");
            return;
        }

        setIdentityFileName(file.name);
        setMessage("");

        const reader = new FileReader();
        reader.onloadend = () => {
            setIdentityDocument(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setIsSubmitting(true);

        try {
            const fullPhone = isHost ? `${phoneCountryCode}${phoneNumber}` : null;

            const response = await fetch(`/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    isHost,
                    address,
                    phone: fullPhone,
                    phoneCountryCode: isHost ? phoneCountryCode : null,
                    identityDocument: isHost ? identityDocument : null,
                }),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('UserName', name);
                localStorage.setItem('role', data.user.role);
                if (isHost) {
                    setMessage("Compte créé avec succès ! Votre profil de gérant est en attente de validation par un administrateur.");
                    setTimeout(() => router.push("/"), 3000);
                } else {
                    router.push("/");
                }
            } else {
                if (response.status === 409) {
                    setMessage("Email already in use");
                } else {
                    setMessage(data.message || "An error occurred");
                }
                setIsSubmitting(false);
            }
        } catch (err) {
            console.error("Registration error:", err);
            setMessage("Network error. Please try again.");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-100px)] items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="card-cartoon p-6 sm:p-8">
                    <div className="text-center mb-6">
                        <span className="text-4xl mb-3 block">🚀</span>
                        <h2 className="text-2xl font-extrabold text-[#2D3436] dark:text-white">Create an account</h2>
                        <p className="text-sm text-[#B2BEC3] mt-1">Join us and start exploring</p>
                    </div>

                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        <InputField
                            label="Name"
                            type="text"
                            value={name}
                            name="name"
                            required
                            onChange={(e) => setName(e.target.value)}
                        />

                        <InputField
                            label="Email"
                            type="email"
                            value={email}
                            name="email"
                            required
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <InputField
                            label="Password"
                            type="password"
                            value={password}
                            name="password"
                            required
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <div className="flex items-center gap-2 mt-2">
                            <input
                                type="checkbox"
                                id="isHost"
                                checked={isHost}
                                onChange={(e) => setIsHost(e.target.checked)}
                                className="w-4 h-4 rounded border-[#B2BEC3] text-[#FF6B6B] focus:ring-[#FF6B6B]"
                            />
                            <label htmlFor="isHost" className="text-sm font-bold text-[#636E72] dark:text-[#B2BEC3]">
                                Register as a Host / Gérant
                            </label>
                        </div>

                        {isHost && (
                            <div className="animate-fade-in-up space-y-4">
                                {/* Info banner */}
                                <div className="flex items-start gap-2 p-3 rounded-2xl bg-[#0984E3]/10 text-[#0984E3]">
                                    <HiInformationCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                    <span className="text-xs font-semibold leading-relaxed">
                                        Votre compte sera créé mais les fonctionnalités de gérant seront disponibles après validation par un administrateur.
                                    </span>
                                </div>

                                <InputField
                                    label="Address"
                                    type="text"
                                    value={address}
                                    name="address"
                                    required={isHost}
                                    onChange={(e) => setAddress(e.target.value)}
                                />

                                {/* Phone with country code */}
                                <div>
                                    <label className="flex items-center gap-1.5 text-sm font-bold text-[#636E72] dark:text-[#B2BEC3] mb-1.5">
                                        <HiPhone className="text-[#6C5CE7]" />
                                        Numéro de téléphone
                                    </label>
                                    <div className="flex gap-2">
                                        <select
                                            value={phoneCountryCode}
                                            onChange={(e) => setPhoneCountryCode(e.target.value)}
                                            className="input-cartoon text-sm flex-shrink-0"
                                            style={{ width: '160px' }}
                                        >
                                            {COUNTRY_CODES.map((cc, idx) => (
                                                <option key={`${cc.code}-${idx}`} value={cc.code}>
                                                    {cc.flag} {cc.country} ({cc.code})
                                                </option>
                                            ))}
                                        </select>
                                        <input
                                            type="tel"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                                            required={isHost}
                                            placeholder="612345678"
                                            className="input-cartoon flex-1 text-sm"
                                            minLength={6}
                                            maxLength={15}
                                        />
                                    </div>
                                </div>

                                {/* Identity Document Upload */}
                                <div>
                                    <label className="flex items-center gap-1.5 text-sm font-bold text-[#636E72] dark:text-[#B2BEC3] mb-1.5">
                                        <HiIdentification className="text-[#FF6B6B]" />
                                        Pièce d&apos;identité
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp,application/pdf"
                                            onChange={handleFileChange}
                                            required={isHost}
                                            className="hidden"
                                            id="identityUpload"
                                        />
                                        <label
                                            htmlFor="identityUpload"
                                            className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl border-2 border-dashed border-[#E8E8E4] dark:border-[#3D3D5C] hover:border-[#FF6B6B] dark:hover:border-[#FF6B6B] transition-all cursor-pointer bg-white dark:bg-[#232340]"
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-[#FF6B6B]/10 flex items-center justify-center flex-shrink-0">
                                                <HiIdentification className="text-lg text-[#FF6B6B]" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                {identityFileName ? (
                                                    <>
                                                        <p className="text-sm font-bold text-[#2D3436] dark:text-white truncate">{identityFileName}</p>
                                                        <p className="text-xs text-[#00B894] font-semibold">✓ Document uploadé</p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <p className="text-sm font-bold text-[#636E72] dark:text-[#B2BEC3]">Téléverser votre pièce d&apos;identité</p>
                                                        <p className="text-xs text-[#B2BEC3]">JPG, PNG, WebP ou PDF · Max 5 Mo</p>
                                                    </>
                                                )}
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        <SubmitButton
                            text={isSubmitting ? (isHost ? "Création en cours, veuillez patienter..." : "Registering...") : "Register"}
                            disabled={isSubmitting}
                        />

                        {isSubmitting && isHost && (
                            <div className="flex items-center justify-center gap-2 text-xs text-[#636E72] dark:text-[#B2BEC3] animate-fade-in">
                                <span className="inline-block w-3 h-3 border-2 border-[#4ECDC4] border-t-transparent rounded-full animate-spin" />
                                Envoi du document en cours...
                            </div>
                        )}
                    </form>

                    {message && (
                        <div className={`mt-4 flex items-center gap-2 p-3 rounded-2xl ${message.includes('succès') || message.includes('successfully') ? 'bg-[#55EFC4]/15 text-[#00B894]' : 'bg-[#FF6B6B]/10 text-[#FF6B6B]'}`}>
                            <RiErrorWarningFill className="w-5 h-5 flex-shrink-0" />
                            <span className="text-sm font-bold">{message}</span>
                        </div>
                    )}

                    <div className="text-center mt-6">
                        <Link className="text-sm font-bold text-[#4ECDC4] hover:text-[#3BADA6] transition-colors" href="/Auth/login/">
                            Already have an account? Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
