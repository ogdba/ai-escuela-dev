"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { CONTACT } from "@/content/es";
import {
  hasErrors,
  validateContactForm,
  type ContactFormData,
  type ValidationErrors,
} from "@/lib/validators";

export default function ContactForm() {
  const [data, setData] = useState<ContactFormData>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange =
    (field: keyof ContactFormData) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setData((prev) => ({ ...prev, [field]: e.target.value }));
      setErrors((prev) => ({ ...prev, [field]: "" }));
    };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validation = validateContactForm(data);
    setErrors(validation);

    if (!hasErrors(validation)) {
      setSubmitted(true);
      // In a real app this would POST to an API route; here we just reset.
      setTimeout(() => {
        setSubmitted(false);
        setData({ name: "", email: "", message: "" });
      }, 2600);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/50 p-8 shadow-lg shadow-violet-500/5 backdrop-blur">
        <p className="text-sm text-violet-600 dark:text-violet-300 font-semibold mb-3">
          {CONTACT.subtitle}
        </p>
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">{CONTACT.title}</h3>
        <p className="text-gray-600 dark:text-gray-300">{CONTACT.description}</p>
        <ul className="mt-6 space-y-3 text-sm text-gray-700 dark:text-gray-200">
          <li>✅ Respuesta en menos de 24h</li>
          <li>✅ Sin spam: solo información relevante</li>
          <li>✅ Soporte para equipos y empresas</li>
        </ul>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 shadow-xl shadow-blue-500/10 space-y-5"
        noValidate
        aria-label="Formulario de contacto"
      >
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            {CONTACT.form.name}
          </label>
          <input
            id="name"
            name="name"
            value={data.name}
            onChange={handleChange("name")}
            className="mt-2 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            required
          />
          {errors.name ? <p className="mt-1 text-sm text-red-500">{errors.name}</p> : null}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            {CONTACT.form.email}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={data.email}
            onChange={handleChange("email")}
            className="mt-2 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            required
          />
          {errors.email ? <p className="mt-1 text-sm text-red-500">{errors.email}</p> : null}
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            {CONTACT.form.message}
          </label>
          <textarea
            id="message"
            name="message"
            value={data.message}
            onChange={handleChange("message")}
            className="mt-2 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            rows={4}
          />
        </div>

        <button
          type="submit"
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold py-3 shadow-lg shadow-violet-500/25 transition hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
        >
          {submitted ? "Enviado ✅" : CONTACT.form.submit}
        </button>

        {submitted ? <p className="text-sm text-green-600 mt-2">{CONTACT.form.success}</p> : null}
      </form>
    </div>
  );
}
