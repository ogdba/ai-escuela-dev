"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { CONTACT } from "@/content/es";
import {
  hasErrors,
  validateContactForm,
  type ContactFormData,
  type ValidationErrors,
} from "@/lib/validators";

interface SubmitState {
  status: "idle" | "submitting" | "success" | "error";
  ticketId?: string;
  errorMessage?: string;
}

export default function ContactForm() {
  const [data, setData] = useState<ContactFormData>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle" });

  const handleChange =
    (field: keyof ContactFormData) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setData((prev) => ({ ...prev, [field]: e.target.value }));
      setErrors((prev) => ({ ...prev, [field]: "" }));
    };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validation = validateContactForm(data);
    setErrors(validation);

    if (hasErrors(validation)) return;

    setSubmitState({ status: "submitting" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const body = await res.json();

      if (!res.ok) {
        const serverErrors = body?.errors as ValidationErrors | undefined;
        if (serverErrors) setErrors(serverErrors);
        throw new Error(body?.error || CONTACT.form.errorFallback);
      }

      setSubmitState({ status: "success", ticketId: body.ticketId });
      setData({ name: "", email: "", message: "" });
    } catch (error) {
      setSubmitState({ status: "error", errorMessage: (error as Error).message });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/60 p-8 shadow-xl shadow-slate-200/40 dark:shadow-none">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 font-semibold mb-3">
          {CONTACT.subtitle}
        </p>
        <h3 className="text-3xl font-semibold text-slate-900 dark:text-white leading-tight mb-3">
          {CONTACT.title}
        </h3>
        <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
          {CONTACT.description}
        </p>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-700 dark:text-slate-200">
          {CONTACT.highlights.map((item) => (
            <div
              key={item}
              className="flex items-center gap-2 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 px-4 py-3"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
              {item}
            </div>
          ))}
        </div>
        <div className="mt-6 text-xs text-slate-500 dark:text-slate-400">{CONTACT.dataNotice}</div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-8 shadow-xl shadow-slate-200/40 dark:shadow-none space-y-5"
        noValidate
        aria-label="Formulario de contacto"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-800 dark:text-slate-200"
            >
              {CONTACT.form.name}
            </label>
            <input
              id="name"
              name="name"
              value={data.name}
              onChange={handleChange("name")}
              className="mt-2 w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              maxLength={120}
            />
            {errors.name ? <p className="mt-1 text-sm text-rose-600">{errors.name}</p> : null}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-800 dark:text-slate-200"
            >
              {CONTACT.form.email}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={data.email}
              onChange={handleChange("email")}
              className="mt-2 w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              maxLength={120}
            />
            {errors.email ? <p className="mt-1 text-sm text-rose-600">{errors.email}</p> : null}
          </div>
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-slate-800 dark:text-slate-200"
          >
            {CONTACT.form.message}
          </label>
          <textarea
            id="message"
            name="message"
            value={data.message}
            onChange={handleChange("message")}
            className="mt-2 w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[140px]"
            placeholder={CONTACT.form.placeholder}
            maxLength={2000}
          />
          {errors.message ? <p className="mt-1 text-sm text-rose-600">{errors.message}</p> : null}
        </div>

        <button
          type="submit"
          className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold py-3.5 shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={submitState.status === "submitting"}
        >
          {submitState.status === "submitting" ? CONTACT.form.submitting : CONTACT.form.submit}
        </button>

        {submitState.status === "success" ? (
          <p
            className="text-sm text-emerald-600 bg-emerald-50/80 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800 rounded-xl px-4 py-3"
            aria-live="polite"
          >
            {CONTACT.form.success.replace("{{id}}", submitState.ticketId || "")}
          </p>
        ) : null}

        {submitState.status === "error" ? (
          <p
            className="text-sm text-rose-600 bg-rose-50/80 dark:bg-rose-900/30 border border-rose-100 dark:border-rose-800 rounded-xl px-4 py-3"
            aria-live="assertive"
          >
            {submitState.errorMessage || CONTACT.form.errorFallback}
          </p>
        ) : null}
      </form>
    </div>
  );
}
