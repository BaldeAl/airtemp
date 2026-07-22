import { useTranslation } from "../lib/i18n/LanguageContext";

function Error({ statusCode }) {
  const { t } = useTranslation();
  return (
    <p className="p-4 text-center">
      {statusCode
        ? t("errors.serverError").replace("{code}", statusCode)
        : t("errors.clientError")}
    </p>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
