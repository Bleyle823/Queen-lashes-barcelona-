import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "@/i18n/LocaleProvider";

const NotFound = () => {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 animate-fade-in">
      <div className="text-center animate-slide-up">
        <h1 className="mb-4 text-4xl font-bold">{t.notFound.title}</h1>
        <p className="mb-4 text-xl text-gray-600">{t.notFound.message}</p>
        <Link to="/" className="text-blue-500 underline hover:text-blue-700">
          {t.notFound.backHome}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
