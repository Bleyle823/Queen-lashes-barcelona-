import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { BookingDetails as BookingDetailsType } from "@/types/booking";
import { useTranslation } from "@/i18n/LocaleProvider";

interface Props {
  details: BookingDetailsType;
  onUpdate: (details: BookingDetailsType) => void;
}

const BookingDetails = ({ details, onUpdate }: Props) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { t } = useTranslation();
  const e = t.booking.details.errors;

  const handleChange = (field: keyof BookingDetailsType, value: string) => {
    onUpdate({ ...details, [field]: value });
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateField = (field: keyof BookingDetailsType, value: string): string => {
    switch (field) {
      case "firstName":
        return !value.trim() ? e.firstNameRequired : "";
      case "lastName":
        return !value.trim() ? e.lastNameRequired : "";
      case "email":
        if (!value.trim()) return e.emailRequired;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return e.emailInvalid;
        return "";
      case "phone":
        if (value && !/^[\+]?[0-9\s\-\(\)]+$/.test(value)) return e.phoneInvalid;
        return "";
      default:
        return "";
    }
  };

  const handleBlur = (field: keyof BookingDetailsType, value: string) => {
    const error = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-ink mb-2">{t.booking.details.title}</h2>
        <p className="text-ink/70 text-sm">{t.booking.details.subtitle}</p>
      </div>

      <div className="grid gap-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-ink font-medium">
              {t.booking.details.firstName} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="firstName"
              value={details.firstName}
              onChange={(ev) => handleChange("firstName", ev.target.value)}
              onBlur={(ev) => handleBlur("firstName", ev.target.value)}
              className={errors.firstName ? "border-destructive" : ""}
              placeholder={t.booking.details.firstNamePlaceholder}
            />
            {errors.firstName && <p className="text-destructive text-sm">{errors.firstName}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-ink font-medium">
              {t.booking.details.lastName} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="lastName"
              value={details.lastName}
              onChange={(ev) => handleChange("lastName", ev.target.value)}
              onBlur={(ev) => handleBlur("lastName", ev.target.value)}
              className={errors.lastName ? "border-destructive" : ""}
              placeholder={t.booking.details.lastNamePlaceholder}
            />
            {errors.lastName && <p className="text-destructive text-sm">{errors.lastName}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-ink font-medium">
            {t.booking.details.email} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={details.email}
            onChange={(ev) => handleChange("email", ev.target.value)}
            onBlur={(ev) => handleBlur("email", ev.target.value)}
            className={errors.email ? "border-destructive" : ""}
            placeholder={t.booking.details.emailPlaceholder}
          />
          {errors.email && <p className="text-destructive text-sm">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-ink font-medium">
            {t.booking.details.phone}
          </Label>
          <Input
            id="phone"
            type="tel"
            value={details.phone || ""}
            onChange={(ev) => handleChange("phone", ev.target.value)}
            onBlur={(ev) => handleBlur("phone", ev.target.value)}
            className={errors.phone ? "border-destructive" : ""}
            placeholder={t.booking.details.phonePlaceholder}
          />
          {errors.phone && <p className="text-destructive text-sm">{errors.phone}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes" className="text-ink font-medium">
            {t.booking.details.notes}
          </Label>
          <Textarea
            id="notes"
            value={details.notes || ""}
            onChange={(ev) => handleChange("notes", ev.target.value)}
            placeholder={t.booking.details.notesPlaceholder}
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
