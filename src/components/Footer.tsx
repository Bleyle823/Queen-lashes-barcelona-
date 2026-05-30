import { Instagram, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "@/i18n/LocaleProvider";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-pink-bar mt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 grid gap-8 md:grid-cols-3">
        <div>
          <div className="font-display tracking-widest text-ink text-lg">QUEENLASHES BARCELONA</div>
          <p className="text-sm text-ink/70 mt-3 max-w-xs">{t.footer.tagline}</p>
        </div>
        <div>
          <div className="font-display tracking-widest text-ink mb-3">{t.footer.explore}</div>
          <ul className="space-y-2 text-sm text-ink/80">
            <li><Link to="/" className="hover:text-ink">{t.nav.home}</Link></li>
            <li><Link to="/our-story" className="hover:text-ink">{t.nav.ourStory}</Link></li>
            <li><Link to="/treatments" className="hover:text-ink">{t.nav.treatments}</Link></li>
            <li><Link to="/booking" className="hover:text-ink">{t.nav.booking}</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-display tracking-widest text-ink mb-3">{t.footer.contact}</div>
          <div className="flex items-center gap-3">
            <a href="https://www.instagram.com/queenlashes_barcelona/" aria-label={t.footer.instagram} className="w-10 h-10 rounded-full bg-background flex items-center justify-center hover:bg-peach transition-colors">
              <Instagram className="w-5 h-5 text-ink" />
            </a>
            <a href="mailto:hello@queenlashesbarcelona.com" aria-label={t.footer.email} className="w-10 h-10 rounded-full bg-background flex items-center justify-center hover:bg-peach transition-colors">
              <Mail className="w-5 h-5 text-ink" />
            </a>
          </div>
          <p className="text-sm text-ink/70 mt-4">
            {t.footer.hours}
            <br />
            {t.footer.hoursDetail}
          </p>
        </div>
      </div>
      <div className="border-t border-ink/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-ink/60">
          <span>© {new Date().getFullYear()} Queenlashes Barcelona. {t.footer.copyright}</span>
          <Link to="/admin/login" className="text-ink/45 hover:text-ink/70">
            {t.footer.staff}
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
