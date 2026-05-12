import { Instagram, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-pink-bar mt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 grid gap-8 md:grid-cols-3">
        <div>
          <div className="font-display tracking-widest text-ink text-lg">QUEENLASHES BARCELONA</div>
          <p className="text-sm text-ink/70 mt-3 max-w-xs">
            Effortless beauty begins with the details. Bespoke lash & brow services in Barcelona.
          </p>
        </div>
        <div>
          <div className="font-display tracking-widest text-ink mb-3">EXPLORE</div>
          <ul className="space-y-2 text-sm text-ink/80">
            <li><Link to="/" className="hover:text-ink">Home</Link></li>
            <li><Link to="/our-story" className="hover:text-ink">Our Story</Link></li>
            <li><Link to="/treatments" className="hover:text-ink">Treatments</Link></li>
            <li><Link to="/booking" className="hover:text-ink">Booking</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-display tracking-widest text-ink mb-3">CONTACT</div>
          <div className="flex items-center gap-3">
            <a href="https://www.instagram.com/queenlashes_barcelona/" aria-label="Instagram" className="w-10 h-10 rounded-full bg-background flex items-center justify-center hover:bg-peach transition-colors">
              <Instagram className="w-5 h-5 text-ink" />
            </a>
            <a href="mailto:hello@queenlashesbarcelona.com" aria-label="Email" className="w-10 h-10 rounded-full bg-background flex items-center justify-center hover:bg-peach transition-colors">
              <Mail className="w-5 h-5 text-ink" />
            </a>
          </div>
          <p className="text-sm text-ink/70 mt-4">By appointment only<br/>Mon–Fri 9:00–18:00 CET</p>
        </div>
      </div>
      <div className="border-t border-ink/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-ink/60">
          <span>© {new Date().getFullYear()} Queenlashes Barcelona. All rights reserved.</span>
          <Link to="/admin/login" className="text-ink/45 hover:text-ink/70">
            Staff
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
