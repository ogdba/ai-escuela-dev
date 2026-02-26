export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface ValidationErrors {
  name?: string;
  email?: string;
  message?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactForm(data: ContactFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  const trimmedName = data.name.trim();
  const trimmedEmail = data.email.trim();
  const trimmedMessage = data.message.trim();

  if (!trimmedName) {
    errors.name = "El nombre es obligatorio";
  } else if (trimmedName.length < 2) {
    errors.name = "El nombre debe tener al menos 2 caracteres";
  } else if (trimmedName.length > 100) {
    errors.name = "El nombre es demasiado largo";
  }

  if (!trimmedEmail) {
    errors.email = "El correo es obligatorio";
  } else if (!EMAIL_REGEX.test(trimmedEmail)) {
    errors.email = "Ingresa un correo válido";
  }

  if (trimmedMessage) {
    if (trimmedMessage.length < 10) {
      errors.message = "El mensaje debe tener al menos 10 caracteres";
    } else if (trimmedMessage.length > 2000) {
      errors.message = "El mensaje es demasiado largo";
    }
  }

  return errors;
}

export function hasErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}
