import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { BookingDetails as BookingDetailsType } from "@/types/booking";

interface Props {
  details: BookingDetailsType;
  onUpdate: (details: BookingDetailsType) => void;
}

const BookingDetails = ({ details, onUpdate }: Props) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof BookingDetailsType, value: string) => {
    onUpdate({ ...details, [field]: value });
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateField = (field: keyof BookingDetailsType, value: string): string => {
    switch (field) {
      case 'firstName':
        return !value.trim() ? 'First name is required' : '';
      case 'lastName':
        return !value.trim() ? 'Last name is required' : '';
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email';
        return '';
      case 'phone':
        if (value && !/^[\+]?[0-9\s\-\(\)]+$/.test(value)) return 'Please enter a valid phone number';
        return '';
      default:
        return '';
    }
  };

  const handleBlur = (field: keyof BookingDetailsType, value: string) => {
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-ink mb-2">Your Details</h2>
        <p className="text-ink/70 text-sm">Please provide your contact information for the booking.</p>
      </div>

      <div className="grid gap-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-ink font-medium">
              First Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="firstName"
              value={details.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              onBlur={(e) => handleBlur('firstName', e.target.value)}
              className={errors.firstName ? 'border-destructive' : ''}
              placeholder="Enter your first name"
            />
            {errors.firstName && (
              <p className="text-destructive text-sm">{errors.firstName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-ink font-medium">
              Last Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="lastName"
              value={details.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              onBlur={(e) => handleBlur('lastName', e.target.value)}
              className={errors.lastName ? 'border-destructive' : ''}
              placeholder="Enter your last name"
            />
            {errors.lastName && (
              <p className="text-destructive text-sm">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-ink font-medium">
            Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={details.email}
            onChange={(e) => handleChange('email', e.target.value)}
            onBlur={(e) => handleBlur('email', e.target.value)}
            className={errors.email ? 'border-destructive' : ''}
            placeholder="Enter your email address"
          />
          {errors.email && (
            <p className="text-destructive text-sm">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-ink font-medium">
            Phone Number (Optional)
          </Label>
          <Input
            id="phone"
            type="tel"
            value={details.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
            onBlur={(e) => handleBlur('phone', e.target.value)}
            className={errors.phone ? 'border-destructive' : ''}
            placeholder="+34 123 456 789"
          />
          {errors.phone && (
            <p className="text-destructive text-sm">{errors.phone}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes" className="text-ink font-medium">
            Notes (Optional)
          </Label>
          <Textarea
            id="notes"
            value={details.notes || ''}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="Any special requests or information you'd like us to know..."
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;