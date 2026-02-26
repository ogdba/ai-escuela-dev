"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  GraduationCap,
  Rocket,
  Shield,
  Sparkles,
  BookOpen,
  FlaskConical,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SectionHeader from "@/components/SectionHeader";
import ContactForm from "@/components/ContactForm";
import {
  CURRICULUM_SECTION,
  MODULES,
  LABS,
  PRICING,
  FAQ_DATA,
  OWASP_LLM_TOP10,
  CTA,
  FOOTER,
} from "@/content/es";
import DemoSandbox from "@/components/DemoSandbox";

const fadeIn = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.5 },
};

const levelColor: Record<string, string> = {
  emerald: "text-emerald-700 dark:text-emerald-300",
  blue: "text-blue-700 dark:text-blue-300",
  purple: "text-purple-700 dark:text-purple-300",
  amber: "text-amber-700 dark:text-amber-300",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/60 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-gray-900 dark:text-gray-50">
      <Navbar />
      <main className="flex flex-col gap-24 pb-24">
        <Hero />

        <DemoSandbox />

        <section id="curriculum" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/70 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800 rounded-3xl p-10 shadow-xl shadow-violet-500/10 backdrop-blur">
            <div className="flex items-start gap-4 mb-10">
              <GraduationCap className="text-violet-600 dark:text-violet-300" />
              <SectionHeader
                eyebrow={CURRICULUM_SECTION.subtitle}
                title={CURRICULUM_SECTION.title}
                subtitle={CURRICULUM_SECTION.description}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {CURRICULUM_SECTION.levels.map((level) => (
                <motion.div
                  key={level.name}
                  {...fadeIn}
                  className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 p-5"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm font-semibold ${levelColor[level.color] || "text-gray-700"}`}
                    >
                      {level.name}
                    </span>
                    <span className="text-xs uppercase tracking-wide text-gray-500">Ruta</span>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-gray-700 dark:text-gray-200">
                    {level.modules.map((m) => (
                      <li key={m} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-violet-500" />
                        {m}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="modules" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-3 mb-8">
            <BookOpen className="text-violet-600 dark:text-violet-300" />
            <SectionHeader
              eyebrow="Módulos"
              title="Del fundamento a producción"
              subtitle="8 módulos diseñados para construir, asegurar y desplegar aplicaciones con IA."
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MODULES.map((module) => (
              <motion.div
                key={module.id}
                {...fadeIn}
                className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/60 p-6 shadow-lg shadow-blue-500/10 backdrop-blur"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-500">
                    Módulo {module.number}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-violet-600 dark:text-violet-300">
                    <Sparkles className="w-4 h-4" />
                    {module.icon}
                  </span>
                </div>
                <h3 className="text-xl font-semibold">{module.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                  {module.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {module.topics.slice(0, 4).map((topic) => (
                    <span
                      key={topic}
                      className="rounded-full bg-violet-100/70 dark:bg-violet-900/40 text-violet-800 dark:text-violet-200 px-3 py-1 text-xs"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  Proyecto: {module.project}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="labs" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-3 mb-8">
            <FlaskConical className="text-emerald-500" />
            <SectionHeader
              eyebrow="Fun Labs"
              title="Laboratorios gamificados"
              subtitle="Practica con retos rápidos, experimenta y mide tus progresos."
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {LABS.slice(0, 9).map((lab) => (
              <motion.div
                key={lab.id}
                {...fadeIn}
                className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/70 p-5 shadow-md shadow-emerald-500/10"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-300">
                    {lab.title}
                  </span>
                  <span className="text-xs text-gray-500">{lab.duration}</span>
                </div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{lab.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {lab.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-emerald-100/70 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-100 px-2.5 py-1 text-[11px]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="security" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-3 mb-8">
            <Shield className="text-amber-500" />
            <SectionHeader
              eyebrow={OWASP_LLM_TOP10.subtitle}
              title={OWASP_LLM_TOP10.title}
              subtitle={OWASP_LLM_TOP10.description}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {OWASP_LLM_TOP10.risks.map((risk) => (
              <motion.div
                key={risk.id}
                {...fadeIn}
                className="rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-white/80 dark:bg-gray-900/60 p-5 shadow-lg shadow-amber-500/10"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-600 dark:text-amber-200">
                    {risk.id}
                  </span>
                  <span className="text-sm font-semibold">{risk.name}</span>
                </div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{risk.risk}</p>
                <p className="mt-3 text-sm text-gray-900 dark:text-gray-100">
                  <span className="font-semibold text-amber-700 dark:text-amber-300">
                    Mitigación:
                  </span>{" "}
                  {risk.mitigation}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="pricing" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow={PRICING.subtitle}
            title={PRICING.title}
            subtitle={PRICING.description}
            align="center"
          />
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRICING.plans.map((plan) => (
              <motion.div
                key={plan.id}
                {...fadeIn}
                className={`rounded-3xl border p-8 backdrop-blur shadow-lg ${
                  plan.highlighted
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/60"
                }`}
              >
                <h3 className={`text-xl font-semibold ${plan.highlighted ? "text-white" : ""}`}>
                  {plan.name}
                </h3>
                <p className="mt-2 text-3xl font-bold">
                  {plan.price}
                  {plan.period ? (
                    <span className="text-sm text-gray-500"> {plan.period}</span>
                  ) : null}
                </p>
                <p
                  className={`mt-3 text-sm ${
                    plan.highlighted ? "text-white/80" : "text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {plan.description}
                </p>
                <ul
                  className={`mt-5 space-y-2 text-sm ${
                    plan.highlighted ? "text-white" : "text-gray-700 dark:text-gray-200"
                  }`}
                >
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <CheckCircle2
                        className={`w-4 h-4 ${plan.highlighted ? "text-amber-300" : "text-violet-500"}`}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  className={`mt-6 inline-flex w-full items-center justify-center rounded-xl font-semibold py-3 transition hover:-translate-y-0.5 ${
                    plan.highlighted
                      ? "bg-white text-slate-900 shadow-lg shadow-white/20"
                      : "bg-slate-900 text-white"
                  }`}
                >
                  {plan.cta}
                </a>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="faq" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow={FAQ_DATA.subtitle}
            title={FAQ_DATA.title}
            subtitle="Lo que nos preguntan con más frecuencia."
            align="center"
          />
          <div className="mt-8 space-y-4">
            {FAQ_DATA.items.map((item) => (
              <motion.details
                key={item.q}
                {...fadeIn}
                className="group rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/60 p-5"
              >
                <summary className="flex items-center justify-between cursor-pointer text-lg font-semibold text-gray-900 dark:text-white">
                  {item.q}
                  <span className="ml-4 text-violet-500 group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm text-gray-700 dark:text-gray-200">{item.a}</p>
              </motion.details>
            ))}
          </div>
        </section>

        <section id="cta" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xl shadow-slate-200/60 dark:shadow-none p-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  {CTA.secondary}
                </p>
                <h3 className="font-display text-3xl md:text-4xl font-semibold text-slate-900 dark:text-white">
                  {CTA.title}
                </h3>
                <p className="mt-1 text-slate-600 dark:text-slate-300 max-w-2xl">
                  {CTA.description}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 text-white font-semibold px-6 py-3 shadow-lg shadow-slate-900/15 hover:-translate-y-0.5 transition"
                >
                  {CTA.primary}
                </a>
                <a
                  href="#curriculum"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold px-6 py-3 hover:border-slate-500 dark:hover:border-slate-500 transition"
                >
                  {CTA.secondary}
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Contacto"
            title="Agenda tu plaza"
            subtitle="Valida tus datos y recibe detalles de la siguiente cohorte."
          />
          <div className="mt-8">
            <ContactForm />
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-800 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex flex-wrap items-center gap-3">
            <Shield className="w-4 h-4 text-violet-500" />
            <span>Seguridad by design • OWASP LLM Top 10</span>
            <Rocket className="w-4 h-4 text-blue-500" />
            <span>Listo para producción</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Hecho para desarrolladores</span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            {FOOTER.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-violet-600 dark:hover:text-violet-300"
              >
                {link.label}
              </a>
            ))}
          </div>
          <p className="text-xs text-gray-500">{FOOTER.copyright}</p>
        </div>
      </footer>
    </div>
  );
}
