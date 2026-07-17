import { useEffect } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "../lib/i18n/LanguageContext";

const WelcomeMessage = () => {
  const { t } = useTranslation();

  useEffect(() => {
    // Check if we already showed the welcome message in this session
    const hasWelcomed = sessionStorage.getItem("hasWelcomed");
    
    if (!hasWelcomed) {
      const storedUserName = localStorage.getItem("UserName");
  
      if (storedUserName) {
        toast.success(t("welcome.welcomeUser", { name: storedUserName }));
      } else {
        toast.success(t("welcome.welcomeGuest"));
      }
      
      sessionStorage.setItem("hasWelcomed", "true");
    }
  }, [t]);

  // ToastContainer is already rendered globally in _app.js
  return null;
};

export default WelcomeMessage;
