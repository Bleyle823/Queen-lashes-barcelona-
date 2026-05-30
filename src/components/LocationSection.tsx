import { useTranslation } from "@/i18n/LocaleProvider";

/** Map shows the Sagrada Família area; exact studio address is shared after booking. */
const SAGRADA_FAMILIA_EMBED_SRC =  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2993.6862625074386!2d2.174355821726583!3d41.40362990005647!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12a4a2e3406b41e41%3A0xef62ba3ccbb39189!2sBas%C3%ADlica%20de%20la%20Sagrada%20Fam%C3%ADlia!5e0!3m2!1sen!2ses!4v1717766400000!5m2!1sen!2ses";

const LocationSection = () => {  const { t } = useTranslation();

  return (
    <section
      className="relative py-20 bg-cover bg-center"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.85)), url('https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1600&q=80')",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid gap-10 lg:gap-14 lg:grid-cols-2 lg:items-start">
          <div className="min-w-0">
            <h2 className="font-display text-4xl md:text-5xl text-ink mb-8">{t.location.title}</h2>
            <div className="font-display text-xl md:text-2xl text-ink/90 space-y-1 leading-relaxed">
              <p>{t.location.appointmentOnly}</p>
              <p>{t.location.weekdayHours}</p>
              <p>{t.location.weekendHours}</p>
            </div>
            <p className="mt-8 text-sm text-ink/70 max-w-md">{t.location.addressNote}</p>
          </div>
          <div className="relative w-[60%] max-w-full aspect-square min-h-0 mx-auto lg:ml-auto lg:mr-0 -translate-y-[15%]">
            <iframe
              title={t.location.mapTitle}
              src={SAGRADA_FAMILIA_EMBED_SRC}
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
