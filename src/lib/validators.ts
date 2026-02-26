export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface ValidationErrors {
  name?: string;
  email?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactForm(data: ContactFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!data.name.trim()) {
    errors.name = "El nombre es obligatorio";
  }

  if (!data.email.trim()) {
    errors.email = "El correo es obligatorio";
  } else if (!EMAIL_REGEX.test(data.email)) {
    errors.email = "Ingresa un correo válido";
  }

  return errors;
}

export function hasErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}
