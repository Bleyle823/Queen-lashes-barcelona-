import type { Treatment, TreatmentVariant } from "@/data/treatments";
import { treatments } from "@/data/treatments";

interface Props {
  selectedTreatment: Treatment | null;
  selectedVariant: TreatmentVariant | null;
  onSelectTreatment: (treatment: Treatment) => void;
  onSelectVariant: (variant: TreatmentVariant) => void;
}

const TreatmentSelection = ({
  selectedTreatment,
  selectedVariant,
  onSelectTreatment,
  onSelectVariant,
}: Props) => {
  const variants = selectedTreatment?.bookingVariants;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-ink mb-2">Select Treatment</h2>
        <p className="text-ink/70 text-sm">Choose the service you&apos;d like to book.</p>
      </div>

      <div className="grid gap-4">
        {treatments.map((treatment) => (
          <div
            key={treatment.slug}
            className={`p-4 border-2 cursor-pointer transition-all hover:border-peach ${
              selectedTreatment?.slug === treatment.slug
                ? "border-peach bg-peach/10"
                : "border-border hover:bg-muted/50"
            }`}
            onClick={() => onSelectTreatment(treatment)}
          >
            <div className="flex items-start gap-4">
              <img
                src={treatment.bookingImage ?? treatment.image}
                alt={treatment.name}
                className="w-20 h-20 object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-lg text-ink">{treatment.name}</h3>
                <p className="text-ink/80 mt-1 font-script text-lg">{treatment.tagline}</p>
                {treatment.price && !treatment.bookingVariants?.length && (
                  <p className="font-display text-sm text-ink mt-2">{treatment.price}</p>
                )}
                {treatment.bookingVariants?.length ? (
                  <p className="text-ink/60 text-xs mt-2">Choose a specific style in the next step.</p>
                ) : null}
              </div>
              <div
                className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${
                  selectedTreatment?.slug === treatment.slug ? "border-peach bg-peach" : "border-ink/30"
                }`}
              >
                {selectedTreatment?.slug === treatment.slug && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedTreatment && variants && variants.length > 0 && (
        <div className="space-y-3 pt-2 border-t border-border">
          <div>
            <h3 className="font-display text-lg text-ink">Choose your style</h3>
            <p className="text-ink/70 text-sm mt-1">
              {selectedTreatment.slug === "signature-lash-extensions"
                ? "Pick the lash style that matches your look (pricing is for a new set)."
                : "Pick Korean or Keratin lash lift for your Signature Lashes appointment."}
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {variants.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => onSelectVariant(v)}
                className={`text-left p-4 border-2 transition-all rounded-sm ${
                  selectedVariant?.id === v.id
                    ? "border-peach bg-peach/10"
                    : "border-border hover:border-ink/30 hover:bg-muted/40"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-medium text-ink text-sm">{v.label}</span>
                  <span className="text-ink font-display text-sm shrink-0">{v.price}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TreatmentSelection;
