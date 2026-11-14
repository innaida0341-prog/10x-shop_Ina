import type { CheckoutFormValues } from "@/types/order";
import type { ProfileForm } from "@/types/user";
import type { NewReview } from "@/types/product";

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

export function digitCount(value: string): number {
  return value.replace(/\D/g, "").length;
}

export function isPhone(value: string): boolean {
  const trimmed = value.trim();
  if (!/^\+?[\d\s]+$/.test(trimmed)) return false;
  const digits = digitCount(trimmed);
  return digits >= 9 && digits <= 15;
}

export function hasErrors<T>(errors: FieldErrors<T>): boolean {
  return Object.keys(errors).length > 0;
}

export function validateCheckout(values: CheckoutFormValues): FieldErrors<CheckoutFormValues> {
  const errors: FieldErrors<CheckoutFormValues> = {};

  if (values.fullName.trim().length < 3) errors.fullName = "Full name must be at least 3 characters";
  if (!isEmail(values.email)) errors.email = "Please enter a valid email address";
  if (!isPhone(values.phone)) errors.phone = "Please enter a valid phone number";
  if (values.address.trim().length < 5) errors.address = "Address must be at least 5 characters";
  if (values.city.trim().length === 0) errors.city = "City is required";

  const postal = values.postalCode.trim();
  if (!/^\d{4,10}$/.test(postal)) errors.postalCode = "Postal code must be 4-10 digits";
  if (values.country.trim().length === 0) errors.country = "Please select a country";

  return errors;
}

export function validateProfile(values: ProfileForm): FieldErrors<ProfileForm> {
  const errors: FieldErrors<ProfileForm> = {};

  if (values.firstName.trim().length < 2) errors.firstName = "First name must be at least 2 characters";
  if (values.lastName.trim().length < 2) errors.lastName = "Last name must be at least 2 characters";
  if (!isEmail(values.email)) errors.email = "Please enter a valid email address";
  if (values.phone.trim().length > 0 && !isPhone(values.phone)) errors.phone = "Please enter a valid phone number";

  return errors;
}

export function validateReview(values: NewReview): FieldErrors<NewReview> {
  const errors: FieldErrors<NewReview> = {};
  if (!Number.isInteger(values.rating) || values.rating < 1 || values.rating > 5) {
    errors.rating = "Please select a rating";
  }
  if (values.comment.trim().length < 10) errors.comment = "Comment must be at least 10 characters";
  return errors;
}