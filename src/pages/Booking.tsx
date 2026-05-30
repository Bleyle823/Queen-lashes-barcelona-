import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { treatments } from "@/data/treatments";
import { Instagram, Mail } from "lucide-react";

const Booking = () => {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      (e.target as HTMLFormElement).reset();
      toast.success("Booking request sent. We'll be in touch soon.");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-5xl mx-auto px-6 lg:px-10 py-16">
        <h1 className="font-display text-5xl md:text-6xl text-ink mb-3">BOOKING</h1>
        <p className="text-ink/75 uppercase tracking-wide text-sm mb-10">
          By appointment only · Mon–Fri 9:00–18:00 CET · Sat–Sun by request
        </p>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6 bg-muted p-8">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" type="tel" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="treatment">Treatment</Label>
            <select id="treatment" name="treatment" required className="w-full h-10 px-3 border border-input bg-background text-sm">
              {treatments.map((t) => (
                <option key={t.slug} value={t.slug}>{t.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="date">Preferred date</Label>
            <Input id="date" name="date" type="date" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" name="notes" rows={4} />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="bg-peach hover:bg-[hsl(var(--peach-hover))] text-ink font-display tracking-widest px-8 py-3 transition-colors disabled:opacity-60"
            >
              {submitting ? "SENDING..." : "REQUEST APPOINTMENT"}
            </button>
          </div>
        </form>

        <div className="mt-10 flex items-center gap-4">
          <span className="text-sm uppercase tracking-wide text-ink/70">Or reach us:</span>
          <a href="https://instagram.com" aria-label="Instagram" className="w-10 h-10 rounded-full bg-pink-bar flex items-center justify-center hover:bg-peach transition-colors">
            <Instagram className="w-5 h-5 text-ink" />
          </a>
          <a href="mailto:hello@queenlashesbarcelona.com" aria-label="Email" className="w-10 h-10 rounded-full bg-pink-bar flex items-center justify-center hover:bg-peach transition-colors">
            <Mail className="w-5 h-5 text-ink" />
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Booking;
