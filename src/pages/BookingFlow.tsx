import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TreatmentSelection from "@/components/booking/TreatmentSelection";
import DateTimeSelection from "@/components/booking/DateTimeSelection";
import BookingDetails from "@/components/booking/BookingDetails";
import BookingSummary from "@/components/booking/BookingSummary";
import PaymentForm from "@/components/booking/PaymentForm";
import { BookingStep, type BookingData, type BookingSlot, type BookingDetails } from "@/types/booking";
import type { Treatment, TreatmentVariant } from "@/data/treatments";
import { getTreatment } from "@/data/treatments";
import { parseTreatmentPrice, BOOKING_DEPOSIT_CENTS } from "@/utils/booking";
import { fetchPublicAvailability, type PublicAvailability } from "@/lib/stripe-checkout";
import { addDays, format } from "date-fns";
import { useTranslation } from "@/i18n/LocaleProvider";
import { interpolate } from "@/i18n/translations";

const WIZARD_STEPS = [
  BookingStep.TREATMENT,
  BookingStep.DATETIME,
  BookingStep.DETAILS,
  BookingStep.SUMMARY,
  BookingStep.PAYMENT,
];

const BookingFlow = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t, locale } = useTranslation();
  const [currentStep, setCurrentStep] = useState<BookingStep>(BookingStep.TREATMENT);
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<TreatmentVariant | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<BookingSlot | null>(null);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    notes: "",
  });

  useEffect(() => {
    if (selectedTreatment) {
      const updated = getTreatment(selectedTreatment.slug, locale);
      if (updated) {
        setSelectedTreatment(updated);
        if (selectedVariant) {
          const updatedVariant = updated.bookingVariants?.find((v) => v.id === selectedVariant.id);
          if (updatedVariant) setSelectedVariant(updatedVariant);
        }
      }
    }
  }, [locale]);

  useEffect(() => {
    const treatmentSlug = searchParams.get("treatment");
    if (treatmentSlug) {
      const treatment = getTreatment(treatmentSlug, locale);
      if (treatment) {
        setSelectedTreatment(treatment);
        setSelectedVariant(null);
        if (!treatment.bookingVariants?.length) {
          setCurrentStep(BookingStep.DATETIME);
        }
      }
    }
  }, [searchParams, locale]);

  useEffect(() => {
    setSelectedSlot(null);
  }, [selectedTreatment?.slug]);

  useEffect(() => {
    if (searchParams.get("checkout") !== "cancelled") return;
    toast.info(t.booking.checkoutCancelled);
    const next = new URLSearchParams(searchParams);
    next.delete("checkout");
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams, t.booking.checkoutCancelled]);

  const [availability, setAvailability] = useState<PublicAvailability>({
    blocked: [],
    extra: [],
    booked: [],
  });

  useEffect(() => {
    let cancelled = false;
    const today = new Date();
    const from = format(today, "yyyy-MM-dd");
    const to = format(addDays(today, 60), "yyyy-MM-dd");
    fetchPublicAvailability(from, to)
      .then((data) => {
        if (!cancelled) setAvailability(data);
      })
      .catch((err) => {
        console.warn("availability load failed", err);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const existingBookings: BookingSlot[] = useMemo(
    () =>
      availability.booked.map((b) => ({
        id: `${b.date}-${b.startTime}`,
        date: b.date,
        startTime: b.startTime,
        endTime: b.endTime,
        available: false,
      })),
    [availability.booked],
  );

  const bookingData: BookingData | null = useMemo(() => {
    if (!selectedTreatment || !selectedSlot) return null;
    const needsVariant = Boolean(selectedTreatment.bookingVariants?.length);
    if (needsVariant && !selectedVariant) return null;

    let servicePriceCents = 0;
    if (selectedVariant) {
      servicePriceCents = parseTreatmentPrice(selectedVariant.price);
    } else if (selectedTreatment.price) {
      servicePriceCents = parseTreatmentPrice(selectedTreatment.price);
    }
    if (!servicePriceCents) {
      servicePriceCents = 5500;
    }

    const serviceLabel = selectedVariant
      ? `${selectedTreatment.name}, ${selectedVariant.label}`
      : undefined;

    return {
      treatment: selectedTreatment,
      slot: selectedSlot,
      details: bookingDetails,
      depositAmountCents: BOOKING_DEPOSIT_CENTS,
      servicePriceCents,
      selectedVariant: selectedVariant ?? undefined,
      serviceLabel,
    };
  }, [selectedTreatment, selectedSlot, selectedVariant, bookingDetails]);

  const stepTitles: Record<BookingStep, string> = {
    [BookingStep.TREATMENT]: t.booking.steps.treatment,
    [BookingStep.DATETIME]: t.booking.steps.datetime,
    [BookingStep.DETAILS]: t.booking.steps.details,
    [BookingStep.SUMMARY]: t.booking.steps.summary,
    [BookingStep.PAYMENT]: t.booking.steps.payment,
    [BookingStep.CONFIRMATION]: t.booking.steps.confirmed,
  };

  const currentStepIndex = WIZARD_STEPS.indexOf(currentStep);

  const canProceed = useMemo(() => {
    switch (currentStep) {
      case BookingStep.TREATMENT:
        if (!selectedTreatment) return false;
        if (selectedTreatment.bookingVariants?.length && !selectedVariant) return false;
        return true;
      case BookingStep.DATETIME:
        return !!selectedSlot;
      case BookingStep.DETAILS:
        return !!(bookingDetails.firstName && bookingDetails.lastName && bookingDetails.email);
      case BookingStep.SUMMARY:
        return !!bookingData;
      default:
        return false;
    }
  }, [currentStep, selectedTreatment, selectedVariant, selectedSlot, bookingDetails, bookingData]);

  const handleNext = () => {
    if (canProceed && currentStepIndex < WIZARD_STEPS.length - 1) {
      setCurrentStep(WIZARD_STEPS[currentStepIndex + 1]);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(WIZARD_STEPS[currentStepIndex - 1]);
    }
  };

  const progressPct =
    WIZARD_STEPS.length <= 1 ? 0 : (currentStepIndex / (WIZARD_STEPS.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-4xl mx-auto px-6 lg:px-10 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-ink/60 mb-2">
            <span>
              {interpolate(t.booking.stepOf, {
                current: currentStepIndex + 1,
                total: WIZARD_STEPS.length,
              })}
            </span>
            <span>{stepTitles[currentStep]}</span>
          </div>
          <div className="w-full bg-border h-2">
            <div
              className="bg-peach h-2 transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        <div className="bg-background min-h-[500px]">
          {currentStep === BookingStep.TREATMENT && (
            <TreatmentSelection
              selectedTreatment={selectedTreatment}
              selectedVariant={selectedVariant}
              onSelectTreatment={(tr) => {
                setSelectedTreatment(tr);
                setSelectedVariant(null);
              }}
              onSelectVariant={setSelectedVariant}
            />
          )}

          {currentStep === BookingStep.DATETIME && selectedTreatment && (
            <DateTimeSelection
              selectedSlot={selectedSlot}
              onSelect={setSelectedSlot}
              durationMinutes={selectedTreatment.bookingDurationMinutes}
              existingBookings={existingBookings}
              blocked={availability.blocked}
              extra={availability.extra}
            />
          )}

          {currentStep === BookingStep.DETAILS && (
            <BookingDetails details={bookingDetails} onUpdate={setBookingDetails} />
          )}

          {currentStep === BookingStep.SUMMARY && bookingData && (
            <BookingSummary bookingData={bookingData} />
          )}

          {currentStep === BookingStep.PAYMENT && bookingData && (
            <PaymentForm bookingData={bookingData} />
          )}
        </div>

        {currentStep !== BookingStep.PAYMENT && (
          <div className="flex justify-between items-center mt-8">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStepIndex === 0}
              className="flex items-center gap-2 px-6 py-3 border border-ink/30 text-ink hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              {t.booking.back}
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={!canProceed}
              className="flex items-center gap-2 bg-peach hover:bg-[hsl(var(--peach-hover))] text-ink font-display tracking-widest px-8 py-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentStep === BookingStep.SUMMARY ? t.booking.proceedToPayment : t.booking.continue}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BookingFlow;
